/**
 * 移动端列表项组件
 * 用于列表展示场景，提供头像、标题、描述、徽章等标准元素
 */

import React from 'react';
import { clsx } from 'clsx';

interface MobileListItemProps {
  /** 列表项内容 */
  children?: React.ReactNode;
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 是否显示底部边框 */
  bordered?: boolean;
  /** 额外的样式类 */
  className?: string;
  /** 左侧图标/头像 */
  avatar?: React.ReactNode;
  /** 右侧内容 */
  right?: React.ReactNode;
  /** 是否显示箭头 */
  arrow?: boolean;
  /** 紧凑模式 */
  compact?: boolean;
}

/**
 * 移动端列表项基础组件
 */
export default function MobileListItem({
  children,
  clickable = false,
  onClick,
  bordered = true,
  className,
  avatar,
  right,
  arrow = false,
  compact = false,
}: MobileListItemProps) {
  return (
    <div
      className={clsx(
        // 基础样式：Flex布局，垂直居中
        'flex items-center',
        // 移动端紧凑padding
        compact ? 'py-2' : 'py-3',
        // 边框
        bordered && 'border-b border-gray-100',
        // 点击效果
        clickable && 'active:bg-gray-50 cursor-pointer',
        // 最小高度，确保触摸区域
        'min-h-[48px]',
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      {/* 左侧图标/头像 */}
      {avatar && <div className="flex-shrink-0 mr-3">{avatar}</div>}

      {/* 中间内容 */}
      <div className="flex-1 min-w-0">
        {children}
      </div>

      {/* 右侧内容 */}
      {right && <div className="flex-shrink-0 ml-3">{right}</div>}

      {/* 右侧箭头 */}
      {arrow && (
        <svg
          className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}

/**
 * 列表项主标题
 */
export function MobileListItemTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-base font-medium text-gray-900 truncate', className)}>
      {children}
    </div>
  );
}

/**
 * 列表项描述
 */
export function MobileListItemDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-sm text-gray-500 mt-0.5 truncate', className)}>
      {children}
    </div>
  );
}

/**
 * 列表项标签/徽章
 */
export function MobileListItemBadge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * 头像组件
 */
export function MobileAvatar({
  src,
  alt,
  size = 'md',
  children,
  className,
}: {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className={clsx('rounded-full object-cover bg-gray-100', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full bg-morandi-ocean bg-opacity-10 flex items-center justify-center text-morandi-ocean',
        sizes[size],
        className
      )}
    >
      {children && <span className={iconSizes[size]}>{children}</span>}
    </div>
  );
}

/**
 * 列表组组件
 */
export function MobileListGroup({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={clsx('bg-white rounded-2xl overflow-hidden', className)}>
      {title && (
        <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * 分隔线
 */
export function MobileListDivider({
  className,
}: {
  className?: string;
}) {
  return <div className={clsx('h-px bg-gray-100', className)} />;
}
