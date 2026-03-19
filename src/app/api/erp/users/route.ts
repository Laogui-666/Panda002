/**
 * ERP用户管理API
 * 
 * 用户CRUD
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser, canAccessCompany, hashPassword } from '@/lib/erp/auth';
import { ROLE_LABELS, UserRole } from '@/lib/erp/types';

// 角色级别映射（数字越大权限越高）
const ROLE_LEVELS: Record<UserRole, number> = {
  SUPER_ADMIN: 9,
  COMPANY_OWNER: 8,
  CS_ADMIN: 7,
  CUSTOMER_SERVICE: 6,
  VISA_ADMIN: 5,
  DOC_COLLECTOR: 4,
  OPERATOR: 3,
  OUTSOURCE: 2,
  CUSTOMER: 1,
};

// GET /api/erp/users
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const role = searchParams.get('role') as UserRole | null;
    const companyId = searchParams.get('companyId');
    const departmentId = searchParams.get('departmentId');
    const name = searchParams.get('name');

    // 构建查询条件
    const where: any = {};

    // 权限控制
    if (user.role === UserRole.SUPER_ADMIN) {
      // 超级管理员可以查看所有
      if (companyId) where.companyId = parseInt(companyId);
    } else if (user.role === UserRole.COMPANY_OWNER) {
      // 公司负责人只能查看本公司
      where.companyId = user.companyId;
    } else if (user.role === UserRole.CS_ADMIN || user.role === UserRole.VISA_ADMIN) {
      // 部门管理员可以查看本公司
      where.companyId = user.companyId;
    } else {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    if (role) where.role = role;
    if (departmentId) where.departmentId = parseInt(departmentId);
    if (name) where.name = { contains: name };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          status: true,
          companyId: true,
          departmentId: true,
          lastLoginAt: true,
          createdAt: true,
          company: { select: { id: true, name: true } },
          department: { select: { id: true, name: true, code: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    // 格式化返回
    const formattedUsers = users.map(u => ({
      ...u,
      roleLabel: ROLE_LABELS[u.role],
    }));

    return NextResponse.json({
      success: true,
      data: {
        list: formattedUsers,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// POST /api/erp/users
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限检查
    const adminRoles: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.COMPANY_OWNER, UserRole.CS_ADMIN];
    if (!adminRoles.includes(user.role as UserRole)) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, email, name, phone, role, companyId, departmentId } = body;

    // 验证必填字段
    if (!username || !password || !name) {
      return NextResponse.json({ success: false, message: '缺少必填字段' }, { status: 400 });
    }

    // 权限校验：允许创建同级及以下角色
    const userRoleLevel = ROLE_LEVELS[user.role as UserRole] || 0;
    const targetRoleLevel = ROLE_LEVELS[role as UserRole] || 0;
    
    // 只有目标角色级别小于等于当前用户角色级别时才允许
    if (targetRoleLevel > userRoleLevel) {
      return NextResponse.json({ success: false, message: '无权限创建该角色用户' }, { status: 403 });
    }

    // 公司权限校验
    if (companyId && !canAccessCompany(user, companyId)) {
      return NextResponse.json({ success: false, message: '无权限操作该公司' }, { status: 403 });
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: '用户名已存在' }, { status: 400 });
    }

    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash: await hashPassword(password),
        email,
        name,
        phone,
        role: role || UserRole.OPERATOR,
        companyId: companyId || user.companyId,
        departmentId: departmentId || user.departmentId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        companyId: true,
        departmentId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '用户创建成功',
      data: newUser,
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
