'use client';

import React, { useEffect, useRef } from 'react';

export default function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Orb[] = [];
    let mouse = { x: width / 2, y: height / 2 };

    class Orb {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      color: string;
      speed: number;
      angle: number;
      distance: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 100 + 50;
        this.color = Math.random() > 0.5 ? 'rgba(37, 99, 235, 0.08)' : 'rgba(99, 102, 241, 0.08)';
        this.speed = Math.random() * 0.002 + 0.001;
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 100 + 50;
      }

      update() {
        // Subtle floating movement
        this.angle += this.speed;
        const xOff = Math.cos(this.angle) * this.distance;
        const yOff = Math.sin(this.angle) * this.distance;

        // Mouse Parallax
        const dx = (mouse.x - width / 2) * 0.05;
        const dy = (mouse.y - height / 2) * 0.05;

        this.x = this.baseX + xOff + dx;
        this.y = this.baseY + yOff + dy;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      for (let i = 0; i < 15; i++) {
        particles.push(new Orb());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      // Soft background glow
      const bgGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, width * 0.8);
      bgGradient.addColorStop(0, 'rgba(37, 99, 235, 0.03)');
      bgGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
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
      className="fixed inset-0 w-full h-full pointer-events-none z-[-2] opacity-100"
      style={{ filter: 'blur(30px)' }}
    />
  );
}
