/**
 * ERP登录API
 * 
 * 用户登录认证
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateUser, generateToken, ROLE_LABELS } from '@/lib/erp/auth';
import prisma from '@/lib/erp/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 验证用户
    const user = await validateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 获取用户详细信息
    const userDetail = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // 生成Token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      companyId: user.companyId,
    });

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          roleLabel: ROLE_LABELS[user.role],
          companyId: user.companyId,
          companyName: userDetail?.company?.name,
          departmentId: user.departmentId,
          departmentName: userDetail?.department?.name,
        },
      },
    });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
