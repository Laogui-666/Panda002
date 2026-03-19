/**
 * 用户注册 API
 * 
 * 处理用户注册
 * 使用数据库存储用户数据
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { hashPassword } from '@/lib/erp/auth';
import { UserRole, UserStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { username, password, nickname, phone, email } = await request.json();

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码为必填项' },
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
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 }
      );
    }

    // 如果提供了邮箱，检查邮箱是否已存在
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: '该邮箱已被注册' },
          { status: 400 }
        );
      }
    }

    // 加密密码
    const passwordHash = await hashPassword(password);

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash,
        name: nickname || username,
        phone: phone || null,
        email: email || null,
        role: UserRole.CUSTOMER, // 默认普通用户角色
        status: UserStatus.ACTIVE,
      },
    });

    // 返回用户信息（不包含密码）
    const { passwordHash: _, ...userInfo } = newUser;

    return NextResponse.json({
      success: true,
      message: '注册成功',
      data: { user: userInfo }
    });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
