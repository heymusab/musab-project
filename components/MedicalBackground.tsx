'use client';

import React, { useEffect, useRef } from 'react';

export default function MedicalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: 'plus' | 'dot';
      opacity: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 8 + 4;
        this.type = Math.random() > 0.8 ? 'plus' : 'dot';
        this.opacity = Math.random() * 0.2 + 0.05;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#2563eb';

        if (this.type === 'plus') {
          const s = this.size;
          const t = s / 3;
          ctx.fillRect(-s / 2, -t / 2, s, t);
          ctx.fillRect(-t / 2, -s / 2, t, s);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();

    return () => window.removeEventListener('resize', init);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] opacity-30"
    />
  );
}
