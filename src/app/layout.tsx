/**
 * 全局布局
 */

import React from 'react';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import BottomNav from '@/components/mobile/BottomNav';
import MobileHeader from '@/components/mobile/MobileHeader';

export const metadata: Metadata = {
  title: '盼达旅行-四海无界，一站畅游',
  description: '为您的出境自由行提供专业的签证服务，让出境自由行变得简单从容',
  keywords: '签证,出境游,自由行,日本签证,泰国签证,欧洲签证',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 移动端顶部导航 - 仅移动端显示 */}
        <div className="block md:hidden">
          <MobileHeader title="盼达旅行" />
        </div>
        
        {/* 主内容区域 */}
        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>
        
        {/* 移动端底部导航 - 仅移动端显示 */}
        <div className="block md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
