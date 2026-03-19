'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  Phone,
  Mail,
  FileText,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// 客户创建Modal
const CreateCustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    passportNo: '',
    birthDate: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', phone: '', email: '', passportNo: '', birthDate: '' });
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('姓名不能为空');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('手机号不能为空');
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
              <h3 className="text-lg font-semibold text-slate-800">添加客户</h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入客户姓名"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱（可选）"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  护照号
                </label>
                <input
                  type="text"
                  value={formData.passportNo}
                  onChange={(e) => setFormData({ ...formData, passportNo: e.target.value })}
                  placeholder="请输入护照号（可选）"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  出生日期
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
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

export default function ERPCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ name: '', phone: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCustomers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (filters.name) params.append('name', filters.name);
      if (filters.phone) params.append('phone', filters.phone);

      const response = await fetch(`/api/erp/customers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data.list);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('获取客户失败:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.name, filters.phone]);

  // 创建客户提交
  const handleCreateCustomer = async (data: any) => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/customers', {
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
        fetchCustomers(1);
      } else {
        toast.error(result.message || '创建失败');
      }
    } catch (error) {
      console.error('创建客户失败:', error);
      toast.error('创建失败');
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(pagination.page);
  }, [fetchCustomers, pagination.page]);

  const handleSearch = () => {
    fetchCustomers(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchCustomers(newPage);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">客户管理</h1>
          <p className="text-slate-500 mt-1">管理客户信息</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          <Plus className="w-4 h-4" />
          添加客户
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
                placeholder="搜索客户姓名..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜索手机号..."
              value={filters.phone}
              onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            搜索
          </button>
          <button
            onClick={() => fetchCustomers(pagination.page)}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 客户列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin" />
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-sm text-slate-500">
                  <th className="px-6 py-3 font-medium">姓名</th>
                  <th className="px-6 py-3 font-medium">手机号</th>
                  <th className="px-6 py-3 font-medium">邮箱</th>
                  <th className="px-6 py-3 font-medium">护照号</th>
                  <th className="px-6 py-3 font-medium">公司</th>
                  <th className="px-6 py-3 font-medium">订单数</th>
                  <th className="px-6 py-3 font-medium">创建时间</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{customer.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.phone || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.email || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.passportNo || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.company?.name}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {customer.orders?.length || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(customer.createdAt).toLocaleDateString('zh-CN')}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Users className="w-12 h-12 mb-4 text-slate-300" />
            <p>暂无客户数据</p>
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

      {/* 创建客户Modal */}
      <CreateCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateCustomer}
        isLoading={modalLoading}
      />
    </div>
  );
}