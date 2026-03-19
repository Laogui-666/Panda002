'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Plus, Search, Edit2, Trash2, 
  X, Check, ToggleLeft, ToggleRight, Copy, Code
} from 'lucide-react';
import { authApi } from '@/lib/erp/api-client';

interface SmsTemplate {
  id: number;
  code: string;
  name: string;
  content: string;
  variables?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SmsTemplatePage() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    content: '',
    variables: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 加载模板列表
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch(
        `/api/erp/sms-templates?search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();
      
      if (result.success) {
        setTemplates(result.data.list);
      }
    } catch (error) {
      console.error('加载模板失败:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // 打开新增/编辑弹窗
  const openModal = (template?: SmsTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        code: template.code,
        name: template.name,
        content: template.content,
        variables: template.variables || '',
        isActive: template.isActive,
      });
    } else {
      setEditingTemplate(null);
      setFormData({ code: '', name: '', content: '', variables: '', isActive: true });
    }
    setShowModal(true);
  };

  // 保存模板
  const handleSave = async () => {
    if (!formData.code || !formData.name || !formData.content) {
      alert('请填写完整信息');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('erp_token');
      const url = editingTemplate 
        ? `/api/erp/sms-templates?id=${editingTemplate.id}` 
        : '/api/erp/sms-templates';
      
      const response = await fetch(url, {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success) {
        setShowModal(false);
        loadTemplates();
      } else {
        alert(result.message || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 删除模板
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个模板吗？')) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem('erp_token');
      const response = await fetch(`/api/erp/sms-templates?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.success) {
        loadTemplates();
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
console.error('删除失败:', error);
      alert('删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  // 复制模板内容
  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('已复制到剪贴板');
  };

  // 常用模板示例
  const templateExamples = [
    { code: 'ORDER_STATUS', name: '订单状态通知', content: '尊敬的客户，您的订单{{orderNo}}状态已更新为：{{status}}。如有疑问请致电客服。' },
    { code: 'DOC_REMINDER', name: '资料补充提醒', content: '尊敬的客户，您的订单{{orderNo}}需要补充以下资料：{{material}}。请尽快上传。' },
    { code: 'APPOINTMENT', name: '预约提醒', content: '尊敬的客户，您的签证预约时间：{{dateTime}}，地点：{{location}}。请准时参加。' },
    { code: 'APPROVED', name: '出签通知', content: '恭喜！您的订单{{orderNo}}已出签，请携带身份证到{{location}}领取。' },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">短信模板管理</h1>
            <p className="text-sm text-slate-500">管理短信通知模板，支持变量替换</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增模板
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索模板编码或名称..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">暂无短信模板</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-cyan-500 hover:text-cyan-600"
            >
              点击新增第一个模板
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {templates.map((template) => (
              <div key={template.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-800">{template.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        template.isActive 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {template.isActive ? '启用' : '禁用'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <Code className="w-4 h-4" />
                      <span>{template.code}</span>
                    </div>
                    <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 font-mono text-xs">
                      {template.content}
                    </div>
                    {template.variables && (
                      <div className="mt-2 text-xs text-slate-400">
                        变量: {template.variables}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyContent(template.content)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="复制内容"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal(template)}
                      className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      disabled={deletingId === template.id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 常用模板示例 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-medium text-slate-800 mb-3">常用模板示例</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templateExamples.map((example) => (
            <div 
              key={example.code}
              className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => {
                setFormData({
                  code: example.code,
                  name: example.name,
                  content: example.content,
                  variables: 'orderNo,status',
                  isActive: true,
                });
                setEditingTemplate(null);
                setShowModal(true);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-700">{example.name}</span>
                <span className="text-xs text-slate-400">{example.code}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{example.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowModal(false)}
            />
            
            {/* 弹窗 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {editingTemplate ? '编辑模板' : '新增模板'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        模板编码 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="如: ORDER_STATUS"
                        disabled={!!editingTemplate}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        模板名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="如: 订单状态通知"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      模板内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="使用 {{变量名}} 作为占位符，如: 尊敬的客户，您的订单{{orderNo}}已{{status}}"
                      rows={5}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      使用 {'{{变量名}}'} 作为占位符，发送时会自动替换
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      变量说明
                    </label>
                    <input
                      type="text"
                      value={formData.variables}
                      onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                      placeholder="如: orderNo,status,date"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className="flex items-center gap-2"
                    >
                      {formData.isActive ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-300" />
                      )}
                      <span className="text-sm text-slate-700">
                        {formData.isActive ? '启用' : '禁用'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        保存中...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        保存
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
