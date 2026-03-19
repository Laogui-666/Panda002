/**
 * 系统设置页面
 * 
 * 功能：
 * - 基础设置（公司信息）
 * - 短信模板配置
 * - 资料清单模板管理
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Bell, MessageSquare, FileText, Building2,
  Save, RefreshCw, Plus, Trash2, Edit2, X, Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Tab配置
const TABS = [
  { id: 'company', label: '公司信息', icon: Building2 },
  { id: 'notification', label: '通知设置', icon: Bell },
  { id: 'sms', label: '短信模板', icon: MessageSquare },
  { id: 'documents', label: '资料模板', icon: FileText },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 公司信息表单
  const [companyForm, setCompanyForm] = useState({
    name: '',
    shortName: '',
    phone: '',
    email: '',
    address: '',
  });

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState({
    orderCreated: true,
    orderStatusChanged: true,
    documentUploaded: true,
    appointmentReminder: true,
    dailyReport: false,
  });

  // 短信模板
  const [smsTemplates, setSmsTemplates] = useState([
    { id: 1, name: '订单创建通知', content: '感谢您的信任，资料员将在24小时内与您取得联系' },
    { id: 2, name: '资料提交通知', content: '感谢您的配合与支持，您的材料已提交送签专员复审' },
    { id: 3, name: '材料交付通知', content: '久等啦！您的签证材料已制作完成' },
    { id: 4, name: '出签通知', content: '恭喜！您的签证已获批准' },
    { id: 5, name: '拒签通知', content: '很遗憾，您的签证申请未获批准' },
  ]);

  // 资料清单模板
  const [documentTemplates, setDocumentTemplates] = useState([
    { id: 1, name: '日本旅游签证', items: ['护照', '照片', '身份证', '户口本', '在职证明', '行程单'] },
    { id: 2, name: '美国旅游签证', items: ['护照', '照片', 'DS-160确认页', '面试确认信'] },
    { id: 3, name: '申根签证', items: ['护照', '照片', '保险', '行程单', '酒店预订单'] },
  ]);

  // 保存公司信息
  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      // TODO: 调用API保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('公司信息保存成功');
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 保存通知设置
  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('通知设置保存成功');
    } catch (error) {
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">系统设置</h1>
        <p className="text-sm text-slate-500 mt-1">配置公司信息和系统参数</p>
      </div>

      {/* Tab切换 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab内容 */}
        <div className="p-6">
          {/* 公司信息 */}
          {activeTab === 'company' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">公司信息</h2>
                <button
                  onClick={handleSaveCompany}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  保存
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    公司名称
                  </label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="请输入公司名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    公司简称
                  </label>
                  <input
                    type="text"
                    value={companyForm.shortName}
                    onChange={(e) => setCompanyForm({ ...companyForm, shortName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="请输入公司简称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    联系电话
                  </label>
                  <input
                    type="text"
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="请输入联系电话"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="请输入邮箱"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    地址
                  </label>
                  <textarea
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none"
                    placeholder="请输入公司地址"
                  />
                </div>
</div>
            </motion.div>
          )}

          {/* 通知设置 */}
          {activeTab === 'notification' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">通知设置</h2>
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  保存
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'orderCreated', label: '新订单创建', desc: '当有新订单创建时发送通知' },
                  { key: 'orderStatusChanged', label: '订单状态变更', desc: '当订单状态发生变化时发送通知' },
                  { key: 'documentUploaded', label: '资料上传提醒', desc: '当客户上传资料时发送通知' },
                  { key: 'appointmentReminder', label: '预约提醒', desc: '在预约日期前发送提醒' },
                  { key: 'dailyReport', label: '每日报告', desc: '每日发送工作汇总报告' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <h3 className="font-medium text-slate-800">{item.label}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings]
                      })}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        notificationSettings[item.key as keyof typeof notificationSettings]
                          ? 'bg-cyan-500'
                          : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notificationSettings[item.key as keyof typeof notificationSettings]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 短信模板 */}
          {activeTab === 'sms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">短信模板</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  新增模板
                </button>
              </div>

              <div className="space-y-4">
                {smsTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-800">{template.name}</h3>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{template.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 资料模板 */}
          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">资料清单模板</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  新增模板
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-800">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {template.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-3">{template.items.length} 项资料</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
