import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { timingSafeEqual, randomBytes, createHash } from 'node:crypto';

export const ID_RE = /^[a-z0-9]{10}$/;
export const COLS = new Set(['house','tasks','routines','checks','comments','activity','people','approvals','rewards','things','service','pros','info','items','expenses']);
const path = h => `houses/${h}.json`;
export const hash = t => createHash('sha256').update(String(t)).digest('hex');
export const newSecret = (n = 18) => randomBytes(n).toString('base64url');

export async function read(h) {
  const r = await get(path(h), { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return null;
  const text = await new Response(r.stream).text();
  return { state: JSON.parse(text), etag: r.blob.etag };
}

function eq(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/* Access:
   - device token: each phone gets its own, issued when it joins; can be removed one at a time.
   - invite key (state.key): only for joining, and for houses made before device tokens existed. Can be reset.
   - feed key (state.feed): read-only calendar feed. */
export function auth(state, k) {
  if (!state || typeof k !== 'string' || !k) return null;
  const hk = hash(k);
  if (state.devices && state.devices[hk]) return { kind: 'device', id: hk.slice(0, 12) };
  if (eq(state.key, k)) return { kind: 'invite' };
  if (state.feed && eq(state.feed, k)) return { kind: 'feed' };
  return null;
}
export const canWrite = a => a && (a.kind === 'device' || a.kind === 'invite');

export async function write(h, state, etag) {
  return put(path(h), JSON.stringify(state), {
    access: 'private', contentType: 'application/json', addRandomSuffix: false,
    allowOverwrite: !!etag, ...(etag ? { ifMatch: etag } : {}), cacheControlMaxAge: 60
  });
}

export function addDevice(state, label) {
  const token = newSecret(24);
  state.devices = state.devices || {};
  state.devices[hash(token)] = { label: String(label || 'Phone').slice(0, 60), at: Date.now() };
  return token;
}

export async function create(label) {
  const h = randomBytes(8).toString('hex').slice(0, 10);
  const state = { key: newSecret(), feed: newSecret(), v: 1, docs: {}, devices: {}, created: Date.now() };
  const token = addDevice(state, label);
  await write(h, state, null);
  return { h, token, state };
}

// Keep the house file small: newest 1,000 activity entries, shift checks from the last 14 days.
function prune(docs) {
  const act = docs.activity;
  if (act) {
    const ids = Object.keys(act);
    if (ids.length > 1000) ids.sort((a, b) => (act[b].at || 0) - (act[a].at || 0)).slice(1000).forEach(id => delete act[id]);
  }
  const ch = docs.checks;
  if (ch) {
    const cutoff = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
    for (const id of Object.keys(ch)) if ((ch[id].date || '') < cutoff) delete ch[id];
  }
}

export function apply(state, ops) {
  const docs = state.docs || (state.docs = {});
  for (const o of ops) {
    if (!o || !COLS.has(o.c) || typeof o.i !== 'string' || o.i.length > 80) continue;
    const col = docs[o.c] || (docs[o.c] = {});
    if (o.t === 'del') delete col[o.i];
    else if (o.t === 'set' && o.d && typeof o.d === 'object') {
      const s = JSON.stringify(o.d);
      if (s.length <= 64000) col[o.i] = JSON.parse(s);
    }
  }
  prune(docs);
  return state;
}

/* Read-modify-write with optimistic concurrency. fn(state, who) mutates state and returns a result,
   or returns {status} to stop without writing. */
export async function mutate(h, k, fn, { needWrite = true } = {}) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const cur = await read(h);
    const who = cur && auth(cur.state, k);
    if (!who || (needWrite && !canWrite(who))) return { status: 404 };
    const out = fn(cur.state, who);
    if (out && out.status) return out;
    cur.state.v = (cur.state.v || 0) + 1;
    try { await write(h, cur.state, cur.etag); return { status: 200, state: cur.state, who, out }; }
    catch (e) {
      if (e instanceof BlobPreconditionFailedError || /precondition/i.test(String(e && e.message))) {
        await new Promise(r => setTimeout(r, 80 + Math.random() * 250)); continue;
      }
      throw e;
    }
  }
  return { status: 409 };
}

export function publicState(s, who) {
  const out = { v: s.v, docs: s.docs || {} };
  if (who && who.kind === 'device') {
    out.invite = s.key; out.feed = s.feed; out.me = who.id;
    out.devices = Object.entries(s.devices || {}).map(([hk, d]) => ({ id: hk.slice(0, 12), label: d.label, at: d.at }));
  }
  return out;
}
