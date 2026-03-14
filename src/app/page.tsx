'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/Input';
import { springConfig } from '@/hooks/useAnimation';

// 模拟热门目的地数据 - 10个，按指定顺序
const destinations = [
  {
    id: 1,
    name: '日本',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    visaType: '电子签',
    price: '¥599',
    description: '樱花之国，现代与传统完美融合',
  },
  {
    id: 2,
    name: '韩国',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80',
    visaType: '电子签',
    price: '¥399',
    description: '时尚之都，潮流与美食并存',
  },
  {
    id: 3,
    name: '申根',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    visaType: '申根签',
    price: '¥358',
    description: '浪漫之都，品味多元文化',
  },
  {
    id: 4,
    name: '英国',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    visaType: '标准签',
    price: '¥1299',
    description: '日不落帝国，绅士与文化的殿堂',
  },
  {
    id: 5,
    name: '澳大利亚',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80',
    visaType: '电子签',
    price: '¥1399',
    description: '神奇大陆自然之美',
  },
  {
    id: 6,
    name: '加拿大',
    image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80',
    visaType: '电子签',
    price: '¥1099',
    description: '枫叶之国，壮美自然风光',
  },
  {
    id: 7,
    name: '美国',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
    visaType: '十年签',
    price: '¥1599',
    description: '自由之地，梦想与机遇之城',
  },
  {
    id: 8,
    name: '越南',
    image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80',
    visaType: '电子签',
    price: '¥299',
    description: '东南亚风情，历史与自然交融',
  },
  {
    id: 9,
    name: '马来西亚',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
    visaType: '电子签',
    price: '¥280',
    description: '多元文化，现代与传统并存',
  },
  {
    id: 10,
    name: '泰国',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80',
    visaType: '落地签',
    price: '¥299',
    description: '微笑之国，海岛风情等你探索',
  },
];

