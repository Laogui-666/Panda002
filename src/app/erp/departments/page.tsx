'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Building2,
  Edit,
  Trash2,
  X,
  Check,
  Users,
  ChevronLeft,
} from 'lucide-react';

// 部门类型
interface Department {
  id: number;
  name: string;
  code?: string;
  description?: string;
  parentId?: number;
  parentName?: string;
  leaderId?: number;
  leaderName?: string;
  status: string;
  companyId: number;
  companyName?: string;
  userCount: number;
  children?: Department[];
}

// 公司类型
interface Company {
  id: number;
  name: string;
}

export default function ERPDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [showTreeView, setShowTreeView] = useState(true);
  
  // 弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentDept, setCurrentDept] = useState<Department | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    parentId: undefined as number | undefined,
    leaderId: undefined as number | undefined,
    companyId: undefined as number | undefined,
    status: 'active'
  });

  // 获取用户信息
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 获取部门列表
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const params = new URLSearchParams();
      if (currentUser?.role === 'COMPANY_OWNER') {
        params.append('companyId', String(currentUser.companyId));
      }
      params.append('includeTree', 'true');

      const response = await fetch(`/api/erp/departments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setDepartments(result.data || []);
      }
    } catch (error) {
      console.error('获取部门失败:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, currentUser?.companyId]);

  // 获取公司列表
  const fetchCompanies = useCallback(async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/companies', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setCompanies(result.data || []);
      }
    } catch (error) {
      console.error('获取公司失败:', error);
    }
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('erp_user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchCompanies();
  }, [fetchDepartments, fetchCompanies]);

  // 切换展开状态
  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // 渲染树形结构
  const renderTree = (depts: Department[], level = 0): React.ReactNode => {
    return depts.map((dept) => {
      const hasChildren = dept.children && dept.children.length > 0;
      const isExpanded = expandedIds.has(dept.id);

      return (
        <div key={dept.id}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 py-3 px-4 hover:bg-slate-50 border-b border-slate-100 cursor-pointer ${
              level > 0 ? 'ml-' + (level * 4) : ''
            }`}
            style={{ paddingLeft: `${level * 20 + 16}px` }}
            onClick={() => hasChildren && toggleExpand(dept.id)}
          >
            {/* 展开/折叠图标 */}
            <div className="w-6 h-6 flex items-center justify-center">
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )
              ) : (
                <span className="w-4" />
              )}
            </div>

            {/* 部门图标 */}
            <Building2 className="w-5 h-5 text-cyan-500" />

            {/* 部门名称 */}
            <span className="flex-1 font-medium text-slate-700">{dept.name}</span>

            {/* 部门编码 */}
            {dept.code && (
              <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                {dept.code}
              </span>
            )}

            {/* 负责人 */}
            {dept.leaderName && (
              <span className="text-sm text-slate-500">
                负责人: {dept.leaderName}
              </span>
            )}

            {/* 员工数量 */}
            <span className="flex items-center gap-1 text-sm text-slate-400">
              <Users className="w-3 h-3" />
              {dept.userCount}
            </span>

            {/* 状态 */}
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                dept.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {dept.status === 'active' ? '启用' : '禁用'}
            </span>

            {/* 操作按钮 */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => openEditModal(dept)}
                className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(dept)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* 子部门 */}
          <AnimatePresence>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {renderTree(dept.children!, level + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  // 打开新增弹窗
  const openCreateModal = () => {
    setModalMode('create');
    setCurrentDept(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      parentId: undefined,
      leaderId: undefined,
      companyId: currentUser?.role === 'COMPANY_OWNER' ? currentUser.companyId : undefined,
      status: 'active'
    });
    setShowModal(true);
  };

  // 打开编辑弹窗
  const openEditModal = (dept: Department) => {
    setModalMode('edit');
    setCurrentDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code || '',
      description: dept.description || '',
      parentId: dept.parentId,
      leaderId: dept.leaderId,
      companyId: dept.companyId,
      status: dept.status
    });
    setShowModal(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const url = '/api/erp/departments';
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const body: any = { ...formData };
      if (modalMode === 'edit' && currentDept) {
        body.id = currentDept.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        fetchDepartments();
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('操作失败');
    }
  };

  // 删除部门
  const handleDelete = async (dept: Department) => {
    if (!confirm(`确定要删除部门"${dept.name}"吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch(`/api/erp/departments?id=${dept.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        fetchDepartments();
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">部门管理</h1>
          <p className="text-slate-500 mt-1">管理公司部门组织架构</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTreeView(!showTreeView)}
            className={`px-3 py-2 text-sm rounded-lg border ${
              showTreeView
                ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            {showTreeView ? '树形视图' : '列表视图'}
          </button>
          <button
            onClick={fetchDepartments}
            className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加部门
          </button>
        </div>
      </div>

      {/* 部门列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Building2 className="w-12 h-12 mb-3" />
            <p>暂无部门数据</p>
            <button
              onClick={openCreateModal}
              className="mt-3 text-cyan-500 hover:text-cyan-600"
            >
              添加第一个部门
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {renderTree(departments)}
          </div>
        )}
      </div>

      {/* 新增/编辑弹窗 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">
                  {modalMode === 'create' ? '添加部门' : '编辑部门'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 弹窗内容 */}
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* 公司选择 */}
                {currentUser?.role === 'SUPER_ADMIN' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      所属公司 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.companyId || ''}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">请选择公司</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 部门名称 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    部门名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入部门名称"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 部门编码 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    部门编码
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="如: CS (客服部), VISA (签证部)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 父部门选择 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    上级部门
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">无（顶级部门）</option>
                    {departments
                      .filter(d => d.id !== currentDept?.id)
                      .map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入部门描述"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* 状态 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    状态
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="text-cyan-500"
                      />
                      <span className="text-sm text-slate-600">启用</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === 'inactive'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="text-cyan-500"
                      />
                      <span className="text-sm text-slate-600">禁用</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 弹窗底部 */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalMode === 'create' ? '创建' : '保存'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
