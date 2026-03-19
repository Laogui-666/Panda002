/**
 * ERP订单详情API
 * 
 * 获取、修改单个订单
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser, canAccessCompany } from '@/lib/erp/auth';
import { ORDER_STATUS_CONFIG, UserRole, OrderStatus } from '@/lib/erp/types';
import { orderStateMachine } from '@/lib/erp/order-state-machine';

// GET /api/erp/orders/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, message: '无效的订单ID' }, { status: 400 });
    }

    // 获取订单
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        company: { select: { id: true, name: true, shortName: true } },
        cs: { select: { id: true, name: true, username: true } },
        dc: { select: { id: true, name: true, username: true } },
        op: { select: { id: true, name: true, username: true } },
        department: { select: { id: true, name: true, code: true } },
        documentRequirements: {
          orderBy: { sortOrder: 'asc' },
        },
        visaMaterials: true,
        orderLogs: {
          include: {
            user: { select: { id: true, name: true, username: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        appointments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: '订单不存在' }, { status: 404 });
    }

    // 权限检查
    if (user.role !== UserRole.SUPER_ADMIN) {
      if (order.companyId !== user.companyId) {
        return NextResponse.json({ success: false, message: '无权限查看该订单' }, { status: 403 });
      }
    }

    // 脱敏处理（外包业务员）
    const formattedOrder = {
      ...order,
      statusLabel: ORDER_STATUS_CONFIG[order.status]?.label || order.status,
      statusColor: ORDER_STATUS_CONFIG[order.status]?.color || 'gray',
      customer: user.role === UserRole.OUTSOURCE ? {
        id: order.customer.id,
        name: order.customer.name.charAt(0) + '**',
        phone: order.customer.phone?.substring(0, 3) + '****' + order.customer.phone?.substring(7),
        passportNo: order.customer.passportNo ? '****' + order.customer.passportNo?.slice(-4) : null,
        idCardNo: order.customer.idCardNo ? '****' + order.customer.idCardNo?.slice(-4) : null,
        email: order.customer.email,
      } : order.customer,
    };

    return NextResponse.json({
      success: true,
      data: formattedOrder,
    });
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/erp/orders/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, message: '无效的订单ID' }, { status: 400 });
    }

    // 获取订单
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: '订单不存在' }, { status: 404 });
    }

    // 权限检查
    if (user.role !== UserRole.SUPER_ADMIN && order.companyId !== user.companyId) {
      return NextResponse.json({ success: false, message: '无权限操作该订单' }, { status: 403 });
    }

    const body = await request.json();
    const { action, status, remark, rejectReason, csId, dcId, opId, ...updateFields } = body;

    // 处理接单操作（资料员）
    if (action === 'accept') {
      // 检查订单状态
      if (order.status !== OrderStatus.PENDING_CONNECTION) {
        return NextResponse.json({ success: false, message: '当前状态不允许接单' }, { status: 400 });
      }
      
      // 检查权限
      const acceptRoles: UserRole[] = [UserRole.DOC_COLLECTOR, UserRole.VISA_ADMIN, UserRole.COMPANY_OWNER, UserRole.SUPER_ADMIN];
      if (!acceptRoles.includes(user.role)) {
        return NextResponse.json({ success: false, message: '无权限接单' }, { status: 403 });
      }
      
      // 执行接单
      const updatedOrder = await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.CONNECTED,
            dcId: dcId || user.id,
            updatedAt: new Date(),
          },
        }),
        prisma.orderLog.create({
          data: {
            orderId,
            userId: user.id,
            action: 'ACCEPT_ORDER',
            content: remark || `资料员 ${user.name} 已接单`,
            fromStatus: order.status,
            toStatus: OrderStatus.CONNECTED,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: '接单成功',
        data: updatedOrder[0],
      });
    }

    // 处理状态变更
    if (action === 'transition' && status) {
      try {
        const newStatus = status as OrderStatus;
        
        // 检查权限
        if (!orderStateMachine.canUserPerformAction(user.role, order.status)) {
          return NextResponse.json({ success: false, message: '无权限执行此操作' }, { status: 403 });
        }

        // 分配操作员（当状态变为 UNDER_REVIEW 时）
        let assignedOpId = opId || order.opId;
        if (newStatus === OrderStatus.UNDER_REVIEW && !assignedOpId) {
          // 如果没有分配操作员，分配给当前用户（如果是操作员角色）
          const operatorRoles: UserRole[] = [UserRole.OPERATOR, UserRole.VISA_ADMIN, UserRole.COMPANY_OWNER];
          if (operatorRoles.includes(user.role)) {
            assignedOpId = user.id;
          }
        }

        const updatedOrder = await orderStateMachine.transition(orderId, newStatus, user.id, {
          remark,
          rejectReason,
          csId: csId || order.csId,
          dcId: dcId || order.dcId,
          opId: assignedOpId,
        });

        return NextResponse.json({
          success: true,
          message: `状态已变更为: ${ORDER_STATUS_CONFIG[newStatus].label}`,
          data: updatedOrder,
        });
      } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
      }
    }

    // 普通字段更新
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...updateFields,
        csId: csId !== undefined ? csId : undefined,
        dcId: dcId !== undefined ? dcId : undefined,
        opId: opId !== undefined ? opId : undefined,
      },
      include: {
        customer: true,
        company: { select: { id: true, name: true } },
      },
    });

    // 记录日志
    await prisma.orderLog.create({
      data: {
        orderId,
        userId: user.id,
        action: 'UPDATE_ORDER',
        content: remark || '更新订单信息',
      },
    });

    return NextResponse.json({
      success: true,
      message: '订单更新成功',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('更新订单失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/erp/orders/[id]
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
      return NextResponse.json({ success: false, message: '无权限删除订单' }, { status: 403 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, message: '无效的订单ID' }, { status: 400 });
    }

    // 检查订单是否存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: '订单不存在' }, { status: 404 });
    }

    // 删除订单（级联删除相关数据）
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({
      success: true,
      message: '订单删除成功',
    });
  } catch (error) {
    console.error('删除订单失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
