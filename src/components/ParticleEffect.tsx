/**
 * 粒子特效组件 - Hero区域鼠标跟随粒子效果
 * 仅在桌面端显示
 */

'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleEffect() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 初始化粒子
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
      });
    }
    setParticles(newParticles);
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 鼠标跟随
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  return (
    <div className="relative w-full h-full">
      {/* 粒子 */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'radial-gradient(circle, rgba(120, 140, 160, 0.6) 0%, rgba(120, 140, 160, 0) 70%)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* 鼠标光晕效果 */}
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]) =>
              `radial-gradient(circle at center, rgba(99, 121, 140, 0.15) 0%, rgba(99, 121, 140, 0.05) 40%, transparent 70%)`
          ),
          x: useTransform(smoothX, (x) => x - 128),
          y: useTransform(smoothY, (y) => y - 128),
        }}
      />
      
      {/* 第二个光晕层 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]) =>
              `radial-gradient(circle at center, rgba(140, 160, 180, 0.08) 0%, transparent 60%)`
          ),
          x: useTransform(smoothX, (x) => x - 192),
          y: useTransform(smoothY, (y) => y - 192),
        }}
      />
    </div>
  );
}

export default ParticleEffect;
