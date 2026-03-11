/**
 * 账号认证自定义 Hook
 * 
 * 功能：管理用户认证的逻辑和状态
 * 状态：待开发
 */

import { useState, useCallback } from 'react';
import { AuthApi } from '@/api/authApi';
import type { User, LoginRequest, RegisterRequest, ApiResponse } from '@/types/user';

interface UseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthActions {
  login: (data: LoginRequest) => Promise<ApiResponse<{ user: User; token: string } | null>>;
  register: (data: RegisterRequest) => Promise<ApiResponse<{ user: User; token: string } | null>>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ApiResponse<User | null>>;
  updateProfile: (data: Partial<User>) => Promise<ApiResponse<User | null>>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<ApiResponse<boolean>>;
  sendVerificationCode: (phone: string) => Promise<ApiResponse<boolean>>;
  verifyCode: (phone: string, code: string) => Promise<ApiResponse<boolean>>;
  clearError: () => void;
}

export type UseAuth = UseAuthState & UseAuthActions;

export function useAuth(): UseAuth {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.login(data);
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // 保存token到localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.register(data);
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // 保存token到localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '注册失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      // 清除token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      console.error('登出失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取用户信息失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.updateProfile(data);
      if (response.success && response.data) {
        setUser(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '更新用户信息失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.changePassword(oldPassword, newPassword);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '修改密码失败';
      setError(message);
      return { success: false, message, data: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendVerificationCode = useCallback(async (phone: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.sendVerificationCode(phone);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '发送验证码失败';
      setError(message);
      return { success: false, message, data: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (phone: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.verifyCode(phone, code);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '验证失败';
      setError(message);
      return { success: false, message, data: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    sendVerificationCode,
    verifyCode,
    clearError,
  };
}
