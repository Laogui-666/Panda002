/**
 * 找回密码 API
 * 
 * 处理密码找回
 * 注意：找回密码功能暂时预留接口，实际实现需要短信/邮箱验证码服务
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

// 初始化默认用户
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
  }
}

initDefaultUsers();

// 验证码存储（实际应使用Redis）
const verificationCodes: Map<string, { code: string; expiresAt: number }> = new Map();

// 生成验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 发送验证码（预留接口）
async function sendVerificationCode(phone: string, code: string): Promise<boolean> {
  // =====================================================
  // 短信验证码发送预留接口
  // =====================================================
  // TODO: 实现短信发送功能需要：
  // 1. 接入短信验证码服务（如阿里云短信、腾讯云短信）
  // 2. 模板审核
  // 3. 调用发送接口
  // 
  // 示例代码结构：
  // try {
  //   const result = await smsClient.send({
  //     PhoneNumbers: phone,
  //     SignName: '盼达旅行',
  //     TemplateCode: 'SMS_xxxxx',
  //     TemplateParam: { code }
  //   });
  //   return result.Code === 'OK';
  // } catch (error) {
  //   console.error('发送验证码失败:', error);
  //   return false;
  // }
  // =====================================================
  
  // 开发环境直接返回成功
  console.log(`[开发模式] 模拟发送验证码 ${code} 到手机号 ${phone}`);
  return true;
}

// 发送验证码
export async function POST(request: NextRequest) {
  try {
    const { action, username, phone: inputPhone, code, newPassword } = await request.json();
    let phone = inputPhone;

    // 验证用户名或手机号
    if (!username && !phone) {
      return NextResponse.json(
        { success: false, message: '请输入用户名或手机号' },
        { status: 400 }
      );
    }

    // 查找用户
    let user = null;
    if (username) {
      user = users.get(username);
    } else if (phone) {
      user = Array.from(users.values()).find(u => u.phone === phone);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 根据操作类型处理
    if (action === 'send_code') {
      // =====================================================
      // 发送验证码
      // =====================================================
      // 实际实现需要：
      // 1. 验证手机号格式
      // 2. 检查手机号是否已绑定
      // 3. 限制发送频率（如每60秒只能发送一次）
      // 4. 发送验证码到手机号
      
      if (!phone && user.phone) {
        // 使用用户绑定的手机号
        phone = user.phone;
      } else if (!phone) {
        return NextResponse.json(
          { success: false, message: '该用户未绑定手机号' },
          { status: 400 }
        );
      }

      // 检查手机号格式
      if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
        return NextResponse.json(
          { success: false, message: '手机号格式不正确' },
          { status: 400 }
        );
      }

      // 检查发送频率（实际应使用Redis）
      const existingCode = verificationCodes.get(phone);
      if (existingCode && existingCode.expiresAt > Date.now()) {
        const remainingTime = Math.ceil((existingCode.expiresAt - Date.now()) / 1000);
        return NextResponse.json(
          { success: false, message: `请${remainingTime}秒后再试` },
          { status: 400 }
        );
      }

      // 生成并发送验证码
      const verificationCode = generateCode();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5分钟有效
      
      verificationCodes.set(phone, { code: verificationCode, expiresAt });
      
      // 发送验证码（预留接口）
      await sendVerificationCode(phone, verificationCode);

      return NextResponse.json({
        success: true,
        message: '验证码已发送',
        // 开发环境返回验证码
        devCode: verificationCode,
      });
    }

    if (action === 'reset_password') {
      // 验证新密码
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: '密码长度至少6位' },
          { status: 400 }
        );
      }

      // 验证验证码（预留接口）
      // 实际实现需要：
      // 1. 验证验证码是否正确
      // 2. 验证验证码是否过期
      // 3. 验证手机号是否匹配
      
      // 开发环境简化验证
      if (code !== '123456' && code !== verificationCodes.get(user.phone || '')?.code) {
        // 验证码验证通过，更新密码
        // user.password = newPassword; // 这行在生产环境需要取消注释
      }

      // 更新密码（生产环境需要实际实现验证码验证）
      user.password = newPassword;
      users.set(user.username, user);

      // 清除验证码
      if (user.phone) {
        verificationCodes.delete(user.phone);
      }

      return NextResponse.json({
        success: true,
        message: '密码重置成功',
      });
    }

    return NextResponse.json(
      { success: false, message: '无效的操作' },
      { status: 400 }
    );
  } catch (error) {
    console.error('找回密码错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
