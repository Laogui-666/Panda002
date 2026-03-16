/**
 * 基础按钮组件
 * 玻璃拟态风格
 * 移动端优化：默认全宽，增大触摸区域
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  /**
   * 按钮宽度模式
   * - 'full': 移动端全宽，桌面端自适应
   * - 'auto': 始终自适应
   * - 'fixed': 始终固定宽度
   */
  width?: 'full' | 'auto' | 'fixed';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  onClick,
  type = 'button',
  width = 'full',
  title,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none';
  
  const variants = {
    primary: 'bg-morandi-ocean text-white hover:bg-opacity-90 shadow-soft hover:shadow-glass-hover',
    secondary: 'bg-morandi-sand text-morandi-deep hover:bg-opacity-80',
    ghost: 'bg-transparent text-morandi-deep hover:bg-morandi-cream',
    glass: 'glass hover:glass-hover text-morandi-deep',
  };
  
  // 移动端增大触摸区域，桌面端保持原样
  const sizes = {
    sm: 'px-4 py-2.5 text-sm md:py-2',
    md: 'px-6 py-3.5 text-base md:py-3',
    lg: 'px-8 py-4.5 text-lg md:py-4',
  };

  // 移动端全宽适配
  const widthStyles = {
    full: 'w-full md:w-auto',
    auto: 'w-auto',
    fixed: 'w-full',
  };
  
  return (
    <motion.button
      type={type}
      title={title}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        widthStyles[width],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};
