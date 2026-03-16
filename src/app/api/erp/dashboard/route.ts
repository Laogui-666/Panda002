/**
 * ERP仪表盘统计API
 * 
 * 获取各角色可见的统计数据
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser, UserRole } from '@/lib/erp/auth';
import { OrderStatus } from '@prisma/client';

// GET /api/erp/dashboard/stats
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 构建查询条件
    const where: any = {};

    // 权限控制
    if (user.role === UserRole.SUPER_ADMIN) {
      // 超级管理员可以查看所有
    } else if (user.role === UserRole.COMPANY_OWNER) {
      where.companyId = user.companyId;
    } else if (user.role === UserRole.DEPT_ADMIN) {
      where.companyId = user.companyId;
      where.departmentId = user.departmentId;
    } else if (user.role === UserRole.OPERATOR) {
      where.OR = [
        { csId: user.id },
        { dcId: user.id },
        { opId: user.id },
      ];
    } else if (user.role === UserRole.CUSTOMER) {
      // 客户只能查看自己的订单
      where.customer = {
        userId: user.id,
      };
    }

    // 查询统计数据
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      totalCustomers,
      recentOrders,
      statusCounts,
    ] = await Promise.all([
      // 总订单数
      prisma.order.count({ where }),
      
      // 待处理订单（待对接、已对接、资料收集中、待审核）
      prisma.order.count({
        where: {
          ...where,
          status: {
            in: [
              OrderStatus.PENDING_CONNECTION,
              OrderStatus.CONNECTED,
              OrderStatus.COLLECTING_DOCS,
              OrderStatus.PENDING_REVIEW,
            ],
          },
        },
      }),
      
      // 处理中订单（审核中、制作中、待交付）
      prisma.order.count({
        where: {
          ...where,
          status: {
            in: [
              OrderStatus.UNDER_REVIEW,
              OrderStatus.MAKING_MATERIALS,
              OrderStatus.PENDING_DELIVERY,
            ],
          },
        },
      }),
      
      // 已完成订单（已交付、出签、拒签）
      prisma.order.count({
        where: {
          ...where,
          status: {
            in: [
              OrderStatus.DELIVERED,
              OrderStatus.APPROVED,
              OrderStatus.REJECTED,
            ],
          },
        },
      }),
      
      // 客户数
      user.role === UserRole.CUSTOMER
        ? prisma.customer.count({ where: { userId: user.id } })
        : prisma.customer.count({
            where: user.role === UserRole.SUPER_ADMIN
              ? {}
              : { companyId: user.companyId! },
          }),
      
      // 最近订单
      prisma.order.findMany({
        where,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          company: { select: { id: true, name: true } },
        },
      }),
      
      // 各状态订单数
      prisma.order.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
    ]);

    // 计算总收入
    const revenueResult = await prisma.order.aggregate({
      where: {
        ...where,
        paymentStatus: 'paid',
        status: { in: [OrderStatus.APPROVED, OrderStatus.DELIVERED] },
      },
      _sum: { totalFee: true },
    });

    // 格式化状态统计
    const statusCountsMap: Record<string, number> = {};
    statusCounts.forEach((item) => {
      statusCountsMap[item.status] = item._count;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalCustomers,
        totalRevenue: revenueResult._sum.totalFee || 0,
        recentOrders,
        statusCounts: statusCountsMap,
      },
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
