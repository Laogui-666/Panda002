'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';

export default function ERPCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ name: '', phone: '' });

  const fetchCustomers = async (page = 1) => {
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
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

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
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
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
    </div>
  );
}
