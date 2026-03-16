/**
 * ERP 用户管理 DAO
 * 
 * 处理用户、角色、部门等数据操作
 */

import { query, queryOne, insert, update, remove } from '../connection';
import { ERPUser, ERPRole, ERPDepartment } from '../types';
import { RowDataPacket } from 'mysql2/promise';

type UserRow = ERPUser & RowDataPacket;
type RoleRow = ERPRole & RowDataPacket;
type DepartmentRow = ERPDepartment & RowDataPacket;

// ============ 用户相关 ============

/**
 * 根据用户名查找用户
 * 注意：使用现有的 users 表，username 实际存储在 mobile 字段
 */
export async function findUserByUsername(username: string): Promise<ERPUser | null> {
  // 优先通过 mobile 字段查找（兼容现有表结构）
  const sql = 'SELECT * FROM users WHERE mobile = ? AND (status = ? OR status IS NULL OR status = ?)';
  const result = await queryOne<UserRow>(sql, [username, 'active', '1']);
  
  if (result) {
    // 映射字段以适配 ERPUser 类型
    return {
      ...result,
      username: result.mobile || result.username,
    };
  }
  return null;
}

/**
 * 根据ID查找用户
 */
export async function findUserById(id: number): Promise<ERPUser | null> {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const result = await queryOne<UserRow>(sql, [id]);
  if (result) {
    return {
      ...result,
      username: result.mobile || result.username,
    };
  }
  return null;
}

/**
 * 获取用户列表
 */
export async function getUserList(params: {
  page?: number;
  pageSize?: number;
  role_id?: number;
  department_id?: number;
  keyword?: string;
}): Promise<{ list: ERPUser[]; total: number }> {
  const { page = 1, pageSize = 10, role_id, department_id, keyword } = params;
  const offset = (page - 1) * pageSize;
  
  let where = 'WHERE 1=1';
  const paramsList: any[] = [];
  
  if (role_id) {
    where += ' AND role_id = ?';
    paramsList.push(role_id);
  }
  if (department_id) {
    where += ' AND department_id = ?';
    paramsList.push(department_id);
  }
  if (keyword) {
    where += ' AND (mobile LIKE ? OR nickname LIKE ? OR real_name LIKE ?)';
    paramsList.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  
  // 获取总数
  const countSql = `SELECT COUNT(*) as total FROM users ${where}`;
  const countResult = await queryOne<RowDataPacket>(countSql, paramsList);
  const total = countResult?.total || 0;
  
  // 获取列表
  const listSql = `SELECT * FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const list = await query<UserRow[]>(listSql, [...paramsList, pageSize, offset]);
  
  return { 
    list: list.map(u => ({ ...u, username: u.mobile || u.username })), 
    total 
  };
}

/**
 * 创建用户
 */
export async function createUser(data: {
  username: string;
  password: string;
  real_name: string;
  phone?: string;
  email?: string;
  role_id: number;
  department_id?: number;
}): Promise<number> {
  const sql = `INSERT INTO users 
    (mobile, password, nickname, real_name, phone, email, role_id, department_id, role, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user', NOW(), NOW())`;
  
  return insert('users', {
    mobile: data.username,
    password: data.password,
    nickname: data.real_name,
    real_name: data.real_name,
    phone: data.phone,
    email: data.email,
    role_id: data.role_id,
    department_id: data.department_id,
    role: 'user',
  });
}

/**
 * 更新用户
 */
export async function updateUser(id: number, data: Partial<{
  real_name: string;
  phone: string;
  email: string;
  role_id: number;
  department_id: number;
  status: string;
  last_login_at: string;
}>): Promise<number> {
  if (Object.keys(data).length === 0) return 0;
  
  // 映射字段名
  const updateData: any = { ...data };
  if (data.phone) {
    updateData.mobile = data.phone;
  }
  
  return update('users', {
    ...updateData,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 删除用户（软删除）
 */
export async function deleteUser(id: number): Promise<number> {
  return update('users', {
    status: 'deleted',
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

/**
 * 修改密码
 */
export async function changePassword(id: number, newPassword: string): Promise<number> {
  return update('users', {
    password: newPassword,
    updated_at: new Date().toISOString(),
  }, 'id = ?', [id]);
}

// ============ 角色相关 ============

/**
 * 获取角色列表
 */
export async function getRoleList(): Promise<ERPRole[]> {
  const sql = 'SELECT * FROM roles WHERE status = ? ORDER BY level ASC';
  return query<RoleRow[]>(sql, ['active']);
}

/**
 * 根据ID获取角色
 */
export async function getRoleById(id: number): Promise<ERPRole | null> {
  const sql = 'SELECT * FROM roles WHERE id = ?';
  return queryOne<RoleRow>(sql, [id]);
}

// ============ 部门相关 ============

/**
 * 获取部门列表
 */
export async function getDepartmentList(): Promise<ERPDepartment[]> {
  const sql = 'SELECT * FROM departments WHERE status = ? ORDER BY id ASC';
  return query<DepartmentRow[]>(sql, ['active']);
}
