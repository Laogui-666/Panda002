/**
 * 移动端抽屉菜单组件
 * 玻璃拟态风格 + 莫兰迪色系
 * 从左侧滑出的抽屉导航
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 关闭图标
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// 首页图标
const IconHome = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// 签证图标
const IconVisa = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// 行程图标
const IconItinerary = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

// 钱包图标
const IconWallet = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

// 用户图标
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// 设置图标
const IconSettings = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { name: '首页', href: '/', icon: <IconHome /> },
  { name: '签证评估', href: '/assessment', icon: <IconVisa /> },
  { name: '行程规划', href: '/itinerary', icon: <IconItinerary /> },
  { name: '我的订单', href: '/profile', icon: <IconWallet /> },
  { name: '个人资料', href: '/profile', icon: <IconUser /> },
  { name: '设置', href: '/profile', icon: <IconSettings /> },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function MobileDrawer({ isOpen, onClose, className }: MobileDrawerProps) {
  const pathname = usePathname();

  // 判断是否为激活状态
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // 抽屉变体
  const drawerVariants = {
    hidden: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // 遮罩层变体
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={onClose}
          />

          {/* 抽屉内容 */}
          <motion.div
            className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden ${className || ''}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-morandi-mist/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-morandi-ocean rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">沐</span>
                </div>
                <span className="text-lg font-bold text-morandi-deep">盼达旅行</span>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 text-morandi-mist hover:text-morandi-deep transition-colors"
              >
                <IconClose />
              </button>
            </div>

            {/* 菜单列表 */}
            <nav className="py-4 px-2">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-morandi-ocean/10 text-morandi-ocean'
                        : 'text-morandi-deep hover:bg-morandi-mist/10'
                    }`}
                  >
                    <span className={active ? 'text-morandi-ocean' : 'text-morandi-mist'}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 底部信息 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-morandi-mist/20">
              <p className="text-xs text-morandi-mist text-center">
                © 2024 盼达旅行 版权所有
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
