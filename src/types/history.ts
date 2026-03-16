/**
 * 历史记录类型定义
 */

import { BaseEntity, ApiResponse } from './common';

export type { ApiResponse };

/**
 * 记录类型
 */
export type RecordType = 'itinerary' | 'assessment' | 'letter' | 'visa_application';

/**
 * 历史记录
 */
export interface HistoryRecord extends BaseEntity {
  userId: string;
  type: RecordType;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'archived' | 'deleted';
  
  // 关联数据
  relatedId?: string;
  relatedData?: Record<string, unknown>;
  
  // 元数据
  metadata?: {
    country?: string;
    visaType?: string;
    duration?: number;
    cost?: number;
    tags?: string[];
  };
  
  // 统计数据
  stats?: {
    viewCount?: number;
    downloadCount?: number;
    shareCount?: number;
  };
  
  // 时间信息
  completedAt?: string;
  expiresAt?: string;
  archivedAt?: string;
}

/**
 * 历史记录查询参数
 */
export interface HistoryQuery {
  type?: RecordType;
  status?: HistoryRecord['status'];
  country?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 导出格式
 */
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

/**
 * 导出请求
 */
export interface ExportRequest {
  ids: string[];
  format: ExportFormat;
  includeAttachments?: boolean;
  options?: {
    dateRange?: {
      start: string;
      end: string;
    };
    fields?: string[];
  };
}
