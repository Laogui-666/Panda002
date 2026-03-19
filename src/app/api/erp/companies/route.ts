/**
 * ERP公司管理API
 * 
 * 公司CRUD（超级管理员专用）
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';
import { UserRole } from '@/lib/erp/types';

// GET /api/erp/companies
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 只有超级管理员可以查看所有公司
    if (user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const name = searchParams.get('name');

    const where: any = {};
    if (name) where.name = { contains: name };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          _count: {
            select: { users: true, orders: true, customers: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        list: companies,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取公司列表失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// POST /api/erp/companies - 创建公司
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { name, shortName, phone, email, address } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: '公司名称不能为空' }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        shortName,
        phone,
        email,
        address,
      },
    });

    return NextResponse.json({
      success: true,
      message: '公司创建成功',
      data: company,
    });
  } catch (error) {
    console.error('创建公司失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/erp/companies - 更新公司
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少公司ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, shortName, phone, email, address, status } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: '公司名称不能为空' }, { status: 400 });
    }

    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name,
        shortName,
        phone,
        email,
        address,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: '公司更新成功',
data: company,
    });
  } catch (error) {
    console.error('更新公司失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/erp/companies - 删除公司
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少公司ID' }, { status: 400 });
    }

    await prisma.company.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: '公司删除成功',
    });
  } catch (error) {
    console.error('删除公司失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
