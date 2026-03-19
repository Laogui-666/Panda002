/**
 * 资料中心API
 * 
 * 资料清单(DocumentRequirement) - 客户需要上传的资料
 * 签证材料(VisaMaterial) - 制作出的材料
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';
import { UserRole } from '@/lib/erp/types';

// 权限角色列表
const VIEWER_ROLES = [
  'SUPER_ADMIN',
  'COMPANY_OWNER',
  'CS_ADMIN',
  'VISA_ADMIN',
  'DOC_COLLECTOR',
  'OPERATOR',
];

// GET /api/erp/documents - 获取资料列表
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 检查权限
    if (!VIEWER_ROLES.includes(user.role as string)) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const type = searchParams.get('type') || 'requirement'; // requirement | visa
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');

    // 构建查询条件
    const where: any = {};

    // 根据类型查询不同的表
    if (type === 'visa') {
      // 签证材料查询
      if (status) where.status = status;
      if (orderId) where.orderId = parseInt(orderId);
    } else {
      // 资料清单查询
      if (status) where.status = status;
      if (orderId) where.orderId = parseInt(orderId);
    }

    // 数据权限过滤
    if (user.role === UserRole.DOC_COLLECTOR || user.role === UserRole.OPERATOR) {
      // 只能查看自己负责的订单
      if (user.role === UserRole.DOC_COLLECTOR) {
        where.order = { dcId: user.id };
      } else {
        where.order = { opId: user.id };
      }
    } else if (user.role === UserRole.CS_ADMIN) {
      // 客服部管理员：只能查看客服录入的订单
      where.order = { csId: user.id };
    } else if (user.role === UserRole.VISA_ADMIN) {
      // 签证部管理员：可以查看签证部所有订单
      where.order = { departmentId: user.departmentId };
    }

    // 查询
    let list, total;
    if (type === 'visa') {
      [list, total] = await Promise.all([
        prisma.visaMaterial.findMany({
          where,
          include: {
            order: {
              select: {
                id: true,
                orderNo: true,
                visaCountry: true,
                visaType: true,
                customer: { select: { id: true, name: true } },
              },
            },
            creator: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.visaMaterial.count({ where }),
      ]);
    } else {
      [list, total] = await Promise.all([
        prisma.documentRequirement.findMany({
          where,
          include: {
            order: {
              select: {
                id: true,
                orderNo: true,
                visaCountry: true,
                visaType: true,
                customer: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.documentRequirement.count({ where }),
      ]);
    }

    return NextResponse.json({
      success: true,
      data: {
        list,
        type,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取资料列表失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// POST /api/erp/documents - 创建资料
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 只有资料员和操作员可以创建资料
    if (!['DOC_COLLECTOR', 'OPERATOR', 'VISA_ADMIN', 'SUPER_ADMIN', 'COMPANY_OWNER'].includes(user.role as string)) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { type, orderId, name, description, isRequired, fileUrl, createdBy } = body;

    if (!orderId || !name) {
      return NextResponse.json({ success: false, message: '缺少必填参数' }, { status: 400 });
    }

    let result;
    if (type === 'visa') {
      // 创建签证材料
      result = await prisma.visaMaterial.create({
        data: {
          orderId,
          name,
          type: description || 'other',
          fileUrl,
          status: 'PENDING',
          createdBy: user.id,
        },
      });
    } else {
      // 创建资料清单
      result = await prisma.documentRequirement.create({
        data: {
          orderId,
          name,
          description,
          isRequired: isRequired !== false,
          status: 'PENDING',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: '资料创建成功',
      data: result,
    });
  } catch (error) {
    console.error('创建资料失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/erp/documents - 更新资料
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    if (!['DOC_COLLECTOR', 'OPERATOR', 'VISA_ADMIN', 'SUPER_ADMIN', 'COMPANY_OWNER'].includes(user.role as string)) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { id, type, status, fileUrl, rejectReason, reviewedBy } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少资料ID' }, { status: 400 });
    }

    let result;
    if (type === 'visa') {
      // 更新签证材料
      result = await prisma.visaMaterial.update({
        where: { id },
        data: {
          status,
          fileUrl,
          rejectReason,
          reviewedAt: status ? new Date() : undefined,
        },
      });
    } else {
      // 更新资料清单
      result = await prisma.documentRequirement.update({
        where: { id },
        data: {
          status,
          fileUrl,
          rejectReason,
          reviewedAt: status ? new Date() : undefined,
          reviewedBy: reviewedBy || user.id,
          uploadedAt: fileUrl ? new Date() : undefined,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: '资料更新成功',
      data: result,
    });
  } catch (error) {
    console.error('更新资料失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/erp/documents - 删除资料
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 只有超级管理员和公司负责人可以删除
    if (!['SUPER_ADMIN', 'COMPANY_OWNER'].includes(user.role as string)) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'requirement';

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少资料ID' }, { status: 400 });
    }

    if (type === 'visa') {
      await prisma.visaMaterial.delete({ where: { id: parseInt(id) } });
    } else {
      await prisma.documentRequirement.delete({ where: { id: parseInt(id) } });
    }

    return NextResponse.json({
      success: true,
      message: '资料删除成功',
    });
  } catch (error) {
    console.error('删除资料失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
