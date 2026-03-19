/**
 * 忘记密码页面
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

const IconPhone = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const IconMail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconLock = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconArrowLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconSuccess = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="w-20 h-20 bg-morandi-ocean rounded-full flex items-center justify-center mx-auto mb-4"
  >
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  </motion.div>
);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: 输入账号, 2: 验证码, 3: 重置密码, 4: 成功
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 验证码倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (method === 'phone') {
      if (!formData.phone) {
        newErrors.phone = '请输入手机号码';
      } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = '请输入有效的手机号码';
      }
    } else {
      if (!formData.email) {
        newErrors.email = '请输入邮箱地址';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '请输入有效的邮箱地址';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code) {
      newErrors.code = '请输入验证码';
    } else if (formData.code.length !== 6) {
      newErrors.code = '验证码为6位数字';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = '请输入新密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度至少8位';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码输入不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = () => {
    if (method === 'phone') {
      if (!formData.phone) {
        setErrors({ ...errors, phone: '请先输入手机号码' });
        return;
      }
if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        setErrors({ ...errors, phone: '请输入有效的手机号码' });
        return;
      }
    } else {
      if (!formData.email) {
        setErrors({ ...errors, email: '请先输入邮箱地址' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrors({ ...errors, email: '请输入有效的邮箱地址' });
        return;
      }
    }
    setCountdown(60);
    // 这里调用发送验证码API
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setIsLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1500);
  };

  const steps = [
    { num: 1, text: '验证身份' },
    { num: 2, text: '重置密码' },
  ];

  return (
    <div className="min-h-screen gradient-morandi flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-morandi-ocean/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-morandi-sand/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 主卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glass" padding="lg" className="backdrop-blur-xl">
          {/* 返回按钮 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
          >
            <Link 
              href="/auth/login" 
              className="inline-flex items-center text-morandi-mist hover:text-morandi-deep transition-colors"
            >
              <IconArrowLeft />
              <span className="ml-1">返回登录</span>
            </Link>
          </motion.div>

          {/* Logo和标题 */}
          <div className="text-center mb-6">
            <motion.div 
              className="inline-flex items-center justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconLogo />
            </motion.div>
            <h1 className="text-2xl font-bold text-morandi-deep mb-2">
              找回密码
            </h1>
            <p className="text-morandi-mist text-sm">
              {step < 4 ? '通过手机号或邮箱找回您的账户' : '密码重置成功'}
            </p>
          </div>

          {/* 步骤指示器 */}
          {step < 4 && (
            <div className="flex justify-center mb-6">
              {steps.map((s, index) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                    step >= s.num 
                      ? 'bg-morandi-ocean text-white' 
                      : 'bg-morandi-mist/30 text-morandi-mist'
                  }`}>
                    {step > s.num ? <IconCheck /> : s.num}
                  </div>
                  <span className={`ml-2 text-sm ${step >= s.num ? 'text-morandi-deep' : 'text-morandi-mist'}`}>
                    {s.text}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${step > s.num ? 'bg-morandi-ocean' : 'bg-morandi-mist/30'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 表单内容 */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* 验证方式选择 */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                      method === 'phone'
                        ? 'bg-morandi-ocean text-white'
                        : 'bg-morandi-mist/20 text-morandi-mist hover:bg-morandi-mist/30'
                    }`}
                  >
                    手机验证
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                      method === 'email'
                        ? 'bg-morandi-ocean text-white'
                        : 'bg-morandi-mist/20 text-morandi-mist hover:bg-morandi-mist/30'
                    }`}
                  >
                    邮箱验证
                  </button>
                </div>

                {method === 'phone' ? (
                  <Input
                    type="tel"
                    placeholder="请输入手机号码"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    leftIcon={<IconPhone />}
                    error={errors.phone}
                    maxLength={11}
                  />
                ) : (
                  <Input
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    leftIcon={<IconMail />}
                    error={errors.email}
                  />
                )}

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full max-w-xs"
                  onClick={handleNextStep}
                >
                  继续
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center text-sm text-morandi-mist mb-4">
                  {method === 'phone' 
                    ? `验证码已发送至 ${formData.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`
                    : `验证码已发送至 ${formData.email.replace(/(@.*)/, '****$1')}`
                  }
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    leftIcon={<IconMail />}
                    error={errors.code}
                    maxLength={6}
                    className="col-span-2"
                  />
                  <Button
                    type="button"
                    variant="glass"
                    className="w-full"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s` : '重新发送'}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full max-w-xs"
                  onClick={handleNextStep}
                >
                  验证
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  type="password"
                  placeholder="设置新密码（至少8位）"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  leftIcon={<IconLock />}
                  error={errors.password}
                />

                <Input
                  type="password"
                  placeholder="确认新密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  leftIcon={<IconLock />}
                  error={errors.confirmPassword}
                />

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full max-w-xs"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  确认重置
                </Button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <IconSuccess />
                
                <h2 className="text-xl font-bold text-morandi-deep mb-2">
                  密码重置成功
                </h2>
                <p className="text-morandi-mist text-sm mb-6">
                  您现在可以使用新密码登录您的账户
                </p>

                <Link href="/auth/login">
                  <Button variant="primary" size="lg" className="w-full">
                    立即登录
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
