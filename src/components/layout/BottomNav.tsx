/**
 * 底部导航栏组件
 * 手机端底部固定导航
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface BottomNavProps {
  isLoggedIn?: boolean;
}

const navItems = [
  {
    name: '首页',
    href: '/',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: '签证',
    href: '/visa-news',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: '行程',
    href: '/itinerary',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    name: '我的',
    href: '/profile',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ isLoggedIn = false }) => {
  const pathname = usePathname();

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 md:hidden z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="glass border-t border-morandi-mist/20 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={isLoggedIn || item.href === '/' ? item.href : '/auth/login'}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-morandi-ocean'
                    : 'text-morandi-mist hover:text-morandi-deep'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-morandi-ocean/10' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-morandi-ocean' : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area padding for notched phones */}
      <div className="h-safe-area-bottom bg-morandi-light" />
    </motion.div>
  );
};
