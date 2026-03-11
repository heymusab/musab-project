'use client';

import React, { useEffect, useRef } from 'react';

export default function ThreeDGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      time += 0.01;

      const gap = 40;
      const rows = height / gap + 20;
      const cols = width / gap + 20;

      ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
      ctx.lineWidth = 1;

      for (let i = -10; i < cols; i++) {
        ctx.beginPath();
        for (let j = -10; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;

          // Wave effect
          const dist = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(y - mouse.y, 2));
          const wave = Math.sin(dist * 0.01 - time * 2) * 15;
          const z = Math.sin(x * 0.005 + y * 0.005 + time) * 30;

          // Perspective projection
          const px = x + (x - width / 2) * (z * 0.001);
          const py = y + (y - height / 2) * (z * 0.001) + wave;

          if (j === -10) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      for (let j = -10; j < rows; j++) {
        ctx.beginPath();
        for (let i = -10; i < cols; i++) {
          const x = i * gap;
          const y = j * gap;

          const dist = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(y - mouse.y, 2));
          const wave = Math.sin(dist * 0.01 - time * 2) * 15;
          const z = Math.sin(x * 0.005 + y * 0.005 + time) * 30;

          const px = x + (x - width / 2) * (z * 0.001);
          const py = y + (y - height / 2) * (z * 0.001) + wave;

          if (i === -10) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
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
      className="fixed inset-0 w-full h-full pointer-events-none z-[-3] opacity-30"
    />
  );
}
