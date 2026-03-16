/**
 * 设备类型检测Hook
 * 用于在客户端检测当前设备类型
 */

'use client';

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface UseDeviceTypeReturn {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMounted: boolean;
}

// 断点配置 (与Tailwind一致)
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export function useDeviceType(): UseDeviceTypeReturn {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 标记已挂载，避免服务端/客户端 hydration mismatch
    setIsMounted(true);

    const determineDeviceType = (): DeviceType => {
      if (typeof window === 'undefined') return 'desktop';
      
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.tablet) {
        return 'mobile';
      } else if (width < BREAKPOINTS.desktop) {
        return 'tablet';
      }
      return 'desktop';
    };

    // 初始检测
    setDeviceType(determineDeviceType());

    // 监听窗口大小变化
    const handleResize = () => {
      setDeviceType(determineDeviceType());
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isMounted,
  };
}

export default useDeviceType;
