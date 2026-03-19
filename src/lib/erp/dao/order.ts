/**
 * ERP 订单管理 DAO
 * 
 * 处理订单、订单状态流转等数据操作
 */

import { query, queryOne, insert, update, remove } from '../connection';
import { ERPOrder, OrderStatus } from '../types';
import { RowDataPacket } from 'mysql2/promise';

type OrderRow = ERPOrder & RowDataPacket;

/**
 * 根据ID获取订单
 */
export async function getOrderById(id: number): Promise<ERPOrder | null> {
  const sql = 'SELECT * FROM erp_orders WHERE id = ?';
  return queryOne<OrderRow>(sql, [id]);
}

/**
 * 根据订单号获取订单
 */
export async function getOrderByNo(orderNo: string): Promise<ERPOrder | null> {
  const sql = 'SELECT * FROM erp_orders WHERE order_no = ?';
  return queryOne<OrderRow>(sql, [orderNo]);
}

/**
 * 获取订单列表
 */
export async function getOrderList(params: {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  assigned_to?: number;
  created_by?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ list: ERPOrder[]; total: number }> {
  const { 
    page = 1, 
    pageSize = 10, 
    status, 
    assigned_to, 
    created_by, 
    keyword,
    startDate,
    endDate,
  } = params;
  
  const offset = (page - 1) * pageSize;
  
  let where = 'WHERE 1=1';
  const paramsList: any[] = [];
  
  if (status) {
    where += ' AND status = ?';
    paramsList.push(status);
  }
  if (assigned_to) {
    where += ' AND assigned_to = ?';
    paramsList.push(assigned_to);
  }
  if (created_by) {
    where += ' AND created_by = ?';
    paramsList.push(created_by);
  }
  if (keyword) {
    where += ' AND (order_no LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
    paramsList.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  if (startDate) {
    where += ' AND DATE(created_at) >= ?';
    paramsList.push(startDate);
  }
  if (endDate) {
    where += ' AND DATE(created_at) <= ?';
    paramsList.push(endDate);
  }
  
  // 获取总数
  const countSql = `SELECT COUNT(*) as total FROM erp_orders ${where}`;
  const countResult = await queryOne<RowDataPacket>(countSql, paramsList);
  const total = countResult?.total || 0;
  
  // 获取列表
  const listSql = `SELECT * FROM erp_orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const list = await query<OrderRow[]>(listSql, [...paramsList, pageSize, offset]);
  
  return { list, total };
}

/**
 * 创建订单
 */
export async function createOrder(data: {
  order_no: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  id_card?: string;
  visa_country: string;
  visa_type: string;
  assigned_to?: number;
  created_by?: number;
  remark?: string;
}): Promise<number> {
  return insert('erp_orders', {
    ...data,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

/**
 * 更新订单
 */
export async function updateOrder(id: number, data: Partial<{
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  id_card: string;
  visa_country: string;
  visa_type: string;
  assigned_to: number;
  status: OrderStatus;
  extra_info: string;
  remark: string;
}>): Promise<number> {
  if (Object.keys(data).length === 0) return 0;
  
  return update('erp_orders', {
    ...data,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 更新订单状态
 */
export async function updateOrderStatus(id: number, status: OrderStatus): Promise<number> {
  return update('erp_orders', {
    status,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 分配订单给操作员
 */
export async function assignOrder(id: number, assignedTo: number): Promise<number> {
  return update('erp_orders', {
    assigned_to: assignedTo,
    status: 'connected',
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 删除订单（软删除）
 */
export async function deleteOrder(id: number): Promise<number> {
  return update('erp_orders', {
    status: 'deleted' as any,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 获取订单状态统计
 */
export async function getOrderStatusStats(): Promise<RowDataPacket[]> {
  const sql = `SELECT status, COUNT(*) as count FROM erp_orders GROUP BY status`;
  return query<RowDataPacket[]>(sql, []);
}

/**
 * 生成订单号
 */
export function generateOrderNo(): string {
  const now = new Date();
  const prefix = 'VD';
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${date}${random}`;
}
