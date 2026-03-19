import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// 获取单个签证国家
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
    const country = await prisma.visaCountry.findUnique({
      where: { id },
      include: {
        visaLines: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!country) {
      return NextResponse.json({ error: '国家不存在' }, { status: 404 });
    }

    return NextResponse.json(country);
  } catch (error) {
    console.error('获取签证国家失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

// 更新签证国家
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
    const { name, code, flag, continent, isActive, sortOrder } = body;

    // 检查代码唯一性
    if (code) {
      const existing = await prisma.visaCountry.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id }
        }
      });
      if (existing) {
        return NextResponse.json({ error: '国家代码已存在' }, { status: 400 });
      }
    }

    const country = await prisma.visaCountry.update({
      where: { id },
      data: {
        name,
        code: code?.toUpperCase(),
        flag,
        continent,
        isActive,
        sortOrder
      }
    });

    return NextResponse.json(country);
  } catch (error) {
    console.error('更新签证国家失败:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

// 删除签证国家
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

    // 检查是否有关联的签证线路
    const lineCount = await prisma.visaLine.count({
      where: { countryId: id }
    });

    if (lineCount > 0) {
      return NextResponse.json({ error: '该国家下存在签证线路，无法删除' }, { status: 400 });
    }

    await prisma.visaCountry.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除签证国家失败:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
