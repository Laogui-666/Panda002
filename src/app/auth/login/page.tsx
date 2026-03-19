/**
 * 登录页面
 * 盼达旅行 - 玻璃拟态风格
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';


// Logo
const IconLogo = () => (
  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
    <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 24C16 21.7909 17.7909 20 20 20C22.2091 20 24 21.7909 24 24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="17" cy="18" r="1.5" fill="white"/>
    <circle cx="23" cy="18" r="1.5" fill="white"/>
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7A9D96"/>
        <stop offset="1" stopColor="#5A7D76"/>
      </linearGradient>
    </defs>
  </svg>
);

const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

const IconRefresh = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);


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
        <svg width="120" height="40" className="block">
          {/* 背景噪点 */}
          {Array.from({ length: 30 }).map((_, i) => (
            <circle
              key={`bg-${i}`}
              cx={Math.random() * 120}
              cy={Math.random() * 40}
              r={Math.random() * 1.5}
              fill={colors[Math.floor(Math.random() * colors.length)]}
              opacity={0.3}
            />
          ))}
          {/* 干扰线 */}
          {Array.from({ length: 2 }).map((_, i) => (
            <line
              key={`line-${i}`}
              x1={Math.random() * 120}
              y1={Math.random() * 40}
              x2={Math.random() * 120}
              y2={Math.random() * 40}
              stroke={colors[Math.floor(Math.random() * colors.length)]}
              strokeWidth={1}
              opacity={0.4}
            />
          ))}
          {/* 验证码文字 */}
          {code.split('').map((char, index) => (
            <text
              key={index}
              x={20 + index * 25}
              y={28}
              fontSize={index % 2 === 0 ? 22 : 20}
              fontFamily="Georgia, serif"
              fontWeight="bold"
              fill={colors[index % colors.length]}
              transform={`rotate(${index % 2 === 0 ? -5 : 5}, ${20 + index * 25}, 28)`}
            >
              {char}
            </text>
          ))}
        </svg>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        className="p-2 text-morandi-mist hover:text-morandi-ocean transition-colors"
        title="换一张"
      >
        <IconRefresh />
      </button>
    </div>
  );
};


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string; captcha?: string }>({});


  // 初始化验证码
  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);


  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptcha('');
  };


  const validateForm = () => {
    const newErrors: { username?: string; password?: string; captcha?: string } = {};
    
    if (!formData.username) {
      newErrors.username = '请输入手机号、邮箱或用户名';
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少6位';
    }
    
    if (!captcha) {
      newErrors.captcha = '请输入验证码';
    } else if (captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      newErrors.captcha = '验证码错误';
      refreshCaptcha();
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
        credentials: 'include',
      });


      const data = await response.json();

      if (response.ok) {
        // 登录成功，保存用户信息到localStorage（供ERP等模块使用）
        if (data.data && data.data.user) {
          localStorage.setItem('erp_user', JSON.stringify(data.data.user));
          localStorage.setItem('erp_token', data.data.token);
        }
        // 跳转到ERP系统
        router.push('/erp/dashboard');
      } else {
        // 登录失败，显示错误信息
        setErrors({ ...errors, password: data.message || '用户名或密码错误' });
        refreshCaptcha();
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      setErrors({ ...errors, password: '网络错误，请稍后重试' });
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen gradient-morandi flex items-center justify-center px-3 sm:p-4 relative overflow-hidden">
      {/* 背景装饰 - 移动端隐藏或简化 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 sm:w-80 h-48 sm:h-80 bg-morandi-ocean/20 rounded-full blur-2xl sm:blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-56 sm:w-96 h-56 sm:h-96 bg-morandi-sand/30 rounded-full blur-2xl sm:blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>



      {/* 登录卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 mx-3 sm:mx-0"
      >
        <Card variant="glass" padding="md" className="backdrop-blur-xl">
          {/* Logo和标题 */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div 
              className="inline-flex items-center justify-center mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconLogo />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-morandi-deep mb-2">
              欢迎回来
            </h1>
            <p className="text-morandi-mist text-sm">
              登录您的盼达旅行账户
            </p>
          </div>



          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* 账号输入 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                type="text"
                placeholder="手机号 / 邮箱 / 用户名"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                leftIcon={<IconUser />}
                error={errors.username}
              />
            </motion.div>


            {/* 密码输入 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                leftIcon={<IconLock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-morandi-ocean transition-colors"
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                }
                error={errors.password}
              />
            </motion.div>


            {/* 验证码输入 - 移动端优化 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="space-y-2">
                {/* 验证码图片 - 移动端使用更宽的显示区域 */}
                <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-morandi-mist/20">
                  <div className="flex-1 overflow-hidden rounded-xl">
                    <CaptchaImage code={captchaCode} onRefresh={refreshCaptcha} />
                  </div>

                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 text-morandi-mist hover:text-morandi-ocean transition-colors flex-shrink-0"
                    title="换一张"
                  >
                    <IconRefresh />
                  </button>
                </div>
                {/* 验证码输入框 - 移动端增大触摸区域 */}
                <Input
                  type="text"
                  placeholder="请输入验证码"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4))}
                  error={errors.captcha}
                  className="text-base md:text-sm"
                />
              </div>
            </motion.div>


            {/* 记住我和忘记密码 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  formData.rememberMe 
                    ? 'bg-morandi-ocean border-morandi-ocean' 
                    : 'border-morandi-mist group-hover:border-morandi-ocean'
                }`}>
                  {formData.rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="ml-2 text-sm text-morandi-mist group-hover:text-morandi-deep transition-colors">
                  记住我
                </span>
              </label>
              
              <Link 
                href="/auth/forgot-password"
                className="text-sm text-morandi-ocean hover:text-morandi-deep transition-colors"
              >
                忘记密码？
              </Link>
            </motion.div>


            {/* 登录按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full max-w-xs"
                isLoading={isLoading}
              >
                登录
              </Button>
            </motion.div>
          </form>


          {/* 注册链接 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-sm text-morandi-mist"
          >
            还没有账户？{' '}
            <Link 
              href="/auth/register" 
              className="text-morandi-ocean font-medium hover:underline"
            >
              立即注册
            </Link>
          </motion.p>
        </Card>



        {/* 返回首页 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-4"
        >
          <Link 
            href="/" 
            className="text-sm text-morandi-mist hover:text-morandi-deep transition-colors"
          >
            ← 返回首页
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
