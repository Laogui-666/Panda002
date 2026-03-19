/**
 * 个人资料 API
 * 
 * 获取和更新用户个人资料
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import jwt from 'jsonwebtoken';
import { verifyPassword } from '@/lib/erp/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'muhai-visa-erp-secret-key-2024';

/**
 * GET - 获取当前用户资料
 */
export async function GET(request: NextRequest) {
  try {
    // 从cookie获取token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    // 解析token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };

    // 获取用户信息（包含公司名称）
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        companyId: true,
        departmentId: true,
        lastLoginAt: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            shortName: true,
          }
        },
        department: {
          select: {
            id: true,
            name: true,
          }
        }
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
    console.error('获取用户资料错误:', error);
    return NextResponse.json(
      { success: false, message: '登录已过期，请重新登录' },
      { status: 401 }
    );
  }
}

/**
 * PUT - 更新用户资料
 */
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    const body = await request.json();

    const { name, email, phone, avatar, currentPassword, newPassword } = body;

    // 获取当前用户
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        passwordHash: true,
        email: true,
        phone: true,
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 如果要修改密码，必须提供当前密码
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: '修改密码需要提供当前密码' },
          { status: 400 }
        );
      }

      // 验证当前密码
      const isValidPassword = await verifyPassword(currentPassword, currentUser.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: '当前密码错误' },
          { status: 400 }
        );
      }

      // 密码强度验证
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: '新密码长度不能少于6位' },
          { status: 400 }
        );
      }
    }

    // 更新用户资料
    const updateData: any = {
      updatedAt: new Date(),
    };

    // 可更新的字段
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    // 如果要修改密码，使用bcrypt加密
    if (newPassword) {
      const bcrypt = require('bcryptjs');
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: '资料更新成功',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('更新用户资料错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

/**
 * POST - 验证密码（用于敏感操作）
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: '请提供密码' },
        { status: 400 }
      );
    }

    // 获取用户密码
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { passwordHash: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: '密码错误' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '验证成功'
    });
  } catch (error) {
    console.error('验证密码错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
