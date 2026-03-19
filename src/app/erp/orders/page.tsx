'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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

// 订单创建Modal
const CreateOrderModal = ({
  isOpen,
  onClose,
  onSubmit,
  customers,
  isLoading
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  customers: any[];
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    customerId: '',
    visaCountry: '',
    visaType: '',
    remarks: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ customerId: '', visaCountry: '', visaType: '', remarks: '' });
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.customerId) {
      toast.error('请选择客户');
      return;
    }
    if (!formData.visaCountry.trim()) {
      toast.error('请输入签证国家');
      return;
    }
    if (!formData.visaType.trim()) {
      toast.error('请输入签证类型');
      return;
    }
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">创建订单</h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  客户 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="">请选择客户</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone || '无手机号'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    签证国家 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.visaCountry}
                    onChange={(e) => setFormData({ ...formData, visaCountry: e.target.value })}
                    placeholder="如：日本、美国"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    签证类型 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    placeholder="如：旅游签、商务签"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  备注
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="请输入备注信息"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? '提交中...' : '创建'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ERPOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ status: '', orderNo: '', customerName: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOrders = useCallback(async (page = 1) => {
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
  }, [filters.status, filters.orderNo, filters.customerName]);

  // 获取客户列表
  const fetchCustomers = useCallback(async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/customers?pageSize=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data.list);
      }
    } catch (error) {
      console.error('获取客户列表失败:', error);
    }
  }, []);

  // 创建订单提交
  const handleCreateOrder = async (data: any) => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('创建成功');
        setShowAddModal(false);
        fetchOrders(1);
      } else {
        toast.error(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      toast.error('创建失败');
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.page);
  }, [fetchOrders, pagination.page]);

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
        <button onClick={() => { setShowAddModal(true); fetchCustomers(); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
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

      {/* 创建订单Modal */}
      <CreateOrderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateOrder}
        customers={customers}
        isLoading={modalLoading}
      />
    </div>
  );
}