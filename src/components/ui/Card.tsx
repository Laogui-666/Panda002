/**
 * 玻璃拟态卡片组件
 * 增强版 - 精致的玻璃效果
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  glassIntensity?: 'light' | 'medium' | 'strong';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'glass',
      padding = 'md',
      hoverable = false,
      glassIntensity = 'medium',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-3xl transition-all duration-300';
    
    const variants = {
      glass: {
        light: 'bg-white/40 backdrop-blur-md border border-white/30 shadow-lg shadow-morandi-ocean/5',
        medium: 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-morandi-ocean/10',
        strong: 'bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-morandi-ocean/15',
      },
      solid: 'bg-white shadow-soft',
      outlined: 'bg-transparent border border-morandi-mist border-opacity-30',
    };
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    
    return (
      <motion.div
        ref={ref}
        className={clsx(
          baseStyles,
          variant === 'glass' ? variants.glass[glassIntensity] : variants[variant],
          paddings[padding],
          hoverable && 'card-hover cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/**
 * 卡片头部
 */
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('mb-4', className)}>{children}</div>
);

/**
 * 卡片内容
 */
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('', className)}>{children}</div>
);

/**
 * 卡片底部
 */
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('mt-4 pt-4 border-t border-morandi-mist border-opacity-20', className)}>
    {children}
  </div>
);
