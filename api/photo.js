import { put } from '@vercel/blob';
import { read, auth, canWrite, ID_RE } from './_store.js';

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { h, k, data } = body;
    if (!ID_RE.test(h || '') || typeof data !== 'string') return res.status(400).json({ error: 'bad_request' });
    const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(data);
    if (!m) return res.status(400).json({ error: 'bad_type' });
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > 3.5 * 1024 * 1024) return res.status(413).json({ error: 'too_large' });
    const cur = await read(h);
    if (!cur || !canWrite(auth(cur.state, k))) return res.status(404).json({ error: 'not_found' });
    const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
    const blob = await put(`photos/${h}/p.${ext}`, buf, { access: 'public', contentType: 'image/' + m[1], addRandomSuffix: true });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error('photo api error', e);
    return res.status(500).json({ error: 'server' });
  }
}
