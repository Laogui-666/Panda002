'use client';

import { ReactNode, useEffect } from 'react';
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
  Menu,
  Bell,
  ChevronLeft,
  ChevronRight,
  Building2,
  MessageSquare
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/lib/erp/store';

/**
 * 菜单权限说明：
 * - super_admin: 平台超级管理员（可管理所有公司）
 * - company_admin: 公司负责人（本公司所有功能）
 * - dept_admin: 业务部管理员（部门管理+本部门数据）
 * - operator: 业务部门操作员（部门业务操作）
 * - external: 外包业务员（授权范围内功能）
 * - user: 普通用户
 * 
 * 部门划分（根据工作流）：
 * - 客服部：客服录单、客户管理
 * - 签证部：资料对接部（资料收集）、操作部（审核、制作）
 * - 综合部：财务、人事
 */

// 菜单配置（根据工作流划分）
const menuItems = [
  // 公共
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, href: '/admin/dashboard', roles: ['super_admin', 'company_admin', 'dept_admin', 'operator', 'external', 'user'], dept: 'all' },
  
  // 客服部
  { id: 'customers', label: '客户管理', icon: Users, href: '/admin/customers', roles: ['super_admin', 'company_admin', 'dept_admin'], dept: 'customer' },
  { id: 'orders', label: '订单管理', icon: FileText, href: '/admin/orders', roles: ['super_admin', 'company_admin', 'dept_admin', 'operator', 'external'], dept: 'visa' },
  
  // 签证部-资料对接部
  { id: 'documents', label: '资料中心', icon: Building2, href: '/admin/documents', roles: ['super_admin', 'company_admin', 'dept_admin', 'operator', 'external'], dept: 'visa_docs' },
  
  // 签证部-操作部
  { id: 'visa_process', label: '签证进度', icon: Calendar, href: '/admin/visa-process', roles: ['super_admin', 'company_admin', 'dept_admin', 'operator'], dept: 'visa_ops' },
  
  // 预约中心（共用）
  { id: 'appointments', label: '预约中心', icon: Calendar, href: '/admin/appointments', roles: ['super_admin', 'company_admin', 'dept_admin', 'operator'], dept: 'all' },
  
  // 消息中心（共用）
  { id: 'messages', label: '消息中心', icon: MessageSquare, href: '/admin/messages', roles: ['super_admin', 'company_admin', 'dept_admin', 'operator', 'external', 'user'], dept: 'all' },
  
  // 部门管理（公司负责人）
  { id: 'departments', label: '部门管理', icon: Building2, href: '/admin/departments', roles: ['super_admin', 'company_admin'], dept: 'admin' },
  
  // 用户管理（公司负责人）
  { id: 'users', label: '子账号管理', icon: Users, href: '/admin/users', roles: ['super_admin', 'company_admin', 'dept_admin'], dept: 'admin' },
  
  // 公司管理（超级管理员）
  { id: 'companies', label: '公司管理', icon: Building2, href: '/admin/companies', roles: ['super_admin'], dept: 'platform' },
  
  // 系统设置
  { id: 'settings', label: '系统设置', icon: Settings, href: '/admin/settings', roles: ['super_admin', 'company_admin'], dept: 'admin' },
];

// 根据角色和部门过滤菜单
const getFilteredMenuItems = (roleType?: string, departmentKey?: string) => {
  if (!roleType) return menuItems.filter(item => item.roles.includes('user'));
  
  return menuItems.filter(item => {
    // 检查角色权限
    if (!item.roles.includes(roleType)) return false;
    return true;
  });
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, role, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  // 获取用户角色类型
  const userRoleType = (user as any)?.role_type || role?.role_key || 'user';
  
  // 根据角色获取过滤后的菜单
  const filteredMenuItems = getFilteredMenuItems(userRoleType);

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  // 如果未登录，不渲染内容
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

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
                <span className="text-white font-semibold">盼达旅行</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
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
              {user?.real_name?.charAt(0) || 'A'}
            </div>
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-white text-sm font-medium truncate">{user?.real_name}</p>
                  <p className="text-slate-400 text-xs truncate">{role?.role_name}</p>
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
                <p className="text-sm font-medium text-slate-700">{user?.real_name}</p>
                <p className="text-xs text-slate-500">{role?.role_name}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.real_name?.charAt(0) || 'A'}
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
