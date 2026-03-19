/**
 * ERP订单列表API
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser, canAccessCompany } from '@/lib/erp/auth';
import { ORDER_STATUS_CONFIG, UserRole } from '@/lib/erp/types';
import { OrderStatus } from '@prisma/client';

// GET /api/erp/orders
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status') as OrderStatus | null;
    const companyId = searchParams.get('companyId');
    const customerName = searchParams.get('customerName');
    const orderNo = searchParams.get('orderNo');
    const visaCountry = searchParams.get('visaCountry');

    // 构建查询条件
    const where: any = {};

    // 权限控制
    if (user.role === UserRole.SUPER_ADMIN) {
      if (companyId) where.companyId = parseInt(companyId);
    } else if (user.role === UserRole.COMPANY_OWNER) {
      where.companyId = user.companyId;
    } else if (user.role === UserRole.CS_ADMIN || user.role === UserRole.VISA_ADMIN) {
      where.companyId = user.companyId;
    } else if (user.role === UserRole.DOC_COLLECTOR || user.role === UserRole.OPERATOR) {
      where.OR = [
        { csId: user.id },
        { dcId: user.id },
        { opId: user.id },
      ];
    } else if (user.role === UserRole.CUSTOMER_SERVICE) {
      where.csId = user.id;
    } else if (user.role === UserRole.CUSTOMER) {
      where.customer = { userId: user.id };
    }

    // 筛选条件
    if (status) where.status = status;
    if (orderNo) where.orderNo = { contains: orderNo };
    if (visaCountry) where.visaCountry = { contains: visaCountry };
    if (customerName) {
      where.customer = { ...where.customer, name: { contains: customerName } };
    }

    // 查询数据
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          company: { select: { id: true, name: true, shortName: true } },
          cs: { select: { id: true, name: true, username: true } },
          dc: { select: { id: true, name: true, username: true } },
          op: { select: { id: true, name: true, username: true } },
          department: { select: { id: true, name: true, code: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    // 格式化返回数据
    const formattedOrders = orders.map(order => ({
      ...order,
      statusLabel: ORDER_STATUS_CONFIG[order.status]?.label || order.status,
      statusColor: ORDER_STATUS_CONFIG[order.status]?.color || 'gray',
      customer: user.role === UserRole.OUTSOURCE ? {
        name: order.customer.name.charAt(0) + '**',
        phone: order.customer.phone?.substring(0, 3) + '****' + order.customer.phone?.substring(7),
        passportNo: order.customer.passportNo ? '****' + order.customer.passportNo?.substring(-4) : null,
      } : order.customer,
    }));

    return NextResponse.json({
      success: true,
      data: {
        list: formattedOrders,
        pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      },
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// POST /api/erp/orders - 创建订单（含自动创建账号、自动分配资料清单、通知）
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 只有超级管理员、公司负责人、部门管理员可以创建订单
    const allowedRoles: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.COMPANY_OWNER, UserRole.CS_ADMIN, UserRole.VISA_ADMIN];
    if (!allowedRoles.includes(user.role as UserRole)) {
      return NextResponse.json({ success: false, message: '无权限创建订单' }, { status: 403 });
    }

    const body = await request.json();
    const {
      companyId, customerId, visaCountry, visaType, entryType, stayDuration,
      validityDays, csId, dcId, opId, departmentId, remark, visaFee, serviceFee, visaLineId,
    } = body;

    // 验证必填字段
    if (!companyId || !customerId || !visaCountry || !visaType) {
      return NextResponse.json({ success: false, message: '缺少必填字段' }, { status: 400 });
    }

    // 验证公司权限
    if (!canAccessCompany(user, companyId)) {
      return NextResponse.json({ success: false, message: '无权限操作该公司' }, { status: 403 });
    }

    // 获取客户信息
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { user: true }
    });

    if (!customer) {
      return NextResponse.json({ success: false, message: '客户不存在' }, { status: 400 });
    }

    // 生成订单号
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNo = `VH${dateStr}${random}`;

    // 【关键功能】自动为客户创建账号（如果客户还没有账号）
    let customerUserId = customer.userId;
    if (!customerUserId) {
      const tempPassword = Math.random().toString(36).substring(2, 10);
      const newUser = await prisma.user.create({
        data: {
          username: `customer_${customerId}_${Date.now()}`,
          passwordHash: `temp_${tempPassword}`,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          role: UserRole.CUSTOMER,
          companyId,
          status: 'ACTIVE',
        },
      });
      customerUserId = newUser.id;
      await prisma.customer.update({
        where: { id: customerId },
        data: { userId: customerUserId },
      });
    }

    // 创建订单（使用事务）
    const order = await prisma.$transaction(async (tx) => {
      // 1. 创建订单
      const newOrder = await tx.order.create({
        data: {
          orderNo, companyId, customerId, visaCountry, visaType, entryType,
          stayDuration, validityDays,
          status: OrderStatus.PENDING_CONNECTION,
          csId: csId || user.id,
          dcId, opId, departmentId, remark,
          visaFee: visaFee || 0, serviceFee: serviceFee || 0,
          totalFee: (visaFee || 0) + (serviceFee || 0),
          visaLineId,
        },
        include: { customer: true, company: { select: { id: true, name: true } } },
      });

      // 2. 创建订单日志
      await tx.orderLog.create({
        data: {
          orderId: newOrder.id, userId: user.id,
          action: 'CREATE_ORDER', content: '创建订单',
          fromStatus: null, toStatus: OrderStatus.PENDING_CONNECTION,
        },
      });

      // 3. 【关键功能】自动分配资料清单（基于签证线路）
      if (visaLineId) {
        const lineDocuments = await tx.visaLineDocument.findMany({
          where: { visaLineId },
          orderBy: { sortOrder: 'asc' },
        });
        for (const lineDoc of lineDocuments) {
          await tx.documentRequirement.create({
            data: {
              orderId: newOrder.id, name: lineDoc.name, description: lineDoc.description,
              isRequired: lineDoc.isRequired, sortOrder: lineDoc.sortOrder, status: 'PENDING',
            },
          });
        }
      }

      // 4. 发送通知给资料员
      const docCollectors = await tx.user.findMany({
        where: { companyId, role: { in: [UserRole.DOC_COLLECTOR, UserRole.VISA_ADMIN] }, status: 'ACTIVE' },
        select: { id: true },
      });
      for (const dc of docCollectors) {
        await tx.notification.create({
          data: {
            userId: dc.id, type: 'NEW_ORDER', title: '新订单通知',
            content: `您有一个新订单，订单号：${orderNo}，签证国家：${visaCountry}，请及时处理。`,
            link: `/erp/orders/${newOrder.id}`, priority: 'high', orderId: newOrder.id,
          },
        });
      }

      return newOrder;
    });

    // 5. 【预留】发送短信通知客户 - 留待后续开发
    // TODO: 集成短信服务发送订单创建通知
    // if (customer.phone) {
    //   await smsService.sendWithTemplate(...)
    // }

    return NextResponse.json({ success: true, message: '订单创建成功', data: order });
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
