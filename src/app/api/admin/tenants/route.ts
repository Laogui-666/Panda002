/**
 * @deprecated
 * 此API已弃用，请使用 /api/erp/companies
 *
 * 原租户管理功能已迁移到新的公司管理API:
 * - GET/POST /api/erp/companies
 * - PUT/DELETE /api/erp/companies?id={id}
 *
 * 架构说明：
 * - 使用 Prisma ORM 作为唯一数据访问层
 * - 所有公司管理功能通过 /api/erp/companies 提供
 *
 * 此文件保留用于向后兼容，将在后续版本中移除。
 */
import { NextResponse } from 'next/server';

// 获取租户列表 - 已迁移到 /api/erp/companies
export async function GET() {
  return NextResponse.json({
    success: false,
    message: '此API已弃用，请使用 /api/erp/companies',
    deprecated: true,
    migration: {
      newEndpoint: '/api/erp/companies',
      method: 'GET',
      description: '获取公司列表'
    }
  }, { status: 410 });
}

// 创建租户 - 已迁移到 /api/erp/companies
export async function POST() {
  return NextResponse.json({
    success: false,
    message: '此API已弃用，请使用 /api/erp/companies',
    deprecated: true,
    migration: {
      newEndpoint: '/api/erp/companies',
      method: 'POST',
      description: '创建公司'
    }
  }, { status: 410 });
}
