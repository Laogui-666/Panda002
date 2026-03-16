/**
 * ERP订单列表API
 * 
 * 获取订单列表（支持分页、筛选）
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
      // 超级管理员可以查看所有公司
      if (companyId) where.companyId = parseInt(companyId);
    } else if (user.role === UserRole.COMPANY_OWNER) {
      // 公司负责人只能查看本公司
      where.companyId = user.companyId;
    } else if (user.role === UserRole.DEPT_ADMIN) {
      // 部门管理员只能查看本部门
      where.companyId = user.companyId;
      where.departmentId = user.departmentId;
    } else if (user.role === UserRole.OPERATOR) {
      // 操作员只能查看自己分配的订单
      where.OR = [
        { csId: user.id },
        { dcId: user.id },
        { opId: user.id },
      ];
    } else if (user.role === UserRole.CUSTOMER) {
      // 普通客户只能查看自己的订单
      where.customer = {
        userId: user.id,
      };
    }

    // 筛选条件
    if (status) where.status = status;
    if (orderNo) where.orderNo = { contains: orderNo };
    if (visaCountry) where.visaCountry = { contains: visaCountry };
    if (customerName) {
      where.customer = {
        ...where.customer,
        name: { contains: customerName },
      };
    }

    // 查询数据
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          company: {
            select: { id: true, name: true, shortName: true },
          },
          cs: {
            select: { id: true, name: true, username: true },
          },
          dc: {
            select: { id: true, name: true, username: true },
          },
          op: {
            select: { id: true, name: true, username: true },
          },
          department: {
            select: { id: true, name: true, code: true },
          },
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
        // 外包业务员敏感信息脱敏
        name: order.customer.name.charAt(0) + '**',
        phone: order.customer.phone?.substring(0, 3) + '****' + order.customer.phone?.substring(7),
        passportNo: order.customer.passportNo ? '****' + order.customer.passportNo?.substring(-4) : null,
      } : order.customer,
    }));

    return NextResponse.json({
      success: true,
      data: {
        list: formattedOrders,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// POST /api/erp/orders
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 只有超级管理员、公司负责人、部门管理员可以创建订单
    const allowedRoles = ['SUPER_ADMIN', 'COMPANY_OWNER', 'DEPT_ADMIN', 'OPERATOR'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ success: false, message: '无权限创建订单' }, { status: 403 });
    }

    const body = await request.json();
    const {
      companyId,
      customerId,
      visaCountry,
      visaType,
      entryType,
      stayDuration,
      validityDays,
      csId,
      dcId,
      opId,
      departmentId,
      remark,
      visaFee,
      serviceFee,
    } = body;

    // 验证必填字段
    if (!companyId || !customerId || !visaCountry || !visaType) {
      return NextResponse.json({ success: false, message: '缺少必填字段' }, { status: 400 });
    }

    // 验证公司权限
    if (!canAccessCompany(user, companyId)) {
      return NextResponse.json({ success: false, message: '无权限操作该公司' }, { status: 403 });
    }

    // 生成订单号
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNo = `VH${dateStr}${random}`;

    // 创建订单
    const order = await prisma.order.create({
      data: {
        orderNo,
        companyId,
        customerId,
        visaCountry,
        visaType,
        entryType,
        stayDuration,
        validityDays,
        status: OrderStatus.PENDING_CONNECTION,
        csId,
        dcId,
        opId,
        departmentId,
        remark,
        visaFee: visaFee || 0,
        serviceFee: serviceFee || 0,
        totalFee: (visaFee || 0) + (serviceFee || 0),
      },
      include: {
        customer: true,
        company: { select: { id: true, name: true } },
      },
    });

    // 创建订单日志
    await prisma.orderLog.create({
      data: {
        orderId: order.id,
        userId: user.id,
        action: 'CREATE_ORDER',
        content: '创建订单',
        fromStatus: null,
        toStatus: OrderStatus.PENDING_CONNECTION,
      },
    });

    return NextResponse.json({
      success: true,
      message: '订单创建成功',
      data: order,
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
