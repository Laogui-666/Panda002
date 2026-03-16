'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/erp/store';

export default function ERPLoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/erp/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 保存登录信息到store
        login(data.data.user, data.data.role, data.data.token);
        
        // 根据角色类型跳转到不同页面
        const roleType = data.data.user.role_type;
        const isSuperAdmin = roleType === 'super_admin' || data.data.role?.role_key === 'admin';
        
        if (isSuperAdmin) {
          // 超级管理员 -> 公司管理页面
          router.push('/admin/companies');
        } else if (roleType === 'company_admin') {
          // 公司负责人 -> 仪表盘
          router.push('/admin/dashboard');
        } else if (roleType === 'dept_admin' || roleType === 'operator' || roleType === 'external' || roleType === 'user') {
          // 部门管理员/操作员/外包/普通用户 -> 仪表盘
          router.push('/admin/dashboard');
        } else {
          // 默认 -> 仪表盘
          router.push('/admin/dashboard');
        }
      } else {
        setError(data.message || '登录失败，请重试');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('登录错误:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* 登录卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">盼达旅行</h1>
            <p className="text-slate-400">ERP 后台管理系统</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-200 text-sm">{error}</span>
            </motion.div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名输入框 */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* 密码输入框 */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 记住我 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="ml-2 text-slate-300 text-sm">
                记住登录状态
              </label>
            </div>

            {/* 登录按钮 */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  登录中...
                </span>
              ) : (
                '登 录'
              )}
            </motion.button>
          </form>

          {/* 底部信息 */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              默认账号: admin / admin123
            </p>
          </div>
        </div>

        {/* 返回网站链接 */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            ← 返回网站首页
          </a>
        </div>
      </motion.div>
    </div>
  );
}
