import handler from './api/generate.js';

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path !== '/api/generate') return path.startsWith('/api/') ? new Response('Not Found', { status: 404 }) : env.ASSETS.fetch(request);
    if (Number(request.headers.get('content-length')) > 10000) return Response.json({ error: '请求内容过长。' }, { status: 413 });
    let body = '';
    if (request.method === 'POST') {
      try { body = await request.text(); } catch { return Response.json({ error: '请求内容不正确。' }, { status: 400 }); }
      if (body.length > 10000) return Response.json({ error: '请求内容过长。' }, { status: 413 });
    }
    let status = 200;
    const res = { status(code) { status = code; return this; }, json(value) { return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } }); } };
    return handler({ method: request.method, body }, res, env);
  }
};
