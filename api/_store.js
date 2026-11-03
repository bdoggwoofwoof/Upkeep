import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { timingSafeEqual, randomBytes } from 'node:crypto';

export const ID_RE = /^[a-z0-9]{10}$/;
export const COLS = new Set(['house','tasks','routines','checks','comments','activity','people','approvals','rewards','things','service','pros','info','items','expenses']);
const path = h => `houses/${h}.json`;

export async function read(h) {
  const r = await get(path(h), { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) return null;
  const text = await new Response(r.stream).text();
  return { state: JSON.parse(text), etag: r.blob.etag };
}

export function keyOk(state, k) {
  if (!state || typeof k !== 'string' || typeof state.key !== 'string') return false;
  const a = Buffer.from(state.key), b = Buffer.from(k);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function write(h, state, etag) {
  return put(path(h), JSON.stringify(state), {
    access: 'private', contentType: 'application/json', addRandomSuffix: false,
    allowOverwrite: !!etag, ...(etag ? { ifMatch: etag } : {}), cacheControlMaxAge: 60
  });
}

export async function create() {
  const h = randomBytes(8).toString('hex').replace(/[^a-z0-9]/g, '').slice(0, 10).padEnd(10, '0');
  const key = randomBytes(18).toString('base64url');
  const state = { key, v: 1, docs: {}, created: Date.now() };
  await write(h, state, null);
  return { h, key, state };
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
  state.v = (state.v || 0) + 1;
  return state;
}

export async function update(h, k, ops) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const cur = await read(h);
    if (!cur || !keyOk(cur.state, k)) return { status: 404 };
    const next = apply(cur.state, ops);
    try { await write(h, next, cur.etag); return { status: 200, state: next }; }
    catch (e) {
      if (e instanceof BlobPreconditionFailedError || /precondition/i.test(String(e && e.message))) {
        await new Promise(r => setTimeout(r, 80 + Math.random() * 250)); continue;
      }
      throw e;
    }
  }
  return { status: 409 };
}

export const publicState = s => ({ v: s.v, docs: s.docs || {} });
