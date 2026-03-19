/**
 * 响应式视图组件
 * 根据设备类型条件渲染不同的组件
 * 使用动态导入实现代码分割，减少bundle体积
 */

'use client';

import React, { Suspense } from 'react';
import { useDeviceType, DeviceType } from '@/hooks/useDeviceType';

// 加载占位符
function DefaultLoading() {
  return (
    <div className="animate-pulse bg-morandi-mist/20 rounded-lg h-10 w-full" />
  );
}

interface ResponsiveViewProps {
  /** 桌面端组件 */
  desktop?: React.ReactNode;
  /** 平板端组件（可选，默认使用desktop） */
  tablet?: React.ReactNode;
  /** 手机端组件 */
  mobile?: React.ReactNode;
  /** 加载时的占位符 */
  loading?: React.ReactNode;
  /** 默认渲染的设备类型（服务端渲染时使用） */
  defaultDevice?: DeviceType;
}

/**
 * ResponsiveView - 响应式视图组件
 * 
 * 使用示例:
 * <ResponsiveView
 *   desktop={<DesktopNav />}
 *   mobile={<MobileNav />}
 * />
 */
export function ResponsiveView({
  desktop,
  tablet,
  mobile,
  loading,
  defaultDevice = 'desktop',
}: ResponsiveViewProps) {
  const { deviceType, isMounted } = useDeviceType();

  // 服务端渲染或未挂载时，使用默认设备类型
  const currentDevice = isMounted ? deviceType : defaultDevice;

  // 选择渲染哪个组件
  let content: React.ReactNode;
  
  switch (currentDevice) {
    case 'mobile':
      content = mobile || desktop;
      break;
    case 'tablet':
      content = tablet || desktop;
      break;
    case 'desktop':
    default:
      content = desktop;
      break;
  }

  // 如果没有内容，返回null
  if (!content) {
    return null;
  }

  // 渲染内容
  return (
    <Suspense fallback={loading || <DefaultLoading />}>
      {content}
    </Suspense>
  );
}

/**
 * 条件可见组件
 * 仅在指定设备类型时渲染子组件，其他设备类型不渲染（不在DOM中）
 */
interface VisibleProps {
  /** 要显示的设备类型 */
  when: DeviceType | DeviceType[];
  /** 子组件 */
  children: React.ReactNode;
  /** 隐藏时的回退组件（可选） */
  fallback?: React.ReactNode;
}

export function Visible({ when, children, fallback = null }: VisibleProps) {
  const { deviceType, isMounted } = useDeviceType();
  
  const currentDevice = isMounted ? deviceType : 'desktop';
  const targetDevices = Array.isArray(when) ? when : [when];
  
  if (targetDevices.includes(currentDevice)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

/**
 * 隐藏组件
 * 在指定设备类型时隐藏（不渲染）
 */
interface HiddenProps {
  /** 要隐藏的设备类型 */
  device: DeviceType | DeviceType[];
  /** 子组件 */
  children: React.ReactNode;
}

export function Hidden({ device, children }: HiddenProps) {
  const { deviceType, isMounted } = useDeviceType();
  
  const currentDevice = isMounted ? deviceType : 'desktop';
  const hiddenDevices = Array.isArray(device) ? device : [device];
  
  // 如果当前设备在隐藏列表中，不渲染任何内容
  if (hiddenDevices.includes(currentDevice)) {
    return null;
  }
  
  return <>{children}</>;
}

export default ResponsiveView;
