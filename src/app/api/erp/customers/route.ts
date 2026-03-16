/**
 * ERP客户API
 * 
 * 客户管理CRUD
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser, canAccessCompany } from '@/lib/erp/auth';
import { UserRole, ROLE_LABELS } from '@/lib/erp/types';

// GET /api/erp/customers
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const name = searchParams.get('name');
    const phone = searchParams.get('phone');
    const companyId = searchParams.get('companyId');

    // 构建查询条件
    const where: any = {};

    // 权限控制
    if (user.role === UserRole.SUPER_ADMIN) {
      if (companyId) where.companyId = parseInt(companyId);
    } else if (user.role === UserRole.COMPANY_OWNER || user.role === UserRole.DEPT_ADMIN) {
      where.companyId = user.companyId;
    } else if (user.role === UserRole.CUSTOMER) {
      where.userId = user.id;
    }

    // 筛选条件
    if (name) where.name = { contains: name };
    if (phone) where.phone = { contains: phone };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, shortName: true } },
          user: { select: { id: true, username: true, email: true } },
          orders: {
            select: { id: true, orderNo: true, status: true, visaCountry: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        list: customers,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取客户列表失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// POST /api/erp/customers
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限检查
    const allowedRoles = ['SUPER_ADMIN', 'COMPANY_OWNER', 'DEPT_ADMIN', 'OPERATOR'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ success: false, message: '无权限创建客户' }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, email, passportNo, idCardNo, gender, birthDate, nationality, address, companyId, userId } = body;

    // 验证必填字段
    if (!name || !companyId) {
      return NextResponse.json({ success: false, message: '缺少必填字段' }, { status: 400 });
    }

    // 验证公司权限
    if (!canAccessCompany(user, companyId)) {
      return NextResponse.json({ success: false, message: '无权限操作该公司' }, { status: 403 });
    }

    // 创建客户
    const customer = await prisma.customer.create({
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
        companyId,
        userId,
      },
      include: {
        company: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: '客户创建成功',
      data: customer,
    });
  } catch (error) {
    console.error('创建客户失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
