/**
 * 移动端模态框组件
 * 提供全屏模态框体验，更适合移动端操作
 */

'use client';

import React, { useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { createPortal } from 'react-dom';

interface MobileModalProps {
  /** 是否显示模态框 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 模态框标题 */
  title?: string;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 是否点击遮罩层关闭 */
  maskClosable?: boolean;
  /** 是否显示底部操作按钮 */
  footer?: React.ReactNode;
  /** 模态框内容 */
  children: React.ReactNode;
  /** 额外的样式类 */
  className?: string;
  /** 是否为全屏模式（无圆角） */
  fullscreen?: boolean;
  /** 是否显示底部安全区域（针对iPhone） */
  safeAreaBottom?: boolean;
}

/**
 * 移动端模态框
 * 从底部滑入，全屏显示
 */
export default function MobileModal({
  open,
  onClose,
  title,
  showCloseButton = true,
  maskClosable = true,
  footer,
  children,
  className,
  fullscreen = true,
  safeAreaBottom = true,
}: MobileModalProps) {
  // 阻止事件冒泡，防止误触发
  const handleMaskClick = useCallback(() => {
    if (maskClosable) {
      onClose();
    }
  }, [maskClosable, onClose]);

  // 锁定body滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* 遮罩层 */}
      <div
        className={clsx(
          'absolute inset-0 bg-black transition-opacity duration-300',
          open ? 'opacity-50' : 'opacity-0'
        )}
        onClick={handleMaskClick}
      />

      {/* 模态框主体 */}
      <div
        className={clsx(
          'relative z-10 flex flex-col bg-white',
          'transform transition-transform duration-300 ease-out',
          'max-h-[90vh]',
          fullscreen ? 'rounded-none' : 'rounded-t-2xl',
          safeAreaBottom && 'pb-env(safe-area-inset-bottom, 20px)',
          className
        )}
        style={{
          marginTop: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* 顶部标题栏 */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex-1">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 text-center">{title}</h2>
              )}
            </div>
            {showCloseButton && (
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100 -mr-2"
                onClick={onClose}
                aria-label="关闭"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 模态框内容 */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* 底部操作区 */}
        {footer && (
          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // 使用Portal渲染到body
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}

/**
 * 模态框底部按钮组
 */
export function MobileModalFooter({
  children,
  className,
  direction = 'horizontal',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}) {
  return (
    <div
      className={clsx(
        'flex gap-3',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 确认对话框
 */
interface MobileConfirmProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function MobileConfirm({
  open,
  title = '确认',
  message,
  confirmText = '确认',
  cancelText = '取消',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: MobileConfirmProps) {
  return (
    <MobileModal
      open={open}
      title={title}
      onClose={onCancel}
      showCloseButton={false}
      footer={
        <MobileModalFooter className="w-full">
          <button
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium active:bg-gray-200"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={clsx(
              'flex-1 py-3 rounded-xl font-medium',
              confirmVariant === 'primary'
                ? 'bg-morandi-ocean text-white active:bg-opacity-90'
                : 'bg-red-500 text-white active:bg-red-600'
            )}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </MobileModalFooter>
      }
    >
      <div className="py-4">
        <p className="text-gray-600 text-center">{message}</p>
      </div>
    </MobileModal>
  );
}

/**
 * 操作菜单（从底部滑出）
 */
interface MobileActionSheetProps {
  open: boolean;
  onClose: () => void;
  actions: Array<{
    label: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
  }>;
  title?: string;
  cancelText?: string;
}

export function MobileActionSheet({
  open,
  onClose,
  actions,
  title,
  cancelText = '取消',
}: MobileActionSheetProps) {
  return (
    <MobileModal
      open={open}
      onClose={onClose}
      fullscreen={false}
      safeAreaBottom={false}
      className="rounded-t-2xl"
      footer={
        <button
          className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium active:bg-gray-200"
          onClick={onClose}
        >
          {cancelText}
        </button>
      }
    >
      <div className="py-2">
        {/* 标题 */}
        {title && (
          <div className="px-4 py-3 text-center">
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        )}

        {/* 操作项 */}
        {actions.map((action, index) => (
          <button
            key={index}
            className={clsx(
              'w-full px-4 py-3 text-center',
              'border-b border-gray-100 last:border-b-0',
              action.danger ? 'text-red-500' : 'text-gray-900',
              action.disabled && 'opacity-50 cursor-not-allowed',
              !action.disabled && 'active:bg-gray-50'
            )}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            disabled={action.disabled}
          >
            {action.label}
          </button>
        ))}
      </div>
    </MobileModal>
  );
}
