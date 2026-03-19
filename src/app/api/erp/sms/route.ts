import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';
import { smsService } from '@/lib/erp/sms-service';

// GET /api/erp/sms - 获取短信发送记录
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const phone = searchParams.get('phone') || '';
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (phone) {
      where.phone = { contains: phone };
    }
    if (status) {
      where.status = status;
    }

    // 根据角色筛选数据
    if (user.role !== 'SUPER_ADMIN' && user.companyId) {
      where.user = { companyId: user.companyId };
    }

    const [list, total] = await Promise.all([
      prisma.smsLog.findMany({
        where,
        include: {
          order: {
            select: { id: true, orderNo: true, visaCountry: true },
          },
          user: {
            select: { id: true, name: true, username: true },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.smsLog.count({ where }),
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
    console.error('获取短信记录失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/erp/sms - 发送短信
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    const body = await request.json();
    const { phone, templateCode, content, orderId, variables } = body;

    if (!phone) {
      return NextResponse.json({ success: false, message: '手机号不能为空' }, { status: 400 });
    }

    if (!content && !templateCode) {
      return NextResponse.json({ success: false, message: '短信内容或模板编码不能为空' }, { status: 400 });
    }

    let finalContent = content;
    let finalTemplateCode = templateCode;

    // 如果使用模板，渲染模板内容
    if (templateCode && variables) {
      const template = await prisma.smsTemplate.findUnique({ where: { code: templateCode } });
      if (!template) {
        return NextResponse.json({ success: false, message: '短信模板不存在' }, { status: 400 });
      }
      finalContent = template.content;
      // 替换变量
      for (const [key, value] of Object.entries(variables)) {
        finalContent = finalContent.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
    }

    // 发送短信
    const result = await smsService.sendSms({
      phone,
      content: finalContent,
      templateCode: finalTemplateCode,
      orderId,
      userId: user.id,
    });

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('发送短信失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/erp/sms/batch - 批量发送短信
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });
    }

    const body = await request.json();
    const { phones, templateCode, content, orderId, variables } = body;

    if (!phones || !Array.isArray(phones) || phones.length === 0) {
      return NextResponse.json({ success: false, message: '手机号列表不能为空' }, { status: 400 });
    }

    if (!content && !templateCode) {
      return NextResponse.json({ success: false, message: '短信内容或模板编码不能为空' }, { status: 400 });
    }

    let finalContent = content;

    // 如果使用模板，渲染模板内容
    if (templateCode && variables) {
      const template = await prisma.smsTemplate.findUnique({ where: { code: templateCode } });
      if (!template) {
        return NextResponse.json({ success: false, message: '短信模板不存在' }, { status: 400 });
      }
      finalContent = template.content;
    }

    // 批量发送
    const results = [];
    for (const phone of phones) {
      let smsContent = finalContent;
      if (templateCode && variables) {
        // 替换变量
        for (const [key, value] of Object.entries(variables)) {
          smsContent = smsContent.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        }
      }
      const result = await smsService.sendSms({
        phone,
        content: smsContent,
        templateCode,
        orderId,
        userId: user.id,
      });
      results.push({ phone, ...result });
    }

    return NextResponse.json({
      success: true,
      data: {
        total: phones.length,
        successCount: results.filter((r: any) => r.success).length,
        failedCount: results.filter((r: any) => !r.success).length,
        results,
      },
    });
  } catch (error: any) {
    console.error('批量发送短信失败:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
