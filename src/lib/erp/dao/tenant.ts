/**
 * @deprecated
 * 租户DAO已弃用，请使用 Prisma ORM
 *
 * 原生MySQL DAO 使用 mysql2/promise 直接操作数据库，
 * 现已统一使用 Prisma ORM 作为唯一数据访问层。
 *
 * 迁移指南：
 * - 使用 src/lib/erp/prisma.ts 中的 prisma 实例
 * - 公司数据模型: prisma.company
 * - 用户数据模型: prisma.user
 *
 * 此文件保留用于向后兼容，将在后续版本中移除。
 *
 * @example
 * // 旧代码 (已弃用)
 * import { getTenantList } from '@/lib/erp/dao/tenant';
 * const { list, total } = await getTenantList({ page: 1, pageSize: 10 });
 *
 * // 新代码 (推荐)
 * import prisma from '@/lib/erp/prisma';
 * const [companies, total] = await Promise.all([
 *   prisma.company.findMany({ skip: 0, take: 10 }),
 *   prisma.company.count()
 * ]);
 */

import { query, queryOne, insert, update, remove } from '../connection';
import { RowDataPacket } from 'mysql2/promise';

// ============ 租户类型定义 ============

export interface ERPTenant {
  id: number;
  tenant_name: string;
  tenant_key: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  company_logo?: string;
  subscription_plan: string;
  max_users: number;
  status: 'active' | 'inactive' | 'suspended';
  config?: string;
  created_at: string;
  updated_at: string;
}

type TenantRow = ERPTenant & RowDataPacket;

// ============ 租户相关 - 已弃用 ============

/**
 * @deprecated 请使用 prisma.company.findMany()
 */
export async function getTenantList(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}): Promise<{ list: ERPTenant[]; total: number }> {
  const { page = 1, pageSize = 10, keyword, status } = params;
  const offset = (page - 1) * pageSize;

  let where = 'WHERE 1=1';
  const paramsList: any[] = [];

  if (keyword) {
    where += ' AND (tenant_name LIKE ? OR tenant_key LIKE ? OR contact_email LIKE ?)';
    paramsList.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  if (status) {
    where += ' AND status = ?';
    paramsList.push(status);
  }

  // 获取总数
  const countSql = `SELECT COUNT(*) as total FROM tenants ${where}`;
  const countResult = await queryOne<RowDataPacket>(countSql, paramsList);
  const total = countResult?.total || 0;

  // 获取列表
  const listSql = `SELECT * FROM tenants ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const list = await query<TenantRow[]>(listSql, [...paramsList, pageSize, offset]);

  return { list, total };
}

/**
 * @deprecated 请使用 prisma.company.findUnique({ where: { id } })
 */
export async function getTenantById(id: number): Promise<ERPTenant | null> {
  const sql = 'SELECT * FROM tenants WHERE id = ?';
  return queryOne<TenantRow>(sql, [id]);
}

/**
 * @deprecated 请使用 prisma.company.findFirst({ where: { tenant_key, status: 'active' } })
 */
export async function getTenantByKey(tenantKey: string): Promise<ERPTenant | null> {
  const sql = 'SELECT * FROM tenants WHERE tenant_key = ? AND status = ?';
  return queryOne<TenantRow>(sql, [tenantKey, 'active']);
}

/**
 * @deprecated 请使用 prisma.company.create({ data: { name, shortName, ... } })
 */
export async function createTenant(data: {
  tenant_name: string;
  tenant_key: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  subscription_plan?: string;
  max_users?: number;
}): Promise<number> {
  const sql = `INSERT INTO tenants
    (tenant_name, tenant_key, contact_person, contact_phone, contact_email, subscription_plan, max_users, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`;

  return insert('tenants', {
    tenant_name: data.tenant_name,
    tenant_key: data.tenant_key,
    contact_person: data.contact_person || '',
    contact_phone: data.contact_phone || '',
    contact_email: data.contact_email || '',
    subscription_plan: data.subscription_plan || 'basic',
    max_users: data.max_users || 10,
    status: 'active',
  });
}

/**
 * @deprecated 请使用 prisma.company.update({ where: { id }, data: { ... } })
 */
export async function updateTenant(id: number, data: Partial<{
  tenant_name: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  company_logo: string;
  subscription_plan: string;
  max_users: number;
  config: string;
}>): Promise<number> {
  if (Object.keys(data).length === 0) return 0;

  return update('tenants', {
    ...data,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * @deprecated 请使用 prisma.company.update({ where: { id }, data: { status } })
 */
export async function updateTenantStatus(id: number, status: 'active' | 'inactive' | 'suspended'): Promise<number> {
  return update('tenants', {
    status,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * @deprecated 请使用 prisma.company.delete({ where: { id } }) 或软删除 prisma.company.update({ where: { id }, data: { status: 'inactive' } })
 */
export async function deleteTenant(id: number): Promise<number> {
  return update('tenants', {
    status: 'inactive',
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * @deprecated 请使用 prisma.user.count({ where: { companyId } })
 */
export async function getTenantUserCount(tenantId: number): Promise<number> {
  const sql = 'SELECT COUNT(*) as total FROM users WHERE tenant_id = ?';
  const result = await queryOne<RowDataPacket>(sql, [tenantId]);
  return result?.total || 0;
}

/**
 * @deprecated 请使用 prisma.order.count({ where: { companyId } })
 */
export async function getTenantOrderCount(tenantId: number): Promise<number> {
  const sql = 'SELECT COUNT(*) as total FROM orders WHERE tenant_id = ?';
  const result = await queryOne<RowDataPacket>(sql, [tenantId]);
  return result?.total || 0;
}
