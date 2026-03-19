import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// GET /api/erp/orders/my - 获取当前客户的订单列表
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    // 根据角色判断查询条件
    let where: any = {};
    
    if (user.role === 'CUSTOMER') {
      // 客户只能看到自己的订单
      where.customerId = user.id;
    } else if (user.role !== 'SUPER_ADMIN') {
      // 其他内部角色根据公司筛选
      if (user.companyId) {
        where.companyId = user.companyId;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        appointments: {
          select: {
            id: true,
            appointmentDate: true,
            location: true,
            status: true,
          },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        visaMaterials: {
          select: {
            id: true,
          },
        },
        orderLogs: {
          select: {
            id: true,
            action: true,
            content: true,
            fromStatus: true,
            toStatus: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 格式化返回数据
    const result = orders.map(order => ({
      id: order.id,
      orderNo: order.orderNo,
      visaCountry: order.visaCountry,
      visaType: order.visaType,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      customer: order.customer,
      appointment: order.appointments[0] || null,
      documentCount: order.visaMaterials.length,
      timeline: order.orderLogs.map(log => ({
        id: log.id,
        status: log.toStatus || log.action,
        comment: log.content,
        createdAt: log.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('获取客户订单失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
