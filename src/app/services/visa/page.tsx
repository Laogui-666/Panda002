'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

// 签证服务配置
const visaServices = [
  {
    id: 'schengen',
    name: '申根签证',
    nameEn: 'Schengen Visa',
    description: '一次申请，畅游29个申根国家',
    icon: '🌍',
    color: 'from-blue-500 to-blue-700',
    href: '/services/visa/schengen',
  },
  {
    id: 'uk',
    name: '英国签证',
    nameEn: 'UK Visa',
    description: '包含学生签、工作签、旅游签等',
    icon: '🇬🇧',
    color: 'from-red-500 to-red-700',
    href: '/services/visa/uk',
  },
  {
    id: 'nz',
    name: '新西兰签证',
    nameEn: 'New Zealand Visa',
    description: '旅游、探亲、商务一站式办理',
    icon: '🇳🇿',
    color: 'from-green-500 to-green-700',
    href: '/services/visa/nz',
  },
  {
    id: 'ca',
    name: '加拿大签证',
    nameEn: 'Canada Visa',
    description: '旅游签、学签、工签办理指南',
    icon: '🇨🇦',
    color: 'from-red-500 to-white',
    href: '/services/visa/ca',
  },
  {
    id: 'us',
    name: '美国签证',
    nameEn: 'US Visa',
    description: 'B1/B2、F1、H1B等签证类型',
    icon: '🇺🇸',
    color: 'from-blue-500 to-blue-600',
    href: '/services/visa/us',
  },
];

export default function VisaServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* 页面标题 */}
        <div className="bg-white rounded-3xl shadow-lg py-8 px-8 mb-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-morandi-deep mb-3">
                全球签证申请助手
              </h1>
              <p className="text-morandi-mist text-lg">
                专业、快捷的签证办理指引 · 智能填写申请表
              </p>
            </motion.div>
          </div>
        </div>

        {/* 服务卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {visaServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={service.href}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden group">
                  {/* 图标区域 */}
                  <div className={`h-32 flex items-center justify-center bg-gradient-to-br ${service.color} relative overflow-hidden`}>
                    <span className="text-5xl relative z-10">{service.icon}</span>
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-morandi-deep mb-1 group-hover:text-morandi-ocean transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-morandi-mist mb-3">{service.nameEn}</p>
                    <p className="text-sm text-morandi-mist flex-1">
                      {service.description}
                    </p>
                    
                    {/* 按钮 */}
                    <div className="mt-4">
                      <span className="inline-flex items-center text-sm font-medium text-morandi-ocean group-hover:translate-x-1 transition-transform">
                        开始办理
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 说明区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-morandi-deep mb-4">使用说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-morandi-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="text-morandi-ocean font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-morandi-deep mb-1">选择签证类型</h3>
                <p className="text-sm text-morandi-mist">选择您需要申请的签证类型</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-morandi-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="text-morandi-ocean font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-morandi-deep mb-1">填写申请表</h3>
                <p className="text-sm text-morandi-mist">按照步骤向导填写个人信息</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-morandi-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="text-morandi-ocean font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-morandi-deep mb-1">导出打印</h3>
                <p className="text-sm text-morandi-mist">生成标准申请表导出打印</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
