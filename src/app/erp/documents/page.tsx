/**
 * 资料中心页面
 * 
 * 功能：
 * - 查看资料清单列表（客户需要上传的资料）
 * - 查看签证材料列表（制作出的材料）
 * - 审核资料状态
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, FileText, Check, X, Eye, Upload, 
  Search, Filter, ChevronLeft, ChevronRight,
  FileCheck, Clock, AlertCircle, Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// 资料状态映射
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: '待上传', color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock },
  PENDING_REVIEW: { label: '待审核', color: 'text-blue-600', bg: 'bg-blue-100', icon: FileText },
  APPROVED: { label: '已合格', color: 'text-green-600', bg: 'bg-green-100', icon: Check },
  REJECTED: { label: '已打回', color: 'text-red-600', bg: 'bg-red-100', icon: X },
};

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'requirement' | 'visa'>('requirement');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 获取资料列表
  const fetchDocuments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pagination.pageSize),
        type: activeTab,
      });
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/erp/documents?${params}`, {
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        setDocuments(result.data.list);
        setPagination(result.data.pagination);
      } else {
        toast.error(result.message || '获取资料列表失败');
      }
    } catch (error) {
      console.error('获取资料列表失败', error);
      toast.error('获取资料列表失败');
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, pagination.pageSize]);

  useEffect(() => {
    fetchDocuments(pagination.page);
  }, [fetchDocuments, pagination.page]);

  // 分页
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchDocuments(newPage);
  };

  // 更新资料状态
  const handleUpdateStatus = async (id: number, status: string, type: string) => {
    try {
      const response = await fetch('/api/erp/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, type, status }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('状态更新成功');
        fetchDocuments(pagination.page);
      } else {
        toast.error(result.message || '更新失败');
      }
    } catch (error) {
      console.error('更新失败', error);
      toast.error('更新失败');
    }
  };

  // 统计各状态数量
  const statusCounts = documents.reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">资料中心</h1>
          <p className="text-sm text-slate-500 mt-1">管理客户上传资料和签证材料</p>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setActiveTab('requirement'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'requirement'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              资料清单
            </div>
          </button>
          <button
            onClick={() => { setActiveTab('visa'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'visa'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              签证材料
            </div>
          </button>
        </div>

        {/* 筛选栏 */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            >
              <option value="">全部状态</option>
              <option value="PENDING">待上传</option>
              <option value="PENDING_REVIEW">待审核</option>
              <option value="APPROVED">已合格</option>
              <option value="REJECTED">已打回</option>
            </select>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索订单号、客户姓名..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 列表内容 */}
        <div className="divide-y divide-slate-200">
          {loading ? (
            <div className="px-6 py-12 text-center text-slate-500">加载中...</div>
          ) : documents.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>暂无资料</p>
            </div>
          ) : (
            documents.map((doc) => {
              const status = STATUS_CONFIG[doc.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;
              
              return (
                <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* 状态图标 */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.bg}`}>
                      <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    </div>

                    {/* 资料信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800 truncate">{doc.name}</h3>
                        {doc.isRequired && (
                          <span className="px-2 py-0.5 text-xs font-medium text-red-600 bg-red-50 rounded">
                            必填
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span>订单: {doc.order?.orderNo || '-'}</span>
                        <span>客户: {doc.order?.customer?.name || '-'}</span>
                        <span>{doc.order?.visaCountry} {doc.order?.visaType}</span>
                      </div>

                      {doc.rejectReason && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          驳回原因: {doc.rejectReason}
                        </div>
                      )}

                      {doc.description && (
                        <p className="mt-1 text-sm text-slate-500 truncate">{doc.description}</p>
                      )}
                    </div>

                    {/* 操作区域 */}
                    <div className="flex items-center gap-2">
                      {/* 状态标签 */}
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-1">
                        {doc.status === 'PENDING' || doc.status === 'PENDING_REVIEW' ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(doc.id, 'APPROVED', activeTab)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="标记合格"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(doc.id, 'REJECTED', activeTab)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="标记打回"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : null}
                        
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="预览"
                          >
                            <Eye className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 分页 */}
        {!loading && documents.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              共 {pagination.total} 条记录
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
    </div>
  );
}
