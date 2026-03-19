/**
 * 订单详情页面 - 核心工作流
 * 
 * 功能：
 * - 订单基本信息展示
 * - 资料收集面板（客户需要上传的资料）
 * - 签证材料面板（制作出的材料）
 * - 订单状态流转
 * - 操作日志时间轴
 * 
 * 工作流：
 * 1. 客服录单 → 待对接
 * 2. 资料员接单 → 已对接
 * 3. 资料员收集资料 → 资料收集中
 * 4. 提交审核 → 待审核
 * 5. 操作员审核 → 资料审核中
 * 6. 制作材料 → 材料制作中
 * 7. 准备交付 → 待交付
 * 8. 交付材料 → 已交付
 * 9. 出签/拒签 → 完成
 */

'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, FileText, Package, Clock, Check, X, Eye, Upload,
  User, Phone, Mail, CreditCard, Calendar, MapPin, MessageSquare,
  ChevronRight, AlertCircle, Send, RefreshCw, Download, Plus,
  CheckCircle, XCircle, Edit, Trash2, FileUp, FileDown, Bell,
  Image, FileSpreadsheet, File
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authApi } from '@/lib/erp/api-client';
import { documentApi } from '@/lib/erp/api-client';
import FilePreviewModal, { getFileType, getFileTypeConfig, getFileName } from '@/components/erp/FilePreviewModal';
import BatchDownload from '@/components/erp/BatchDownload';

// 订单状态配置
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; next: string[] }> = {
  PENDING_CONNECTION: { label: '待对接', color: 'text-yellow-600', bg: 'bg-yellow-100', next: ['CONNECTED'] },
  CONNECTED: { label: '已对接', color: 'text-blue-600', bg: 'bg-blue-100', next: ['COLLECTING_DOCS'] },
  COLLECTING_DOCS: { label: '资料收集中', color: 'text-purple-600', bg: 'bg-purple-100', next: ['PENDING_REVIEW'] },
  PENDING_REVIEW: { label: '待审核', color: 'text-orange-600', bg: 'bg-orange-100', next: ['UNDER_REVIEW'] },
  UNDER_REVIEW: { label: '资料审核中', color: 'text-indigo-600', bg: 'bg-indigo-100', next: ['MAKING_MATERIALS', 'COLLECTING_DOCS'] },
  MAKING_MATERIALS: { label: '材料制作中', color: 'text-cyan-600', bg: 'bg-cyan-100', next: ['PENDING_DELIVERY'] },
  PENDING_DELIVERY: { label: '待交付', color: 'text-teal-600', bg: 'bg-teal-100', next: ['DELIVERED'] },
  DELIVERED: { label: '已交付', color: 'text-green-600', bg: 'bg-green-100', next: ['APPROVED', 'REJECTED'] },
  APPROVED: { label: '出签', color: 'text-emerald-600', bg: 'bg-emerald-100', next: [] },
  REJECTED: { label: '拒签', color: 'text-red-600', bg: 'bg-red-100', next: [] },
};

// 资料状态
const DOC_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: '待上传', color: 'text-gray-600', bg: 'bg-gray-100' },
  PENDING_REVIEW: { label: '待审核', color: 'text-blue-600', bg: 'bg-blue-100' },
  APPROVED: { label: '已合格', color: 'text-green-600', bg: 'bg-green-100' },
  REJECTED: { label: '已打回', color: 'text-red-600', bg: 'bg-red-100' },
};

