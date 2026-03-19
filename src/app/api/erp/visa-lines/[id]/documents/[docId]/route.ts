import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/erp/prisma';
import { getCurrentUser } from '@/lib/erp/auth';

// 删除资料清单条目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; docId: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    if (!['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const docId = parseInt(params.docId);

    await prisma.visaLineDocument.delete({
      where: { id: docId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除资料清单失败:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
