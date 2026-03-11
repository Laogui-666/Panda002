/**
 * 桌面端导航栏组件
 * 仅在桌面端加载
 * 玻璃拟态风格增强版
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface DesktopNavProps {
  isScrolled?: boolean;
}

const navLinks = [
  { name: '首页', href: '/' },
  { name: '签证资讯', href: '/visa-news' },
  { name: '行程单定制', href: '/itinerary' },
  { name: '签证评估', href: '/assessment' },
  { name: '一键翻译', href: '/translation' },
  { name: '证明文件', href: '/proofs' },
  { name: '特色功能', href: '/features' },
];

export function DesktopNav({ isScrolled = false }: DesktopNavProps) {
  return (
    <>
      {/* 桌面端导航链接 - 按钮形式 */}
      <div className="hidden md:flex items-center gap-2 lg:gap-3">
        {navLinks.map((link) => (
          <motion.div
            key={link.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={link.href}
              className={`
                px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium transition-all duration-300
                ${isScrolled 
                  ? 'bg-morandi-ocean/10 text-morandi-deep hover:bg-morandi-ocean/20 hover:text-morandi-ocean border border-transparent hover:border-morandi-ocean/30' 
                  : 'bg-white/20 text-morandi-deep hover:bg-white/30 hover:text-morandi-deep border border-white/30 backdrop-blur-sm'
                }
              `}
            >
              {link.name}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 桌面端登录注册按钮 */}
      <div className="hidden md:flex items-center gap-3 ml-4 lg:ml-6">
        <Link href="/auth/login">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-5 lg:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${isScrolled 
                ? 'bg-morandi-ocean text-white hover:bg-morandi-ocean/90 shadow-lg shadow-morandi-ocean/30' 
                : 'bg-white/30 text-morandi-deep backdrop-blur-sm hover:bg-white/50'
              }
            `}
          >
            登录
          </motion.button>
        </Link>
        <Link href="/auth/register">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-5 lg:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${isScrolled 
                ? 'bg-morandi-deep text-white hover:bg-morandi-deep/90' 
                : 'bg-morandi-deep/80 text-white hover:bg-morandi-deep'
              }
            `}
          >
            注册
          </motion.button>
        </Link>
      </div>
    </>
  );
}

export default DesktopNav;
