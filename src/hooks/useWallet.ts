/**
 * 旅行币钱包自定义 Hook
 * 
 * 功能：管理旅行币钱包的逻辑和状态
 * 状态：待开发
 */

import { useState, useCallback } from 'react';
import { WalletApi } from '@/api/walletApi';
import type { Wallet, Transaction, ApiResponse } from '@/types/wallet';

interface UseWalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

interface UseWalletActions {
  getWallet: () => Promise<ApiResponse<Wallet | null>>;
  getTransactions: () => Promise<ApiResponse<Transaction[] | null>>;
  recharge: (amount: number) => Promise<ApiResponse<Wallet | null>>;
  consume: (amount: number, description: string) => Promise<ApiResponse<Wallet | null>>;
  claimDailyReward: () => Promise<ApiResponse<Wallet | null>>;
  clearError: () => void;
}

export type UseWallet = UseWalletState & UseWalletActions;

export function useWallet(): UseWallet {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await WalletApi.getWallet();
      if (response.success && response.data) {
        setWallet(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取钱包信息失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await WalletApi.getTransactions();
      if (response.success && response.data) {
        setTransactions(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取交易记录失败';
      setError(message);
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recharge = useCallback(async (amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await WalletApi.recharge(amount);
      if (response.success && response.data) {
        setWallet(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '充值失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const consume = useCallback(async (amount: number, description: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await WalletApi.consume(amount, description);
      if (response.success && response.data) {
        setWallet(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '消费失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const claimDailyReward = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await WalletApi.claimDailyReward();
      if (response.success && response.data) {
        setWallet(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '领取奖励失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    wallet,
    transactions,
    isLoading,
    error,
    getWallet,
    getTransactions,
    recharge,
    consume,
    claimDailyReward,
    clearError,
  };
}
