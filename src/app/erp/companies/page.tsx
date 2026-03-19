/**
 * 公司管理页面 - 超级管理员专用
 * 
 * 功能：
 * - 查看所有公司列表
 * - 创建新公司
 * - 编辑公司信息
 * - 删除公司
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Search, Edit2, Trash2, X, Check, ChevronLeft, ChevronRight, Users, FileText, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 公司状态映射
const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: '正常' },
  inactive: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '停用' },
};

// 公司编辑弹窗
const CompanyModal = ({
  isOpen,
  onClose,
  onSubmit,
  company,
  isLoading
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  company?: any;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        shortName: company.shortName || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
      });
    } else {
      setFormData({ name: '', shortName: '', phone: '', email: '', address: '' });
    }
  }, [company, isOpen]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('公司名称不能为空');
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
              <h3 className="text-lg font-semibold text-slate-800">
                {company ? '编辑公司' : '新增公司'}
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入公司名称"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  公司简称
                </label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  placeholder="请输入公司简称"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入联系电话"
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
                    placeholder="请输入邮箱"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  地址
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="请输入公司地址"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500focus:border-cyan-500 outline-none transition-colors resize-none"
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
                {isLoading ? '提交中...' : company ? '保存' : '创建'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // 获取公司列表
  const fetchCompanies = useCallback(async (page = 1, keyword = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pagination.pageSize),
      });
      if (keyword) params.set('name', keyword);

      const response = await fetch(`/api/erp/companies?${params}`, {
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        setCompanies(result.data.list);
        setPagination(result.data.pagination);
      } else {
        toast.error(result.message || '获取公司列表失败');
      }
    } catch (error) {
      console.error('获取公司列表失败', error);
      toast.error('获取公司列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  useEffect(() => {
    fetchCompanies(pagination.page, searchKeyword);
  }, [fetchCompanies, pagination.page, searchKeyword]);

  // 搜索
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchCompanies(1, searchKeyword);
  };

  // 打开新建弹窗
  const handleAdd = () => {
    setEditingCompany(null);
    setShowModal(true);
  };

  // 打开编辑弹窗
  const handleEdit = (company: any) => {
    setEditingCompany(company);
    setShowModal(true);
  };

  // 提交表单
  const handleSubmit = async (data: any) => {
    setModalLoading(true);
    try {
      const url = editingCompany ? `/api/erp/companies?id=${editingCompany.id}` : '/api/erp/companies';
      const method = editingCompany ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(editingCompany ? '更新成功' : '创建成功');
        setShowModal(false);
        fetchCompanies(pagination.page, searchKeyword);
      } else {
        toast.error(result.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败', error);
      toast.error('操作失败');
    } finally {
      setModalLoading(false);
    }
  };

  // 分页
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchCompanies(newPage, searchKeyword);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">公司管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理所有入驻公司信息</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增公司
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索公司名称..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 公司列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">公司信息</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">联系方式</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">员工数</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">订单数</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">客户数</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">状态</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    加载中...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                companies.map((company) => {
                  const status = STATUS_COLORS[company.status] || STATUS_COLORS.active;
                  return (
                    <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{company.name}</p>
                            <p className="text-sm text-slate-500">{company.shortName || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          <p>{company.phone || '-'}</p>
                          <p className="text-slate-500">{company.email || '-'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600">
                          <Users className="w-4 h-4" />
                          <span>{company._count?.users || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600">
                          <FileText className="w-4 h-4" />
                          <span>{company._count?.orders || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600">
                          <UserCheck className="w-4 h-4" />
                          <span>{company._count?.customers || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {!loading && companies.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              共 {pagination.total} 条记录，第 {pagination.page}/{pagination.totalPages} 页
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-slate-700">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 新增/编辑弹窗 */}
      <CompanyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        company={editingCompany}
        isLoading={modalLoading}
      />
    </div>
  );
}
