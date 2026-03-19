import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// 获取所有签证线路
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const isPopular = searchParams.get('isPopular');
    const search = searchParams.get('search');

    const where: any = {};

    if (countryId) {
      where.countryId = parseInt(countryId);
    }
    if (category) {
      where.category = category;
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    if (isPopular === 'true') {
      where.isPopular = true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { visaType: { contains: search } },
        { country: { name: { contains: search } } }
      ];
    }

    const visaLines = await prisma.visaLine.findMany({
      where,
      orderBy: [
        { country: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        country: true,
        _count: {
          select: { documentReqs: true }
        }
      }
    });

    return NextResponse.json(visaLines);
  } catch (error) {
    console.error('获取签证线路失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

// 创建签证线路
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      countryId,
      category,
      visaType,
      entryType,
      validityDays,
      maxStayDays,
      processingDays,
      interview,
      invitation,
      visaFee,
      serviceFee,
      expressFee,
      description,
      requirements,
      materials,
      isPopular,
      sortOrder
    } = body;

    if (!name || !countryId || !visaType) {
      return NextResponse.json({ error: '请填写必填字段' }, { status: 400 });
    }

    // 检查国家是否存在
    const country = await prisma.visaCountry.findUnique({
      where: { id: countryId }
    });

    if (!country) {
      return NextResponse.json({ error: '国家不存在' }, { status: 400 });
    }

    const visaLine = await prisma.visaLine.create({
      data: {
        name,
        countryId,
        category: category || 'TOURISM',
        visaType,
        entryType,
        validityDays: validityDays ? parseInt(validityDays) : null,
        maxStayDays: maxStayDays ? parseInt(maxStayDays) : null,
        processingDays: processingDays ? parseInt(processingDays) : null,
        interview: interview || false,
        invitation: invitation || false,
        visaFee: visaFee ? parseFloat(visaFee) : null,
        serviceFee: serviceFee ? parseFloat(serviceFee) : null,
        expressFee: expressFee ? parseFloat(expressFee) : null,
        description,
        requirements,
        materials,
        isPopular: isPopular || false,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0
      },
      include: {
        country: true
      }
    });

    return NextResponse.json(visaLine, { status: 201 });
  } catch (error) {
    console.error('创建签证线路失败:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
