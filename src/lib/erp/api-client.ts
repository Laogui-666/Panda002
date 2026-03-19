/**
 * ERP API客户端
 * 
 * 用于前端调用ERP后端接口
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/erp';

// 获取Token
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('erp_token');
}

// 通用请求方法
export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API请求失败:', error);
    return { success: false, message: '网络错误' };
  }
}

// ============ 认证API ============

export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
    
  logout: () => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
  },
    
  getCurrentUser: () => {
    const userStr = localStorage.getItem('erp_user');
    return userStr ? JSON.parse(userStr) : null;
  },
    
  setAuth: (token: string, user: any) => {
    localStorage.setItem('erp_token', token);
    localStorage.setItem('erp_user', JSON.stringify(user));
  },
};

// ============ 订单API ============

export interface Order {
  id: number;
  orderNo: string;
  visaCountry: string;
  visaType: string;
  status: string;
  statusLabel?: string;
  statusColor?: string;
  customer: any;
  company: any;
  cs?: any;
  dc?: any;
  op?: any;
  department?: any;
  totalFee?: number;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  companyId?: number;
  customerName?: string;
  orderNo?: string;
  visaCountry?: string;
}

export const orderApi = {
  list: (params: OrderListParams = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    return request<{ list: Order[]; pagination: any }>(`/orders?${query}`);
  },
    
  get: (id: number) => request<Order>(`/orders/${id}`),
    
  create: (data: any) =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),
    
  update: (id: number, data: any) =>
    request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
  delete: (id: number) =>
    request(`/orders/${id}`, { method: 'DELETE' }),
    
  transition: (id: number, status: string, remark?: string) =>
    request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'transition', status, remark }),
    }),
};

// ============ 客户API ============

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  passportNo?: string;
  idCardNo?: string;
  gender?: string;
  birthDate?: string;
  nationality?: string;
  address?: string;
  companyId: number;
  userId?: number;
  createdAt: string;
}

export const customerApi = {
  list: (params: { page?: number; pageSize?: number; name?: string; phone?: string; companyId?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    return request<{ list: Customer[]; pagination: any }>(`/customers?${query}`);
  },
    
  get: (id: number) => request<Customer>(`/customers/${id}`),
    
  create: (data: any) =>
    request('/customers', { method: 'POST', body: JSON.stringify(data) }),
    
  update: (id: number, data: any) =>
    request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    
  delete: (id: number) =>
    request(`/customers/${id}`, { method: 'DELETE' }),
};

// ============ 公司API ============

export const companyApi = {
  list: (params: { page?: number; pageSize?: number; name?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    return request<{ list: any[]; pagination: any }>(`/companies?${query}`);
  },
    
  create: (data: any) =>
    request('/companies', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ 用户API ============

export interface User {
  id: number;
  username: string;
  email?: string;
  name: string;
  phone?: string;
  role: string;
  roleLabel?: string;
  companyId?: number;
  departmentId?: number;
  status: string;
  createdAt: string;
}

export const userApi = {
  list: (params: { page?: number; pageSize?: number; role?: string; companyId?: number; departmentId?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
    return request<{ list: User[]; pagination: any }>(`/users?${query}`);
  },
    
  create: (data: any) =>
    request('/users', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ 资料API ============

export interface Document {
  id: number;
  name: string;
  description?: string;
  isRequired: boolean;
  status: string;
  statusLabel?: string;
  fileUrl?: string;
  uploadedAt?: string;
  reviewedAt?: string;
  reviewedBy?: number;
  rejectReason?: string;
  orderId: number;
  createdAt: string;
}

export interface VisaMaterial {
  id: number;
  name: string;
  type: string;
  fileUrl?: string;
  status: string;
  rejectReason?: string;
  reviewedAt?: string;
  orderId: number;
  createdBy?: number;
  createdAt: string;
}

export const documentApi = {
  // 获取资料列表
  list: (orderId: number, type: 'requirement' | 'material') =>
    request<{ list: Document[] | VisaMaterial[] }>(`/documents?orderId=${orderId}&type=${type}`),
  
  // 创建资料清单
  create: (data: {
    orderId: number;
    name: string;
    description?: string;
    isRequired?: boolean;
  }) =>
    request('/documents', { method: 'POST', body: JSON.stringify(data) }),
  
  // 更新资料状态
  update: (data: {
    id: number;
    type: 'requirement' | 'material';
    status?: string;
    rejectReason?: string;
  }) =>
    request('/documents', { method: 'PUT', body: JSON.stringify(data) }),
  
  // 上传文件
  upload: async (file: File, orderId: number, options: {
    type?: 'requirement' | 'material';
    requirementId?: number;
    name?: string;
    description?: string;
    materialType?: string;
  } = {}) => {
    const token = getToken();
    if (!token) {
      return { success: false, message: '未登录' };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', String(orderId));
    
    if (options.type) formData.append('type', options.type);
    if (options.requirementId) formData.append('requirementId', String(options.requirementId));
    if (options.name) formData.append('name', options.name);
    if (options.description) formData.append('description', options.description);
    if (options.materialType) formData.append('materialType', options.materialType);

    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('文件上传失败:', error);
      return { success: false, message: '文件上传失败' };
    }
  },
};

// ============ 通用ERP API ============

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export const erpApi = {
  get: async <T = any>(endpoint: string): Promise<T> => {
    const result = await request<T>(endpoint);
    if (!result.success) {
      throw new Error(result.message || '请求失败');
    }
    return (result.data ?? result) as T;
  },
  
  post: async <T = any>(endpoint: string, data: any): Promise<T> => {
    const result = await request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!result.success) {
      throw new Error(result.message || '请求失败');
    }
    return (result.data ?? result) as T;
  },
  
  put: async <T = any>(endpoint: string, data: any): Promise<T> => {
    const result = await request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!result.success) {
      throw new Error(result.message || '请求失败');
    }
    return (result.data ?? result) as T;
  },
  
  delete: async <T = any>(endpoint: string): Promise<T> => {
    const result = await request<T>(endpoint, {
      method: 'DELETE',
    });
    if (!result.success) {
      throw new Error(result.message || '请求失败');
    }
    return (result.data ?? result) as T;
  },
};

// ============ 仪表盘统计API ============

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export const dashboardApi = {
  stats: () => request<DashboardStats>('/dashboard/stats'),
};
