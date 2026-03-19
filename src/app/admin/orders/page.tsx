'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { ORDER_STATUS_MAP, OrderStatus } from '@/lib/erp/types';

interface Order {
  id: number;
  order_no: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  visa_country: string;
  visa_type: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

const statusOptions = [
  { value: '', label: '全部状态' },
  ...Object.entries(ORDER_STATUS_MAP).map(([key, value]) => ({
    value: key,
    label: value.label
  }))
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [showDetail, setShowDetail] = useState<Order | null>(null);

  // 模拟加载订单数据
  const loadOrders = useCallback(async () => {
    setLoading(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      order_no: `VD20260316${(i + 1).toString().padStart(4, '0')}`,
      customer_name: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'][i % 8],
      customer_phone: `138${Math.random().toString().slice(2, 11)}`,
      customer_email: `user${i + 1}@example.com`,
      visa_country: ['法国', '德国', '意大利', '西班牙', '瑞士'][i % 5],
      visa_type: ['旅游签证', '商务签证', '学生签证', '探亲签证'][i % 4],
      status: Object.keys(ORDER_STATUS_MAP)[i % 10] as OrderStatus,
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
    }));
    
    let filtered = mockOrders;
    if (statusFilter) {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    if (searchKeyword) {
      filtered = filtered.filter(o => 
        o.order_no.includes(searchKeyword) || 
        o.customer_name.includes(searchKeyword) ||
        o.customer_phone.includes(searchKeyword)
      );
    }
    
    setOrders(filtered);
    setTotal(filtered.length);
    setLoading(false);
  }, [statusFilter, searchKeyword]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadOrders();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          {/* 搜索框 */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索订单号、客户姓名、电话..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* 状态筛选 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg flex items-center gap-2 text-sm hover:shadow-md transition-shadow">
              <Plus className="w-4 h-4" />
              新建订单
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-50">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">订单号</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">客户姓名</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">联系电话</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">签证国家</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">签证类型</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">创建时间</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    加载中...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusInfo = ORDER_STATUS_MAP[order.status];
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-700">{order.order_no}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{order.customer_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{order.visa_country}</td>
                      <td className="px-6 py-4 text-slate-700">{order.visa_type}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {new Date(order.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowDetail(order)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-cyan-600"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            共 {total} 条记录，第 {currentPage}/{totalPages} 页
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-cyan-500 text-white'
                    : 'border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 订单详情弹窗 */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetail(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-lg m-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">订单详情</h3>
              <button
                onClick={() => setShowDetail(null)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <span className="text-2xl text-slate-400">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">订单号</label>
                  <p className="font-mono text-slate-800">{showDetail.order_no}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">状态</label>
                  <p className={`font-medium ${
                    ORDER_STATUS_MAP[showDetail.status].color === 'green' ? 'text-green-600' :
                    ORDER_STATUS_MAP[showDetail.status].color === 'red' ? 'text-red-600' :
                    'text-slate-800'
                  }`}>
                    {ORDER_STATUS_MAP[showDetail.status].label}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">客户姓名</label>
                  <p className="text-slate-800">{showDetail.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">联系电话</label>
                  <p className="text-slate-800">{showDetail.customer_phone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">签证国家</label>
                  <p className="text-slate-800">{showDetail.visa_country}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">签证类型</label>
                  <p className="text-slate-800">{showDetail.visa_type}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-slate-500">创建时间</label>
                <p className="text-slate-800">{new Date(showDetail.created_at).toLocaleString('zh-CN')}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDetail(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                编辑订单
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
