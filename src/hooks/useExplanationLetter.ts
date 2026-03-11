/**
 * 解释信编写自定义 Hook
 * 
 * 功能：管理解释信编写的逻辑和状态
 * 状态：待开发
 */

import { useState, useCallback } from 'react';
import { ExplanationLetterApi } from '@/api/explanationLetterApi';
import type { ExplanationLetter, ExplanationLetterRequest, ApiResponse } from '@/types/explanationLetter';

interface UseExplanationLetterState {
  letters: ExplanationLetter[];
  currentLetter: ExplanationLetter | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
}

interface UseExplanationLetterActions {
  generateLetter: (data: ExplanationLetterRequest) => Promise<ApiResponse<ExplanationLetter | null>>;
  getLetter: (id: string) => Promise<ApiResponse<ExplanationLetter | null>>;
  updateLetter: (id: string, content: string) => Promise<ApiResponse<ExplanationLetter | null>>;
  deleteLetter: (id: string) => Promise<ApiResponse<boolean>>;
  exportToPdf: (id: string) => Promise<ApiResponse<string | null>>;
  getUserLetters: () => Promise<ApiResponse<ExplanationLetter[] | null>>;
  setCurrentLetter: (letter: ExplanationLetter | null) => void;
  clearError: () => void;
}

export type UseExplanationLetter = UseExplanationLetterState & UseExplanationLetterActions;

export function useExplanationLetter(): UseExplanationLetter {
  const [letters, setLetters] = useState<ExplanationLetter[]>([]);
  const [currentLetter, setCurrentLetter] = useState<ExplanationLetter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLetter = useCallback(async (data: ExplanationLetterRequest) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await ExplanationLetterApi.generateLetter(data);
      if (response.success && response.data) {
        setLetters(prev => [response.data!, ...prev]);
        setCurrentLetter(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '生成解释信失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const getLetter = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ExplanationLetterApi.getLetter(id);
      if (response.success && response.data) {
        setCurrentLetter(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取解释信失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLetter = useCallback(async (id: string, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ExplanationLetterApi.updateLetter(id, content);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '更新解释信失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteLetter = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ExplanationLetterApi.deleteLetter(id);
      if (response.success) {
        setLetters(prev => prev.filter(item => item.id !== id));
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除解释信失败';
      setError(message);
      return { success: false, message, data: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportToPdf = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ExplanationLetterApi.exportToPdf(id);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '导出PDF失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserLetters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ExplanationLetterApi.getUserLetters();
      if (response.success && response.data) {
        setLetters(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取解释信列表失败';
      setError(message);
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    letters,
    currentLetter,
    isLoading,
    isGenerating,
    error,
    generateLetter,
    getLetter,
    updateLetter,
    deleteLetter,
    exportToPdf,
    getUserLetters,
    setCurrentLetter,
    clearError,
  };
}
