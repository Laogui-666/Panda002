/**
 * ERP资料管理API
 * 
 * 资料清单和签证材料管理
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';
import { UserRole } from '@/lib/erp/types';
import { DocumentReviewStatus, DocumentStatus, OrderStatus } from '@prisma/client';

// GET /api/erp/documents
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const type = searchParams.get('type'); // requirement | material

    if (!orderId) {
      return NextResponse.json({ success: false, message: '缺少订单ID' }, { status: 400 });
    }

    // 检查订单权限
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: '订单不存在' }, { status: 404 });
    }

    if (user.role !== UserRole.SUPER_ADMIN && order.companyId !== user.companyId) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    // 获取资料清单
    if (type === 'requirement' || !type) {
      const requirements = await prisma.documentRequirement.findMany({
        where: { orderId: parseInt(orderId) },
        orderBy: { sortOrder: 'asc' },
      });

      return NextResponse.json({
        success: true,
        data: {
          type: 'requirement',
          list: requirements,
        },
      });
    }

    // 获取签证材料
    if (type === 'material') {
      const materials = await prisma.visaMaterial.findMany({
        where: { orderId: parseInt(orderId) },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: {
          type: 'material',
          list: materials,
        },
      });
    }

    return NextResponse.json({ success: false, message: '无效的类型' }, { status: 400 });
  } catch (error) {
    console.error('获取资料失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// POST /api/erp/documents
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, type, name, description, isRequired, fileUrl, status, rejectReason } = body;

    if (!orderId || !type || !name) {
      return NextResponse.json({ success: false, message: '缺少必填字段' }, { status: 400 });
    }

    // 检查订单权限
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: '订单不存在' }, { status: 404 });
    }

    if (user.role !== UserRole.SUPER_ADMIN && order.companyId !== user.companyId) {
      return NextResponse.json({ success: false, message: '无权限' }, { status: 403 });
    }

    // 创建资料清单
    if (type === 'requirement') {
      const doc = await prisma.documentRequirement.create({
        data: {
          name,
          description,
          isRequired: isRequired ?? true,
          status: DocumentReviewStatus.PENDING,
          orderId,
        },
      });

      return NextResponse.json({
        success: true,
        message: '资料清单创建成功',
        data: doc,
      });
    }

    // 创建签证材料
    if (type === 'material') {
      const material = await prisma.visaMaterial.create({
        data: {
          name,
          type: body.materialType || 'other',
          fileUrl,
          status: status || DocumentStatus.PENDING,
          orderId,
          createdBy: user.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: '签证材料创建成功',
        data: material,
      });
    }

    return NextResponse.json({ success: false, message: '无效的类型' }, { status: 400 });
  } catch (error) {
    console.error('创建资料失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/erp/documents
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const body = await request.json();
    const { id, type, status, rejectReason, fileUrl } = body;

    if (!id || !type) {
      return NextResponse.json({ success: false, message: '缺少必填字段' }, { status: 400 });
    }

    // 更新资料清单
    if (type === 'requirement') {
      const doc = await prisma.documentRequirement.update({
        where: { id },
        data: {
          status,
          rejectReason,
          fileUrl,
          uploadedAt: fileUrl ? new Date() : undefined,
          reviewedAt: status && status !== DocumentReviewStatus.PENDING ? new Date() : undefined,
        },
      });

      return NextResponse.json({
        success: true,
        message: '资料清单更新成功',
        data: doc,
      });
    }

    // 更新签证材料
    if (type === 'material') {
      const material = await prisma.visaMaterial.update({
        where: { id },
        data: {
          status,
          rejectReason,
          fileUrl,
          reviewedAt: status && status !== DocumentStatus.PENDING ? new Date() : undefined,
        },
      });

      return NextResponse.json({
        success: true,
        message: '签证材料更新成功',
        data: material,
      });
    }

    return NextResponse.json({ success: false, message: '无效的类型' }, { status: 400 });
  } catch (error) {
    console.error('更新资料失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
