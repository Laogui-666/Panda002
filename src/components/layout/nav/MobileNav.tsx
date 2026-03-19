/**
 * 移动端导航栏组件
 * 仅在移动端加载
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface MobileNavProps {
  isScrolled?: boolean;
}

const navLinks = [
  { name: '首页', href: '/' },
  { name: '签证资讯', href: '/visa-news' },
  { name: '行程单定制', href: '/itinerary' },
  { name: '签证评估', href: '/assessment' },
  { name: '一键翻译', href: '/translation' },
  { name: '证明文件', href: '/proofs' },
  
  { name: '申请表助手', href: '/services/visa' },
];

export function MobileNav({ isScrolled = false }: MobileNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 移动端汉堡菜单按钮 */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-morandi-deep"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* 移动端下拉菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 md:hidden glass mt-4 mx-4 rounded-2xl overflow-hidden z-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-3 text-morandi-deep hover:text-morandi-ocean transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {/* 移动端底部导航提示 */}
              <div className="pt-4 border-t border-morandi-mist/20 mt-4">
                <p className="text-sm text-morandi-mist text-center">
                  可在底部导航快速切换
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileNav;
