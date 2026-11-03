import { read, auth, mutate, create, apply, addDevice, newSecret, publicState, ID_RE } from './_store.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const { h, k, v } = req.query;
      if (!ID_RE.test(h || '')) return res.status(400).json({ error: 'bad_house' });
      const cur = await read(h);
      const who = cur && auth(cur.state, k);
      if (!who || who.kind === 'feed') return res.status(404).json({ error: 'not_found' });
      if (v && String(cur.state.v) === String(v)) return res.status(200).json({ same: true, v: cur.state.v });
      return res.status(200).json(publicState(cur.state, who));
    }
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'method' }); }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (body.create) {
      const { h, token, state } = await create(body.label);
      return res.status(200).json({ h, token, ...publicState(state, { kind: 'device', id: '' }) });
    }
    const { h, k } = body;
    if (!ID_RE.test(h || '')) return res.status(400).json({ error: 'bad_request' });

    // Join with the invite key (or upgrade an older phone that only has it): issue this phone its own token.
    if (body.join) {
      let token = null;
      const r = await mutate(h, k, (state, who) => {
        if (who.kind !== 'invite') return { status: 404 };
        token = addDevice(state, body.label);
      });
      if (r.status !== 200) return res.status(r.status).json({ error: r.status === 404 ? 'not_found' : 'busy' });
      return res.status(200).json({ token, ...publicState(r.state, { kind: 'device', id: '' }) });
    }

    // Device-only actions
    if (body.rotate || body.revoke) {
      const r = await mutate(h, k, (state, who) => {
        if (who.kind !== 'device') return { status: 403 };
        if (body.rotate) state.key = newSecret();
        if (body.revoke) {
          const id = String(body.revoke);
          if (id === who.id) return { status: 400 };
          for (const hk of Object.keys(state.devices || {})) if (hk.slice(0, 12) === id) delete state.devices[hk];
        }
      });
      if (r.status !== 200) return res.status(r.status).json({ error: 'refused' });
      return res.status(200).json(publicState(r.state, r.who));
    }

    const { ops } = body;
    if (!Array.isArray(ops) || ops.length > 300) return res.status(400).json({ error: 'bad_request' });
    const r = await mutate(h, k, state => { apply(state, ops); });
    if (r.status !== 200) return res.status(r.status).json({ error: r.status === 404 ? 'not_found' : 'busy' });
    return res.status(200).json(publicState(r.state, r.who));
  } catch (e) {
    console.error('house api error', e);
    return res.status(500).json({ error: 'server' });
  }
}
