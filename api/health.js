import { get, put, BlobPreconditionFailedError } from '@vercel/blob';

// Checks that Blob storage works end to end: write, read back, conditional overwrite, stale write refused.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const t0 = Date.now(), steps = {};
  try {
    const p = 'health/ping.json';
    const a = await put(p, JSON.stringify({ at: t0 }), { access: 'private', contentType: 'application/json', allowOverwrite: true, addRandomSuffix: false });
    steps.write = true;
    const r = await get(p, { access: 'private', useCache: false });
    const body = JSON.parse(await new Response(r.stream).text());
    steps.read = body.at === t0;
    const b = await put(p, JSON.stringify({ at: t0 + 1 }), { access: 'private', contentType: 'application/json', allowOverwrite: true, addRandomSuffix: false, ifMatch: r.blob.etag });
    steps.conditional = !!b;
    try {
      await put(p, JSON.stringify({ at: 0 }), { access: 'private', contentType: 'application/json', allowOverwrite: true, addRandomSuffix: false, ifMatch: r.blob.etag });
      steps.staleRefused = false;
    } catch (e) { steps.staleRefused = e instanceof BlobPreconditionFailedError || /precondition/i.test(String(e && e.message)); }
    const ok = Object.values(steps).every(Boolean);
    return res.status(ok ? 200 : 500).json({ ok, steps, ms: Date.now() - t0 });
  } catch (e) {
    return res.status(500).json({ ok: false, steps, error: String(e && e.message || e).slice(0, 200) });
  }
}
