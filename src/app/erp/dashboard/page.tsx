'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { request } from '@/lib/erp/api-client';

// 状态标签映射
const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_CONNECTION: { label: '待对接', color: 'text-gray-600', bg: 'bg-gray-100' },
  CONNECTED: { label: '已对接', color: 'text-blue-600', bg: 'bg-blue-100' },
  COLLECTING_DOCS: { label: '资料收集中', color: 'text-cyan-600', bg: 'bg-cyan-100' },
  PENDING_REVIEW: { label: '待审核', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  UNDER_REVIEW: { label: '资料审核中', color: 'text-orange-600', bg: 'bg-orange-100' },
  MAKING_MATERIALS: { label: '材料制作中', color: 'text-purple-600', bg: 'bg-purple-100' },
  PENDING_DELIVERY: { label: '待交付', color: 'text-pink-600', bg: 'bg-pink-100' },
  DELIVERED: { label: '已交付', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  APPROVED: { label: '出签', color: 'text-green-600', bg: 'bg-green-100' },
  REJECTED: { label: '拒签', color: 'text-red-600', bg: 'bg-red-100' },
};

// 卡片组件
function StatCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default function ERPDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 模拟数据（如果API返回失败）
  const displayStats = stats || {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    statusCounts: {},
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">仪表盘</h1>
          <p className="text-slate-500 mt-1">欢迎使用沐海旅行ERP系统</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          刷新数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总订单"
          value={displayStats.totalOrders}
          icon={FileText}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="待处理"
          value={displayStats.pendingOrders}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="处理中"
          value={displayStats.processingOrders}
          icon={AlertCircle}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="已完成"
          value={displayStats.completedOrders}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* 客户数和收入 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">客户总数</p>
              <p className="text-3xl font-bold text-slate-800">{displayStats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <Link
            href="/erp/customers"
            className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700"
          >
            查看全部客户 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">总收入</p>
              <p className="text-3xl font-bold text-slate-800">
                ¥{displayStats.totalRevenue?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <Link
            href="/erp/orders"
            className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700"
          >
            查看全部订单 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 订单状态分布 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">订单状态分布</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(STATUS_LABELS).map(([key, config]) => {
            const count = displayStats.statusCounts?.[key] || 0;
            return (
              <div
                key={key}
                className={`px-4 py-2 rounded-lg ${config.bg} ${config.color} text-sm font-medium`}
              >
                {config.label}: {count}
              </div>
            );
          })}
        </div>
      </div>

      {/* 最近订单 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">最近订单</h2>
          <Link
            href="/erp/orders"
            className="text-sm text-cyan-600 hover:text-cyan-700"
          >
            查看全部
          </Link>
        </div>
        
        {displayStats.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                  <th className="pb-3 font-medium">订单号</th>
                  <th className="pb-3 font-medium">客户</th>
                  <th className="pb-3 font-medium">签证国家</th>
                  <th className="pb-3 font-medium">状态</th>
                  <th className="pb-3 font-medium">创建时间</th>
                </tr>
              </thead>
              <tbody>
                {displayStats.recentOrders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 text-sm font-medium text-slate-800">{order.orderNo}</td>
                    <td className="py-3 text-sm text-slate-600">{order.customer?.name}</td>
                    <td className="py-3 text-sm text-slate-600">{order.visaCountry}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        STATUS_LABELS[order.status]?.bg || 'bg-gray-100'
                      } ${STATUS_LABELS[order.status]?.color || 'text-gray-600'}`}>
                        {STATUS_LABELS[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            暂无订单数据
          </div>
        )}
      </div>
    </div>
  );
}
