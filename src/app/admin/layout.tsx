'use client';
// Version: 2026-03-18-v3 - Fixed authentication flow
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  MessageSquare,
  Bell
} from 'lucide-react';
import { authApi } from '@/lib/erp/api-client';

/**
 * 菜单权限说明（扁平化角色体系）：
 * - SUPER_ADMIN: 平台超级管理员（可管理所有公司）
 * - COMPANY_OWNER: 公司负责人（本公司所有功能）
 * - CS_ADMIN: 客服部管理员（客服部门管理）
 * - CUSTOMER_SERVICE: 客服（录单、客服管理）
 * - VISA_ADMIN: 签证部管理员（签证部门管理）
 * - DOC_COLLECTOR: 资料员（资料收集）
 * - OPERATOR: 签证操作员（审核、制作）
 * - OUTSOURCE: 外包业务员（受限权限）
 * - CUSTOMER: 普通用户
 * 
 * 部门划分（扁平化）：
 * - 客服部：CS_ADMIN + CUSTOMER_SERVICE
 * - 签证部：VISA_ADMIN + DOC_COLLECTOR + OPERATOR
 * - 外包(OUTSOURCE)：直属于COMPANY_OWNER
 */

// 角色标签映射
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '超级管理员',
  COMPANY_OWNER: '公司负责人',
  CS_ADMIN: '客服部管理员',
  CUSTOMER_SERVICE: '客服',
  VISA_ADMIN: '签证部管理员',
  DOC_COLLECTOR: '资料员',
  OPERATOR: '签证操作员',
  OUTSOURCE: '外包业务员',
  CUSTOMER: '普通用户',
};

// 菜单配置
const menuItems = [
  // 公共
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, href: '/admin/dashboard', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR', 'OUTSOURCE', 'CUSTOMER'] },
  
  // 客服部
  { id: 'customers', label: '客户管理', icon: Users, href: '/admin/customers', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE'], dept: 'customer' },
  { id: 'orders', label: '订单管理', icon: FileText, href: '/admin/orders', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR', 'OUTSOURCE'], dept: 'visa' },
  
  // 签证部
  { id: 'documents', label: '资料中心', icon: Building2, href: '/admin/documents', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR', 'OUTSOURCE'], dept: 'visa_docs' },
  
  // 签证进度
  { id: 'visa_process', label: '签证进度', icon: Calendar, href: '/admin/visa-process', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN', 'OPERATOR'], dept: 'visa_ops' },
  
  // 预约中心
  { id: 'appointments', label: '预约中心', icon: Calendar, href: '/admin/appointments', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR'], dept: 'all' },
  
  // 消息中心
  { id: 'messages', label: '消息中心', icon: MessageSquare, href: '/admin/messages', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR', 'OUTSOURCE', 'CUSTOMER'], dept: 'all' },
  
  // 部门管理
  { id: 'departments', label: '部门管理', icon: Building2, href: '/admin/departments', roles: ['SUPER_ADMIN', 'COMPANY_OWNER'], dept: 'admin' },
  
  // 用户管理
  { id: 'users', label: '子账号管理', icon: Users, href: '/admin/users', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'VISA_ADMIN'], dept: 'admin' },
  
  // 公司管理
  { id: 'companies', label: '公司管理', icon: Building2, href: '/admin/companies', roles: ['SUPER_ADMIN'], dept: 'platform' },
  
  // 系统设置
  { id: 'settings', label: '系统设置', icon: Settings, href: '/admin/settings', roles: ['SUPER_ADMIN', 'COMPANY_OWNER'], dept: 'admin' },
];

// 根据角色过滤菜单
const getFilteredMenuItems = (userRole?: string) => {
  if (!userRole) return [];
  
  return menuItems.filter(item => {
    if (!item.roles.includes(userRole)) return false;
    return true;
  });
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 检查登录状态
  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login?redirect=/admin');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    authApi.logout();
    router.push('/auth/login');
  };

  const filteredMenuItems = getFilteredMenuItems(user?.role);

  // 加载状态
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 侧边栏 */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 z-50 flex flex-col"
      >
        {/* Logo区域 */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PD</span>
                </div>
                <span className="text-white font-semibold">签证平台</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* 用户信息区域 */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0) || user.real_name?.charAt(0) || 'A'}
            </div>
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-white text-sm font-medium truncate">{user.name || user.real_name || '用户'}</p>
                  <p className="text-slate-400 text-xs truncate">{ROLE_LABELS[user.role] || user.role || '-'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleLogout}
            className={`mt-4 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  退出登录
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* 主内容区 */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
      >
        {/* 顶部 Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-800">
              {menuItems.find(item => pathname.startsWith(item.href))?.label || '仪表盘'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* 通知按钮 */}
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">{user.name || user.real_name || '用户'}</p>
                <p className="text-xs text-slate-500">{ROLE_LABELS[user.role] || user.role || '-'}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0) || user.real_name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
