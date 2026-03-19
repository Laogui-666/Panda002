/**
 * JWT认证工具
 * 
 * 生成和验证JWT令牌
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import prisma from './prisma';
import { UserRole, UserStatus, OrderStatus } from '@prisma/client';

// 重新导出类型
export { UserRole, UserStatus, OrderStatus };

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'muhai-visa-erp-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 用户类型（不含密码）
export interface AuthUser {
  id: number;
  username: string;
  email: string | null;
  name: string;
  phone: string | null;
  role: UserRole;
  companyId: number | null;
  departmentId: number | null;
}

// JWT载荷
export interface JWTPayload {
  userId: number;
  username: string;
  role: UserRole;
  companyId: number | null;
}

/**
 * 生成JWT令牌
 */
export function generateToken(payload: JWTPayload): string {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * 验证JWT令牌
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * 密码加密
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * 密码验证
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * 从请求中获取当前用户
 */
export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      companyId: true,
      departmentId: true,
      status: true,
    },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return null;
  }

  return user as AuthUser;
}

/**
 * 验证密码（用户登录）
 */
export async function validateUser(username: string, password: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      companyId: true,
      departmentId: true,
      passwordHash: true,
      status: true,
    },
  });

  if (!user) {
    return null;
  }

  if (user.status !== UserStatus.ACTIVE) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  // 更新最后登录时间
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // 记录登录日志
  await prisma.loginLog.create({
    data: {
      userId: user.id,
      ipAddress: '0.0.0.0', // 实际应从请求中获取
      loginStatus: 'success',
    },
  });

  const { passwordHash, ...authUser } = user;
  return authUser as AuthUser;
}

/**
 * 角色权限检查
 */
export function hasRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * 公司数据权限检查
 */
export function canAccessCompany(user: AuthUser | null, companyId: number): boolean {
  if (!user) return false;
  
  // 超级管理员可以访问所有公司
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // 其他角色只能访问自己公司
  return user.companyId === companyId;
}

/**
 * 部门数据权限检查
 */
export function canAccessDepartment(user: AuthUser | null, departmentId: number): boolean {
  if (!user) return false;
  
  // 超级管理员和公司负责人可以访问所有部门
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.COMPANY_OWNER) {
    return true;
  }

  // 部门管理员（客服部管理员、签证部管理员）只能访问自己部门
  if (user.role === UserRole.CS_ADMIN || user.role === UserRole.VISA_ADMIN) {
    return user.departmentId === departmentId;
  }

  return false;
}

/**
 * API错误响应
 */
export function unauthorizedResponse(message: string = '未授权') {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  );
}

/**
 * 禁止访问响应
 */
export function forbiddenResponse(message: string = '禁止访问') {
  return NextResponse.json(
    { success: false, message },
    { status: 403 }
  );
}

/**
 * 角色标签映射
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '超级管理员',
  [UserRole.COMPANY_OWNER]: '公司负责人',
  [UserRole.CS_ADMIN]: '客服部管理员',
  [UserRole.CUSTOMER_SERVICE]: '客服',
  [UserRole.VISA_ADMIN]: '签证部管理员',
  [UserRole.DOC_COLLECTOR]: '资料员',
  [UserRole.OPERATOR]: '签证操作员',
  [UserRole.OUTSOURCE]: '外包业务员',
  [UserRole.CUSTOMER]: '普通用户',
};

/**
 * 角色可访问的菜单
 */
export const ROLE_MENUS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ['dashboard', 'companies', 'departments', 'users', 'orders', 'customers', 'documents', 'appointments', 'settings'],
  [UserRole.COMPANY_OWNER]: ['dashboard', 'departments', 'users', 'orders', 'customers', 'documents', 'appointments', 'settings'],
  [UserRole.CS_ADMIN]: ['dashboard', 'orders', 'customers', 'documents'],
  [UserRole.CUSTOMER_SERVICE]: ['dashboard', 'orders', 'customers'],
  [UserRole.VISA_ADMIN]: ['dashboard', 'orders', 'customers', 'documents', 'appointments'],
  [UserRole.DOC_COLLECTOR]: ['dashboard', 'orders', 'documents', 'appointments'],
  [UserRole.OPERATOR]: ['dashboard', 'orders', 'documents', 'appointments'],
  [UserRole.OUTSOURCE]: ['dashboard', 'orders'],
  [UserRole.CUSTOMER]: ['my-orders'],
};
