/**
 * 行程规划类型定义
 */

import { BaseEntity, ApiResponse } from './common';

export type { ApiResponse };

/**
 * 行程目的地
 */
export interface Destination {
  name: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  accommodation?: Accommodation;
}

/**
 * 住宿信息
 */
export interface Accommodation {
  name: string;
  address: string;
  checkInDate: string;
  checkOutDate: string;
  confirmationNumber?: string;
}

/**
 * 行程活动
 */
export interface Activity {
  id: string;
  name: string;
  description?: string;
  location: string;
  date: string;
  time?: string;
  duration?: number; // 分钟
  cost?: number;
  currency?: string;
  bookingReference?: string;
  notes?: string;
}

/**
 * 航班信息
 */
export interface Flight {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    dateTime: string;
    terminal?: string;
  };
  arrival: {
    airport: string;
    city: string;
    dateTime: string;
    terminal?: string;
  };
  confirmationNumber?: string;
  seat?: string;
  class?: 'economy' | 'premium_economy' | 'business' | 'first';
}

/**
 * 行程规划
 */
export interface Itinerary extends BaseEntity {
  title: string;
  description?: string;
  destinations: Destination[];
  activities: Activity[];
  flights: Flight[];
  totalBudget?: number;
  currency?: string;
  status: 'draft' | 'planning' | 'confirmed' | 'completed' | 'cancelled';
  isPublic: boolean;
  tags?: string[];
  coverImage?: string;
}

/**
 * 创建行程请求
 */
export interface ItineraryRequest {
  title: string;
  description?: string;
  destinations?: Destination[];
  activities?: Activity[];
  flights?: Flight[];
  totalBudget?: number;
  currency?: string;
  isPublic?: boolean;
  tags?: string[];
  coverImage?: string;
}

/**
 * 行程响应
 */
export interface ItineraryResponse {
  itinerary: Itinerary;
  suggestions?: string[];
  warnings?: string[];
}
