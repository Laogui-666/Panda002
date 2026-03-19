/**
 * 导航栏组件
 * 玻璃拟态风格 - 增强版
 * 使用响应式代码分割优化
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import dynamic from 'next/dynamic';
import { useScrollPosition } from '@/hooks/useAnimation';

// 动态导入桌面端组件
const DesktopNav = dynamic(
  () => import('./nav/DesktopNav'),
  {
    loading: () => <div className="hidden md:flex items-center w-64" />,
    ssr: false,
  }
);

// 动态导入移动端组件
const MobileNav = dynamic(
  () => import('./nav/MobileNav'),
  {
    loading: () => <div className="md:hidden w-10" />,
    ssr: false,
  }
);

interface NavbarProps {
  logo?: React.ReactNode;
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  logo, 
  transparent = false 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollPosition = useScrollPosition();
  
  useEffect(() => {
    setIsScrolled(scrollPosition > 50);
  }, [scrollPosition]);

  // 计算导航栏样式 - 桌面端显示，移动端隐藏
  const getNavStyles = () => {
    const baseStyles = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500';
    
    if (transparent && !isScrolled && !isHovered) {
      return clsx(baseStyles, 'bg-transparent py-5');
    }
    
    // 滚动后或悬停时 - 增强版玻璃拟态
    return clsx(
      baseStyles,
      'py-3',
      'bg-white/70',
      'backdrop-blur-xl',
      'backdrop-saturate-150',
      'border-b border-white/20',
      'shadow-lg shadow-morandi-ocean/5'
    );
  };

  return (
    <motion.nav
      className={getNavStyles()}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景装饰 - 滚动时显示 */}
      <AnimatePresence>
        {(isScrolled || isHovered) && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-morandi-ocean/5 via-transparent to-morandi-blush/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-morandi-ocean to-morandi-mist flex items-center justify-center shadow-lg shadow-morandi-ocean/30 group-hover:scale-105 transition-transform duration-300">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold text-morandi-deep group-hover:text-morandi-ocean transition-colors duration-300">
            {logo || '盼达旅行'}
          </span>
        </Link>
        
        {/* 响应式导航 */}
        <div className="flex items-center">
          <DesktopNav isScrolled={isScrolled} />
          <MobileNav isScrolled={isScrolled} />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
