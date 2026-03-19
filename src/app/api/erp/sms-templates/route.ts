import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// GET /api/erp/sms-templates - 获取短信模板列表
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const [list, total] = await Promise.all([
      prisma.smsTemplate.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.smsTemplate.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        list,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    });
  } catch (error: any) {
    console.error('获取短信模板失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/erp/sms-templates - 创建短信模板
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    // 只有SUPER_ADMIN可以管理模板
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: '权限不足' }, { status: 403 });
    }

    const body = await request.json();
    const { code, name, content, variables, isActive } = body;

    if (!code || !name || !content) {
      return NextResponse.json({ success: false, message: '缺少必填字段' }, { status: 400 });
    }

    // 检查编码是否已存在
    const existing = await prisma.smsTemplate.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ success: false, message: '模板编码已存在' }, { status: 400 });
    }

    const template = await prisma.smsTemplate.create({
      data: { code, name, content, variables, isActive },
    });

    return NextResponse.json({ success: true, data: template });
  } catch (error: any) {
    console.error('创建短信模板失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/erp/sms-templates - 更新短信模板
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: '权限不足' }, { status: 403 });
    }

    const body = await request.json();
    const { id, code, name, content, variables, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少模板ID' }, { status: 400 });
    }

    const template = await prisma.smsTemplate.update({
      where: { id },
      data: { code, name, content, variables, isActive },
    });

    return NextResponse.json({ success: true, data: template });
  } catch (error: any) {
    console.error('更新短信模板失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/erp/sms-templates - 删除短信模板
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, message: '权限不足' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少模板ID' }, { status: 400 });
    }

    await prisma.smsTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('删除短信模板失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
