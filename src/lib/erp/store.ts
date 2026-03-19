/**
 * ERP 状态管理 Store
 * 
 * 管理登录状态、用户信息、权限等
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ERPUser, UserRole } from './types';

interface AuthState {
  isAuthenticated: boolean;
  user: ERPUser | null;
  role: UserRole | null;
  token: string | null;
  lastLoginAt: string | null;
}

interface AuthActions {
  login: (user: ERPUser, role: UserRole, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<ERPUser>) => void;
  checkPermission: (permission: string) => boolean;
}

type AuthStore = AuthState & AuthActions;

// 基于角色的权限配置
const rolePermissions: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['all'],
  COMPANY_OWNER: ['all'],
  CS_ADMIN: ['orders:read', 'orders:write', 'orders:delete', 'customers:read', 'customers:write', 'appointments:read', 'appointments:write'],
  CUSTOMER_SERVICE: ['orders:read', 'orders:write', 'customers:read', 'appointments:read', 'appointments:write'],
  VISA_ADMIN: ['orders:read', 'orders:write', 'documents:read', 'documents:write', 'documents:review'],
  DOC_COLLECTOR: ['orders:read', 'documents:read', 'documents:write'],
  OPERATOR: ['orders:read', 'orders:write', 'documents:read'],
  OUTSOURCE: ['orders:read'],
  CUSTOMER: ['orders:read', 'appointments:read'],
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      role: null,
      token: null,
      lastLoginAt: null,

      login: (user, role, token) => {
        set({
          isAuthenticated: true,
          user,
          role,
          token,
          lastLoginAt: new Date().toISOString(),
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          role: null,
          token: null,
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      checkPermission: (permission) => {
        const { role } = get();
        if (!role) return false;
        // 获取角色权限
        const permissions = rolePermissions[role] || [];
        // 检查是否有all权限
        if (permissions.includes('all')) return true;
        // 检查具体权限
        return permissions.includes(permission);
      },
    }),
    {
      name: 'erp-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        role: state.role,
        token: state.token,
        lastLoginAt: state.lastLoginAt,
      }),
    }
  )
);

// ============ 订单状态管理 ============

interface OrderState {
  orders: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  filters: {
    status?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
  };
}

interface OrderActions {
  setOrders: (orders: any[], total: number) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: Partial<OrderState['filters']>) => void;
  resetFilters: () => void;
}

type OrderStore = OrderState & OrderActions;

export const useOrderStore = create<OrderStore>()((set) => ({
  orders: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {},

  setOrders: (orders, total) => set({ orders, total }),
  setPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  setLoading: (loading) => set({ loading }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters },
    currentPage: 1 
  })),
  resetFilters: () => set({ filters: {}, currentPage: 1 }),
}));

// ============ UI状态管理 ============

interface UIState {
  sidebarCollapsed: boolean;
  currentModule: string;
  notifications: number;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentModule: (module: string) => void;
  setNotifications: (count: number) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()((set) => ({
  sidebarCollapsed: false,
  currentModule: 'dashboard',
  notifications: 0,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentModule: (module) => set({ currentModule: module }),
  setNotifications: (count) => set({ notifications: count }),
}));