// 智能服务 - 6个服务卡片
const services = [
  {
    id: 1,
    name: '行程规划',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    description: '智能规划您的旅行路线',
    status: 'coming_soon',
    color: 'from-morandi-ocean to-morandi-mist',
    iconBg: 'bg-morandi-ocean',
  },
  {
    id: 2,
    name: '签证评估',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    description: 'AI 评估您的签证通过率',
    status: 'coming_soon',
    color: 'from-morandi-sand to-morandi-clay',
    iconBg: 'bg-morandi-sand',
  },
  {
    id: 3,
    name: '一键翻译',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    description: '快速精准的多语言翻译',
    href: '/translation',
    status: 'new',
    color: 'from-morandi-ocean to-morandi-blush',
    iconBg: 'bg-morandi-ocean',
  },
  {
    id: 4,
    name: '证明文件',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    description: '在职/在读证明文件生成',
    status: 'new',
    href: '/proofs',
    color: 'from-morandi-ocean to-morandi-deep',
    iconBg: 'bg-morandi-ocean',
  },
  {
    id: 5,
    name: '申请表助手',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: '智能填写各国签证申请表',
    href: '/services/visa',
    status: 'new',
    color: 'from-morandi-ocean to-morandi-deep',
    iconBg: 'bg-morandi-ocean',
  },
  {
    id: 6,
    name: '敬请期待',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: '更多功能即将上线',
    status: 'coming_soon',
    color: 'from-morandi-mist to-morandi-ocean',
    iconBg: 'bg-morandi-mist',
  },
];

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useState(() => {
    setIsLoaded(true);
  });

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleServiceClick = (feature: string, href?: string) => {
    if (href) {
      router.push(href);
    } else {
      alert(`${feature}功能正在开发中，敬请期待！`);
    }
  };

  return (
    <div className="min-h-screen bg-morandi-light">
      <Navbar transparent />
      
      {/* Hero Section - 占满整个首屏 */}
      <section className="relative min-h-screen w-full flex flex-col">
        {/* 简洁静态背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-morandi-light via-morandi-cream to-morandi-blush" />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-20 md:pt-24 pb-8">
          {/* 标题区域 */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.gentle, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-morandi-deep mb-3 md:mb-4">
              <span className="hidden md:block">四海无界</span>
              <span className="md:hidden">盼达旅行</span>
              <span className="hidden md:block text-morandi-ocean mt-1 block">一站畅游</span>
              <span className="md:hidden text-morandi-ocean text-lg mt-1 block whitespace-nowrap">一站式服务，轻松出境自由行</span>
            </h1>
            <p className="hidden md:block text-base sm:text-lg text-morandi-mist max-w-2xl mx-auto">
              为您提供专业的签证服务，让出境自由行变得简单从容
            </p>
          </motion.div>
          
          {/* 统计数据 */}
          <motion.div
            className="flex justify-center gap-8 md:gap-16 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { value: '50+', label: '热门国家' },
              { value: '10K+', label: '用户服务' },
              { value: '99%+', label: '成功率' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springConfig.medium, delay: 0.5 + index * 0.1 }}
              >
                <div className="text-2xl md:text-4xl font-bold text-morandi-ocean">{stat.value}</div>
                <div className="text-xs md:text-sm text-morandi-mist mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* 搜索框区域 */}
          <motion.div
            className="max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SearchInput
              placeholder="搜索目的地或签证类型..."
              onSearch={handleSearch}
              className="w-full"
            />
          </motion.div>
          
          {/* 热门目的地 - 图片卡片 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-center text-lg font-semibold text-morandi-deep mb-4">热门目的地</h3>
            {/* 国家卡片网格 - 5栏布局 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
              {destinations.map((dest, index) => (
                <Link href={`/itinerary?destination=${dest.id}`} key={dest.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer"
                  >
                    {/* 图片区域 - 占2/3 */}
                    <div className="relative h-20 md:h-24 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-3 text-white font-bold text-base md:text-lg">
                        {dest.name}
                      </div>
                    </div>
                    {/* 信息区域 - 占1/3 */}
                    <div className="p-2 md:p-3 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] md:text-xs bg-morandi-ocean/10 text-morandi-ocean px-2 py-0.5 rounded-full">
                          {dest.visaType}
                        </span>
                        <span className="text-xs md:text-sm font-bold text-morandi-deep">
                          {dest.price}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-xs text-morandi-mist truncate">
                        {dest.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 服务卡片区域 - 无留白 */}
      <section className="py-12 -mt-4 bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springConfig.medium }}
          >
            <h2 className="text-xl md:text-2xl font-semibold text-morandi-deep">
              选择您需要的服务
            </h2>
          </motion.div>
          
          {/* 服务卡片网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springConfig.medium, delay: index * 0.08 }}
                whileHover={{ scale: 1.02, y: -6 }}
              >
                {service.href ? (
                  <Link href={service.href}>
                    <Card
                      variant="glass"
                      glassIntensity="medium"
                      padding="sm"
                      hoverable
                      className="h-full cursor-pointer text-center group relative overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${service.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg ${service.iconBg}/30 group-hover:scale-110 transition-transform duration-300`}>
                          {service.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-morandi-deep mb-1 sm:mb-2 relative z-10">
                        {service.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-morandi-mist relative z-10">
                        {service.description}
                      </p>
                      
                      {service.status === 'new' && (
                        <span className="absolute top-3 right-3 text-[10px] bg-morandi-ocean text-white px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                      {service.status === 'coming_soon' && (
                        <span className="absolute top-3 right-3 text-[10px] bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">
                          即将上线
                        </span>
                      )}
                    </Card>
                  </Link>
                ) : (
                  <Card
                    variant="glass"
                    glassIntensity="medium"
                    padding="sm"
                    hoverable
                    className="h-full cursor-pointer text-center group relative overflow-hidden"
                    onClick={() => handleServiceClick(service.name)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${service.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg ${service.iconBg}/30 group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-morandi-deep mb-1 sm:mb-2 relative z-10">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-morandi-mist relative z-10">
                      {service.description}
                    </p>
                    
                    {service.status === 'new' && (
                      <span className="absolute top-3 right-3 text-[10px] bg-morandi-ocean text-white px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    {service.status === 'coming_soon' && (
                      <span className="absolute top-3 right-3 text-[10px] bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">
                        即将上线
                      </span>
                    )}
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
