'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';

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

export default function ERPOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: '', orderNo: '', customerName: '' });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (filters.status) params.append('status', filters.status);
      if (filters.orderNo) params.append('orderNo', filters.orderNo);
      if (filters.customerName) params.append('customerName', filters.customerName);

      const response = await fetch(`/api/erp/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data.list);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('获取订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    fetchOrders(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">订单管理</h1>
          <p className="text-slate-500 mt-1">管理所有签证订单</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          <Plus className="w-4 h-4" />
          创建订单
        </button>
      </div>

      {/* 筛选条件 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索订单号..."
                value={filters.orderNo}
                onChange={(e) => setFilters({ ...filters, orderNo: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索客户姓名..."
              value={filters.customerName}
              onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="">全部状态</option>
            {Object.entries(STATUS_LABELS).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            搜索
          </button>
          <button
            onClick={() => fetchOrders(pagination.page)}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-sm text-slate-500">
                  <th className="px-6 py-3 font-medium">订单号</th>
                  <th className="px-6 py-3 font-medium">客户</th>
                  <th className="px-6 py-3 font-medium">签证国家</th>
                  <th className="px-6 py-3 font-medium">签证类型</th>
                  <th className="px-6 py-3 font-medium">状态</th>
                  <th className="px-6 py-3 font-medium">费用</th>
                  <th className="px-6 py-3 font-medium">创建时间</th>
                  <th className="px-6 py-3 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">{order.orderNo}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {order.customer?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {order.visaCountry}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {order.visaType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        STATUS_LABELS[order.status]?.bg || 'bg-gray-100'
                      } ${STATUS_LABELS[order.status]?.color || 'text-gray-600'}`}>
                        {STATUS_LABELS[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      ¥{order.totalFee || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/erp/orders/${order.id}`}
                          className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Package className="w-12 h-12 mb-4 text-slate-300" />
            <p>暂无订单数据</p>
          </div>
        )}

        {/* 分页 */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              共 {pagination.total} 条记录，第 {pagination.page}/{pagination.totalPages} 页
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
