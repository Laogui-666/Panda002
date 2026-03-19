/**
 * 用户登录 API
 * 
 * 处理前台用户登录认证
 * 使用数据库中的用户数据
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { verifyPassword } from '@/lib/erp/auth';
import { UserStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'muhai-visa-erp-secret-key-2024';
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
      companyId: true,
      departmentId: true,
      passwordHash: true,
      status: true,
    },
  });

  if (!user) {
    return null;
  }

  if (user.status !== UserStatus.ACTIVE) {
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

  // 记录登录日志
  await prisma.loginLog.create({
    data: {
      userId: user.id,
      ipAddress: '0.0.0.0',
      loginStatus: 'success',
    },
  });

  const { passwordHash, ...userInfo } = user;
  return userInfo;
}

// 生成JWT token（payload与auth.ts中的JWTPayload一致）
function generateToken(userInfo: {
  id: number;
  username: string;
  role: string;
  companyId: number | null;
}): string {
  return jwt.sign(
    { userId: userInfo.id, username: userInfo.username, role: userInfo.role, companyId: userInfo.companyId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
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
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      companyId: user.companyId
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    
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
        companyId: true,
        departmentId: true,
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
      { success: false, message: '登录已过期，请重新登录' },
      { status: 401 }
    );
  }
}