// 常用资料清单模板
const COMMON_DOCUMENTS = [
  { name: '护照', description: '有效期6个月以上' },
  { name: '照片', description: '白底2寸证件照' },
  { name: '身份证', description: '正反面复印件' },
  { name: '户口本', description: '整本复印件' },
  { name: '在职证明', description: '公司抬头纸加盖公章' },
  { name: '营业执照', description: '副本复印件加盖公章' },
  { name: '银行流水', description: '近6个月流水账单' },
  { name: '行程单', description: '往返机票和酒店预订单' },
  { name: '邀请函', description: '境外邀请方出具' },
  { name: '保险单', description: '境外医疗保险' },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activePanel, setActivePanel] = useState<'documents' | 'materials' | 'logs'>('documents');
  const [actionLoading, setActionLoading] = useState(false);
  
  // 弹窗状态
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocName, setUploadDocName] = useState('');
  
  // 文件预览状态
  const [previewFiles, setPreviewFiles] = useState<Array<{ url: string; name?: string }>>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // 批量下载状态
  const [downloadItems, setDownloadItems] = useState<Array<{ url: string; filename: string }>>([]);
  
  // 获取当前用户
  useEffect(() => {
    const user = authApi.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // 获取订单详情
  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/erp/orders/${id}`, {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setOrder(result.data);
        // 更新批量下载项
        const items: Array<{ url: string; filename: string }> = [];
        result.data.documentRequirements?.forEach((doc: any) => {
          if (doc.fileUrl) {
            items.push({ url: doc.fileUrl, filename: doc.name || getFileName(doc.fileUrl) });
          }
        });
        result.data.visaMaterials?.forEach((mat: any) => {
          if (mat.fileUrl) {
            items.push({ url: mat.fileUrl, filename: mat.name || getFileName(mat.fileUrl) });
          }
        });
        setDownloadItems(items);
      } else {
        toast.error(result.message || '获取订单详情失败');
      }
    } catch (error) {
      console.error('获取订单详情失败', error);
      toast.error('获取订单详情失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  // 接单操作（资料员）
  const handleAcceptOrder = async () => {
    if (!currentUser) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/erp/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'accept',
          dcId: currentUser.id,
          remark: '资料员已接单'
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('接单成功！订单已流转到您的已接单列表');
        fetchOrderDetail();
      } else {
        toast.error(result.message || '接单失败');
      }
    } catch (error) {
      toast.error('接单失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 状态流转
  const handleStatusTransition = async (toStatus: string, remark?: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/erp/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'transition', 
          status: toStatus,
          remark 
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message || '状态更新成功');
        fetchOrderDetail();
      } else {
        toast.error(result.message || '状态更新失败');
      }
    } catch (error) {
      toast.error('状态更新失败');
    } finally {
      setActionLoading(false);
      setShowTransitionModal(false);
    }
  };

  // 添加资料清单
  const handleAddDocument = async (name: string, description: string, isRequired: boolean) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/erp/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          type: 'requirement',
          orderId: parseInt(id),
          name,
          description,
          isRequired
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('资料清单已添加');
        fetchOrderDetail();
        setShowAddDocModal(false);
      } else {
        toast.error(result.message || '添加失败');
      }
    } catch (error) {
      toast.error('添加失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 发送资料清单给客户
  const handleSendToCustomer = async (docId: number) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/erp/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          id: docId, 
          type: 'requirement',
          status: 'PENDING'
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('已发送资料清单给客户');
        fetchOrderDetail();
      } else {
        toast.error(result.message || '发送失败');
      }
    } catch (error) {
      toast.error('发送失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 上传资料文件
  const handleUploadDocument = async () => {
    if (!uploadFile || !uploadDocName) {
      toast.error('请选择文件和输入资料名称');
      return;
    }
    setActionLoading(true);
    try {
      const result = await documentApi.upload(uploadFile, parseInt(id), {
        type: 'requirement',
        requirementId: selectedDoc?.id,
        name: uploadDocName,
        description: selectedDoc?.description,
      });
      if (result.success) {
        toast.success('资料上传成功');
        fetchOrderDetail();
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadDocName('');
        setSelectedDoc(null);
      } else {
        toast.error(result.message || '上传失败');
      }
    } catch (error) {
      toast.error('上传失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 审核资料（合格/打回）
  const handleReviewDocument = async (docId: number, status: string, reason?: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/erp/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          id: docId, 
          type: 'requirement',
          status,
          rejectReason: reason
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(status === 'APPROVED' ? '资料已标记为合格' : '资料已打回');
        fetchOrderDetail();
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedDoc(null);
      } else {
        toast.error(result.message || '操作失败');
      }
    } catch (error) {
      toast.error('操作失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 上传签证材料
  const handleUploadMaterial = async (file: File, name: string, type: string) => {
    setActionLoading(true);
    try {
      const result = await documentApi.upload(file, parseInt(id), {
        type: 'material',
        name,
        materialType: type,
      });
      if (result.success) {
        toast.success('签证材料上传成功');
        fetchOrderDetail();
      } else {
        toast.error(result.message || '上传失败');
      }
    } catch (error) {
      toast.error('上传失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 审核签证材料
  const handleReviewMaterial = async (materialId: number, status: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/erp/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          id: materialId, 
          type: 'visa',
          status
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('签证材料审核完成');
        fetchOrderDetail();
      } else {
        toast.error(result.message || '操作失败');
      }
    } catch (error) {
      toast.error('操作失败');
    } finally {
      setActionLoading(false);
    }
  };

  // 判断当前用户可以执行的操作
  const canAcceptOrder = () => {
    if (!currentUser || !order) return false;
    const isDocCollector = currentUser.role === 'DOC_COLLECTOR' || currentUser.role === 'VISA_ADMIN';
    return isDocCollector && order.status === 'PENDING_CONNECTION' && !order.dcId;
  };

  const canCollectDocs = () => {
    if (!currentUser || !order) return false;
    const isDocCollector = currentUser.role === 'DOC_COLLECTOR' || currentUser.role === 'VISA_ADMIN';
    return isDocCollector && order.status === 'CONNECTED' && order.dcId === currentUser.id;
  };

  const canReviewDocs = () => {
    if (!currentUser || !order) return false;
    const isOperator = currentUser.role === 'OPERATOR' || currentUser.role === 'VISA_ADMIN';
    return isOperator && order.status === 'UNDER_REVIEW' && order.opId === currentUser.id;
  };

  const canMakeMaterials = () => {
    if (!currentUser || !order) return false;
    const isOperator = currentUser.role === 'OPERATOR' || currentUser.role === 'VISA_ADMIN';
    return isOperator && order.status === 'UNDER_REVIEW' && order.opId === currentUser.id;
  };

  const canDeliver = () => {
    if (!currentUser || !order) return false;
    const isDocCollector = currentUser.role === 'DOC_COLLECTOR' || currentUser.role === 'VISA_ADMIN';
    return isDocCollector && order.status === 'PENDING_DELIVERY' && order.dcId === currentUser.id;
  };

  const canFinalize = () => {
    if (!currentUser || !order) return false;
    const canFinalize = ['COMPANY_OWNER', 'VISA_ADMIN', 'OPERATOR'].includes(currentUser.role);
    return canFinalize && order.status === 'DELIVERED';
  };

  // 获取下一步操作提示
  const getNextActionHint = () => {
    if (!order) return '';
    const status = order.status;
    const hints: Record<string, string> = {
      'PENDING_CONNECTION': '资料员可点击"接单"开始处理此订单',
      'CONNECTED': '资料员联系客户后，点击"开始收集资料"',
      'COLLECTING_DOCS': '资料员发送资料清单给客户，等待客户上传资料',
      'PENDING_REVIEW': '等待操作员接单审核',
      'UNDER_REVIEW': '操作员审核资料，合格后制作签证材料',
      'MAKING_MATERIALS': '操作员制作完成后，点击"准备交付"',
      'PENDING_DELIVERY': '资料员确认资料完整后，点击"确认交付"',
      'DELIVERED': '等待出签结果，点击"出签"或"拒签"结束流程',
    };
    return hints[status] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
          <p className="mt-4 text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
<div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <p className="mt-4 text-slate-600">订单不存在</p>
        <button onClick={() => router.back()} className="mt-4 text-cyan-500 hover:underline">
          返回列表
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_CONNECTION;

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">订单详情</h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">订单号: {order.orderNo}</p>
        </div>
        {/* 操作按钮区域 */}
        <div className="flex items-center gap-2">
          {/* 批量下载按钮 */}
          {order.documentRequirements?.some((d: any) => d.fileUrl) || order.visaMaterials?.some((m: any) => m.fileUrl) ? (
            <BatchDownload
              items={downloadItems}
              label="打包下载"
              variant="secondary"
              size="sm"
            />
          ) : null}
          {canAcceptOrder() && (
            <button
              onClick={handleAcceptOrder}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              接单
            </button>
          )}
          {order.status === 'CONNECTED' && order.dcId === currentUser?.id && (
            <button
              onClick={() => handleStatusTransition('COLLECTING_DOCS', '开始收集资料')}
              disabled={actionLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              开始收集资料
            </button>
          )}
          {order.status === 'COLLECTING_DOCS' && (
            <button
              onClick={() => handleStatusTransition('PENDING_REVIEW', '提交审核')}
              disabled={actionLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              提交审核
            </button>
          )}
          {canFinalize() && (
            <>
              <button
                onClick={() => handleStatusTransition('APPROVED', '签证通过')}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                出签
              </button>
              <button
                onClick={() => {
                  setSelectedDoc({ id: 'reject' });
                  setShowRejectModal(true);
                }}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                拒签
              </button>
            </>
          )}
        </div>
      </div>

      {/* 状态提示 */}
      {getNextActionHint() && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 flex items-start gap-3"
        >
          <Bell className="w-5 h-5 text-cyan-600 mt-0.5" />
          <p className="text-cyan-700">{getNextActionHint()}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：客户信息和订单信息 */}
        <div className="space-y-6">
          {/* 客户信息卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-500" />
              客户信息
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{order.customer?.name}</p>
                  <p className="text-sm text-slate-500">{order.customer?.phone || '未填写'}</p>
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {order.customer?.phone || '-'}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {order.customer?.email || '-'}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  {order.customer?.passportNo || '-'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 订单信息卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              签证信息
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">签证国家</span>
                <span className="font-medium text-slate-800">{order.visaCountry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">签证类型</span>
                <span className="font-medium text-slate-800">{order.visaType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">入境类型</span>
                <span className="font-medium text-slate-800">{order.entryType || '-'}</span>
              </div>
              {order.appointmentDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">预约日期</span>
                  <span className="font-medium text-slate-800">
                    {new Date(order.appointmentDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">总费用</span>
                <span className="font-medium text-cyan-600">¥{order.totalFee || 0}</span>
              </div>
            </div>
          </motion.div>

          {/* 受理人员 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">受理人员</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">客服</span>
                <span className="font-medium text-slate-800">{order.cs?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">资料员</span>
                <span className="font-medium text-slate-800">{order.dc?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">操作员</span>
                <span className="font-medium text-slate-800">{order.op?.name || '-'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 右侧：工作区 */}
        <div className="lg:col-span-2">
          {/* 工作面板切换 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActivePanel('documents')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activePanel === 'documents'
                    ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  资料收集 ({order.documentRequirements?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActivePanel('materials')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activePanel === 'materials'
                    ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  签证材料 ({order.visaMaterials?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActivePanel('logs')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activePanel === 'logs'
                    ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  操作日志
                </div>
              </button>
            </div>

            {/* 资料收集面板 */}
            <AnimatePresence mode="wait">
              {activePanel === 'documents' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  {/* 资料员操作栏 */}
                  {canCollectDocs() && (
                    <div className="mb-4 p-4 bg-purple-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-700">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">资料收集模式</span>
                      </div>
                      <button
                        onClick={() => setShowAddDocModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        添加资料清单
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {(!order.documentRequirements || order.documentRequirements.length === 0) ? (
                      <div className="text-center py-12 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>暂无资料清单</p>
                        {canCollectDocs() && (
                          <button
                            onClick={() => setShowAddDocModal(true)}
                            className="mt-4 text-cyan-600 hover:underline"
                          >
                            点击添加资料清单
                          </button>
                        )}
                      </div>
                    ) : (
                      order.documentRequirements.map((doc: any) => {
                        const docStatus = DOC_STATUS_CONFIG[doc.status] || DOC_STATUS_CONFIG.PENDING;
                        return (
                          <div
                            key={doc.id}
                            className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${docStatus.bg}`}>
                                  {doc.status === 'APPROVED' ? (
                                    <Check className={`w-4 h-4 ${docStatus.color}`} />
                                  ) : doc.status === 'REJECTED' ? (
                                    <X className={`w-4 h-4 ${docStatus.color}`} />
                                  ) : (
                                    <Clock className={`w-4 h-4 ${docStatus.color}`} />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-slate-800">{doc.name}</h4>
                                    {doc.isRequired && (
                                      <span className="px-2 py-0.5 text-xs text-red-600 bg-red-50 rounded">
                                        必填
                                      </span>
                                    )}
                                  </div>
                                  {doc.description && (
                                    <p className="text-sm text-slate-500 mt-1">{doc.description}</p>
                                  )}
                                  {doc.rejectReason && (
                                    <div className="mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-600">
                                      <AlertCircle className="w-4 h-4 inline mr-1" />
                                      {doc.rejectReason}
                                    </div>
                                  )}
                                  {doc.fileUrl && (
                                    <div className="mt-2 flex items-center gap-2">
                                      {(() => {
                                        const fileType = getFileType(doc.fileUrl, doc.name);
                                        const config = getFileTypeConfig(fileType);
                                        const FileIcon = config.icon;
                                        return (
                                          <button
                                            onClick={() => {
                                              setPreviewFiles([{ url: doc.fileUrl, name: doc.name || getFileName(doc.fileUrl) }]);
                                              setPreviewIndex(0);
                                              setShowPreviewModal(true);
                                            }}
                                            className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition-colors"
                                          >
                                            <FileIcon className="w-4 h-4" />
                                            <span>预览文件</span>
                                          </button>
                                        );
                                      })()}
                                      <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-500 hover:text-slate-600 flex items-center gap-1 transition-colors"
                                        title="下载文件"
                                      >
                                        <FileDown className="w-4 h-4" />
                                        <span className="text-sm">下载</span>
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${docStatus.bg} ${docStatus.color}`}>
                                  {docStatus.label}
                                </span>
                                {canCollectDocs() && (
                                  <div className="flex gap-1">
                                    {!doc.fileUrl && doc.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => {
                                          setSelectedDoc(doc);
                                          setShowUploadModal(true);
                                          setUploadDocName(doc.name);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="上传资料"
                                      >
                                        <FileUp className="w-4 h-4" />
                                      </button>
                                    )}
                                    {doc.fileUrl && doc.status !== 'APPROVED' && (
                                      <>
                                        <button
                                          onClick={() => handleReviewDocument(doc.id, 'APPROVED')}
                                          disabled={actionLoading}
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                          title="合格"
                                        >
                                          <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSelectedDoc(doc);
                                            setShowRejectModal(true);
                                          }}
                                          disabled={actionLoading}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                          title="打回"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}

              {/* 签证材料面板 */}
              {activePanel === 'materials' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  {/* 操作员操作栏 */}
                  {canMakeMaterials() && (
                    <div className="mb-4 p-4 bg-cyan-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyan-700">
                        <Package className="w-5 h-5" />
                        <span className="font-medium">签证材料制作模式</span>
                      </div>
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.onchange = async (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files) {
                              for (const file of files) {
                                await handleUploadMaterial(file, file.name, 'other');
                              }
                            }
                          };
                          input.click();
                        }}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        上传材料
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {(!order.visaMaterials || order.visaMaterials.length === 0) ? (
                      <div className="text-center py-12 text-slate-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>暂无签证材料</p>
                        {canMakeMaterials() && (
                          <p className="mt-2 text-sm text-slate-400">点击上方按钮上传签证材料</p>
                        )}
                      </div>
                    ) : (
                      order.visaMaterials.map((material: any) => {
                        const matStatus = material.status === 'APPROVED' 
                          ? { label: '已合格', color: 'text-green-600', bg: 'bg-green-100' }
                          : material.status === 'REJECTED'
                          ? { label: '已打回', color: 'text-red-600', bg: 'bg-red-100' }
                          : { label: '待审核', color: 'text-gray-600', bg: 'bg-gray-100' };
                        
                        return (
                          <div
                            key={material.id}
                            className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${matStatus.bg}`}>
                                  <Package className={`w-4 h-4 ${matStatus.color}`} />
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-800">{material.name}</h4>
                                  <p className="text-sm text-slate-500">{material.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${matStatus.bg} ${matStatus.color}`}>
                                  {matStatus.label}
                                </span>
                                {material.fileUrl && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setPreviewFiles([{ url: material.fileUrl, name: material.name || getFileName(material.fileUrl) }]);
                                        setPreviewIndex(0);
                                        setShowPreviewModal(true);
                                      }}
                                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                      title="预览文件"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <a
                                      href={material.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                      title="下载文件"
                                    >
                                      <FileDown className="w-4 h-4" />
                                    </a>
                                  </>
                                )}
                                {canDeliver() && material.status !== 'APPROVED' && (
                                  <button
                                    onClick={() => handleReviewMaterial(material.id, 'APPROVED')}
                                    disabled={actionLoading}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="合格"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            {material.rejectReason && (
                              <div className="mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-600">
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                {material.rejectReason}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* 待交付时的交付按钮 */}
                  {order.status === 'PENDING_DELIVERY' && canDeliver() && (
                    <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                      <button
                        onClick={() => handleStatusTransition('DELIVERED', '签证材料已交付')}
                        disabled={actionLoading}
                        className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Package className="w-5 h-5" />
                        确认材料交付
                      </button>
                    </div>
                  )}

                  {/* 材料制作中时 */}
                  {canMakeMaterials() && order.status === 'UNDER_REVIEW' && (
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                      <button
                        onClick={() => handleStatusTransition('MAKING_MATERIALS', '开始制作签证材料')}
                        disabled={actionLoading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Package className="w-5 h-5" />
                        开始制作签证材料
                      </button>
                    </div>
                  )}

                  {/* 材料制作完成后 */}
                  {canMakeMaterials() && order.status === 'MAKING_MATERIALS' && order.opId === currentUser?.id && (
                    <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                      <button
                        onClick={() => handleStatusTransition('PENDING_DELIVERY', '签证材料制作完成')}
                        disabled={actionLoading}
                        className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        材料制作完成，准备交付
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 操作日志 */}
              {activePanel === 'logs' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  <div className="space-y-4">
                    {(!order.orderLogs || order.orderLogs.length === 0) ? (
                      <div className="text-center py-12 text-slate-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>暂无操作记录</p>
                      </div>
                    ) : (
                      order.orderLogs.map((log: any, index: number) => (
                        <div key={log.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-cyan-500" />
                            {index < order.orderLogs.length - 1 && (
                              <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{log.action}</span>
                              {log.fromStatus && log.toStatus && (
                                <>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-sm text-slate-500">
                                    {STATUS_CONFIG[log.fromStatus]?.label || log.fromStatus}
                                    <ChevronRight className="w-4 h-4 inline mx-1" />
                                    {STATUS_CONFIG[log.toStatus]?.label || log.toStatus}
                                  </span>
                                </>
                              )}
                            </div>
                            {log.content && (
                              <p className="text-sm text-slate-600 mt-1">{log.content}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-2">
                              {log.user?.name || '系统'} • {new Date(log.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 添加资料清单弹窗 */}
      <AnimatePresence>
        {showAddDocModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">添加资料清单</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">常用资料</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_DOCUMENTS.map((doc) => (
                    <button
                      key={doc.name}
                      onClick={() => handleAddDocument(doc.name, doc.description, true)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors"
                    >
                      {doc.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px bg-slate-200 my-4" />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 打回原因弹窗 */}
      <AnimatePresence>
        {showRejectModal && selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {selectedDoc.id === 'reject' ? '拒签原因' : '打回原因'}
              </h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请输入打回原因（选填）"
                className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none"
              />
              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedDoc(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (selectedDoc.id === 'reject') {
                      handleStatusTransition('REJECTED', rejectReason || '签证被拒');
                    } else {
                      handleReviewDocument(selectedDoc.id, 'REJECTED', rejectReason);
                    }
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  确认{selectedDoc.id === 'reject' ? '拒签' : '打回'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 文件预览弹窗 */}
      <FilePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        files={previewFiles}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        title="文件预览"
      />

      {/* 上传资料弹窗 */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-4">上传资料</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">资料名称</label>
                <input
                  type="text"
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  placeholder="请输入资料名称"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">选择文件</label>
                <div
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        setUploadFile(file);
                        if (!uploadDocName) {
                          setUploadDocName(file.name);
                        }
                      }
                    };
                    input.click();
                  }}
                  className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors"
                >
                  {uploadFile ? (
                    <>
                      <FileUp className="w-8 h-8 text-cyan-500 mb-2" />
                      <p className="text-sm text-slate-600">{uploadFile.name}</p>
                      <p className="text-xs text-slate-400 mt-1">点击更换文件</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">点击选择文件</p>
                      <p className="text-xs text-slate-400 mt-1">支持 PDF、Word、图片等格式</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                    setUploadDocName('');
                    setSelectedDoc(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleUploadDocument}
                  disabled={!uploadFile || !uploadDocName || actionLoading}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上传
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
