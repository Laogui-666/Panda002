/**
 * 用户类型定义
 */

import { BaseEntity, ApiResponse } from './common';

export type { ApiResponse };

/**
 * 用户角色
 */
export type UserRole = 'user' | 'vip' | 'admin';

/**
 * 用户状态
 */
export type UserStatus = 'active' | 'inactive' | 'banned';

/**
 * 用户
 */
export interface User extends BaseEntity {
  email?: string;
  phone?: string;
  nickname: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  
  // 扩展信息
  profile?: {
    realName?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    nationality?: string;
    residence?: string;
    occupation?: string;
    company?: string;
  };
  
  // 会员信息
  membership?: {
    level: 'free' | 'basic' | 'premium' | 'enterprise';
    expiresAt?: string;
    features?: string[];
  };
  
  // 统计
  stats?: {
    itinerariesCount: number;
    assessmentsCount: number;
    lettersCount: number;
  };
}

/**
 * 登录请求
 */
export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 注册请求
 */
export interface RegisterRequest {
  email?: string;
  phone?: string;
  password: string;
  nickname: string;
  verificationCode?: string;
}

/**
 * 认证令牌
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // 秒
}
