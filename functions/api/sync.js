/**
 * Cloudflare Pages Function: 家庭习惯打卡云端 KV 同步接口
 * 路由匹配：https://<your-project>.pages.dev/api/sync
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 跨域与 JSON 响应头
  const corsHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // 预检请求直接通过
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 获取家庭频道标识
  const channel = url.searchParams.get('channel') || 'fute_family_default';
  const kvKey = `daka_data_${channel}`;

  // 兼容不同的 KV 绑定变量名 (首选 DAKA_KV，也可兼容 EDGE_KV 或 KV)
  const kv = env.DAKA_KV || env.EDGE_KV || env.KV;

  if (!kv) {
    return new Response(
      JSON.stringify({
        code: 500,
        error: '未绑定 Cloudflare KV 数据库！请前往 Cloudflare Pages -> Settings -> Functions -> KV namespace bindings 绑定变量名为 DAKA_KV。'
      }),
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    // 1. GET 请求：读取打卡数据
    if (request.method === 'GET') {
      const data = await kv.get(kvKey, { type: 'json' });
      return new Response(JSON.stringify({ code: 0, data }), { headers: corsHeaders });
    }

    // 2. POST 请求：写入最新打卡数据
    if (request.method === 'POST') {
      const body = await request.json();
      if (body && body.kids) {
        // 持久化存储到 Cloudflare 全球边缘 KV
        await kv.put(kvKey, JSON.stringify(body));
      }
      return new Response(JSON.stringify({ code: 0, message: 'saved' }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ code: 405, message: 'Method Not Allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ code: 500, error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
