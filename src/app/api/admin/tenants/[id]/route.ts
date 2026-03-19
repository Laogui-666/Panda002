/**
 * @deprecated
 * 此API已弃用，请使用 /api/erp/companies
 *
 * 原租户管理功能已迁移到新的公司管理API:
 * - GET /api/erp/companies?id={id}
 * - PUT /api/erp/companies?id={id}
 * - DELETE /api/erp/companies?id={id}
 *
 * 架构说明：
 * - 使用 Prisma ORM 作为唯一数据访问层
 * - 所有公司管理功能通过 /api/erp/companies 提供
 *
 * 此文件保留用于向后兼容，将在后续版本中移除。
 */
import { NextRequest, NextResponse } from 'next/server';

// 获取单个租户详情 - 已迁移到 /api/erp/companies
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: false,
    message: '此API已弃用，请使用 /api/erp/companies',
    deprecated: true,
    migration: {
      newEndpoint: '/api/erp/companies',
      method: 'GET',
      description: '获取公司详情'
    }
  }, { status: 410 });
}

// 更新租户 - 已迁移到 /api/erp/companies
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: false,
    message: '此API已弃用，请使用 /api/erp/companies',
    deprecated: true,
    migration: {
      newEndpoint: '/api/erp/companies',
      method: 'PUT',
      description: '更新公司信息'
    }
  }, { status: 410 });
}

// 更新租户状态 - 已迁移到 /api/erp/companies
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: false,
    message: '此API已弃用，请使用 /api/erp/companies',
    deprecated: true,
    migration: {
      newEndpoint: '/api/erp/companies',
      method: 'PUT',
      description: '更新公司状态'
    }
  }, { status: 410 });
}

// 删除租户 - 已迁移到 /api/erp/companies
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: false,
    message: '此API已弃用，请使用 /api/erp/companies',
    deprecated: true,
    migration: {
      newEndpoint: '/api/erp/companies',
      method: 'DELETE',
      description: '删除公司'
    }
  }, { status: 410 });
}
