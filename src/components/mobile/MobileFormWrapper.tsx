/**
 * 移动端表单容器组件
 * 将桌面端双列/多列布局转换为移动端单列布局
 * 增大移动端输入区域，提升触摸体验
 * 
 * 使用方式：
 * <MobileFormWrapper>
 *   <Input />
 *   <Button />
 * </MobileFormWrapper>
 */

'use client';

import React from 'react';

interface MobileFormWrapperProps {
  children: React.ReactNode;
  className?: string;
  /**
   * 是否在移动端显示底部间距（为底部导航留空间）
   * 默认true
   */
  showBottomPadding?: boolean;
}

export default function MobileFormWrapper({
  children,
  className,
  showBottomPadding = true,
}: MobileFormWrapperProps) {
  return (
    <div className={`${className || ''}`}>
      {/* 表单容器 - 移动端优化 */}
      <div className="flex flex-col gap-4">
        {/* 移动端：单列布局，增大间距和触摸区域 */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
          {children}
        </div>
      </div>

      {/* 底部安全区域 - 为底部导航留空间 */}
      {showBottomPadding && <div className="h-20 md:hidden" />}
    </div>
  );
}

/**
 * 移动端表单单项组件
 * 用于包裹单个表单项，提供统一的移动端样式
 */
interface FormItemProps {
  children: React.ReactNode;
  /**
   * 是否占据整行
   * 移动端默认true，桌面端可通过colSpan控制
   */
  fullWidth?: boolean;
  colSpan?: {
    mobile?: string;
    desktop?: string; // e.g., "col-span-1", "col-span-2"
  };
  className?: string;
}

export function MobileFormItem({
  children,
  fullWidth = true,
  colSpan,
  className,
}: FormItemProps) {
  const mobileClasses = fullWidth ? 'w-full' : '';
  const desktopClasses = colSpan?.desktop || (fullWidth ? 'md:col-span-2' : '');

  return (
    <div className={`${mobileClasses} ${desktopClasses} ${className || ''}`}>
      {children}
    </div>
  );
}

/**
 * 移动端标签组件
 * 优化移动端字体大小和间距
 */
interface MobileLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function MobileLabel({ children, required, className }: MobileLabelProps) {
  return (
    <label className={`block text-sm font-medium text-morandi-deep mb-2 ${className || ''}`}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

/**
 * 移动端按钮组组件
 * 移动端全宽按钮，桌面端并排
 */
interface MobileButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  gap?: string;
}

export function MobileButtonGroup({
  children,
  className,
  gap = 'gap-3',
}: MobileButtonGroupProps) {
  return (
    <div className={`flex flex-col md:flex-row ${gap} ${className || ''}`}>
      {children}
    </div>
  );
}
