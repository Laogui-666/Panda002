/**
 * ERP 租户(公司)管理 DAO
 * 
 * 处理租户、公司等数据操作
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

// ============ 租户相关 ============

/**
 * 获取租户列表
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
 * 根据ID获取租户
 */
export async function getTenantById(id: number): Promise<ERPTenant | null> {
  const sql = 'SELECT * FROM tenants WHERE id = ?';
  return queryOne<TenantRow>(sql, [id]);
}

/**
 * 根据tenant_key获取租户
 */
export async function getTenantByKey(tenantKey: string): Promise<ERPTenant | null> {
  const sql = 'SELECT * FROM tenants WHERE tenant_key = ? AND status = ?';
  return queryOne<TenantRow>(sql, [tenantKey, 'active']);
}

/**
 * 创建租户
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
 * 更新租户
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
 * 更新租户状态
 */
export async function updateTenantStatus(id: number, status: 'active' | 'inactive' | 'suspended'): Promise<number> {
  return update('tenants', {
    status,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 删除租户（软删除）
 */
export async function deleteTenant(id: number): Promise<number> {
  return update('tenants', {
    status: 'inactive',
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 获取租户下的用户数量
 */
export async function getTenantUserCount(tenantId: number): Promise<number> {
  const sql = 'SELECT COUNT(*) as total FROM users WHERE tenant_id = ?';
  const result = await queryOne<RowDataPacket>(sql, [tenantId]);
  return result?.total || 0;
}

/**
 * 获取租户下的订单数量
 */
export async function getTenantOrderCount(tenantId: number): Promise<number> {
  const sql = 'SELECT COUNT(*) as total FROM orders WHERE tenant_id = ?';
  const result = await queryOne<RowDataPacket>(sql, [tenantId]);
  return result?.total || 0;
}
