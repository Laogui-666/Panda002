/**
 * 注册页面
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

// Logo图标
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

const IconPhone = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const IconLock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconMail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconRefresh = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// 密码强度计算
const calculatePasswordStrength = (password: string): { level: number; text: string; color: string } => {
  if (!password) return { level: 0, text: '', color: '' };
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  const levels = [
    { level: 0, text: '', color: '' },
    { level: 1, text: '弱', color: 'bg-red-400' },
    { level: 2, text: '中等', color: 'bg-yellow-400' },
    { level: 3, text: '强', color: 'bg-green-400' },
    { level: 4, text: '非常强', color: 'bg-morandi-ocean' },
  ];
  
  return levels[Math.min(strength, 4)];
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
        <svg width="120" height="40" className="block">
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

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [registerMethod, setRegisterMethod] = useState<'phone' | 'username'>('username');
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const passwordStrength = calculatePasswordStrength(formData.password);

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 初始化验证码
  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptcha('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (registerMethod === 'username') {
      if (!formData.username) {
        newErrors.username = '请输入账号';
      } else if (formData.username.length < 4) {
        newErrors.username = '账号长度至少4位';
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = '请输入手机号码';
      } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = '请输入有效的手机号码';
      }
      
      if (!formData.code) {
        newErrors.code = '请输入验证码';
      }
    }
    
    if (!formData.password) {
      newErrors.password = '请设置密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度至少8位';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码输入不一致';
    }
    
    if (!captcha) {
      newErrors.captcha = '请输入验证码';
    } else if (captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      newErrors.captcha = '验证码错误';
      refreshCaptcha();
    }
    
    if (!agreedToTerms) {
      newErrors.terms = '请同意用户协议和隐私政策';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = () => {
    if (!formData.phone) {
      setErrors({ ...errors, phone: '请先输入手机号码' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      setErrors({ ...errors, phone: '请输入有效的手机号码' });
      return;
    }
    setCountdown(60);
    // 这里调用发送验证码API
  };

  const handleSubmit = async (e: React.FormEvent) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerMethod === 'username' ? formData.username : formData.phone,
          password: formData.password,
          nickname: registerMethod === 'username' ? formData.username : formData.phone,
          phone: formData.phone || null,
          email: formData.email || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/auth/login');
      } else {
        setErrors({ ...errors, username: data.message || '注册失败' });
        refreshCaptcha();
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      setErrors({ ...errors, username: '网络错误' });
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };
  };

  return (
    <div className="min-h-screen gradient-morandi flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-morandi-sand/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-morandi-ocean/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 注册卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 mx-3 sm:mx-0"
      >
        <Card variant="glass" padding="md" className="backdrop-blur-xl">
          {/* Logo和标题 */}
          <div className="text-center mb-4 sm:mb-6">
            <motion.div 
              className="inline-flex items-center justify-center mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconLogo />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold text-morandi-deep mb-2">
              创建账户
            </h1>
            <p className="text-morandi-mist text-sm">
              注册成为盼达旅行会员
            </p>
          </div>

          {/* 注册方式选择 */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setRegisterMethod('username')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                registerMethod === 'username'
                  ? 'bg-morandi-ocean text-white'
                  : 'bg-morandi-mist/20 text-morandi-mist hover:bg-morandi-mist/30'
              }`}
            >
              账号注册
            </button>
            <button
              type="button"
              onClick={() => setRegisterMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                registerMethod === 'phone'
                  ? 'bg-morandi-ocean text-white'
                  : 'bg-morandi-mist/20 text-morandi-mist hover:bg-morandi-mist/30'
              }`}
            >
              手机号注册
            </button>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 账号输入 */}
            {registerMethod === 'username' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  type="text"
                  placeholder="账号"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  leftIcon={<IconUser />}
                  error={errors.username}
                />
              </motion.div>
            )}

            {/* 手机号和验证码 */}
            {registerMethod === 'phone' && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="tel"
                      placeholder="手机号码"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      leftIcon={<IconPhone />}
                      error={errors.phone}
                      maxLength={11}
                    />
                    <Button
                      type="button"
                      variant="glass"
                      className="w-full h-full min-h-[50px]"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Input
                    type="text"
                    placeholder="请输入6位验证码"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    leftIcon={<IconMail />}
                    error={errors.code}
                    maxLength={6}
                  />
                </motion.div>
              </>
            )}

            {/* 密码输入 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="设置密码（至少8位）"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                leftIcon={<IconLock />}
                error={errors.password}
              />
              {/* 密码强度指示器 */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.level >= i ? passwordStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-morandi-mist">
                    密码强度：{passwordStrength.text}
                  </p>
                </div>
              )}
            </motion.div>

            {/* 确认密码 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="确认密码"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                leftIcon={<IconLock />}
                error={errors.confirmPassword}
              />
            </motion.div>

            {/* 邮箱（可选） */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Input
                type="email"
                placeholder="邮箱地址（用于登录和找回密码）"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                leftIcon={<IconMail />}
                error={errors.email}
              />
            </motion.div>

            {/* 验证码 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-2">
                <CaptchaImage code={captchaCode} onRefresh={refreshCaptcha} />
                <Input
                  type="text"
                  placeholder="请输入验证码"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4))}
                  error={errors.captcha}
                />
              </div>
            </motion.div>

            {/* 密码显示切换 */}
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center cursor-pointer text-sm text-morandi-mist"
            >
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                showPassword ? 'bg-morandi-ocean border-morandi-ocean' : 'border-morandi-mist'
              }`}>
                {showPassword && <IconCheck />}
              </div>
              显示密码
            </motion.label>

            {/* 用户协议 */}
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start cursor-pointer"
            >
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
                agreedToTerms 
                  ? 'bg-morandi-ocean border-morandi-ocean' 
                  : 'border-morandi-mist hover:border-morandi-ocean'
              }`}>
                {agreedToTerms && <IconCheck />}
              </div>
              <span className="ml-2 text-sm text-morandi-mist">
                我已阅读并同意{' '}
                <a href="#" className="text-morandi-ocean hover:underline">《用户协议》</a>
                {' '}和{' '}
                <a href="#" className="text-morandi-ocean hover:underline">《隐私政策》</a>
              </span>
            </motion.label>
            {errors.terms && (
              <p className="text-sm text-red-500 mt-1">{errors.terms}</p>
            )}

            {/* 注册按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex justify-center"
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full max-w-xs"
                isLoading={isLoading}
              >
                立即注册
              </Button>
            </motion.div>
          </form>

          {/* 登录链接 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-sm text-morandi-mist"
          >
            已有账户？{' '}
            <Link 
              href="/auth/login" 
              className="text-morandi-ocean font-medium hover:underline"
            >
              立即登录
            </Link>
          </motion.p>
        </Card>

        {/* 返回首页 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
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


