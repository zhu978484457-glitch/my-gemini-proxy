export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);

  // 1. 强行把请求目标替换为谷歌官方的 Gemini API 地址
  url.host = 'generativelanguage.googleapis.com';

  // 2. 移除 Vercel 自动生成的 /api 前缀，确保路径与谷歌官方 100% 对齐
  if (url.pathname.startsWith('/api')) {
    url.pathname = url.pathname.replace('/api', '');
  }

  // 3. 构建全新的请求，转发所有 Header 和数据体
  const newRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });

  // 4. 返回谷歌的响应，并加上跨域头，防止酒馆前端报错
  const response = await fetch(newRequest);
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, OPTION, POST, PUT, DELETE');
  newHeaders.set('Access-Control-Allow-Headers', '*');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
