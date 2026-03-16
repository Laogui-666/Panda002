/**
 * ERP客户详情API
 * 
 * 获取、修改、删除单个客户
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser, canAccessCompany } from '@/lib/erp/auth';
import { UserRole } from '@/lib/erp/types';

// GET /api/erp/customers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const customerId = parseInt(params.id);
    if (isNaN(customerId)) {
      return NextResponse.json({ success: false, message: '无效的客户ID' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        company: { select: { id: true, name: true, shortName: true } },
        user: { select: { id: true, username: true, email: true, name: true } },
        orders: {
          include: {
            company: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ success: false, message: '客户不存在' }, { status: 404 });
    }

    // 权限检查
    if (user.role !== UserRole.SUPER_ADMIN && customer.companyId !== user.companyId) {
      return NextResponse.json({ success: false, message: '无权限查看该客户' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('获取客户详情失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/erp/customers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const customerId = parseInt(params.id);
    if (isNaN(customerId)) {
      return NextResponse.json({ success: false, message: '无效的客户ID' }, { status: 400 });
    }

    // 检查客户是否存在
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ success: false, message: '客户不存在' }, { status: 404 });
    }

    // 权限检查
    if (user.role !== UserRole.SUPER_ADMIN && customer.companyId !== user.companyId) {
      return NextResponse.json({ success: false, message: '无权限操作该客户' }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, email, passportNo, idCardNo, gender, birthDate, nationality, address } = body;

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name,
        phone,
        email,
        passportNo,
        idCardNo,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        nationality,
        address,
      },
    });

    return NextResponse.json({
      success: true,
      message: '客户更新成功',
      data: updatedCustomer,
    });
  } catch (error) {
    console.error('更新客户失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/erp/customers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 只有超级管理员和公司负责人可以删除
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.COMPANY_OWNER) {
      return NextResponse.json({ success: false, message: '无权限删除客户' }, { status: 403 });
    }

    const customerId = parseInt(params.id);
    if (isNaN(customerId)) {
      return NextResponse.json({ success: false, message: '无效的客户ID' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ success: false, message: '客户不存在' }, { status: 404 });
    }

    // 检查是否有相关订单
    const orderCount = await prisma.order.count({
      where: { customerId },
    });

    if (orderCount > 0) {
      return NextResponse.json({ success: false, message: '该客户有关联订单，无法删除' }, { status: 400 });
    }

    await prisma.customer.delete({
      where: { id: customerId },
    });

    return NextResponse.json({
      success: true,
      message: '客户删除成功',
    });
  } catch (error) {
    console.error('删除客户失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
