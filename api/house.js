import { read, keyOk, update, create, publicState, ID_RE } from './_store.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const { h, k, v } = req.query;
      if (!ID_RE.test(h || '')) return res.status(400).json({ error: 'bad_house' });
      const cur = await read(h);
      if (!cur || !keyOk(cur.state, k)) return res.status(404).json({ error: 'not_found' });
      if (v && String(cur.state.v) === String(v)) return res.status(200).json({ same: true, v: cur.state.v });
      return res.status(200).json(publicState(cur.state));
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (body.create) {
        const { h, key, state } = await create();
        return res.status(200).json({ h, key, ...publicState(state) });
      }
      const { h, k, ops } = body;
      if (!ID_RE.test(h || '') || !Array.isArray(ops) || ops.length > 300) return res.status(400).json({ error: 'bad_request' });
      const r = await update(h, k, ops);
      if (r.status !== 200) return res.status(r.status).json({ error: r.status === 404 ? 'not_found' : 'busy' });
      return res.status(200).json(publicState(r.state));
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method' });
  } catch (e) {
    console.error('house api error', e);
    return res.status(500).json({ error: 'server' });
  }
}
