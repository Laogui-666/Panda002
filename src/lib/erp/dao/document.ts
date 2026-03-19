/**
 * ERP 资料中心 DAO
 * 
 * 处理资料上传、审核等数据操作
 */

import { query, queryOne, insert, update, remove } from '../connection';
import { ERPDocument } from '../types';
import { RowDataPacket } from 'mysql2/promise';

type DocumentRow = ERPDocument & RowDataPacket;

/**
 * 根据ID获取资料
 */
export async function getDocumentById(id: number): Promise<ERPDocument | null> {
  const sql = 'SELECT * FROM erp_documents WHERE id = ?';
  return queryOne<DocumentRow>(sql, [id]);
}

/**
 * 根据订单ID获取资料列表
 */
export async function getDocumentsByOrderId(orderId: number): Promise<ERPDocument[]> {
  const sql = 'SELECT * FROM erp_documents WHERE order_id = ? ORDER BY created_at DESC';
  return query<DocumentRow[]>(sql, [orderId]);
}

/**
 * 获取资料列表
 */
export async function getDocumentList(params: {
  page?: number;
  pageSize?: number;
  order_id?: number;
  document_type?: string;
  status?: 'pending' | 'approved' | 'rejected';
  uploaded_by?: number;
}): Promise<{ list: ERPDocument[]; total: number }> {
  const { page = 1, pageSize = 10, order_id, document_type, status, uploaded_by } = params;
  const offset = (page - 1) * pageSize;
  
  let where = 'WHERE 1=1';
  const paramsList: any[] = [];
  
  if (order_id) {
    where += ' AND order_id = ?';
    paramsList.push(order_id);
  }
  if (document_type) {
    where += ' AND document_type = ?';
    paramsList.push(document_type);
  }
  if (status) {
    where += ' AND status = ?';
    paramsList.push(status);
  }
  if (uploaded_by) {
    where += ' AND uploaded_by = ?';
    paramsList.push(uploaded_by);
  }
  
  // 获取总数
  const countSql = `SELECT COUNT(*) as total FROM erp_documents ${where}`;
  const countResult = await queryOne<RowDataPacket>(countSql, paramsList);
  const total = countResult?.total || 0;
  
  // 获取列表
  const listSql = `SELECT * FROM erp_documents ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const list = await query<DocumentRow[]>(listSql, [...paramsList, pageSize, offset]);
  
  return { list, total };
}

/**
 * 创建资料记录
 */
export async function createDocument(data: {
  order_id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: number;
}): Promise<number> {
  return insert('erp_documents', {
    ...data,
    status: 'pending',
    created_at: new Date().toISOString(),
  });
}

/**
 * 更新资料
 */
export async function updateDocument(id: number, data: Partial<{
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  status: 'pending' | 'approved' | 'rejected';
  review_remark: string;
  reviewed_by: number;
}>): Promise<number> {
  if (Object.keys(data).length === 0) return 0;
  
  return update('erp_documents', data, 'id = ?', [id]);
}

/**
 * 审核资料
 */
export async function reviewDocument(
  id: number, 
  status: 'approved' | 'rejected', 
  remark: string,
  reviewedBy: number
): Promise<number> {
  return update('erp_documents', {
    status,
    review_remark: remark,
    reviewed_by: reviewedBy,
    reviewed_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 删除资料
 */
export async function deleteDocument(id: number): Promise<number> {
  return remove('erp_documents', 'id = ?', [id]);
}

/**
 * 获取待审核资料数量
 */
export async function getPendingReviewCount(): Promise<number> {
  const sql = 'SELECT COUNT(*) as count FROM erp_documents WHERE status = ?';
  const result = await queryOne<RowDataPacket>(sql, ['pending']);
  return result?.count || 0;
}
