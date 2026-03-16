/**
 * 用户登录 API
 * 
 * 处理前台用户登录认证
 */

import { NextRequest, NextResponse } from 'next/server';

// 用户数据存储（开发环境使用内存，生产环境应使用数据库）
// 注意：这里为了演示使用内存存储，实际项目请使用数据库
const users: Map<string, {
  id: number;
  username: string;
  password: string;
  nickname: string;
  phone?: string;
  email?: string;
  role: 'user' | 'admin';
  createdAt: string;
}> = new Map();

// 初始化默认用户
function initDefaultUsers() {
  if (users.size === 0) {
    // 普通用户
    users.set('user123', {
      id: 1,
      username: 'user123',
      password: 'user123',
      nickname: '测试用户',
      phone: '13800138000',
      email: 'user@example.com',
      role: 'user',
      createdAt: new Date().toISOString(),
    });
    // 管理员用户
    users.set('admin', {
      id: 2,
      username: 'admin',
      password: 'admin123',
      nickname: '系统管理员',
      phone: '13900139000',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
  }
}

initDefaultUsers();

// 验证密码
function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  return inputPassword === storedPassword;
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

    // 查找用户
    const user = users.get(username);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 验证密码
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成简单token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    // 设置cookie
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token,
      },
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
    const decoded = Buffer.from(token, 'base64').toString();
    const userId = parseInt(decoded.split(':')[0]);

    // 查找用户
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
