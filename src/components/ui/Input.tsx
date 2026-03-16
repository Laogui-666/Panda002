/**
 * 输入框组件
 * 玻璃拟态风格
 * 移动端优化：增大输入区域和字体
 */

import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'glass' | 'solid';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      variant = 'glass',
      className,
      ...props
    },
    ref
  ) => {
    // 移动端增大输入区域，桌面端保持原样
    const baseStyles = 'w-full px-4 py-3.5 md:py-3 rounded-2xl transition-all duration-300 focus:outline-none hover:border-morandi-ocean/50 hover:shadow-md text-base md:text-sm';
    
    const variants = {
      glass: 'glass bg-white bg-opacity-50 focus:bg-opacity-70',
      solid: 'bg-white border border-morandi-mist border-opacity-30 focus:border-morandi-ocean',
    };
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-morandi-deep mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-morandi-mist">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              baseStyles,
              variants[variant],
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-red-400 focus:border-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-morandi-mist">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * 搜索输入框
 */
interface SearchInputProps extends Omit<InputProps, 'variant'> {
  onSearch?: (value: string) => void;
  showSearchButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, showSearchButton = true, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(e.currentTarget.value);
      }
    };

    const handleSearchClick = () => {
      const input = document.querySelector('input[placeholder*="搜索"]') as HTMLInputElement;
      if (input && onSearch) {
        onSearch(input.value);
      }
    };
    
    return (
      <div className="relative flex items-center gap-2 w-full">
        <div className="flex-1">
          <Input
            ref={ref}
            variant="glass"
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            onKeyDown={handleKeyDown}
            {...props}
          />
        </div>
        {showSearchButton && (
          <button
            type="button"
            onClick={handleSearchClick}
            className="px-5 py-3 bg-morandi-ocean text-white rounded-2xl hover:bg-morandi-deep transition-colors duration-200 font-medium text-sm whitespace-nowrap h-12 md:h-auto"
          >
            搜索
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput'

/**
 * 文本域组件
 */
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'glass' | 'solid';
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      variant = 'glass',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full px-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none resize-none hover:border-morandi-ocean/50 hover:shadow-md'
    
    const variants = {
      glass: 'glass bg-white bg-opacity-50 focus:bg-opacity-70',
      solid: 'bg-white border border-morandi-mist border-opacity-30 focus:border-morandi-ocean',
    }
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-morandi-deep mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            baseStyles,
            variants[variant],
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

/**
 * 下拉选择组件
 */
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      className,
      onChange,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-morandi-deep mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            className={clsx(
              'w-full px-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer hover:border-morandi-ocean/50 hover:shadow-md',
              'bg-white border border-morandi-mist/30 focus:border-morandi-ocean focus:ring-2 focus:ring-morandi-ocean/20',
              disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
              error && 'border-red-400 focus:border-red-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-morandi-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
