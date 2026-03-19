'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Database,
  Palette,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // 表单状态
  const [profile, setProfile] = useState({
    real_name: '系统管理员',
    email: 'admin@panda.com',
    phone: '13800138000',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    orderCreated: true,
    orderStatusChanged: true,
    appointmentReminder: true,
    documentReview: true,
    systemAnnouncements: false,
  });

  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'security', label: '安全设置', icon: Lock },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'system', label: '系统设置', icon: Database },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* 左侧标签导航 */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            {/* 个人信息 */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-slate-800">个人信息</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">姓名</label>
                    <input
                      type="text"
                      value={profile.real_name}
                      onChange={(e) => setProfile({ ...profile, real_name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">手机号</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 安全设置 */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-slate-800">修改密码</h3>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">当前密码</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">新密码</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">确认新密码</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 通知设置 */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-slate-800">通知设置</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'orderCreated', label: '新订单通知', desc: '当有新订单创建时接收通知' },
                    { key: 'orderStatusChanged', label: '订单状态变更', desc: '当订单状态发生变化时通知' },
                    { key: 'appointmentReminder', label: '预约提醒', desc: '预约时间前提醒' },
                    { key: 'documentReview', label: '资料审核通知', desc: '资料审核状态变更通知' },
                    { key: 'systemAnnouncements', label: '系统公告', desc: '接收系统公告和更新通知' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-medium text-slate-700">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof typeof notifications]
                        })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications]
                            ? 'bg-cyan-500'
                            : 'bg-slate-200'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof typeof notifications]
                            ? 'left-7'
                            : 'left-1'
                        }`}></span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 系统设置 */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-slate-800">系统设置</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="w-5 h-5 text-slate-600" />
                      <span className="font-medium text-slate-700">数据库连接</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      阿里云RDS MySQL · rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com:3306
                    </p>
                    <span className="inline-flex items-center mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      已连接
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Palette className="w-5 h-5 text-slate-600" />
                      <span className="font-medium text-slate-700">系统版本</span>
                    </div>
                    <p className="text-sm text-slate-500">盼达旅行 ERP v1.0.0</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 保存按钮 */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg flex items-center gap-2 hover:shadow-md transition-shadow disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存设置
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
