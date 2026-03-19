/**
 * ERP认证中间件
 * 
 * 验证请求的JWT令牌并附加用户信息
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/erp/auth';

// 公开API路径（不需要认证）
const publicPaths = [
  '/api/erp/auth/login',
  '/api/erp/auth/register',
  '/api/health',
];

// 静态资源路径
const staticPaths = [
  '/_next',
  '/favicon',
  '/images',
  '/fonts',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是公开路径
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 检查是否是静态资源
  if (staticPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 检查是否是API路由
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 获取Token
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: '未授权，请先登录' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: '令牌无效或已过期' },
      { status: 401 }
    );
  }

  // 将用户信息添加到请求头
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId.toString());
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-company-id', payload.companyId?.toString() || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/erp/:path*',
  ],
};
