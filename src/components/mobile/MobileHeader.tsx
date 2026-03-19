/**
 * 移动端顶部导航栏组件
 * 玻璃拟态风格 + 莫兰迪色系
 * 显示：移动端 (block md:hidden)
 * 隐藏：桌面端 (hidden md:block)
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 返回图标
const IconArrowLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

// 菜单图标
const IconMenu = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// 搜索图标
const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export default function MobileHeader({
  title = '盼达旅行',
  showBack = false,
  showMenu = false,
  showSearch = false,
  onMenuClick,
  onSearchClick,
  rightContent,
  className,
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* 顶部导航容器 - 固定定位 */}
      <header className={`fixed top-0 left-0 right-0 z-40 md:hidden ${className || ''}`}>
        {/* 玻璃拟态背景 */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm" />
        
        {/* 导航内容 */}
        <div className="relative flex items-center justify-between h-14 px-4">
          {/* 左侧：返回/菜单按钮 */}
          <div className="flex items-center">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 -ml-2 text-morandi-deep hover:text-morandi-ocean transition-colors"
              >
                <IconArrowLeft />
              </button>
            )}
            
            {showMenu && !showBack && (
              <button
                onClick={onMenuClick}
                className="flex items-center justify-center w-10 h-10 -ml-2 text-morandi-deep hover:text-morandi-ocean transition-colors"
              >
                <IconMenu />
              </button>
            )}
          </div>

          {/* 中间：标题 */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-morandi-deep truncate">
              {title}
            </h1>
          </div>

          {/* 右侧：搜索/自定义内容 */}
          <div className="flex items-center">
            {showSearch && (
              <button
                onClick={onSearchClick}
                className="flex items-center justify-center w-10 h-10 text-morandi-deep hover:text-morandi-ocean transition-colors"
              >
                <IconSearch />
              </button>
            )}
            
            {rightContent && (
              <div className="ml-2">
                {rightContent}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 占位元素 - 防止内容被顶部导航遮挡 */}
      <div className="h-14 md:hidden" />
    </>
  );
}
