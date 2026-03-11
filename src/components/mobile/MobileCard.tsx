/**
 * 移动端卡片组件
 * 采用移动优先设计，默认样式为移动端优化
 */

import React from 'react';
import { clsx } from 'clsx';

interface MobileCardProps {
  /** 卡片内容 */
  children: React.ReactNode;
  /** 额外的样式类 */
  className?: string;
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击事件处理 */
  onClick?: () => void;
  /** 是否显示底部边框 */
  bordered?: boolean;
  /** 是否有阴影 */
  shadowed?: boolean;
  /** 是否有圆角 */
  rounded?: boolean;
}

/**
 * 移动端基础卡片
 * 默认样式：紧凑布局、大触摸区域、无悬停效果
 */
export default function MobileCard({
  children,
  className,
  clickable = false,
  onClick,
  bordered = true,
  shadowed = true,
  rounded = true,
}: MobileCardProps) {
  return (
    <div
      className={clsx(
        // 基础样式：白色背景，移动端优先
        'bg-white',
        // 移动端：紧凑padding，桌面端用md:覆盖
        'p-4',
        // 边框处理
        bordered && 'border-b border-gray-100 last:border-b-0',
        // 圆角处理
        rounded && 'rounded-2xl',
        // 阴影处理
        shadowed && 'shadow-sm',
        // 点击效果：使用active替代hover（移动端无hover）
        clickable && 'active:bg-gray-50 active:scale-[0.99] transition-transform duration-150',
        // 点击处理
        clickable && 'cursor-pointer',
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
}

/**
 * 卡片头部
 */
export function MobileCardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center justify-between mb-3', className)}>
      {children}
    </div>
  );
}

/**
 * 卡片标题
 */
export function MobileCardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx('text-base font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

/**
 * 卡片副标题
 */
export function MobileCardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={clsx('text-sm text-gray-500 mt-1', className)}>
      {children}
    </p>
  );
}

/**
 * 卡片内容
 */
export function MobileCardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-sm text-gray-600', className)}>
      {children}
    </div>
  );
}

/**
 * 卡片底部操作区
 */
export function MobileCardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center gap-3 mt-3 pt-3 border-t border-gray-100', className)}>
      {children}
    </div>
  );
}

/**
 * 卡片徽章/标签
 */
export function MobileCardBadge({
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
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * 卡片图标区域
 */
export function MobileCardIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-morandi-ocean bg-opacity-10 text-morandi-ocean', className)}>
      {children}
    </div>
  );
}
