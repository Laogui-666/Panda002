import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// 获取签证线路的所有资料清单
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const visaLineId = parseInt(params.id);

    // 检查线路是否存在
    const visaLine = await prisma.visaLine.findUnique({
      where: { id: visaLineId },
      select: { id: true, name: true }
    });

    if (!visaLine) {
      return NextResponse.json({ error: '签证线路不存在' }, { status: 404 });
    }

    const documents = await prisma.visaLineDocument.findMany({
      where: { visaLineId },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' }
      ]
    });

    return NextResponse.json({
      visaLine,
      documents
    });
  } catch (error) {
    console.error('获取资料清单失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}

// 批量创建资料清单
export async function POST(
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

    const visaLineId = parseInt(params.id);

    // 检查线路是否存在
    const visaLine = await prisma.visaLine.findUnique({
      where: { id: visaLineId }
    });

    if (!visaLine) {
      return NextResponse.json({ error: '签证线路不存在' }, { status: 404 });
    }

    const body = await request.json();
    const { documents } = body;

    if (!Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json({ error: '请提供资料清单' }, { status: 400 });
    }

    // 删除现有的资料清单
    await prisma.visaLineDocument.deleteMany({
      where: { visaLineId }
    });

    // 创建新的资料清单
    const created = await prisma.visaLineDocument.createMany({
      data: documents.map((doc: any, index: number) => ({
        visaLineId,
        name: doc.name,
        description: doc.description,
        category: doc.category || '其他',
        isRequired: doc.isRequired !== false,
        isMultiple: doc.isMultiple || false,
        fileType: doc.fileType,
        maxFileSize: doc.maxFileSize ? parseInt(doc.maxFileSize) : null,
        templateUrl: doc.templateUrl,
        templateDesc: doc.templateDesc,
        sortOrder: doc.sortOrder ?? index
      }))
    });

    return NextResponse.json({
      success: true,
      count: created.count
    }, { status: 201 });
  } catch (error) {
    console.error('创建资料清单失败:', error);
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}

// 添加单条资料
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

    const visaLineId = parseInt(params.id);
    const body = await request.json();
    const { documentId, ...data } = body;

    // 检查线路是否存在
    const visaLine = await prisma.visaLine.findUnique({
      where: { id: visaLineId }
    });

    if (!visaLine) {
      return NextResponse.json({ error: '签证线路不存在' }, { status: 404 });
    }

    if (documentId) {
      // 更新单条
      const updated = await prisma.visaLineDocument.update({
        where: { id: documentId },
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          isRequired: data.isRequired,
          isMultiple: data.isMultiple,
          fileType: data.fileType,
          maxFileSize: data.maxFileSize ? parseInt(data.maxFileSize) : null,
          templateUrl: data.templateUrl,
          templateDesc: data.templateDesc,
          sortOrder: data.sortOrder ? parseInt(data.sortOrder) : 0
        }
      });
      return NextResponse.json(updated);
    } else {
      // 创建新条
      const created = await prisma.visaLineDocument.create({
        data: {
          visaLineId,
          name: data.name,
          description: data.description,
          category: data.category || '其他',
          isRequired: data.isRequired !== false,
          isMultiple: data.isMultiple || false,
          fileType: data.fileType,
          maxFileSize: data.maxFileSize ? parseInt(data.maxFileSize) : null,
          templateUrl: data.templateUrl,
          templateDesc: data.templateDesc,
          sortOrder: data.sortOrder || 0
        }
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error('保存资料清单失败:', error);
    return NextResponse.json({ error: '保存失败' }, { status: 500 });
  }
}
