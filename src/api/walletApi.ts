/**
 * 旅行币 API 服务层
 * 
 * 功能：旅行币钱包系统
 * 状态：待开发
 */

import { BaseApi } from './baseApi';
import type { 
  Wallet, 
  Transaction,
  ApiResponse 
} from '@/types/wallet';

export class WalletApi extends BaseApi {
  /**
   * 获取用户钱包信息
   */
  static async getWallet(): Promise<ApiResponse<Wallet>> {
    // TODO: 实现获取钱包信息API
    console.log('[WalletApi] getWallet - 待开发');
    return {
      success: false,
      message: '该功能正在开发中，敬请期待',
      data: null
    };
  }

  /**
   * 获取交易记录
   */
  static async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    // TODO: 实现获取交易记录API
    console.log('[WalletApi] getTransactions - 待开发');
    return {
      success: false,
      message: '该功能正在开发中，敬请期待',
      data: []
    };
  }

  /**
   * 充值旅行币
   */
  static async recharge(amount: number): Promise<ApiResponse<Wallet>> {
    // TODO: 实现充值API
    console.log('[WalletApi] recharge - 待开发', amount);
    return {
      success: false,
      message: '该功能正在开发中，敬请期待',
      data: null
    };
  }

  /**
   * 消费旅行币
   */
  static async consume(amount: number, description: string): Promise<ApiResponse<Wallet>> {
    // TODO: 实现消费API
    console.log('[WalletApi] consume - 待开发', { amount, description });
    return {
      success: false,
      message: '该功能正在开发中，敬请期待',
      data: null
    };
  }

  /**
   * 领取每日奖励
   */
  static async claimDailyReward(): Promise<ApiResponse<Wallet>> {
    // TODO: 实现每日奖励API
    console.log('[WalletApi] claimDailyReward - 待开发');
    return {
      success: false,
      message: '该功能正在开发中，敬请期待',
      data: null
    };
  }
}
