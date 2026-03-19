/**
 * 个人中心页面 - 真实API版本
 * 盼达旅行 - 玻璃拟态风格
 * 
 * 功能：
 * - 从localStorage读取用户信息
 * - 调用API获取/更新个人资料
 * - 支持修改昵称、邮箱、头像
 * - 支持修改密码（需验证当前密码）
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

// 用户角色映射
const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '超级管理员',
  COMPANY_OWNER: '公司负责人',
  CS_ADMIN: '客服部管理员',
  CUSTOMER_SERVICE: '客服',
  VISA_ADMIN: '签证部管理员',
  DOC_COLLECTOR: '资料员',
  OPERATOR: '签证操作员',
  OUTSOURCE: '外包业务员',
  CUSTOMER: '普通用户',
};

// 用户头像
const IconAvatar = ({ name, size = 'md' }: { name?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  
  const getInitial = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-morandi-ocean to-morandi-mist flex items-center justify-center text-white font-bold`}>
      <span className={size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'}>
        {getInitial(name)}
      </span>
    </div>
  );
};

// 导航图标
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

const IconEye = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEyeOff = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconLoading = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  { id: 'security', label: '账户安全', icon: <IconShield /> },
  { id: 'settings', label: '设置', icon: <IconSettings /> },
];

// 密码修改弹窗
const PasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
  password,
  setPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showNewPassword,
  setShowNewPassword,
  isLoading,
  error
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  password: string;
  setPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (v: boolean) => void;
  isLoading: boolean;
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
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-morandi-deep">修改密码</h3>
              <button onClick={onClose} className="text-morandi-mist hover:text-morandi-deep">
                <IconClose />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-morandi-deep mb-2">
                  当前密码
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入当前密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<IconLock />}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-morandi-mist hover:text-morandi-deep"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-morandi-deep mb-2">
                  新密码
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="请输入新密码（至少6位）"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    leftIcon={<IconLock />}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-morandi-mist hover:text-morandi-deep"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-morandi-deep mb-2">
                  确认新密码
                </label>
                <Input
                  type="password"
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<IconLock />}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
                  取消
                </Button>
                <Button variant="primary" className="flex-1" onClick={onConfirm} disabled={isLoading}>
                  {isLoading ? <IconLoading /> : '确认修改'}
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // 密码修改弹窗
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 用户数据
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // 从localStorage读取用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('erp_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
        });
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
    setIsLoading(false);
  }, []);

  // 验证登录状态
  useEffect(() => {
    const token = localStorage.getItem('erp_token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  // 获取用户资料
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.user) {
          setUser(result.data.user);
          setFormData({
            name: result.data.user.name || '',
            email: result.data.user.email || '',
            phone: result.data.user.phone || '',
          });
          // 更新localStorage
          localStorage.setItem('erp_user', JSON.stringify(result.data.user));
        }
      }
    } catch (error) {
      console.error('获取用户资料失败', error);
    }
  }, []);

  // 初始化时获取最新资料
  useEffect(() => {
    if (!isLoading) {
      fetchUserProfile();
    }
  }, [isLoading, fetchUserProfile]);

  const handleLogout = () => {
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_token');
    router.push('/auth/login');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('资料更新成功');
        setIsEditing(false);
        // 更新本地数据
        if (result.data?.user) {
          setUser((prev: any) => ({ ...prev, ...result.data.user }));
          localStorage.setItem('erp_user', JSON.stringify({ ...user, ...result.data.user }));
        }
      } else {
        toast.error(result.message || '更新失败');
      }
    } catch (error) {
      console.error('保存失败', error);
      toast.error('保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    // 验证
    if (!password) {
      setPasswordError('请输入当前密码');
      return;
    }
    if (!newPassword) {
      setPasswordError('请输入新密码');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('新密码长度不能少于6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: password,
          newPassword: newPassword,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('密码修改成功');
        setShowPasswordModal(false);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(result.message || '密码修改失败');
      }
    } catch (error) {
      console.error('修改密码失败', error);
      setPasswordError('修改失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-morandi flex items-center justify-center">
        <div className="text-center">
          <IconLoading />
          <p className="mt-4 text-morandi-mist">加载中...</p>
        </div>
      </div>
    );
  }

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
            <Button variant="ghost" size="sm" onClick={() => router.push('/erp')}>
              ERP系统
            </Button>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <IconAvatar name={user?.name} size="sm" />
              <span className="text-sm text-morandi-deep">{user?.name || user?.username}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* 左侧侧边栏 */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 flex-shrink-0 order-2 md:order-1"
          >
            <Card variant="glass" padding="md" className="sticky top-20 md:top-24">
              {/* 用户信息头部 */}
              <div className="text-center pb-4 border-b border-morandi-mist/20">
                <div className="relative inline-block">
                  <IconAvatar name={user?.name} size="lg" />
                </div>
                <h3 className="mt-3 font-bold text-morandi-deep">{user?.name || user?.username}</h3>
                <p className="text-sm text-morandi-mist">{ROLE_LABELS[user?.role] || user?.role}</p>
              </div>

              {/* 导航菜单 */}
              <nav className="py-2 overflow-x-auto flex md:flex-col gap-1 sm:gap-0 -mx-2 px-2 md:mx-0 md:px-0">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
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
                      onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                      rightIcon={!isEditing ? <IconEdit /> : <IconCheck />}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none"
                    >
                      {isSaving ? '保存中...' : isEditing ? '保存' : '编辑'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 头像区域 */}
                  <div className="flex items-center gap-6">
                    <IconAvatar name={user?.name} size="lg" />
                    <div>
                      {isEditing && (
                        <Button variant="glass" size="sm" leftIcon={<IconCamera />}>
                          更换头像
                        </Button>
                      )}
                      <p className="text-xs text-morandi-mist mt-2">
                        支持 JPG、PNG 格式，最大 2MB
                      </p>
                    </div>
                  </div>

                  {/* 账号信息 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        账号
                      </label>
                      <div className="px-4 py-3 bg-morandi-mist/10 rounded-xl text-morandi-deep">
                        {user?.username}
                      </div>
                      <p className="text-xs text-morandi-mist mt-1">账号不可修改</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        手机号
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="请输入手机号"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        姓名
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        placeholder="请输入姓名"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        邮箱
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        placeholder="请输入邮箱"
                      />
                    </div>

                    {/* 角色信息（只读） */}
                    <div>
                      <label className="block text-sm font-medium text-morandi-deep mb-2">
                        角色
                      </label>
                      <div className="px-4 py-3 bg-morandi-mist/10 rounded-xl text-morandi-deep">
                        {ROLE_LABELS[user?.role] || user?.role}
                      </div>
                    </div>

                    {/* 公司信息（只读） */}
                    {user?.company && (
                      <div>
                        <label className="block text-sm font-medium text-morandi-deep mb-2">
                          公司
                        </label>
                        <div className="px-4 py-3 bg-morandi-mist/10 rounded-xl text-morandi-deep">
                          {user.company.name}
                        </div>
                      </div>
                    )}
                  </div>
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
                        <IconLock />
                      </div>
                      <div>
                        <h4 className="font-medium text-morandi-deep">登录密码</h4>
                        <p className="text-sm text-morandi-mist">定期修改密码可保护账户安全</p>
                      </div>
                    </div>
                    <Button variant="glass" size="sm" onClick={() => setShowPasswordModal(true)}>
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
                        <p className="text-sm text-morandi-mist">
                          {user?.phone ? `已绑定：${user.phone}` : '未绑定手机号'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm flex items-center ${user?.phone ? 'text-green-500' : 'text-yellow-500'}`}>
                      <IconCheck /> {user?.phone ? '已绑定' : '未绑定'}
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
                        <p className="text-sm text-morandi-mist">
                          {user?.email ? `已绑定：${user.email}` : '未绑定邮箱'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm flex items-center ${user?.email ? 'text-green-500' : 'text-yellow-500'}`}>
                      <IconCheck /> {user?.email ? '已绑定' : '未绑定'}
                    </span>
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

      {/* 密码修改弹窗 */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordError('');
          setPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        onConfirm={handleChangePassword}
        password={password}
        setPassword={setPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        isLoading={isSaving}
        error={passwordError}
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
