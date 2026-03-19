'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Pause,
  Play,
  Users,
  FileText,
  X,
  Check
} from 'lucide-react';
import { authApi } from '@/lib/erp/api-client';

// 公司类型
interface Tenant {
  id: number;
  tenant_name: string;
  tenant_key: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  subscription_plan: string;
  max_users: number;
  status: 'active' | 'inactive' | 'suspended';
  userCount: number;
  orderCount: number;
  created_at: string;
}


export default function CompaniesPage() {
  const [user, setUser] = useState<any>(null);
  const [companies, setCompanies] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_key: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    subscription_plan: 'basic',
    max_users: 10,
  });

  // 初始化用户
  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // 检查是否是超级管理员
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // 获取公司列表
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.append('keyword', searchKeyword);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await fetch(`/api/admin/tenants?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setCompanies(result.data.list);
      }
    } catch (error) {
      console.error('获取公司列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, statusFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingCompany) {
        // 更新公司
        response = await fetch(`/api/admin/tenants/${editingCompany.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // 创建公司
        response = await fetch('/api/admin/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const result = await response.json();
      
      if (result.success) {
        alert(editingCompany ? '公司信息已更新' : '公司创建成功');
        setShowModal(false);
        setEditingCompany(null);
        resetForm();
        fetchCompanies();
      } else {
        alert(result.message || '操作失败');
      }

    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive' | 'suspended') => {
    if (!confirm(`确定要${newStatus === 'active' ? '启用' : newStatus === 'suspended' ? '暂停' : '停用'}该公司吗？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tenants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(result.message);
        fetchCompanies();
      } else {
        alert(result.message || '操作失败');
      }

    } catch (error) {
      console.error('状态更新失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该公司吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tenants/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        alert('公司已删除');
        fetchCompanies();
      } else {
        alert(result.message || '删除失败');
      }

    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  const openEditModal = (company: Tenant) => {
    setEditingCompany(company);
    setFormData({
      tenant_name: company.tenant_name,
      tenant_key: company.tenant_key,
      contact_person: company.contact_person || '',
      contact_phone: company.contact_phone || '',
      contact_email: company.contact_email || '',
      subscription_plan: company.subscription_plan,
      max_users: company.max_users,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      tenant_name: '',
      tenant_key: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      subscription_plan: 'basic',
      max_users: 10,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: '正常', class: 'bg-green-100 text-green-700' },
      inactive: { label: '已停用', class: 'bg-gray-100 text-gray-700' },
      suspended: { label: '已暂停', class: 'bg-yellow-100 text-yellow-700' },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.inactive;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>{config.label}</span>;
  };

  const getPlanBadge = (plan: string) => {
    const planMap = {
      basic: { label: '基础版', class: 'bg-blue-100 text-blue-700' },
      pro: { label: '专业版', class: 'bg-purple-100 text-purple-700' },
      enterprise: { label: '企业版', class: 'bg-orange-100 text-orange-700' },
    };
    const config = planMap[plan as keyof typeof planMap] || planMap.basic;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>{config.label}</span>;
  };

  // 非超级管理员不显示页面
  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">您没有权限访问此页面</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">公司管理</h1>
          <p className="text-slate-500 mt-1">管理系统中所有公司账号</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditingCompany(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          新建公司
        </button>
      </div>


      {/* 搜索和筛选 */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索公司名称、标识..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="suspended">已暂停</option>
          <option value="inactive">已停用</option>
        </select>
      </div>


      {/* 公司列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Building2 className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">暂无公司数据</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">公司名称</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">标识</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">联系人</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">套餐</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">用户/订单</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">状态</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {companies.map((company) => (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {company.tenant_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{company.tenant_name}</p>
                        <p className="text-xs text-slate-500">{company.contact_email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <code className="px-2 py-1 bg-slate-100 rounded text-sm text-slate-600">
                      {company.tenant_key}
                    </code>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {company.contact_person || '-'}
                  </td>

                  <td className="px-6 py-4">
                    {getPlanBadge(company.subscription_plan)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-slate-600">
<Users className="w-4 h-4" />
                        {company.userCount}
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <FileText className="w-4 h-4" />
                        {company.orderCount}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(company.status)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(company)}
                        className="p-2 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {company.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(company.id, 'suspended')}
                          className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="暂停"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : company.status === 'suspended' ? (
                        <button
                          onClick={() => handleStatusChange(company.id, 'active')}
                          className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="启用"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleDelete(company.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {/* 新建/编辑公司弹窗 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingCompany ? '编辑公司' : '新建公司'}
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>


              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    公司名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tenant_name}
                    onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="请输入公司名称"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    公司标识 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCompany}
                    value={formData.tenant_key}
                    onChange={(e) => setFormData({ ...formData, tenant_key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    placeholder="只能包含字母、数字、下划线"
                  />
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      联系人
                    </label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="联系人姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      联系电话
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="联系电话"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    联系邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="联系邮箱"
                  />
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      套餐类型
                    </label>
                    <select
                      value={formData.subscription_plan}
                      onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="basic">基础版</option>
                      <option value="pro">专业版</option>
                      <option value="enterprise">企业版</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      最大用户数
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_users}
                      onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) || 10 })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>


                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingCompany ? '保存修改' : '创建公司'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
