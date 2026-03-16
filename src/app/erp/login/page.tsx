'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/erp/api-client';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

export default function ERPLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authApi.login(username, password);
      
      if (result.success && result.data) {
        // 保存登录信息
        authApi.setAuth(result.data.token, result.data.user);
        // 跳转仪表盘
        router.push('/erp/dashboard');
      } else {
        setError(result.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/30">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white">沐海旅行ERP系统</h1>
          <p className="text-slate-400 mt-2">签证行业专属管理平台</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">账号登录</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">用户名</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          {/* 测试账号提示 */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">测试账号：</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-300">superadmin / 123456</div>
              <div className="text-slate-300">owner1 / owner123456</div>
              <div className="text-slate-300">deptadmin1 / deptadmin123456</div>
              <div className="text-slate-300">operator1 / operator123456</div>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <p className="text-center text-slate-500 text-sm mt-6">
          沐海旅行科技 © 2024
        </p>
      </div>
    </div>
  );
}
