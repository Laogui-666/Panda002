/**
 * 用户注册 API
 * 
 * 处理用户注册
 * 注意：手机号注册功能暂时预留接口，实际实现需要短信验证码服务
 */

import { NextRequest, NextResponse } from 'next/server';

// 用户数据存储（开发环境使用内存，生产环境应使用数据库）
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

let nextId = 1;

// 获取所有用户（用于初始化）
function initDefaultUsers() {
  if (users.size === 0) {
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
    nextId = 3;
  }
}

initDefaultUsers();

export async function POST(request: NextRequest) {
  try {
    const { username, password, nickname, phone, email } = await request.json();

    // 验证必填字段
    if (!username || !password || !nickname) {
      return NextResponse.json(
        { success: false, message: '用户名、密码和昵称为必填项' },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { success: false, message: '用户名长度应为3-20个字符' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: '密码长度至少6位' },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    if (users.has(username)) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 }
      );
    }

    // =====================================================
    // 手机号注册预留接口
    // =====================================================
    // TODO: 实现手机号注册功能需要：
    // 1. 接入短信验证码服务（如阿里云短信、腾讯云短信）
    // 2. 验证手机号格式
    // 3. 发送验证码到手机号
    // 4. 验证验证码正确性
    // 
    // 示例代码结构：
    // if (phone) {
    //   // 验证手机号格式
    //   if (!/^1[3-9]\d{9}$/.test(phone)) {
    //     return NextResponse.json(
    //       { success: false, message: '手机号格式不正确' },
    //       { status: 400 }
    //     );
    //   }
    //   
    //   // 检查手机号是否已注册
    //   const existingPhone = Array.from(users.values()).find(u => u.phone === phone);
    //   if (existingPhone) {
    //     return NextResponse.json(
    //       { success: false, message: '该手机号已注册' },
    //       { status: 400 }
    //     );
    //   }
    //   
    //   // TODO: 发送验证码
    //   // const verificationCode = generateVerificationCode();
    //   // await sendSMS(phone, verificationCode);
    //   // 存储验证码（实际应存入Redis并设置过期时间）
    //   
    //   // 验证验证码（注册时需要）
    //   // if (!verifyCode(phone, inputCode)) {
    //   //   return NextResponse.json(
    //   //     { success: false, message: '验证码错误或已过期' },
    //   //     { status: 400 }
    //   //   );
    //   // }
    // }
    // =====================================================

    // 创建新用户
    const newUser = {
      id: nextId++,
      username,
      password, // 生产环境应使用bcrypt加密
      nickname,
      phone: phone || undefined,
      email: email || undefined,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    users.set(username, newUser);

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: '注册成功',
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
