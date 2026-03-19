/**
 * 用户登出 API
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: '登出成功',
  });

  // 清除cookie
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  return response;
}
