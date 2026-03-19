'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  User,
  X,
  Check,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// 预约类型
interface Appointment {
  id: number;
  appointmentDate: string;
  appointmentTime?: string;
  location?: string;
  contactPerson?: string;
  contactPhone?: string;
  status: string;
  statusLabel: string;
  remark?: string;
  documentPath?: string;
  orderId: number;
  order: {
    id: number;
    orderNo: string;
    visaCountry: string;
    visaType: string;
    customer: {
      id: number;
      name: string;
      phone: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// 订单类型
interface Order {
  id: number;
  orderNo: string;
  visaCountry: string;
  visaType: string;
  customer: {
    name: string;
    phone: string;
  };
}

export default function ERPAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  
  // 筛选条件
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });

  // 弹窗状态
  const [showModal, setShowModal] = useState(false);
  const [currentApt, setCurrentApt] = useState<Appointment | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState({
    orderId: undefined as number | undefined,
    appointmentDate: '',
    appointmentTime: '',
    location: '',
    contactPerson: '',
    contactPhone: '',
    remark: ''
  });

  // 获取预约列表
  const fetchAppointments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/erp/appointments?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setAppointments(result.data.list || []);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('获取预约失败:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.startDate, filters.endDate]);

  useEffect(() => {
    fetchAppointments(pagination.page);
  }, [fetchAppointments, pagination.page]);

  // 获取可选订单列表
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/orders?pageSize=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data.list || []);
      }
    } catch (error) {
      console.error('获取订单失败:', error);
    }
  };

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchAppointments(1);
  };

  // 分页
  const handlePageChange = (newPage: number) => {
    fetchAppointments(newPage);
  };

  // 打开新增弹窗
  const openCreateModal = () => {
    setCurrentApt(null);
    setFormData({
      orderId: undefined,
      appointmentDate: '',
      appointmentTime: '',
      location: '',
      contactPerson: '',
      contactPhone: '',
      remark: ''
    });
    fetchOrders();
    setShowModal(true);
  };

  // 打开编辑弹窗
  const openEditModal = (apt: Appointment) => {
    setCurrentApt(apt);
    setFormData({
      orderId: apt.orderId,
      appointmentDate: apt.appointmentDate.split('T')[0],
      appointmentTime: apt.appointmentTime || '',
      location: apt.location || '',
      contactPerson: apt.contactPerson || '',
      contactPhone: apt.contactPhone || '',
      remark: apt.remark || ''
    });
    fetchOrders();
    setShowModal(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('erp_token');
      const url = '/api/erp/appointments';
      const method = currentApt ? 'PUT' : 'POST';

      const body: any = { ...formData };
      if (currentApt) {
        body.id = currentApt.id;
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
        fetchAppointments(pagination.page);
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('操作失败');
    }
  };

  // 更新预约状态
  const updateStatus = async (apt: Appointment, newStatus: string) => {
    if (!confirm(`确定要将预约状态改为"${newStatus === 'COMPLETED' ? '已完成' : '已取消'}"吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: apt.id, status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        fetchAppointments(pagination.page);
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('操作失败');
    }
  };

  // 删除预约
  const handleDelete = async (apt: Appointment) => {
    if (!confirm(`确定要删除此预约吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch(`/api/erp/appointments?id=${apt.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        fetchAppointments(pagination.page);
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">预约中心</h1>
          <p className="text-slate-500 mt-1">管理签证预约时间安排</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加预约
        </button>
      </div>

      {/* 筛选条件 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-slate-500 mb-1">预约状态</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="">全部</option>
              <option value="SCHEDULED">已预约</option>
              <option value="COMPLETED">已完成</option>
              <option value="CANCELLED">已取消</option>
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm text-slate-500 mb-1">开始日期</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm text-slate-500 mb-1">结束日期</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            搜索
          </button>
          <button
            onClick={() => {
              setFilters({ status: '', startDate: '', endDate: '' });
              fetchAppointments(1);
            }}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            重置
          </button>
        </div>
      </div>

      {/* 预约列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Calendar className="w-12 h-12 mb-3" />
            <p>暂无预约数据</p>
            <button onClick={openCreateModal} className="mt-3 text-cyan-500 hover:text-cyan-600">
              添加第一个预约
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    预约信息
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    订单信息
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    客户信息
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <motion.tr
                    key={apt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {formatDate(apt.appointmentDate)}
                          </div>
                          <div className="text-sm text-slate-400">
                            {apt.appointmentTime || '全天'}
                          </div>
                          {apt.location && (
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                              <MapPin className="w-3 h-3" />
                              {apt.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {apt.order.orderNo}
                      </div>
                      <div className="text-sm text-slate-400">
                        {apt.order.visaCountry} - {apt.order.visaType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        {apt.order.customer.name}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                        <Phone className="w-3 h-3" />
                        {apt.order.customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                        {apt.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {apt.status === 'SCHEDULED' && (
                          <>
                            <button
                              onClick={() => updateStatus(apt, 'COMPLETED')}
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded"
                              title="标记完成"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(apt, 'CANCELLED')}
                              className="p-1.5 text-gray-500 hover:bg-gray-50 rounded"
                              title="取消预约"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(apt)}
                              className="p-1.5 text-cyan-500 hover:bg-cyan-50 rounded"
                              title="编辑"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {apt.status === 'SCHEDULED' && (
                          <button
                            onClick={() => handleDelete(apt)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            title="删除"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            共 {pagination.total} 条记录，第 {pagination.page}/{pagination.totalPages} 页
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    pagination.page === pageNum
                      ? 'bg-cyan-500 text-white'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                  {currentApt ? '编辑预约' : '添加预约'}
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
                {/* 订单选择 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    选择订单 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.orderId || ''}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value ? Number(e.target.value) : undefined })}
                    disabled={!!currentApt}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 disabled:bg-slate-50"
                  >
                    <option value="">请选择订单</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.orderNo} - {order.visaCountry} {order.visaType} ({order.customer.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 预约日期 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    预约日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 预约时间 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    预约时间
                  </label>
                  <input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 地点 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    地点
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="请输入预约地点"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 联系人 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    联系人
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="请输入联系人姓名"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 联系电话 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="请输入联系电话"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* 备注 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    备注
                  </label>
                  <textarea
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    placeholder="请输入备注"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500 resize-none"
                  />
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
                  disabled={!formData.orderId || !formData.appointmentDate}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentApt ? '保存' : '创建'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
