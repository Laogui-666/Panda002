'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle, XCircle, AlertCircle, 
  Upload, Eye, Calendar, ChevronRight, X, RefreshCw,
  Phone, Mail, MessageSquare, Check, Loader2
} from 'lucide-react';
import { authApi } from '@/lib/erp/api-client';

// 订单状态配置
const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  PENDING_CONNECTION: { label: '待对接', color: 'text-slate-600', bgColor: 'bg-slate-100', icon: Clock },
  CONNECTED: { label: '已对接', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
  COLLECTING_DOCS: { label: '资料收集中', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Upload },
  PENDING_REVIEW: { label: '待审核', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: AlertCircle },
  UNDER_REVIEW: { label: '审核中', color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: Eye },
  MAKING_MATERIALS: { label: '材料制作中', color: 'text-cyan-600', bgColor: 'bg-cyan-100', icon: FileText },
  PENDING_DELIVERY: { label: '待交付', color: 'text-teal-600', bgColor: 'bg-teal-100', icon: CheckCircle },
  DELIVERED: { label: '已交付', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  APPROVED: { label: '已出签', color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: CheckCircle },
  REJECTED: { label: '已拒签', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
};

interface Order {
  id: number;
  orderNo: string;
  visaCountry: string;
  visaType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  appointment?: {
    id: number;
    appointmentDate: string;
    location: string;
    status: string;
  };
  customer?: {
    name: string;
    phone: string;
    email?: string;
  };
  documentCount?: number;
  unreadMessages?: number;
}

interface OrderDetail extends Order {
  documents: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    uploadedAt: string;
    url?: string;
  }>;
  timeline: Array<{
    id: number;
    status: string;
    comment?: string;
    createdAt: string;
    operator?: string;
  }>;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null);

  // 加载客户订单列表
  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch('/api/erp/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data || []);
      }
    } catch (error) {
      console.error('加载订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 加载订单详情
  const loadOrderDetail = async (orderId: number) => {
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch(`/api/erp/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      
      if (result.success) {
        setSelectedOrder(result.data);
        setShowDetail(true);
      }
    } catch (error) {
      console.error('加载订单详情失败:', error);
    }
  };

  // 上传资料
  const handleUpload = async (orderId: number, file: File, docType: string) => {
    setUploadingDoc(orderId);
    try {
      const token = localStorage.getItem('erp_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', String(orderId));
      formData.append('type', docType);

      const response = await fetch('/api/erp/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await response.json();
      
      if (result.success) {
        alert('上传成功！');
        loadOrderDetail(orderId);
      } else {
        alert(result.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    } finally {
      setUploadingDoc(null);
    }
  };

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    return ORDER_STATUS_CONFIG[status] || { 
      label: status, 
      color: 'text-slate-600', 
      bgColor: 'bg-slate-100', 
      icon: Clock 
    };
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

  // 格式化日期时间
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">我的订单</h1>
            <p className="text-sm text-slate-500">查看签证申请进度，上传所需资料</p>
          </div>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      {/* 订单列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">暂无订单</h3>
          <p className="text-slate-400">您还没有提交签证申请</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => loadOrderDetail(order.id)}
              >
                {/* 订单头部 */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{getCountryFlag(order.visaCountry)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{order.visaCountry} - {order.visaType}</h3>
                      <p className="text-sm text-slate-400">订单号: {order.orderNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* 订单信息 */}
                <div className="px-4 pb-4 grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">申请时间</p>
                    <p className="text-sm font-medium text-slate-700">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">资料状态</p>
                    <p className="text-sm font-medium text-slate-700">
                      {order.documentCount !== undefined ? `${order.documentCount} 份资料` : '待上传'}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">预约信息</p>
                    <p className="text-sm font-medium text-slate-700">
                      {order.appointment ? formatDate(order.appointment.appointmentDate) : '待预约'}
                    </p>
                  </div>
                </div>

                {/* 操作提示 */}
                {order.status === 'COLLECTING_DOCS' && (
                  <div className="px-4 pb-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
                      <Upload className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-orange-700">请尽快上传签证所需资料</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 订单详情弹窗 */}
      <AnimatePresence>
        {showDetail && selectedOrder && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDetail(false)}
            />
            
            {/* 弹窗 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-4 md:inset-10 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className="flex items-center gap-3 text-white">
                  <FileText className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-semibold">{selectedOrder.visaCountry} - {selectedOrder.visaType}</h2>
                    <p className="text-sm text-white/70">订单号: {selectedOrder.orderNo}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 内容 */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 左侧：订单信息 */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* 状态卡片 */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-500">当前状态</span>
                        {(() => {
                          const config = getStatusConfig(selectedOrder.status);
                          const Icon = config.icon;
                          return (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color} flex items-center gap-1`}>
                              <Icon className="w-4 h-4" />
                              {config.label}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-slate-600">
                        {getStatusDescription(selectedOrder.status)}
                      </p>
                    </div>

                    {/* 预约信息 */}
                    {selectedOrder.appointment && (
                      <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-cyan-500" />
                          预约信息
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs text-slate-400 mb-1">预约日期</p>
                            <p className="text-sm font-medium text-slate-700">
                              {formatDate(selectedOrder.appointment.appointmentDate)}
                            </p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs text-slate-400 mb-1">预约地点</p>
                            <p className="text-sm font-medium text-slate-700">
                              {selectedOrder.appointment.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 资料清单 */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-cyan-500" />
                        资料清单
                      </h3>
                      {selectedOrder.documents && selectedOrder.documents.length > 0 ? (
                        <div className="space-y-2">
                          {selectedOrder.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${
                                  doc.status === 'APPROVED' ? 'bg-green-500' :
                                  doc.status === 'REJECTED' ? 'bg-red-500' :
                                  'bg-yellow-500'
                                }`} />
                                <span className="text-sm text-slate-700">{doc.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  doc.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                  doc.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                  'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {doc.status === 'APPROVED' ? '已通过' : doc.status === 'REJECTED' ? '已打回' : '待审核'}
                                </span>
                                {doc.url && (
                                  <a 
                                    href={doc.url} 
                                    target="_blank" 
                                    className="p-1 text-slate-400 hover:text-cyan-600"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <Upload className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p>暂无上传资料</p>
                          {selectedOrder.status === 'COLLECTING_DOCS' && (
                            <p className="text-sm text-orange-500 mt-1">请尽快上传所需资料</p>
                          )}
                        </div>
                      )}
                      
                      {/* 上传按钮 */}
                      {selectedOrder.status === 'COLLECTING_DOCS' && (
                        <div className="mt-4">
                          <label className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-lg cursor-pointer hover:bg-cyan-600 transition-colors">
                            {uploadingDoc === selectedOrder.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5" />
                            )}
                            <span>{uploadingDoc === selectedOrder.id ? '上传中...' : '上传资料'}</span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUpload(selectedOrder.id, file, 'PASSPORT');
                                }
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* 进度时间线 */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-cyan-500" />
                        办理进度
                      </h3>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                        <div className="space-y-4">
                          {selectedOrder.timeline && selectedOrder.timeline.map((item, index) => (
                            <div key={item.id} className="relative flex items-start gap-4 pl-10">
                              <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                                index === 0 ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-slate-300'
                              }`} />
                              <div className="flex-1 bg-slate-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm font-medium ${
                                    index === 0 ? 'text-cyan-600' : 'text-slate-600'
                                  }`}>
                                    {getStatusConfig(item.status).label}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {formatDateTime(item.createdAt)}
                                  </span>
                                </div>
                                {item.comment && (
                                  <p className="text-sm text-slate-500">{item.comment}</p>
                                )}
                                {item.operator && (
                                  <p className="text-xs text-slate-400 mt-1">操作员: {item.operator}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 右侧：联系信息 */}
                  <div className="space-y-4">
                    {/* 联系方式 */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <h3 className="font-semibold text-slate-800 mb-3">联系方式</h3>
                      <div className="space-y-3">
                        {selectedOrder.customer?.phone && (
                          <a 
                            href={`tel:${selectedOrder.customer.phone}`}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Phone className="w-5 h-5 text-cyan-500" />
                            <span className="text-sm text-slate-700">{selectedOrder.customer.phone}</span>
                          </a>
                        )}
                        {selectedOrder.customer?.email && (
                          <a 
                            href={`mailto:${selectedOrder.customer.email}`}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Mail className="w-5 h-5 text-cyan-500" />
                            <span className="text-sm text-slate-700">{selectedOrder.customer.email}</span>
                          </a>
                        )}
                        <button className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors w-full">
                          <MessageSquare className="w-5 h-5 text-cyan-500" />
                          <span className="text-sm text-slate-700">在线咨询</span>
                        </button>
                      </div>
                    </div>

                    {/* 帮助信息 */}
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-4 text-white">
                      <h3 className="font-semibold mb-2">需要帮助？</h3>
                      <p className="text-sm text-white/80 mb-3">
                        如有疑问，请随时联系我们的客服团队
                      </p>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          400-888-8888
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          service@muhai.com
                        </p>
                      </div>
                    </div>

                    {/* 温馨提示 */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <h4 className="font-medium text-amber-800 mb-2">温馨提示</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• 请确保上传的资料清晰可辨</li>
                        <li>• 资料文件大小不超过10MB</li>
                        <li>• 支持PDF、JPG、PNG格式</li>
                        <li>• 如有疑问请及时联系客服</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// 获取国家旗帜emoji
function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    '美国': '🇺🇸', '英国': '🇬🇧', '加拿大': '🇨🇦', '澳大利亚': '🇦🇺',
    '日本': '🇯🇵', '韩国': '🇰🇷', '法国': '🇫🇷', '德国': '🇩🇪',
    '意大利': '🇮🇹', '西班牙': '🇪🇸', '瑞士': '🇨🇭', '荷兰': '🇳🇱',
    '比利时': '🇧🇪', '瑞典': '🇸🇪', '挪威': '🇳🇴', '丹麦': '🇩🇰',
    '芬兰': '🇫🇮', '新西兰': '🇳🇿', '新加坡': '🇸🇬', '泰国': '🇹🇭',
    '马来西亚': '🇲🇾', '菲律宾': '🇵🇭', '越南': '🇻🇳', '印度': '🇮🇳',
    '阿联酋': '🇦🇪', '迪拜': '🇦🇪', '希腊': '🇬🇷', '葡萄牙': '🇵🇹',
    '奥地利': '🇦🇹', '捷克': '🇨🇿', '匈牙利': '🇭🇺', '波兰': '🇵🇱',
  };
  return flags[country] || '🌍';
}

// 获取状态描述
function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    PENDING_CONNECTION: '您的订单已提交，正在等待客服对接...',
    CONNECTED: '客服已接手您的订单，正在准备资料清单',
    COLLECTING_DOCS: '请根据要求上传签证所需资料',
    PENDING_REVIEW: '资料已提交，等待审核',
    UNDER_REVIEW: '签证材料正在审核中，请耐心等待',
    MAKING_MATERIALS: '签证材料正在制作中',
    PENDING_DELIVERY: '签证材料已就绪，等待交付',
    DELIVERED: '签证材料已交付完成',
    APPROVED: '恭喜！您的签证已获批准！',
    REJECTED: '很遗憾，您的签证申请未通过',
  };
  return descriptions[status] || '处理中...';
}
