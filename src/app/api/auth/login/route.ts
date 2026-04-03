/**
 * 用户登录 API
 * 
 * 处理前台用户登录认证
 * 使用数据库中的用户数据
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken, verifyToken, JWTPayload } from '@/lib/auth';

// JWT配置
const JWT_EXPIRES_IN = '7d';

// 验证密码（调用auth模块）
async function validateUserPassword(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      passwordHash: true,
      status: true,
    },
  });

  if (!user) {
    return null;
  }

  if (user.status !== 'ACTIVE') {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  // 更新最后登录时间
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const { passwordHash, ...userInfo } = user;
  return userInfo;
}

// 生成JWT token
function createToken(userInfo: {
  id: number;
  username: string;
  role: string;
}): string {
  return generateToken(
    { userId: userInfo.id, username: userInfo.username, role: userInfo.role },
    JWT_EXPIRES_IN
  );
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, rememberMe } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 从数据库验证用户
    const user = await validateUserPassword(username, password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成JWT token
    const token = createToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // 返回用户信息（不包含密码）
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: user,
        token,
      }
    });

    // 如果记住我，设置长期cookie
    if (rememberMe) {
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30天
        path: '/',
      });
    } else {
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1天
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 获取当前登录用户信息
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    // 解析token获取用户ID
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: '登录已过期，请重新登录' },
        { status: 401 }
      );
    }
    
    // 从数据库获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
