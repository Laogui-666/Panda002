/**
 * 移动端底部导航栏组件
 * 玻璃拟态风格 + 莫兰迪色系
 * 显示：移动端 (hidden md:block)
 * 隐藏：桌面端 (block md:hidden)
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

// 图标组件
const IconHome = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconUser = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconChat = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: '首页', href: '/', icon: <IconHome /> },
  { name: '我的订单', href: '/orders', icon: <IconDocument /> },
  { name: '消息', href: '/messages', icon: <IconChat /> },
  { name: '我的', href: '/profile', icon: <IconUser /> },
];

interface BottomNavProps {
  className?: string;
}

export default function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  // 判断是否为激活状态
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 底部导航容器 - 固定定位 */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${className || ''}`}>
        {/* 玻璃拟态背景 */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-t border-white/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" />
        
        {/* 导航内容 */}
        <div className="relative flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all duration-200 ${
                  active 
                    ? 'text-morandi-ocean' 
                    : 'text-morandi-mist hover:text-morandi-deep'
                }`}
              >
                {/* 图标容器 */}
                <div className={`relative p-1 ${active ? 'scale-110' : ''}`}>
                  {active && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute inset-0 bg-morandi-ocean/10 rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="relative">
                    {item.icon}
                  </div>
                </div>
                
                {/* 文字标签 */}
                <span className={`text-xs font-medium mt-1 ${active ? 'text-morandi-ocean' : 'text-morandi-mist'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 占位元素 - 防止内容被底部导航遮挡 */}
      <div className="h-16 md:hidden" />
    </>
  );
}
