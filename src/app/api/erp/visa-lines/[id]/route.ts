import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// 获取单个签证线路
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const visaLine = await prisma.visaLine.findUnique({
      where: { id },
      include: {
        country: true,
        documentReqs: {
          orderBy: [
            { category: 'asc' },
            { sortOrder: 'asc' }
          ]
        }
      }
    });

    if (!visaLine) {
      return NextResponse.json({ error: '签证线路不存在' }, { status: 404 });
    }

    return NextResponse.json(visaLine);
  } catch (error) {
    console.error('获取签证线路失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

// 更新签证线路
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);
    const body = await request.json();

    // 检查线路是否存在
    const existing = await prisma.visaLine.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: '签证线路不存在' }, { status: 404 });
    }

    // 如果更改国家，检查新国家是否存在
    if (body.countryId && body.countryId !== existing.countryId) {
      const country = await prisma.visaCountry.findUnique({
        where: { id: body.countryId }
      });
      if (!country) {
        return NextResponse.json({ error: '国家不存在' }, { status: 400 });
      }
    }

    const visaLine = await prisma.visaLine.update({
      where: { id },
      data: {
        name: body.name,
        countryId: body.countryId,
        category: body.category,
        visaType: body.visaType,
        entryType: body.entryType,
        validityDays: body.validityDays ? parseInt(body.validityDays) : null,
        maxStayDays: body.maxStayDays ? parseInt(body.maxStayDays) : null,
        processingDays: body.processingDays ? parseInt(body.processingDays) : null,
        interview: body.interview,
        invitation: body.invitation,
        visaFee: body.visaFee ? parseFloat(body.visaFee) : null,
        serviceFee: body.serviceFee ? parseFloat(body.serviceFee) : null,
        expressFee: body.expressFee ? parseFloat(body.expressFee) : null,
        description: body.description,
        requirements: body.requirements,
        materials: body.materials,
        isActive: body.isActive,
        isPopular: body.isPopular,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0
      },
      include: {
        country: true,
        documentReqs: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    return NextResponse.json(visaLine);
  } catch (error) {
    console.error('更新签证线路失败:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

// 删除签证线路
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);

    // 检查是否有关联的订单
    const orderCount = await prisma.order.count({
      where: { visaLineId: id }
    });

    if (orderCount > 0) {
      return NextResponse.json({ error: '该线路下存在订单，无法删除' }, { status: 400 });
    }

    await prisma.visaLine.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除签证线路失败:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
