/**
 * 行程规划自定义 Hook
 * 
 * 功能：管理行程规划的逻辑和状态
 * 状态：待开发
 */

import { useState, useCallback } from 'react';
import { ItineraryApi } from '@/api/itineraryApi';
import type { Itinerary, ItineraryRequest, ApiResponse } from '@/types/itinerary';

interface UseItineraryState {
  itineraries: Itinerary[];
  currentItinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;
}

interface UseItineraryActions {
  createItinerary: (data: ItineraryRequest) => Promise<ApiResponse<Itinerary | null>>;
  getItinerary: (id: string) => Promise<ApiResponse<Itinerary | null>>;
  updateItinerary: (id: string, data: Partial<ItineraryRequest>) => Promise<ApiResponse<Itinerary | null>>;
  deleteItinerary: (id: string) => Promise<ApiResponse<boolean>>;
  getUserItineraries: () => Promise<ApiResponse<Itinerary[] | null>>;
  optimizeItinerary: (id: string) => Promise<ApiResponse<Itinerary | null>>;
  setCurrentItinerary: (itinerary: Itinerary | null) => void;
  clearError: () => void;
}

export type UseItinerary = UseItineraryState & UseItineraryActions;

export function useItinerary(): UseItinerary {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createItinerary = useCallback(async (data: ItineraryRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ItineraryApi.createItinerary(data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '创建行程失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItinerary = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ItineraryApi.getItinerary(id);
      if (response.success && response.data) {
        setCurrentItinerary(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取行程失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItinerary = useCallback(async (id: string, data: Partial<ItineraryRequest>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ItineraryApi.updateItinerary(id, data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '更新行程失败';
      setError(message);
      return { success: false, message, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItinerary = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ItineraryApi.deleteItinerary(id);
      if (response.success) {
        setItineraries(prev => prev.filter(item => item.id !== id));
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除行程失败';
      setError(message);
      return { success: false, message, data: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserItineraries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ItineraryApi.getUserItineraries();
      if (response.success && response.data) {
        setItineraries(response.data);
      }
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取行程列表失败';
      setError(message);
      return { success: false, message, data: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const optimizeItinerary = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ItineraryApi.optimizeItinerary(id);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '优化行程失败';
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
    itineraries,
    currentItinerary,
    isLoading,
    error,
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary,
    getUserItineraries,
    optimizeItinerary,
    setCurrentItinerary,
    clearError,
  };
}
