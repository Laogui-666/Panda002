/**
 * ERP 文件上传API
 * 
 * 处理资料文件上传到阿里云OSS
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/erp/auth';
import { UserRole, DocumentReviewStatus } from '@/lib/erp/types';
import prisma from '@/lib/erp/prisma';
import { uploadFile } from '@/lib/oss';

// 文件大小限制：10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 允许的文件类型
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// POST /api/erp/documents/upload
export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '未授权，请先登录' },
        { status: 401 }
      );
    }

    // 验证角色权限（资料员、操作员、客服可以上传）
    const allowedRoles: UserRole[] = [
      UserRole.SUPER_ADMIN,
      UserRole.COMPANY_OWNER,
      UserRole.CS_ADMIN,
      UserRole.CUSTOMER_SERVICE,
      UserRole.VISA_ADMIN,
      UserRole.DOC_COLLECTOR,
      UserRole.OPERATOR,
    ];
    
    if (!allowedRoles.includes(user.role as UserRole)) {
      return NextResponse.json(
        { success: false, message: '您没有上传资料的权限' },
        { status: 403 }
      );
    }

    // 解析表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const orderId = formData.get('orderId') as string | null;
    const requirementId = formData.get('requirementId') as string | null;
    const type = formData.get('type') as string || 'requirement'; // requirement | material

    // 验证必填字段
    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择要上传的文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: '不支持的文件类型，请上传 JPG、PNG、PDF、Word 文档' },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: '文件大小超过10MB限制' },
        { status: 400 }
      );
    }

    // 验证订单ID
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: '缺少订单ID' },
        { status: 400 }
      );
    }

    const orderIdNum = parseInt(orderId, 10);
    
    // 验证订单存在且有权限访问
    const order = await prisma.order.findUnique({
      where: { id: orderIdNum },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: '订单不存在' },
        { status: 404 }
      );
    }

    // 权限检查：只能操作自己公司的订单
    if (user.role !== UserRole.SUPER_ADMIN && order.companyId !== user.companyId) {
      return NextResponse.json(
        { success: false, message: '无权限操作此订单' },
        { status: 403 }
      );
    }

    // 上传文件到OSS
    const folder = type === 'material' ? 'visa-materials' : 'document-requirements';
    const fileUrl = await uploadFile(file, `${folder}/${order.orderNo}`);

    // 如果有requirementId，更新资料清单记录
    if (requirementId && type === 'requirement') {
      const requirementIdNum = parseInt(requirementId, 10);
      
      await prisma.documentRequirement.update({
        where: { id: requirementIdNum },
        data: {
          fileUrl,
          status: DocumentReviewStatus.PENDING_REVIEW, // 待审核
          uploadedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: '文件上传成功，资料待审核',
        data: {
          fileUrl,
          requirementId: requirementIdNum,
        },
      });
    }

    // 创建新的资料清单记录
    if (type === 'requirement') {
      const docName = formData.get('name') as string || file.name;
      
      const doc = await prisma.documentRequirement.create({
        data: {
          name: docName,
          description: formData.get('description') as string || '',
          isRequired: formData.get('isRequired') === 'true',
          status: DocumentReviewStatus.PENDING_REVIEW,
          fileUrl,
          uploadedAt: new Date(),
          orderId: orderIdNum,
        },
      });

      return NextResponse.json({
        success: true,
        message: '文件上传成功，资料待审核',
        data: {
          fileUrl,
          documentId: doc.id,
        },
      });
    }

    // 创建签证材料记录
    if (type === 'material') {
      const materialName = formData.get('name') as string || file.name;
      
      const material = await prisma.visaMaterial.create({
        data: {
          name: materialName,
          type: formData.get('materialType') as string || 'other',
          fileUrl,
          status: 'PENDING',
          orderId: orderIdNum,
          createdBy: user.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: '签证材料上传成功',
        data: {
          fileUrl,
          materialId: material.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      data: { fileUrl },
    });

  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误：文件上传失败' },
      { status: 500 }
    );
  }
}
