import { NextResponse } from 'next/server';

// 模拟的 API 密钥
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export function middleware(request) {
  // 获取当前时间
  const requestTime = new Date().toISOString();
  
  // 获取请求方法和路径
  const { method, url } = request;
  const path = new URL(url).pathname;

  // 记录请求日志
  console.log(`[${requestTime}] ${method} ${path}`);

  // 只对 API 路由进行认证检查
  if (path.startsWith('/api')) {
    // 获取请求头中的 API 密钥
    const apiKey = request.headers.get('x-api-key');

    // 检查 API 密钥
    if (!apiKey || apiKey !== API_KEY) {
      console.log(`[${requestTime}] Authentication failed for ${path}`);
      return new NextResponse(
        JSON.stringify({ error: 'Authentication failed' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // 添加自定义响应头
  const response = NextResponse.next();
  response.headers.set('x-request-time', requestTime);
  response.headers.set('x-powered-by', 'Next.js Middleware');

  return response;
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化 API)
     * - favicon.ico (浏览器图标)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 