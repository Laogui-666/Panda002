/**
 * 签证评估自定义 Hook
 * 
 * 功能：管理签证评估的逻辑和状态
 * 状态：待开发
 */

import { useState, useCallback } from 'react';
import { VisaAssessmentApi } from '@/api/visaAssessmentApi';
import type { VisaAssessment, VisaAssessmentRequest, ApiResponse } from '@/types/visa';

interface UseVisaAssessmentState {
  assessments: VisaAssessment[];
  currentAssessment: VisaAssessment | null;
  isLoading: boolean;
  error: string | null;
}

interface UseVisaAssessmentActions {
  assessVisa: (data: VisaAssessmentRequest) => Promise<ApiResponse<VisaAssessment | null>>;
  getAssessment: (id: string) => Promise<ApiResponse<VisaAssessment | null>>;
  getAssessmentHistory: () => Promise<ApiResponse<VisaAssessment[] | null>>;
  getSupportedCountries: () => Promise<ApiResponse<string[] | null>>;
  setCurrentAssessment: (assessment: VisaAssessment | null) => void;
  clearError: () => void;
}

export type UseVisaAssessment = UseVisaAssessmentState & UseVisaAssessmentActions;

export function useVisaAssessment(): UseVisaAssessment {
  const [assessments, setAssessments] = useState<VisaAssessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<VisaAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assessVisa = useCallback(async (data: VisaAssessmentRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VisaAssessmentApi.assessVisa(data);
      if (response.success && response.data) {
        setAssessments(prev => [response.data!, ...prev]);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '签证评估失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAssessment = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VisaAssessmentApi.getAssessment(id);
      if (response.success && response.data) {
        setCurrentAssessment(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取评估结果失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAssessmentHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VisaAssessmentApi.getAssessmentHistory();
      if (response.success && response.data) {
        setAssessments(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取评估历史失败';
      setError(message);
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSupportedCountries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await VisaAssessmentApi.getSupportedCountries();
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取支持国家失败';
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
    assessments,
    currentAssessment,
    isLoading,
    error,
    assessVisa,
    getAssessment,
    getAssessmentHistory,
    getSupportedCountries,
    setCurrentAssessment,
    clearError,
  };
}
