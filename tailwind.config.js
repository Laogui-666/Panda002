/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 移动端禁用悬停效果：仅在支持悬停的设备（鼠标）上启用hover样式
  // 这样可以避免移动端点击后样式卡在hover状态的问题
  future: {
    hoverOnlyWhenSupported: true,
  },
  // 断点配置保持默认，兼容现有UI
  // 如需精简可后续渐进式调整
  theme: {
    // 保留默认断点：sm(640) / md(768) / lg(1024) / xl(1280) / 2xl(1536)
    // 注意：修改断点会影响现有UI，请谨慎操作
    extend: {
      colors: {
        // 莫兰迪色系 - 偏冷色调 (Morandi Color Palette - Cool Tone)
        morandi: {
          ocean: '#6B8E8E',      // 冷调海洋绿 - 主色调（偏蓝绿）
          oceanLight: '#8FAFAB', // 浅冷海洋绿
          sand: '#B8C4C4',       // 冷调沙色（偏灰绿）
          mist: '#7A8B8B',       // 冷调雾色
          clay: '#7A7D7D',       // 冷调陶土色（偏灰）
          blush: '#D4D8E0',       // 冷调 blush（偏灰紫）
          deep: '#1E2A32',        // 深色文字（偏蓝灰）
          light: '#EEF2F5',      // 浅色背景（偏冷白）
          cream: '#E5EBEE',       // 冷调奶油色
          steel: '#5A6B73',      // 钢蓝色（新增）
          silver: '#9CADB7',      // 银灰色（新增）
        },
        // 玻璃拟态专用
        glass: {
          white: 'rgba(255, 255, 255, 0.6)',
          border: 'rgba(255, 255, 255, 0.4)',
          shadow: 'rgba(31, 38, 135, 0.10)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        display: ['Noto Sans SC', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        'card': '1.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.15)',
        'soft': '0 4px 20px 0 rgba(31, 38, 135, 0.08)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
