/**
 * 导航组件导出
 * 使用动态导入实现代码分割
 */

import dynamic from 'next/dynamic';

// 桌面端导航 - 使用动态导入
export const DesktopNav = dynamic(
  () => import('./DesktopNav'),
  {
    loading: () => <div className="hidden md:block w-full h-10" />,
    ssr: true, // 桌面端保持SSR
  }
);

// 移动端导航 - 使用动态导入
export const MobileNav = dynamic(
  () => import('./MobileNav'),
  {
    loading: () => <div className="md:hidden w-full h-10" />,
    ssr: false, // 移动端组件不需要SSR，减少服务端负担
  }
);

// 统一导出
export { DesktopNav as default } from './DesktopNav';
