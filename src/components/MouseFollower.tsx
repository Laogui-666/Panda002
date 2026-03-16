/**
 * 鼠标跟随效果组件
 * 提取为独立组件以支持动态导入优化
 */

'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface MouseFollowerProps {
  className?: string;
}

export function MouseFollower({ className }: MouseFollowerProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none z-50 ${className || ''}`}
      style={{
        background: useTransform(
          [smoothX, smoothY],
          ([x, y]) =>
            `radial-gradient(800px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15), transparent 40%)`
        ),
      }}
    />
  );
}

export default MouseFollower;
