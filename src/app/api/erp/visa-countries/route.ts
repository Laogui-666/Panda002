import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// 获取所有签证国家
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const countries = await prisma.visaCountry.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { visaLines: true }
        }
      }
    });

    return NextResponse.json(countries);
  } catch (error) {
    console.error('获取签证国家失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

// 创建签证国家
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    // 只有管理员可以创建
    if (!['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { name, code, flag, continent } = body;

    if (!name || !code) {
      return NextResponse.json({ error: '名称和代码不能为空' }, { status: 400 });
    }

    // 检查代码唯一性
    const existing = await prisma.visaCountry.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json({ error: '国家代码已存在' }, { status: 400 });
    }

    const country = await prisma.visaCountry.create({
      data: {
        name,
        code: code.toUpperCase(),
        flag,
        continent
      }
    });

    return NextResponse.json(country, { status: 201 });
  } catch (error) {
    console.error('创建签证国家失败:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
