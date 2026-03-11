'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

export default function ThreeDTheme() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    let mouse = { x: width / 2, y: height / 2 };

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.002;
      const currentTheme = themeRef.current;

      for (let i = 0; i < 3; i++) {
        drawRibbon(i, time, currentTheme);
      }

      drawOrbs(time, currentTheme);

      requestAnimationFrame(animate);
    };

    const drawRibbon = (index: number, t: number, currentTheme: string) => {
      ctx.save();
      ctx.beginPath();
      
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const baseAlpha = currentTheme === 'night' ? 0.1 : 0.15;
      const midAlpha = currentTheme === 'night' ? 0.05 : 0.08;

      if (index === 0) {
        gradient.addColorStop(0, `rgba(37, 99, 235, ${baseAlpha})`);
        gradient.addColorStop(0.5, `rgba(99, 102, 241, ${midAlpha})`);
        gradient.addColorStop(1, 'transparent');
      } else if (index === 1) {
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, `rgba(6, 182, 212, ${midAlpha})`);
        gradient.addColorStop(1, `rgba(37, 99, 235, ${baseAlpha})`);
      } else {
        gradient.addColorStop(0, `rgba(139, 92, 246, ${midAlpha})`);
        gradient.addColorStop(1, 'transparent');
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = currentTheme === 'night' ? 2 : 3;

      for (let x = 0; x <= width; x += 10) {
        const xOffset = x * 0.002;
        const yOffset = t * (1 + index * 0.5);
        
        const y = height / 2 + 
                  Math.sin(xOffset + yOffset) * 200 * Math.sin(t * 0.5 + index) +
                  Math.cos(xOffset * 2 - yOffset) * 100 * Math.cos(t * 0.2);

        const mX = (mouse.x - width / 2) * (0.01 * (index + 1));
        const mY = (mouse.y - height / 2) * (0.01 * (index + 1));

        if (x === 0) ctx.moveTo(x + mX, y + mY);
        else ctx.lineTo(x + mX, y + mY);
      }

      ctx.stroke();
      ctx.restore();
    };

    const drawOrbs = (t: number, currentTheme: string) => {
      const alphaMul = currentTheme === 'night' ? 1 : 1.5;
      const orbs = [
        { x: 0.2, y: 0.3, s: 200, c: `rgba(37, 99, 235, ${0.08 * alphaMul})` },
        { x: 0.8, y: 0.7, s: 300, c: `rgba(99, 102, 241, ${0.06 * alphaMul})` },
        { x: 0.5, y: 0.5, s: 400, c: `rgba(6, 182, 212, ${0.04 * alphaMul})` },
      ];

      orbs.forEach((orb, i) => {
        const x = width * orb.x + Math.sin(t + i) * 100;
        const y = height * orb.y + Math.cos(t * 0.8 + i) * 100;
        
        const grad = ctx.createRadialGradient(x, y, 0, x, y, orb.s);
        grad.addColorStop(0, orb.c);
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, orb.s, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-2] opacity-70"
      style={{ filter: 'blur(40px)' }}
    />
  );
}

