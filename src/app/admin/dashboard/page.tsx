'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/erp/store';
import { ORDER_STATUS_MAP } from '@/lib/erp/types';

// 统计数据卡片组件
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, color, trend, trendUp }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp className={`w-4 h-4 ${!trendUp ? 'rotate-180' : ''}`} />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// 订单状态卡片
interface OrderStatusCardProps {
  status: string;
  count: number;
  color: string;
}

function OrderStatusCard({ status, count, color }: OrderStatusCardProps) {
  const statusInfo = ORDER_STATUS_MAP[status as keyof typeof ORDER_STATUS_MAP] || { label: status, color: 'gray' };
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full bg-${statusInfo.color}-500`}></div>
        <span className="text-slate-600">{statusInfo.label}</span>
      </div>
      <span className="text-2xl font-bold text-slate-800">{count}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user, role } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    todayAppointments: 0,
    pendingDocuments: 0,
  });
  const [orderStats, setOrderStats] = useState<{ status: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载数据
    const loadData = async () => {
      setLoading(true);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟数据
      setStats({
        totalOrders: 156,
        pendingOrders: 23,
        processingOrders: 45,
        completedOrders: 88,
        todayAppointments: 5,
        pendingDocuments: 12,
      });
      
      setOrderStats([
        { status: 'pending', count: 23 },
        { status: 'connected', count: 15 },
        { status: 'collecting', count: 18 },
        { status: 'to_review', count: 12 },
        { status: 'reviewing', count: 8 },
        { status: 'processing', count: 25 },
        { status: 'to_deliver', count: 10 },
        { status: 'delivered', count: 35 },
        { status: 'approved', count: 8 },
        { status: 'rejected', count: 2 },
      ]);
      
      setLoading(false);
    };

    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 欢迎区域 */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">欢迎回来，{user?.real_name || '管理员'}！</h2>
        <p className="text-cyan-100">今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          当前角色: {role?.role_name}
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总订单数"
          value={loading ? '-' : stats.totalOrders}
          icon={FileText}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="较上周 +12%"
          trendUp={true}
        />
        <StatCard
          title="待处理订单"
          value={loading ? '-' : stats.pendingOrders}
          icon={Clock}
          color="bg-gradient-to-br from-yellow-500 to-orange-500"
        />
        <StatCard
          title="处理中订单"
          value={loading ? '-' : stats.processingOrders}
          icon={AlertCircle}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="已完成订单"
          value={loading ? '-' : stats.completedOrders}
          icon={CheckCircle}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend="较上周 +8%"
          trendUp={true}
        />
      </div>

      {/* 次要统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="今日预约"
          value={loading ? '-' : stats.todayAppointments}
          icon={Calendar}
          color="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
        <StatCard
          title="待审核资料"
          value={loading ? '-' : stats.pendingDocuments}
          icon={FileText}
          color="bg-gradient-to-br from-pink-500 to-pink-600"
        />
        <StatCard
          title="活跃用户"
          value="12"
          icon={Users}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
      </div>

      {/* 订单状态分布 */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">订单状态分布</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {orderStats.map((item) => (
            <OrderStatusCard
              key={item.status}
              status={item.status}
              count={loading ? 0 : item.count}
              color={ORDER_STATUS_MAP[item.status as keyof typeof ORDER_STATUS_MAP]?.color || 'gray'}
            />
          ))}
        </div>
      </motion.div>

      {/* 最近操作日志 */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">最近操作</h3>
        <div className="space-y-4">
          {[
            { action: '创建新订单', user: '张经理', time: '5分钟前', type: 'create' },
            { action: '审核通过资料', user: '李操作员', time: '15分钟前', type: 'approve' },
            { action: '更新订单状态', user: '王业务员', time: '30分钟前', type: 'update' },
            { action: '添加预约', user: '赵资料员', time: '1小时前', type: 'appointment' },
            { action: '分配订单', user: '张经理', time: '2小时前', type: 'assign' },
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'create' ? 'bg-green-500' :
                  log.type === 'approve' ? 'bg-blue-500' :
                  log.type === 'update' ? 'bg-yellow-500' :
                  log.type === 'appointment' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}></div>
                <span className="text-slate-700">{log.action}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>{log.user}</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
