/**
 * ERP部门管理API
 * 
 * 功能：
 * - 部门列表查询（支持树形结构）
 * - 部门详情查询
 * - 部门创建
 * - 部门更新
 * - 部门删除
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';
import { UserRole } from '@/lib/erp/types';

// ============ 辅助函数：构建树形结构 ============
function buildTree(departments: any[], parentId: number | null = null): any[] {
  return departments
    .filter(dept => dept.parentId === parentId)
    .map(dept => ({
      ...dept,
      children: buildTree(departments, dept.id)
    }));
}

// ============ GET: 获取部门列表 ============
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const parentId = searchParams.get('parentId');
    const includeTree = searchParams.get('includeTree'); // 是否返回树形结构

    // 构建查询条件
    const where: any = {};

    // 权限控制
    if (user.role === UserRole.SUPER_ADMIN) {
      // 超级管理员可以查看所有
      if (companyId) where.companyId = parseInt(companyId);
    } else if (user.role === UserRole.COMPANY_OWNER || user.role === UserRole.CS_ADMIN || user.role === UserRole.VISA_ADMIN) {
      // 公司负责人和部门管理员可以查看本公司
      where.companyId = user.companyId;
    } else {
      return NextResponse.json({ success: false, message: '无权限访问部门管理' }, { status: 403 });
    }

    // 如果指定了父部门ID
    if (parentId) {
      where.parentId = parseInt(parentId);
    }

    // 查询部门列表
    const departments = await prisma.department.findMany({
      where,
      include: {
        parent: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
        _count: { select: { users: true } }
      },
      orderBy: [
        { parentId: 'asc' },
        { id: 'asc' }
      ]
    });

    // 如果需要树形结构
    if (includeTree === 'true') {
      const tree = buildTree(departments);
      return NextResponse.json({ success: true, data: tree });
    }

    // 格式化返回数据
    const formattedDepartments = departments.map((dept: any) => ({
      id: dept.id,
      name: dept.name,
      code: dept.code,
      description: dept.description,
      parentId: dept.parentId,
      parentName: dept.parent?.name,
      leaderId: dept.leaderId,
      status: dept.status,
      companyId: dept.companyId,
      companyName: dept.company?.name,
      userCount: dept._count?.users || 0,
      createdAt: dept.createdAt,
      updatedAt: dept.updatedAt
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedDepartments 
    });

  } catch (error) {
    console.error('获取部门列表失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}

// ============ POST: 创建部门 ============
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限控制：只有公司负责人及以上可以创建部门
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.COMPANY_OWNER) {
      return NextResponse.json({ success: false, message: '无权限创建部门' }, { status: 403 });
    }

    const body = await request.json();
    const { name, code, description, parentId, leaderId, companyId } = body;

    // 验证必填字段
    if (!name) {
      return NextResponse.json({ success: false, message: '部门名称不能为空' }, { status: 400 });
    }

    // 确定公司ID
    let finalCompanyId = companyId;
    if (!finalCompanyId) {
      if (user.role === UserRole.COMPANY_OWNER) {
        finalCompanyId = user.companyId;
      } else {
        return NextResponse.json({ success: false, message: '请指定公司ID' }, { status: 400 });
      }
    }

    // 权限检查：只能在自己公司下创建部门
    if (user.role === UserRole.COMPANY_OWNER && user.companyId !== finalCompanyId) {
      return NextResponse.json({ success: false, message: '只能在本公司创建部门' }, { status: 403 });
    }

    // 如果指定了父部门，验证父部门存在且属于同一公司
    if (parentId) {
      const parentDept = await prisma.department.findUnique({
        where: { id: parentId }
      });
      if (!parentDept) {
        return NextResponse.json({ success: false, message: '父部门不存在' }, { status: 400 });
      }
      if (parentDept.companyId !== finalCompanyId) {
        return NextResponse.json({ success: false, message: '父部门必须属于同一公司' }, { status: 400 });
      }
    }

    // 如果指定了负责人，验证负责人存在且属于同一公司
    if (leaderId) {
      const leader = await prisma.user.findUnique({
        where: { id: leaderId }
      });
      if (!leader) {
        return NextResponse.json({ success: false, message: '负责人不存在' }, { status: 400 });
      }
      if (leader.companyId !== finalCompanyId) {
        return NextResponse.json({ success: false, message: '负责人必须属于同一公司' }, { status: 400 });
      }
    }

    // 检查部门编码是否已存在（同一公司内）
    if (code) {
      const existingDept = await prisma.department.findFirst({
        where: { code, companyId: finalCompanyId }
      });
      if (existingDept) {
        return NextResponse.json({ success: false, message: '部门编码已存在' }, { status: 400 });
      }
    }

    // 创建部门
    const department = await prisma.department.create({
      data: {
        name,
        code,
        description,
        parentId: parentId || null,
        leaderId: leaderId || null,
        companyId: finalCompanyId,
        status: 'active'
      },
      include: {
        company: { select: { id: true, name: true } },
        parent: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: '部门创建成功',
      data: department
    });

  } catch (error) {
    console.error('创建部门失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}

// ============ PUT: 更新部门 ============
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限控制
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.COMPANY_OWNER) {
      return NextResponse.json({ success: false, message: '无权限更新部门' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, code, description, parentId, leaderId, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少部门ID' }, { status: 400 });
    }

    // 查询部门是否存在
    const existingDept = await prisma.department.findUnique({
      where: { id }
    });

    if (!existingDept) {
      return NextResponse.json({ success: false, message: '部门不存在' }, { status: 404 });
    }

    // 权限检查：只能更新自己公司的部门
    if (user.role === UserRole.COMPANY_OWNER && user.companyId !== existingDept.companyId) {
      return NextResponse.json({ success: false, message: '无权限更新此部门' }, { status: 403 });
    }

    // 如果修改了父部门，验证不能设置自己或自己的子部门为父部门
    if (parentId && parentId !== existingDept.parentId) {
      if (parentId === id) {
        return NextResponse.json({ success: false, message: '不能设置自己为父部门' }, { status: 400 });
      }
      // 检查是否是子部门
      const children = await prisma.department.findMany({
        where: { parentId: id }
      });
      const childIds = children.map(c => c.id);
      if (childIds.includes(parentId)) {
        return NextResponse.json({ success: false, message: '不能设置子部门为父部门' }, { status: 400 });
      }
    }

    // 更新部门
    const department = await prisma.department.update({
      where: { id },
      data: {
        name,
        code,
        description,
        parentId: parentId !== undefined ? parentId : undefined,
        leaderId: leaderId !== undefined ? leaderId : undefined,
        status
      },
      include: {
        company: { select: { id: true, name: true } },
        parent: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: '部门更新成功',
      data: department
    });

  } catch (error) {
    console.error('更新部门失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}

// ============ DELETE: 删除部门 ============
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限控制
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.COMPANY_OWNER) {
      return NextResponse.json({ success: false, message: '无权限删除部门' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少部门ID' }, { status: 400 });
    }

    const deptId = parseInt(id);

    // 查询部门是否存在
    const existingDept = await prisma.department.findUnique({
      where: { id: deptId }
    });

    if (!existingDept) {
      return NextResponse.json({ success: false, message: '部门不存在' }, { status: 404 });
    }

    // 权限检查
    if (user.role === UserRole.COMPANY_OWNER && user.companyId !== existingDept.companyId) {
      return NextResponse.json({ success: false, message: '无权限删除此部门' }, { status: 403 });
    }

    // 检查是否有子部门
    const childCount = await prisma.department.count({
      where: { parentId: deptId }
    });

    if (childCount > 0) {
      return NextResponse.json({ success: false, message: '请先删除子部门' }, { status: 400 });
    }

    // 检查是否有员工
    const userCount = await prisma.user.count({
      where: { departmentId: deptId }
    });

    if (userCount > 0) {
      return NextResponse.json({ success: false, message: '请先转移部门员工' }, { status: 400 });
    }

    // 删除部门
    await prisma.department.delete({
      where: { id: deptId }
    });

    return NextResponse.json({ 
      success: true, 
      message: '部门删除成功'
    });

  } catch (error) {
    console.error('删除部门失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}
