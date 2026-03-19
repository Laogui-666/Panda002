/**
 * ERP个人资料API
 * 
 * 功能：
 * - 获取当前用户资料
 * - 更新当前用户资料（密码修改需要验证）
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/erp/auth';
import { UserRole } from '@/lib/erp/types';

// ============ GET: 获取当前用户资料 ============
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 查询完整用户信息
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        status: true,
        companyId: true,
        departmentId: true,
        lastLoginAt: true,
        createdAt: true,
        company: { select: { id: true, name: true } },
        department: { select: { id: true, name: true, code: true } },
      }
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    }

    // 角色标签
    const roleLabels: Record<string, string> = {
      SUPER_ADMIN: '超级管理员',
      COMPANY_OWNER: '公司负责人',
      CS_ADMIN: '客服部管理员',
      CUSTOMER_SERVICE: '客服',
      VISA_ADMIN: '签证部管理员',
      DOC_COLLECTOR: '资料员',
      OPERATOR: '签证操作员',
      OUTSOURCE: '外包业务员',
      CUSTOMER: '普通用户',
    };

    return NextResponse.json({
      success: true,
      data: {
        ...currentUser,
        roleLabel: roleLabels[currentUser.role] || currentUser.role,
      }
    });

  } catch (error) {
    console.error('获取用户资料失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}

// ============ PUT: 更新当前用户资料 ============
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name,           // 姓名
      email,          // 邮箱
      phone,          // 电话
      avatar,         // 头像
      currentPassword, // 当前密码（修改敏感信息时需要）
      newPassword,    // 新密码
      verifyPassword  // 确认新密码
    } = body;

    // 查询当前用户
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    }

    // 准备更新数据
    const updateData: any = {};

    // 1. 更新基本信息（不需要验证密码）
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    // 2. 修改密码需要验证
    if (newPassword) {
      // 验证当前密码
      if (!currentPassword) {
        return NextResponse.json({ 
          success: false, 
          message: '修改密码需要验证当前密码' 
        }, { status: 400 });
      }

      // 验证密码正确
      const isPasswordValid = await verifyPassword(currentPassword, currentUser.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json({ 
          success: false, 
          message: '当前密码错误' 
        }, { status: 400 });
      }

      // 验证两次密码一致
      if (newPassword !== verifyPassword) {
        return NextResponse.json({ 
          success: false, 
          message: '两次输入的密码不一致' 
        }, { status: 400 });
      }

      // 验证密码强度
      if (newPassword.length < 6) {
        return NextResponse.json({ 
          success: false, 
          message: '密码长度不能少于6位' 
        }, { status: 400 });
      }

      // 更新密码
      updateData.passwordHash = await hashPassword(newPassword);
    }

    // 如果没有要更新的内容
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: '没有要更新的内容' 
      }, { status: 400 });
    }

    // 执行更新
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        companyId: true,
        departmentId: true,
      }
    });

    // 返回成功（不返回密码相关信息）
    return NextResponse.json({
      success: true,
      message: newPassword ? '密码修改成功，请重新登录' : '资料更新成功',
      data: updatedUser
    });

  } catch (error) {
    console.error('更新用户资料失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}
