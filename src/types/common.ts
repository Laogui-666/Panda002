/**
 * 通用 API 响应类型
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 基础实体
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
