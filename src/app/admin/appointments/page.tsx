'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Appointment {
  id: number;
  order_no: string;
  customer_name: string;
  appointment_date: string;
  appointment_time?: string;
  location: string;
  contact_person?: string;
  contact_phone?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  remark?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetail, setShowDetail] = useState<Appointment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // 模拟数据
    const mockAppts: Appointment[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      order_no: `VD20260316${(i + 1).toString().padStart(4, '0')}`,
      customer_name: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
      appointment_date: new Date(Date.now() + (i - 3) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      appointment_time: ['09:00', '10:00', '11:00', '14:00', '15:00'][i % 5],
      location: ['北京市朝阳区签证中心', '上海市浦东新区签证中心', '广州市天河区签证中心'][i % 3],
      contact_person: '签证专员',
      contact_phone: '400-888-8888',
      status: i < 3 ? 'scheduled' : i < 8 ? 'completed' : 'cancelled',
      remark: i % 2 === 0 ? '请提前准备好护照和资料' : undefined,
    }));
    setAppointments(mockAppts);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const config = {
      scheduled: { label: '已预约', color: 'blue', icon: Clock },
      completed: { label: '已完成', color: 'green', icon: CheckCircle },
      cancelled: { label: '已取消', color: 'red', icon: XCircle },
    };
    const { label, color } = config[status as keyof typeof config] || config.scheduled;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700`}>
        {label}
      </span>
    );
  };

  const filteredAppts = appointments.filter(appt => {
    if (statusFilter && appt.status !== statusFilter) return false;
    if (searchKeyword && !appt.order_no.includes(searchKeyword) && !appt.customer_name.includes(searchKeyword)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索订单号、客户姓名..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="">全部状态</option>
            <option value="scheduled">已预约</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg flex items-center gap-2 text-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4" />
            新建预约
          </button>
        </div>
      </div>

      {/* 预约卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredAppts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            暂无预约数据
          </div>
        ) : (
          filteredAppts.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-sm text-slate-500">{appt.order_no}</p>
                  <h3 className="text-lg font-semibold text-slate-800 mt-1">{appt.customer_name}</h3>
                </div>
                {getStatusBadge(appt.status)}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{appt.appointment_date}</span>
                  {appt.appointment_time && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span>{appt.appointment_time}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{appt.location}</span>
                </div>
                {appt.contact_phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{appt.contact_phone}</span>
                  </div>
                )}
              </div>

              {appt.remark && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                  {appt.remark}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setShowDetail(appt)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                  <Edit className="w-4 h-4" />
                </button>
                {appt.status === 'scheduled' && (
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 text-green-500">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 新建预约弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-md m-4"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-6">新建预约</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">订单号</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="请输入订单号" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">预约日期</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">预约时间</label>
                <input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">预约地点</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="请输入预约地点" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">备注</label>
                <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={3} placeholder="可选备注"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                  确认预约
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
