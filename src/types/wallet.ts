/**
 * 钱包类型定义
 */

import { BaseEntity, ApiResponse } from './common';

export type { ApiResponse };

/**
 * 交易类型
 */
export type TransactionType = 'recharge' | 'consume' | 'reward' | 'refund' | 'bonus';

/**
 * 交易状态
 */
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

/**
 * 交易记录
 */
export interface Transaction extends BaseEntity {
  userId: string;
  type: TransactionType;
  amount: number;
  balance: number; // 交易后余额
  currency: string;
  status: TransactionStatus;
  description: string;
  orderId?: string;
  completedAt?: string;
}

/**
 * 钱包
 */
export interface Wallet extends BaseEntity {
  userId: string;
  balance: number;
  currency: string;
  
  // 会员权益
  membership?: {
    level: 'free' | 'basic' | 'premium' | 'enterprise';
    monthlyAllowance?: number;
    discount?: number;
  };
  
  // 统计
  stats?: {
    totalRecharged: number;
    totalConsumed: number;
    transactionCount: number;
  };
  
  // 状态
  isActive: boolean;
  frozenBalance?: number;
}

/**
 * 充值选项
 */
export interface RechargeOption {
  amount: number;
  bonus?: number;
  currency: string;
  description?: string;
  isPopular?: boolean;
}

/**
 * 奖励信息
 */
export interface Reward {
  type: 'daily' | 'signin' | 'referral' | 'promotion';
  amount: number;
  description: string;
  expiresAt?: string;
  conditions?: string[];
}
