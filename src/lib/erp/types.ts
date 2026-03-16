/**
 * ERP类型定义
 */

import { UserRole, UserStatus, OrderStatus, DocumentStatus, DocumentReviewStatus, AppointmentStatus } from '@prisma/client';

export { UserRole, UserStatus, OrderStatus, DocumentStatus, DocumentReviewStatus, AppointmentStatus };

// 预约类型（兼容旧代码）
export interface ERPAppointment {
  id: number;
  order_id: number;
  appointment_date: string;
  appointment_time?: string;
  location?: string;
  contact_person?: string;
  contact_phone?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  remark?: string;
  document_path?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

// 文档类型（兼容旧代码）
export interface ERPDocument {
  id: number;
  order_id: number;
  type: 'requirement' | 'material';
  name: string;
  file_path?: string;
  status: string;
  review_status?: string;
  remark?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

// 订单类型（兼容旧代码）
export interface ERPOrder {
  id: number;
  order_no: string;
  customer_id: number;
  visa_country: string;
  visa_type: string;
  status: OrderStatus;
  total_fee?: number;
  payment_status?: string;
  payment_time?: string;
  company_id: number;
  cs_id?: number;
  dc_id?: number;
  op_id?: number;
  department_id?: number;
  remark?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

// 用户类型（兼容旧代码）
export interface ERPUser {
  id: number;
  username: string;
  password?: string;
  email?: string;
  mobile?: string;
  name?: string;
  real_name?: string;
  role?: string;
  company_id?: number;
  department_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// 角色类型（兼容旧代码）
export interface ERPRole {
  id: number;
  name: string;
  code: string;
  role_key?: string;
  role_name?: string;
  description?: string;
  permissions?: string;
  created_at?: string;
  updated_at?: string;
}

// 部门类型（兼容旧代码）
export interface ERPDepartment {
  id: number;
  name: string;
  code?: string;
  company_id?: number;
  parent_id?: number;
  manager_id?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '超级管理员',
  [UserRole.COMPANY_OWNER]: '公司负责人',
  [UserRole.DEPT_ADMIN]: '业务部管理员',
  [UserRole.OPERATOR]: '操作员',
  [UserRole.OUTSOURCE]: '外包业务员',
  [UserRole.CUSTOMER]: '普通用户',
};

export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  color: string;
  next: OrderStatus[];
  prev?: OrderStatus[];
  roles: UserRole[];
}> = {
  [OrderStatus.PENDING_CONNECTION]: {
    label: '待对接', color: 'gray',
    next: [OrderStatus.CONNECTED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.CONNECTED]: {
    label: '已对接', color: 'blue',
    next: [OrderStatus.COLLECTING_DOCS, OrderStatus.PENDING_REVIEW],
    prev: [OrderStatus.PENDING_CONNECTION],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.COLLECTING_DOCS]: {
    label: '资料收集中', color: 'cyan',
    next: [OrderStatus.PENDING_REVIEW],
    prev: [OrderStatus.CONNECTED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.PENDING_REVIEW]: {
    label: '待审核', color: 'yellow',
    next: [OrderStatus.UNDER_REVIEW, OrderStatus.COLLECTING_DOCS],
    prev: [OrderStatus.COLLECTING_DOCS, OrderStatus.CONNECTED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.UNDER_REVIEW]: {
    label: '资料审核中', color: 'orange',
    next: [OrderStatus.MAKING_MATERIALS, OrderStatus.COLLECTING_DOCS],
    prev: [OrderStatus.PENDING_REVIEW],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.MAKING_MATERIALS]: {
    label: '材料制作中', color: 'purple',
    next: [OrderStatus.PENDING_DELIVERY],
    prev: [OrderStatus.UNDER_REVIEW],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.PENDING_DELIVERY]: {
    label: '待交付', color: 'pink',
    next: [OrderStatus.DELIVERED],
    prev: [OrderStatus.MAKING_MATERIALS],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR],
  },
  [OrderStatus.DELIVERED]: {
    label: '已交付', color: 'indigo',
    next: [OrderStatus.APPROVED, OrderStatus.REJECTED],
    prev: [OrderStatus.PENDING_DELIVERY],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER],
  },
  [OrderStatus.APPROVED]: {
    label: '出签', color: 'green',
    next: [],
    prev: [OrderStatus.DELIVERED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER],
  },
  [OrderStatus.REJECTED]: {
    label: '拒签', color: 'red',
    next: [],
    prev: [OrderStatus.DELIVERED],
    roles: [UserRole.COMPANY_OWNER, UserRole.DEPT_ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER],
  },
};

export const ORDER_STATUS_MAP = ORDER_STATUS_CONFIG;

export const ROLE_MENUS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ['dashboard', 'companies', 'departments', 'users', 'orders', 'customers', 'documents', 'appointments', 'settings'],
  [UserRole.COMPANY_OWNER]: ['dashboard', 'departments', 'users', 'orders', 'customers', 'documents', 'appointments', 'settings'],
  [UserRole.DEPT_ADMIN]: ['dashboard', 'orders', 'customers', 'documents', 'appointments'],
  [UserRole.OPERATOR]: ['dashboard', 'orders', 'documents', 'appointments'],
  [UserRole.OUTSOURCE]: ['dashboard', 'orders'],
  [UserRole.CUSTOMER]: ['my-orders'],
};
