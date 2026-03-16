/**
 * 移动端区块组件
 * 用于页面分区管理，提供带标题和可折叠功能的区域容器
 */

'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';

interface MobileSectionProps {
  /** 区块内容 */
  children: React.ReactNode;
  /** 区块标题 */
  title?: string;
  /** 副标题 */
  description?: string;
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 默认展开状态 */
  defaultExpanded?: boolean;
  /** 额外的样式类 */
  className?: string;
  /** 右侧操作区 */
  action?: React.ReactNode;
  /** 是否显示底部圆角 */
  rounded?: boolean;
  /** 是否有阴影 */
  shadowed?: boolean;
}

/**
 * 移动端区块容器
 * 支持标题、描述、可折叠功能
 */
export default function MobileSection({
  children,
  title,
  description,
  collapsible = false,
  defaultExpanded = true,
  className,
  action,
  rounded = true,
  shadowed = false,
}: MobileSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      className={clsx(
        'bg-white',
        rounded && 'rounded-2xl',
        shadowed && 'shadow-sm',
        'overflow-hidden',
        className
      )}
    >
      {/* 区块头部 */}
      {(title || action) && (
        <div
          className={clsx(
            'flex items-center justify-between px-4 py-3',
            collapsible && 'cursor-pointer active:bg-gray-50',
            'border-b border-gray-100'
          )}
          onClick={collapsible ? toggleExpand : undefined}
        >
          <div className="flex-1 min-w-0">
            {title && (
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">{title}</h2>
                {collapsible && (
                  <svg
                    className={clsx(
                      'w-4 h-4 text-gray-400 transition-transform duration-200',
                      expanded && 'rotate-180'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0 ml-3">{action}</div>}
        </div>
      )}

      {/* 区块内容 */}
      {(!collapsible || expanded) && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * 区块标题组件
 */
export function MobileSectionTitle({
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
 * 区块描述组件
 */
export function MobileSectionDescription({
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
 * 区块内容组件
 */
export function MobileSectionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('', className)}>
      {children}
    </div>
  );
}

/**
 * 区块底部操作区
 */
export function MobileSectionFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 简单的分割线
 */
export function MobileSectionDivider({
  className,
}: {
  className?: string;
}) {
  return <div className={clsx('h-px bg-gray-100 my-4', className)} />;
}

/**
 * 空状态组件
 */
export function MobileSectionEmpty({
  children,
  icon,
  className,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-8 text-center', className)}>
      {icon && (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <p className="text-sm text-gray-500">
        {children || '暂无数据'}
      </p>
    </div>
  );
}

/**
 * 加载状态组件
 */
export function MobileSectionLoading({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center justify-center py-8', className)}>
      <div className="w-6 h-6 border-2 border-morandi-ocean border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
