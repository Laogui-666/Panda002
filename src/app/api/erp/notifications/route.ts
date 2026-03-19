/**
 * 通知API
 * 
 * 提供通知的创建、查询、标记已读等功能
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';
import { NotificationType } from '@prisma/client';

// GET /api/erp/notifications - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const isRead = searchParams.get('isRead');
    const type = searchParams.get('type');

    // 构建查询条件
    const where: any = { userId: user.id };
    
    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === 'true';
    }
    
    if (type) {
      where.type = type;
    }

    const [list, total] = await Promise.all([
      prisma.notification.findMany({
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
      prisma.notification.count({ where }),
    ]);

    // 获取未读数量
    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return NextResponse.json({
      success: true,
      data: {
        list,
        unreadCount,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/erp/notifications - 标记通知已读
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, all } = body;

    // 全部标记已读
    if (action === 'readAll' || all) {
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
      return NextResponse.json({ success: true, message: '全部已读' });
    }

    // 标记单条已读
    if (id) {
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification || notification.userId !== user.id) {
        return NextResponse.json({ success: false, message: '通知不存在' }, { status: 404 });
      }

      await prisma.notification.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
      });

      return NextResponse.json({ success: true, message: '已标记为已读' });
    }

    return NextResponse.json({ success: false, message: '缺少参数' }, { status: 400 });
  } catch (error) {
    console.error('标记已读失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/erp/notifications - 删除通知
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少通知ID' }, { status: 400 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    if (!notification || notification.userId !== user.id) {
      return NextResponse.json({ success: false, message: '通知不存在' }, { status: 404 });
    }

    await prisma.notification.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除通知失败:', error);
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}
