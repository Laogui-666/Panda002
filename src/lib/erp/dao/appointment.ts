/**
 * ERP 预约中心 DAO
 * 
 * 处理预约管理、提醒设置等数据操作
 */

import { query, queryOne, insert, update, remove } from '../connection';
import { ERPAppointment } from '../types';
import { RowDataPacket } from 'mysql2/promise';

type AppointmentRow = ERPAppointment & RowDataPacket;

/**
 * 根据ID获取预约
 */
export async function getAppointmentById(id: number): Promise<ERPAppointment | null> {
  const sql = 'SELECT * FROM erp_appointments WHERE id = ?';
  return queryOne<AppointmentRow>(sql, [id]);
}

/**
 * 根据订单ID获取预约
 */
export async function getAppointmentByOrderId(orderId: number): Promise<ERPAppointment | null> {
  const sql = 'SELECT * FROM erp_appointments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1';
  return queryOne<AppointmentRow>(sql, [orderId]);
}

/**
 * 获取预约列表
 */
export async function getAppointmentList(params: {
  page?: number;
  pageSize?: number;
  order_id?: number;
  status?: 'scheduled' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  created_by?: number;
}): Promise<{ list: ERPAppointment[]; total: number }> {
  const { 
    page = 1, 
    pageSize = 10, 
    order_id, 
    status,
    startDate,
    endDate,
    created_by,
  } = params;
  const offset = (page - 1) * pageSize;
  
  let where = 'WHERE 1=1';
  const paramsList: any[] = [];
  
  if (order_id) {
    where += ' AND order_id = ?';
    paramsList.push(order_id);
  }
  if (status) {
    where += ' AND status = ?';
    paramsList.push(status);
  }
  if (startDate) {
    where += ' AND DATE(appointment_date) >= ?';
    paramsList.push(startDate);
  }
  if (endDate) {
    where += ' AND DATE(appointment_date) <= ?';
    paramsList.push(endDate);
  }
  if (created_by) {
    where += ' AND created_by = ?';
    paramsList.push(created_by);
  }
  
  // 获取总数
  const countSql = `SELECT COUNT(*) as total FROM erp_appointments ${where}`;
  const countResult = await queryOne<RowDataPacket>(countSql, paramsList);
  const total = countResult?.total || 0;
  
  // 获取列表
  const listSql = `SELECT * FROM erp_appointments ${where} ORDER BY appointment_date ASC, appointment_time ASC LIMIT ? OFFSET ?`;
  const list = await query<AppointmentRow[]>(listSql, [...paramsList, pageSize, offset]);
  
  return { list, total };
}

/**
 * 创建预约
 */
export async function createAppointment(data: {
  order_id: number;
  appointment_date: string;
  appointment_time?: string;
  location?: string;
  contact_person?: string;
  contact_phone?: string;
  remark?: string;
  document_path?: string;
  created_by?: number;
}): Promise<number> {
  return insert('erp_appointments', {
    ...data,
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

/**
 * 更新预约
 */
export async function updateAppointment(
  id: number, 
  data: Partial<{
    appointment_date: string;
    appointment_time: string;
    location: string;
    contact_person: string;
    contact_phone: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    remark: string;
    document_path: string;
  }>
): Promise<number> {
  if (Object.keys(data).length === 0) return 0;
  
  return update('erp_appointments', {
    ...data,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 取消预约
 */
export async function cancelAppointment(id: number): Promise<number> {
  return update('erp_appointments', {
    status: 'cancelled',
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 完成预约
 */
export async function completeAppointment(id: number): Promise<number> {
  return update('erp_appointments', {
    status: 'completed',
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 删除预约
 */
export async function deleteAppointment(id: number): Promise<number> {
  return remove('erp_appointments', 'id = ?', [id]);
}

/**
 * 获取今日预约数量
 */
export async function getTodayAppointmentCount(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const sql = 'SELECT COUNT(*) as count FROM erp_appointments WHERE DATE(appointment_date) = ? AND status = ?';
  const result = await queryOne<RowDataPacket>(sql, [today, 'scheduled']);
  return result?.count || 0;
}

/**
 * 获取即将到来的预约（未来7天）
 */
export async function getUpcomingAppointments(days: number = 7): Promise<ERPAppointment[]> {
  const today = new Date().toISOString().slice(0, 10);
  const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  
  const sql = `SELECT * FROM erp_appointments 
    WHERE DATE(appointment_date) >= ? 
    AND DATE(appointment_date) <= ? 
    AND status = 'scheduled' 
    ORDER BY appointment_date ASC, appointment_time ASC`;
  
  return query<AppointmentRow[]>(sql, [today, endDate]);
}
