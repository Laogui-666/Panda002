/**
 * ERP预约管理API
 * 
 * 功能：
 * - 预约列表查询
 * - 预约详情查询
 * - 预约创建
 * - 预约更新
 * - 预约取消/完成
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';
import { UserRole, AppointmentStatus } from '@/lib/erp/types';

// ============ GET: 获取预约列表 ============
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 构建查询条件
    const where: any = {};

    // 权限控制 - 根据角色过滤数据
    if (user.role === UserRole.SUPER_ADMIN) {
      // 超级管理员可以查看所有
    } else if (user.role === UserRole.COMPANY_OWNER) {
      // 公司负责人查看本公司
      where.order = { companyId: user.companyId };
    } else if ([UserRole.VISA_ADMIN, UserRole.DOC_COLLECTOR, UserRole.OPERATOR, UserRole.CS_ADMIN, UserRole.CUSTOMER_SERVICE].includes(user.role as any)) {
      // 签证部和客服部人员查看自己负责的订单
      const orderFilter: any = { companyId: user.companyId };
      if (user.role === UserRole.CUSTOMER_SERVICE) {
        orderFilter.csId = user.id;
      } else {
        orderFilter.OR = [
          { dcId: user.id },
          { opId: user.id }
        ];
      }
      where.order = orderFilter;
    } else {
      return NextResponse.json({ success: false, message: '无权限访问预约管理' }, { status: 403 });
    }

    // 其他筛选条件
    if (status) where.status = status;
    if (orderId) where.orderId = parseInt(orderId);
    if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) where.appointmentDate.gte = new Date(startDate);
      if (endDate) where.appointmentDate.lte = new Date(endDate);
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        select: {
          id: true,
          appointmentDate: true,
          appointmentTime: true,
          location: true,
          contactPerson: true,
          contactPhone: true,
          status: true,
          remark: true,
          documentPath: true,
          orderId: true,
          createdAt: true,
          updatedAt: true,
          order: {
            select: {
              id: true,
              orderNo: true,
              customerId: true,
              visaCountry: true,
              visaType: true,
              status: true,
              customer: { select: { id: true, name: true, phone: true } },
              company: { select: { id: true, name: true } }
            }
          }
        },
        orderBy: { appointmentDate: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.appointment.count({ where })
    ]);

    // 格式化返回数据
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      appointmentDate: apt.appointmentDate,
      appointmentTime: apt.appointmentTime,
      location: apt.location,
      contactPerson: apt.contactPerson,
      contactPhone: apt.contactPhone,
      status: apt.status,
      statusLabel: apt.status === AppointmentStatus.SCHEDULED ? '已预约' : 
                   apt.status === AppointmentStatus.COMPLETED ? '已完成' : '已取消',
      remark: apt.remark,
      documentPath: apt.documentPath,
      orderId: apt.orderId,
      order: apt.order,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: {
        list: formattedAppointments,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });

  } catch (error) {
    console.error('获取预约列表失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}

// ============ POST: 创建预约 ============
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限控制
    if (![UserRole.SUPER_ADMIN, UserRole.COMPANY_OWNER, UserRole.VISA_ADMIN, UserRole.DOC_COLLECTOR, UserRole.OPERATOR, UserRole.CS_ADMIN, UserRole.CUSTOMER_SERVICE].includes(user.role as any)) {
      return NextResponse.json({ success: false, message: '无权限创建预约' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, appointmentDate, appointmentTime, location, contactPerson, contactPhone, remark } = body;

    // 验证必填字段
    if (!orderId) {
      return NextResponse.json({ success: false, message: '请选择订单' }, { status: 400 });
    }
    if (!appointmentDate) {
      return NextResponse.json({ success: false, message: '请选择预约日期' }, { status: 400 });
    }

    // 验证订单是否存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true }
    });

    if (!order) {
      return NextResponse.json({ success: false, message: '订单不存在' }, { status: 400 });
    }

    // 权限检查
    if (user.role !== UserRole.SUPER_ADMIN && user.companyId !== order.companyId) {
      return NextResponse.json({ success: false, message: '无权限为此订单创建预约' }, { status: 403 });
    }

    // 创建预约
    const appointment = await prisma.appointment.create({
      data: {
orderId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        location,
        contactPerson: contactPerson || order.customer.name,
        contactPhone: contactPhone || order.customer.phone,
        remark,
        status: AppointmentStatus.SCHEDULED
      },
      include: {
        order: {
          select: {
            id: true,
            orderNo: true,
            customer: { select: { id: true, name: true, phone: true } }
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: '预约创建成功',
      data: appointment
    });

  } catch (error) {
    console.error('创建预约失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}

// ============ PUT: 更新预约 ============
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限控制
    const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.COMPANY_OWNER, UserRole.CS_ADMIN, UserRole.VISA_ADMIN, UserRole.DOC_COLLECTOR, UserRole.OPERATOR];
    if (!allowedRoles.includes(user.role as any)) {
      return NextResponse.json({ success: false, message: '无权限更新预约' }, { status: 403 });
    }

    const body = await request.json();
    const { id, appointmentDate, appointmentTime, location, contactPerson, contactPhone, status, remark } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少预约ID' }, { status: 400 });
    }

    // 查询预约是否存在
    const existingApt = await prisma.appointment.findUnique({
      where: { id },
      include: { order: true }
    });

    if (!existingApt) {
      return NextResponse.json({ success: false, message: '预约不存在' }, { status: 404 });
    }

    // 权限检查
    if (user.role !== UserRole.SUPER_ADMIN && user.companyId !== existingApt.order.companyId) {
      return NextResponse.json({ success: false, message: '无权限更新此预约' }, { status: 403 });
    }

    // 如果是状态变更，只能从 SCHEDULED -> COMPLETED 或 SCHEDULED -> CANCELLED
    if (status && status !== existingApt.status) {
      if (existingApt.status !== AppointmentStatus.SCHEDULED) {
        return NextResponse.json({ success: false, message: '只能修改已预约状态的预约' }, { status: 400 });
      }
      if (![AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED].includes(status)) {
        return NextResponse.json({ success: false, message: '无效的预约状态' }, { status: 400 });
      }
    }

    // 更新预约
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
        appointmentTime,
        location,
        contactPerson,
        contactPhone,
        status,
        remark
      },
      include: {
        order: {
          select: {
            id: true,
            orderNo: true,
            customer: { select: { id: true, name: true, phone: true } }
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: '预约更新成功',
      data: appointment
    });

  } catch (error) {
    console.error('更新预约失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}

// ============ DELETE: 取消/删除预约 ============
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    // 权限控制
    if (![UserRole.SUPER_ADMIN, UserRole.COMPANY_OWNER, UserRole.VISA_ADMIN, UserRole.DOC_COLLECTOR, UserRole.OPERATOR, UserRole.CS_ADMIN, UserRole.CUSTOMER_SERVICE].includes(user.role as any)) {
      return NextResponse.json({ success: false, message: '无权限删除预约' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少预约ID' }, { status: 400 });
    }

    const aptId = parseInt(id);

    // 查询预约是否存在
    const existingApt = await prisma.appointment.findUnique({
      where: { id: aptId },
      include: { order: true }
    });

    if (!existingApt) {
      return NextResponse.json({ success: false, message: '预约不存在' }, { status: 404 });
    }

    // 权限检查
    if (user.role !== UserRole.SUPER_ADMIN && user.companyId !== existingApt.order.companyId) {
      return NextResponse.json({ success: false, message: '无权限删除此预约' }, { status: 403 });
    }

    // 只有已预约状态的预约可以删除
    if (existingApt.status !== AppointmentStatus.SCHEDULED) {
      return NextResponse.json({ success: false, message: '只能删除已预约状态的预约' }, { status: 400 });
    }

    // 删除预约
    await prisma.appointment.delete({
      where: { id: aptId }
    });

    return NextResponse.json({ 
      success: true, 
      message: '预约删除成功'
    });

  } catch (error) {
    console.error('删除预约失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '服务器错误' 
    }, { status: 500 });
  }
}
