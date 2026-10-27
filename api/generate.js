const products = ['Pebble M350s 白色', 'LIFT 玫瑰粉', 'MX Master 3S 石墨灰', 'POP Mouse Blast 黄黑'];
const wants = ['只要文案', '文案 + 配图', '文案 + 配图 + 视频'];

export default async function handler(req, res, env = process.env) {
  const send = (status, value) => res.status(status).json(value);
  if (req.method !== 'POST') return send(405, { error: '请使用正确的请求方式。' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return send(400, { error: '请求内容不正确。' }); } }
  const { product, campaign, audience, want, shot = '' } = body || {};
  if (!products.includes(product) || !wants.includes(want) || typeof campaign !== 'string' || !campaign.trim() || campaign.length > 20 || typeof audience !== 'string' || !audience.trim() || audience.length > 60 || typeof shot !== 'string' || shot.length > 500) return send(400, { error: '请检查产品、主题、目标人群和镜头要求。' });
  const base = env.DIFY_API_BASE?.trim().replace(/\/+$/, '');
  const key = env.DIFY_API_KEY?.trim();
  if (!base || !key) return send(503, { error: '服务尚未配置完成，请联系管理员。' });
  try {
    const response = await fetch(`${base}/workflows/run`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ inputs: { product, campaign: campaign.trim(), audience: audience.trim(), want, shot: shot.trim() }, response_mode: 'blocking', user: 'logitech-creative-web' }), signal: AbortSignal.timeout(55000) });
    if (!response.ok) return send(502, { error: '生成服务暂时不可用，请稍后重试。' });
    const payload = await response.json();
    if (payload.data?.status !== 'succeeded') return send(502, { error: '生成未完成，请稍后重试。' });
    const output = payload.data?.outputs?.result;
    const parsed = typeof output === 'string' ? JSON.parse(output) : output;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid output');
    const text = value => typeof value === 'string' ? value.split(key).join('[已隐藏]') : '';
    const url = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) && !u.href.includes(key) ? u.href : ''; } catch { return ''; } };
    return send(200, { result: { verdict: text(parsed.verdict), reason: text(parsed.reason), error: text(parsed.error), xhs: { title: text(parsed.xhs?.title), body: text(parsed.xhs?.body), tags: Array.isArray(parsed.xhs?.tags) ? parsed.xhs.tags.filter(x => typeof x === 'string').map(text).join(' ') : text(parsed.xhs?.tags) }, douyin: { script: text(parsed.douyin?.script) }, detail: { headline: text(parsed.detail?.headline), points: Array.isArray(parsed.detail?.points) ? parsed.detail.points.filter(x => typeof x === 'string').map(text) : [], price: text(parsed.detail?.price) }, image_url: url(parsed.image_url), video_url: url(parsed.video_url), video_desc: text(parsed.video_desc) } });
  } catch { return send(502, { error: '生成失败，请稍后重试。' }); }
}
