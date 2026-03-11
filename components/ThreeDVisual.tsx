'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

export default function ThreeDVisual() {
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
    
    interface Node {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
    }

    let nodes: Node[] = [];
    const count = 40;

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: (Math.random() - 0.5) * 1000,
          y: (Math.random() - 0.5) * 1000,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          vz: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const project = (node: Node) => {
      const perspective = 600 / (600 + node.z);
      return {
        x: width / 2 + node.x * perspective,
        y: height / 2 + node.y * perspective,
        size: 4 * perspective,
        opacity: Math.min(1, perspective * 1.5),
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.005;
      const currentTheme = themeRef.current;

      // Draw background glow
      const glowColor = currentTheme === 'night' ? 'rgba(37, 99, 235, 0.05)' : 'rgba(37, 99, 235, 0.1)';
      const bgGlow = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width*0.8);
      bgGlow.addColorStop(0, glowColor);
      bgGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Update nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        const s = Math.sin(0.001);
        const c = Math.cos(0.001);
        const rx = n.x * c - n.z * s;
        const rz = n.x * s + n.z * c;
        n.x = rx;
        n.z = rz;

        if (n.z < -500) n.z = 500;
        if (n.z > 500) n.z = -500;
      });

      const sortedNodes = [...nodes].sort((a, b) => b.z - a.z);

      // Draw connections
      ctx.lineWidth = 1;
      const lineColor = currentTheme === 'night' ? '37, 99, 235' : '30, 58, 138';
      for (let i = 0; i < sortedNodes.length; i++) {
        for (let j = i + 1; j < sortedNodes.length; j++) {
          const dx = sortedNodes[i].x - sortedNodes[j].x;
          const dy = sortedNodes[i].y - sortedNodes[j].y;
          const dz = sortedNodes[i].z - sortedNodes[j].z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

          if (dist < 300) {
            const p1 = project(sortedNodes[i]);
            const p2 = project(sortedNodes[j]);
            const opacity = (1 - dist / 300) * p1.opacity * p2.opacity * (currentTheme === 'night' ? 0.2 : 0.4);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      sortedNodes.forEach(n => {
        const p = project(n);
        if (p.size < 0.1) return;

        ctx.beginPath();
        const nodeGlow = currentTheme === 'night' ? '59, 130, 246' : '29, 78, 216';
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${nodeGlow}, ${p.opacity * 0.6})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = currentTheme === 'night' ? `rgba(255, 255, 255, ${p.opacity * 0.8})` : `rgba(30, 58, 138, ${p.opacity * 0.9})`;
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
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
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
}

