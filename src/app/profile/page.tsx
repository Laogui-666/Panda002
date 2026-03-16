/**
 * 个人中心页面
 * 盼达旅行 - 玻璃拟态风格
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

// 用户头像
const IconAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-morandi-ocean to-morandi-mist flex items-center justify-center text-white font-bold`}>
      <span className={size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'}>张</span>
    </div>
  );
};

// 导航图标
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconWallet = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconLock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconRefresh = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// 导航菜单项
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'profile', label: '个人资料', icon: <IconUser /> },
  { id: 'erp', label: 'ERP系统', icon: <IconSettings /> },
  { id: 'security', label: '账户安全', icon: <IconShield /> },
  { id: 'wallet', label: '我的钱包', icon: <IconWallet /> },
  { id: 'settings', label: '设置', icon: <IconSettings /> },
];

// 模拟数据
const userInfo = {
  username: 'zhangsan2024',
  nickname: '旅行达人',
  name: '张先生',
  email: 'zhangsan@example.com',
  phone: '13812345678',
  avatar: null,
  memberLevel: '黄金会员',
  balance: 299.00,
  applications: [
    { id: 1, type: '日本旅游签证', status: 'pending', date: '2024-01-15' },
    { id: 2, type: '美国商务签证', status: 'approved', date: '2024-01-10' },
  ],
};

const statusMap: Record<string, { text: string; color: string; bg: string }> = {
  pending: { text: '审核中', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  approved: { text: '已通过', color: 'text-green-600', bg: 'bg-green-100' },
  rejected: { text: '已拒绝', color: 'text-red-600', bg: 'bg-red-100' },
};

// 生成随机验证码
const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 生成验证码图片的 SVG
const CaptchaImage = ({ code, onRefresh }: { code: string; onRefresh: () => void }) => {
  const colors = ['#7A9D96', '#5A7D76', '#A8C5BB', '#6B8E7F', '#8FAF9F'];
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative bg-white/80 rounded-xl overflow-hidden border border-morandi-mist/30">
        <svg width="100" height="32" className="block">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`bg-${i}`}
              cx={Math.random() * 100}
              cy={Math.random() * 32}
              r={Math.random() * 1.5}
              fill={colors[Math.floor(Math.random() * colors.length)]}
              opacity={0.3}
            />
          ))}
          {code.split('').map((char, index) => (
            <text
              key={index}
              x={15 + index * 22}
              y={22}
              fontSize={18}
              fontFamily="Georgia, serif"
              fontWeight="bold"
              fill={colors[index % colors.length]}
            >
              {char}
            </text>
          ))}
        </svg>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        className="p-1 text-morandi-mist hover:text-morandi-ocean transition-colors"
        title="换一张"
      >
        <IconRefresh />
      </button>
    </div>
  );
};

// 验证弹窗组件
const VerifyModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  captchaCode,
  refreshCaptcha,
  password,
  setPassword,
  captcha,
  setCaptcha,
  error
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: () => void;
  captchaCode: string;
  refreshCaptcha: () => void;
  password: string;
  setPassword: (v: string) => void;
  captcha: string;
  setCaptcha: (v: string) => void;
  error: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-morandi-deep">验证身份</h3>
              <button onClick={onClose} className="text-morandi-mist hover:text-morandi-deep">
                <IconClose />
              </button>
            </div>
            
            <p className="text-sm text-morandi-mist mb-4">
              请输入密码和验证码以确认修改
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-morandi-deep mb-2">
                  登录密码
                </label>
                <Input
                  type="password"
                  placeholder="请输入登录密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<IconLock />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-morandi-deep mb-2">
                  验证码
                </label>
                <CaptchaImage code={captchaCode} onRefresh={refreshCaptcha} />
                <Input
                  type="text"
                  placeholder="请输入验证码"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4))}
                  className="mt-2"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1" onClick={onClose}>
                  取消
                </Button>
                <Button variant="primary" className="flex-1" onClick={onConfirm}>
                  确认
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyCaptcha, setVerifyCaptcha] = useState('');
  const [verifyCaptchaCode, setVerifyCaptchaCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  
  const [formData, setFormData] = useState({
    nickname: userInfo.nickname,
    email: userInfo.email,
  });

  // 初始化验证码
  useEffect(() => {
    setVerifyCaptchaCode(generateCaptcha());
  }, [showVerifyModal]);

  const refreshVerifyCaptcha = () => {
    setVerifyCaptchaCode(generateCaptcha());
    setVerifyCaptcha('');
  };

  const handleLogout = () => {
    router.push('/auth/login');
  };

  const handleSaveClick = () => {
    setShowVerifyModal(true);
    setVerifyPassword('');
    setVerifyCaptcha('');
    setVerifyError('');
  };

  const handleVerifyConfirm = () => {
    // 验证逻辑
    if (!verifyPassword) {
      setVerifyError('请输入登录密码');
      return;
    }
    if (!verifyCaptcha) {
      setVerifyError('请输入验证码');
      return;
    }
    if (verifyCaptcha.toLowerCase() !== verifyCaptchaCode.toLowerCase()) {
      setVerifyError('验证码错误');
      refreshVerifyCaptcha();
      return;
    }
    
    // 验证通过，保存并关闭弹窗
    setShowVerifyModal(false);
    setIsEditing(false);
    // 这里调用实际的保存API
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      nickname: userInfo.nickname,
      email: userInfo.email,
    });
  };

  return (
    <div className="min-h-screen gradient-morandi">
      {/* 顶部导航栏 */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-morandi-ocean rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">盼</span>
            </div>
            <span className="text-lg font-bold text-morandi-deep">盼达旅行</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              消息
            </Button>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <IconAvatar size="sm" />
              <span className="text-sm text-morandi-deep">{userInfo.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* 左侧侧边栏 - 移动端变为顶部导航 */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 flex-shrink-0 order-2 md:order-1"
          >
            <Card variant="glass" padding="md" className="sticky top-20 md:top-24">
              {/* 用户信息头部 - 移动端隐藏 */}
              <div className="text-center pb-4 border-b border-morandi-mist/20 hidden md:block">
                <div className="relative inline-block">
                  <IconAvatar size="lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-morandi-sand rounded-full flex items-center justify-center">
                    <span className="text-xs">VIP</span>
                  </div>
                </div>
                <h3 className="mt-3 font-bold text-morandi-deep">{userInfo.nickname}</h3>
                <p className="text-sm text-morandi-mist">{userInfo.memberLevel}</p>
              </div>

              {/* 导航菜单 - 移动端改为横向滚动 */}
              <nav className="py-2 overflow-x-auto flex md:flex-col gap-1 sm:gap-0 -mx-2 px-2 md:mx-0 md:px-0">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'erp') {
                        window.location.href = '/erp';
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === item.id
                        ? 'bg-morandi-ocean/10 text-morandi-ocean'
                        : 'text-morandi-mist hover:bg-morandi-mist/10 hover:text-morandi-deep'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* 退出登录 */}
              <div className="pt-4 border-t border-morandi-mist/20 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <IconLogout />
                  <span className="font-medium">退出登录</span>
                </button>
              </div>
            </Card>
          </motion.aside>

          {/* 右侧内容区 */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 order-1 md:order-2"
          >
            {/* 个人资料 */}
            {activeTab === 'profile' && (
              <Card variant="glass" padding="md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-morandi-deep">个人资料</h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="flex-1 sm:flex-none"
                      >
                        取消
                      </Button>
                    )}
                    <Button
                      variant={isEditing ? 'primary' : 'glass'}
                      size="sm"
                      onClick={isEditing ? handleSaveClick : () => setIsEditing(true)}
                      rightIcon={!isEditing ? <IconEdit /> : <IconCheck />}
                      className="flex-1 sm:flex-none"
                    >
                      {isEditing ? '保存' : '编辑'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 头像区域 */}
                  <div className="flex items-center gap-6">
                    <IconAvatar size="lg" />
                    <div>
                      <Button variant="glass" size="sm" disabled={!isEditing}>
                        更换头像
                      </Button>
                      <p className="text-xs text-morandi-mist mt-2">
                        支持 JPG、PNG 格式，最大 2MB
                      </p>
                    </div>
                  </div>

                  {/* 表单 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        账号
                      </label>
                      <div className="px-4 py-3 bg-morandi-mist/10 rounded-xl text-morandi-deep">
                        {userInfo.username}
                      </div>
                      <p className="text-xs text-morandi-mist mt-1">账号不可修改</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        手机号
                      </label>
                      <div className="px-4 py-3 bg-morandi-mist/10 rounded-xl text-morandi-deep flex items-center justify-between">
                        <span>{userInfo.phone}</span>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <IconCheck /> 已绑定
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        昵称
                      </label>
                      <Input
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        disabled={!isEditing}
                        placeholder="请输入昵称"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        邮箱地址
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 签证申请 */}
            {activeTab === 'applications' && (
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-morandi-deep">我的订单</h2>
                  <Button variant="primary" size="sm">
                    新建订单
                  </Button>
                </div>

                <div className="space-y-4">
                  {userInfo.applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-morandi-ocean/10 rounded-xl flex items-center justify-center">
                          <IconDocument />
                        </div>
                        <div>
                          <h4 className="font-medium text-morandi-deep">{app.type}</h4>
                          <p className="text-sm text-morandi-mist">申请日期：{app.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[app.status].bg} ${statusMap[app.status].color}`}>
                          {statusMap[app.status].text}
                        </span>
                        <Button variant="ghost" size="sm">
                          查看
                          <IconArrowRight />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {userInfo.applications.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-morandi-mist/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconDocument />
                      </div>
                      <p className="text-morandi-mist">暂无签证申请记录</p>
                      <Button variant="primary" className="mt-4">
                        立即申请
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* 账户安全 */}
            {activeTab === 'security' && (
              <Card variant="glass" padding="lg">
                <h2 className="text-xl font-bold text-morandi-deep mb-6">账户安全</h2>

                <div className="space-y-4">
                  {/* 登录密码 */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-morandi-ocean/10 rounded-xl flex items-center justify-center">
                        <IconShield />
                      </div>
                      <div>
                        <h4 className="font-medium text-morandi-deep">登录密码</h4>
                        <p className="text-sm text-morandi-mist">定期修改密码可保护账户安全</p>
                      </div>
                    </div>
                    <Button variant="glass" size="sm">
                      修改
                    </Button>
                  </div>

                  {/* 手机绑定 */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-morandi-ocean/10 rounded-xl flex items-center justify-center">
                        <IconShield />
                      </div>
                      <div>
                        <h4 className="font-medium text-morandi-deep">手机绑定</h4>
                        <p className="text-sm text-morandi-mist">已绑定：{userInfo.phone}</p>
                      </div>
                    </div>
                    <span className="text-green-500 text-sm flex items-center">
                      <IconCheck /> 已绑定
                    </span>
                  </div>

                  {/* 邮箱绑定 */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-morandi-ocean/10 rounded-xl flex items-center justify-center">
                        <IconShield />
                      </div>
                      <div>
                        <h4 className="font-medium text-morandi-deep">邮箱绑定</h4>
                        <p className="text-sm text-morandi-mist">已绑定：{userInfo.email}</p>
                      </div>
                    </div>
                    <Button variant="glass" size="sm">
                      修改
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* 我的钱包 */}
            {activeTab === 'wallet' && (
              <Card variant="glass" padding="lg">
                <h2 className="text-xl font-bold text-morandi-deep mb-6">我的钱包</h2>

                {/* 余额卡片 */}
                <div className="bg-gradient-to-r from-morandi-ocean to-morandi-mist rounded-2xl p-6 text-white mb-6">
                  <p className="text-white/80 text-sm mb-1">账户余额</p>
                  <p className="text-4xl font-bold">¥{userInfo.balance.toFixed(2)}</p>
                  <div className="flex gap-3 mt-4">
                    <Button variant="secondary" size="sm" className="bg-white/20 border-0 text-white hover:bg-white/30">
                      充值
                    </Button>
                  </div>
                </div>

                {/* 交易记录 */}
                <div>
                  <h3 className="font-medium text-morandi-deep mb-4">交易记录</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                      <div>
                        <p className="font-medium text-morandi-deep">签证服务费</p>
                        <p className="text-sm text-morandi-mist">2024-01-15</p>
                      </div>
                      <span className="text-red-500 font-medium">-¥199.00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                      <div>
                        <p className="font-medium text-morandi-deep">账户充值</p>
                        <p className="text-sm text-morandi-mist">2024-01-14</p>
                      </div>
                      <span className="text-green-500 font-medium">+¥500.00</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 设置 */}
            {activeTab === 'settings' && (
              <Card variant="glass" padding="lg">
                <h2 className="text-xl font-bold text-morandi-deep mb-6">设置</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                    <div>
                      <h4 className="font-medium text-morandi-deep">消息通知</h4>
                      <p className="text-sm text-morandi-mist">接收订单状态更新推送</p>
                    </div>
                    <div className="w-12 h-6 bg-morandi-ocean rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                    <div>
                      <h4 className="font-medium text-morandi-deep">邮件通知</h4>
                      <p className="text-sm text-morandi-mist">接收邮件提醒</p>
                    </div>
                    <div className="w-12 h-6 bg-morandi-ocean rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5" />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      {/* 验证弹窗 */}
      <VerifyModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onConfirm={handleVerifyConfirm}
        captchaCode={verifyCaptchaCode}
        refreshCaptcha={refreshVerifyCaptcha}
        password={verifyPassword}
        setPassword={setVerifyPassword}
        captcha={verifyCaptcha}
        setCaptcha={setVerifyCaptcha}
        error={verifyError}
      />

      {/* 页脚 */}
      <footer className="mt-12 py-6 border-t border-morandi-mist/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-morandi-mist">
          © 2024 盼达旅行 版权所有
        </div>
      </footer>
    </div>
  );
}
