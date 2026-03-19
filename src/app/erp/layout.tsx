'use client';

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
  Menu,
  Bell,
  ChevronLeft,
  ChevronRight,
  Building2,
  MessageSquare,
  UserCheck,
  Package,
  Send,
  Globe,
} from 'lucide-react';
import { authApi } from '@/lib/erp/api-client';
import NotificationPanel from '@/components/erp/NotificationPanel';

/**
 * ERP系统布局组件
 * 
 * 【工作流权限说明】
 * 
 * 签证业务工作流（10个状态）：
 * 1. 待对接(PENDING_CONNECTION) - 客服录入订单
 * 2. 已对接(CONNECTED) - 资料员接单
 * 3. 资料收集中(COLLECTING_DOCS) - 资料员收集客户资料
 * 4. 待审核(PENDING_REVIEW) - 资料员提交给操作员
 * 5. 资料审核中(UNDER_REVIEW) - 操作员审核资料
 * 6. 材料制作中(MAKING_MATERIALS) - 操作员制作材料
 * 7. 待交付(PENDING_DELIVERY) - 资料员确认交付
 * 8. 已交付(DELIVERED) - 流程完成
 * 9. 出签(APPROVED) - 最终状态
 * 10. 拒签(REJECTED) - 最终状态
 * 
 * 角色权限矩阵（扁平化部门架构）：
 * - SUPER_ADMIN: 全部功能
 * - COMPANY_OWNER: 公司全部数据，直管客服部、签证部、外包业务员
 * - CS_ADMIN: 客服部管理员(查看客服部门数据，管理客服)
 * - CUSTOMER_SERVICE: 客服(录入订单，状态:待对接→已对接)
 * - VISA_ADMIN: 签证部管理员(查看签证部门数据，管理资料员和签证操作员)
 * - DOC_COLLECTOR: 资料员(只能操作自己分配的订单，状态:已对接→资料收集中→待审核)
 * - OPERATOR: 签证操作员(只能操作自己分配的订单，状态:待审核→资料审核中→材料制作中→待交付)
 * - OUTSOURCE: 外包业务员(受限视图，敏感信息脱敏，直属公司负责人)
 * - CUSTOMER: 客户(只能查看自己的订单)
 */

// 菜单权限配置（扁平化部门架构）
const ROLE_MENUS: Record<string, string[]> = {
  SUPER_ADMIN: ['dashboard', 'companies', 'departments', 'users', 'orders', 'customers', 'documents', 'appointments', 'visa-lines', 'visa-countries', 'settings'],
  // 公司负责人：直管客服部、签证部、外包业务员
  COMPANY_OWNER: ['dashboard', 'departments', 'users', 'orders', 'customers', 'documents', 'appointments', 'visa-lines', 'visa-countries', 'settings'],
  // 客服部管理员：可查看客服部门数据，管理客服
  CS_ADMIN: ['dashboard', 'orders', 'customers', 'documents', 'appointments'],
  // 客服：只能录入订单，查看自己录入的订单
  CUSTOMER_SERVICE: ['dashboard', 'orders', 'customers', 'appointments'],
  // 签证部管理员：可查看签证部门数据，管理资料员和操作员
  VISA_ADMIN: ['dashboard', 'orders', 'customers', 'documents', 'appointments', 'visa-lines', 'visa-countries'],
  // 资料员：只能看自己接单的订单，进行资料收集工作
  DOC_COLLECTOR: ['dashboard', 'orders', 'documents', 'appointments'],
  // 签证操作员：只能看自己接单的订单，进行审核和材料制作
  OPERATOR: ['dashboard', 'orders', 'documents', 'appointments'],
  // 外包业务员：受限视图，直属公司负责人
  OUTSOURCE: ['dashboard', 'orders'],
  CUSTOMER: ['my-orders'],
};

// 菜单配置（扁平化部门架构）
const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, href: '/erp/dashboard', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR', 'OUTSOURCE', 'CUSTOMER'] },
  { id: 'companies', label: '公司管理', icon: Building2, href: '/erp/companies', roles: ['SUPER_ADMIN'] },
  { id: 'departments', label: '部门管理', icon: Building2, href: '/erp/departments', roles: ['SUPER_ADMIN', 'COMPANY_OWNER'] },
  // 员工管理：公司负责人、客服部管理员、签证部管理员可访问
  { id: 'users', label: '员工管理', icon: Users, href: '/erp/users', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'VISA_ADMIN'] },
  // 订单管理：所有内部角色都可访问，但看到的数据范围不同
  { id: 'orders', label: '订单管理', icon: FileText, href: '/erp/orders', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR', 'OUTSOURCE'] },
  { id: 'my-orders', label: '我的订单', icon: FileText, href: '/erp/my-orders', roles: ['CUSTOMER'] },
  // 客户管理：客服、资料员需要管理客户信息
  { id: 'customers', label: '客户管理', icon: UserCheck, href: '/erp/customers', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'CUSTOMER_SERVICE', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR'] },
  { id: 'documents', label: '资料中心', icon: Package, href: '/erp/documents', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR'] },
  { id: 'appointments', label: '预约中心', icon: Calendar, href: '/erp/appointments', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'CS_ADMIN', 'VISA_ADMIN', 'DOC_COLLECTOR', 'OPERATOR'] },
  // 签证配置：签证参数线路配置
  { id: 'visa-countries', label: '签证国家', icon: Globe, href: '/erp/visa-countries', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN'] },
  { id: 'visa-lines', label: '签证线路', icon: Globe, href: '/erp/visa-lines', roles: ['SUPER_ADMIN', 'COMPANY_OWNER', 'VISA_ADMIN'] },
  // 系统设置
  { id: 'settings', label: '系统设置', icon: Settings, href: '/erp/settings', roles: ['SUPER_ADMIN', 'COMPANY_OWNER'] },
  { id: 'sms-templates', label: '短信模板', icon: Send, href: '/erp/sms-templates', roles: ['SUPER_ADMIN', 'COMPANY_OWNER'] },
];

// 角色标签（扁平化部门架构）
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

interface ERPLayoutProps {
  children: ReactNode;
}

export default function ERPLayout({ children }: ERPLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取用户信息
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      // 未登录，跳转到主站登录页面
      router.push('/auth/login?redirect=/erp');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    authApi.logout();
    // 退出登录后跳转到主站登录页
    router.push('/auth/login');
  };

  // 获取用户角色的菜单
  const getFilteredMenus = () => {
    if (!user) return [];
    return menuItems.filter(item => item.roles.includes(user.role));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const filteredMenus = getFilteredMenus();

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
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-white font-semibold">沐海ERP</span>
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
          {filteredMenus.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* 用户信息 */}
        <div className="p-4 border-t border-slate-700">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0) || user.username?.charAt(0)}
            </div>
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{ROLE_LABELS[user.role] || user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          )}
        </div>
      </motion.aside>

      {/* 主内容区 */}
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
      >
        {/* 顶部导航 */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-800">
              {menuItems.find(item => item.href === pathname)?.label || 'ERP系统'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* 通知中心 */}
            <NotificationPanel />
            {/* 用户菜单 */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.companyName || '沐海旅行'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0) || user.username?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
