import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

// 申请表助手配置
const visaServices = [
  {
    id: 'schengen',
    name: '申根签证',
    nameEn: 'Schengen Visa',
    description: '一次申请，畅游29个申根国家',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-700',
    href: '/services/visa/schengen',
  },
  {
    id: 'uk',
    name: '英国签证',
    nameEn: 'UK Visa',
    description: '包含学生签、工作签、旅游签等',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'from-red-500 to-red-700',
    href: '/services/visa/uk',
  },
  {
    id: 'nz',
    name: '新西兰签证',
    nameEn: 'New Zealand Visa',
    description: '旅游、探亲、商务一站式办理',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    color: 'from-green-500 to-green-700',
    href: '/services/visa/nz',
  },
  {
    id: 'ca',
    name: '加拿大签证',
    nameEn: 'Canada Visa',
    description: '旅游签、学签、工签办理指南',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'from-red-500 to-white',
    href: '/services/visa/ca',
  },
  {
    id: 'us',
    name: '美国签证',
    nameEn: 'US Visa',
    description: 'B1/B2、F1、H1B等签证类型',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
    href: '/services/visa/us',
  },
];

// 入场动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.8, 0.2, 1],
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -6,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function VisaServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <Navbar />
      
<main className="container mx-auto px-4 py-8 pt-24">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="bg-white rounded-3xl shadow-lg py-10 px-8 mb-10"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-morandi-ocean to-morandi-blush rounded-2xl mb-4 shadow-lg shadow-morandi-ocean/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-morandi-deep mb-3">
              全球申请表助手
            </h1>
            <p className="text-morandi-mist text-lg">
              专业、快捷的签证办理指引 · 智能填写申请表
            </p>
          </div>
        </motion.div>

        {/* 服务卡片网格 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {visaServices.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
            >
              <Link href={service.href}>
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col overflow-hidden group"
                >
                  {/* 图标区域 */}
                  <div className={`h-32 flex items-center justify-center bg-gradient-to-br ${service.color} relative overflow-hidden`}>
                    <motion.div
                      className="text-white relative z-10"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.icon}
                    </motion.div>
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
                    {/* 装饰线条 */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-morandi-deep mb-1 group-hover:text-morandi-ocean transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-xs text-morandi-mist mb-3">{service.nameEn}</p>
                    <p className="text-sm text-morandi-mist flex-1">
                      {service.description}
                    </p>
                    
                    {/* 按钮 */}
                    <motion.div
                      className="mt-4"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="inline-flex items-center text-sm font-medium text-morandi-ocean group-hover:text-morandi-deep transition-colors">
                        开始办理
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* 说明区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-morandi-deep mb-6 text-center">使用说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '选择签证类型',
                desc: '选择您需要申请的签证类型',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: '填写申请表',
                desc: '按照步骤向导填写个人信息',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: '导出打印',
                desc: '生成标准申请表导出打印',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-morandi-ocean/10 to-morandi-blush/10 flex items-center justify-center mb-4 text-morandi-ocean">
                  {item.icon}
                </div>
                <div className="text-xs font-medium text-morandi-ocean mb-2">{item.step}</div>
                <h3 className="font-medium text-morandi-deep mb-1">{item.title}</h3>
                <p className="text-sm text-morandi-mist">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
