'use client';

import React, { useEffect, useRef } from 'react';

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: Point[] = [];
    const particleCount = 120;
    const maxDistance = 180;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: -100, y: -100 };

    interface Point {
      x: number;
      y: number;
      vx: number;
      vy: number;
      origX: number;
      origY: number;
      size: number;
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      points = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        points.push({
          x,
          y,
          origX: x,
          origY: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse Attraction/Repulsion logic
      points.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x -= (dx / dist) * force * 5;
          p.y -= (dy / dist) * force * 5;
        }

        // Return to natural flow
        p.x += (p.origX - p.x) * 0.02;
        p.y += (p.origY - p.y) * 0.02;

        p.x += p.vx;
        p.y += p.vy;
        p.origX += p.vx;
        p.origY += p.vy;

        if (p.origX < 0 || p.origX > width) p.vx *= -1;
        if (p.origY < 0 || p.origY > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - dist / maxDistance)})`;
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
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
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-50"
      style={{ filter: 'blur(1px)' }}
    />
  );
}
