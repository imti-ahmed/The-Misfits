'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CHARS = [
  '·', '∙', '.', '○', '◦', '×', '+', '*',
  '0', '1', '2', '3', '7', '8', '9',
  '#', '@', '!', '%', '&', '/', '\\', '_', '|',
];

const ACCENT = '157, 137, 78';
const COUNT = 120;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  char: string;
  size: number;
  opacity: number;
}

export default function CoolInteraction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Particles
    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        size: 9 + Math.random() * 9,
        opacity: 0.1 + Math.random() * 0.35,
      };
    });

    const state = { speed: 1 };
    const ripple = { active: false, x: 0, y: 0, radius: 0, maxRadius: 0, opacity: 0 };
    let mouseDownPos = { x: 0, y: 0 };

    // Hover slow
    const onMouseEnter = () => {
      gsap.to(state, { speed: 0.15, duration: 0.8, ease: 'power2.out' });
    };
    const onMouseLeave = () => {
      gsap.to(state, { speed: 1, duration: 1.5, ease: 'power2.out' });
    };

    // Click hold + release ripple
    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseDownPos = {
        x: (e.clientX - rect.left) / (rect.width / W),
        y: (e.clientY - rect.top) / (rect.height / H),
      };
    };

    const onMouseUp = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const rx = (e.clientX - rect.left) / (rect.width / W);
      const ry = (e.clientY - rect.top) / (rect.height / H);

      // Ripple ring
      ripple.active = true;
      ripple.x = rx;
      ripple.y = ry;
      ripple.radius = 0;
      ripple.opacity = 0.6;
      ripple.maxRadius = Math.sqrt(W * W + H * H);

      gsap.killTweensOf(ripple);
      gsap.to(ripple, {
        radius: ripple.maxRadius,
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
        onComplete: () => { ripple.active = false; },
      });

      // Push particles
      particles.forEach((p) => {
        const dx = p.x - rx;
        const dy = p.y - ry;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const maxForce = 350;
        if (dist < maxForce) {
          const force = ((maxForce - dist) / maxForce) * 6;
          const nx = dx / dist;
          const ny = dy / dist;
          gsap.killTweensOf(p);
          gsap.to(p, {
            vx: p.baseVx + nx * force,
            vy: p.baseVy + ny * force,
            duration: 0.2,
            ease: 'power3.out',
            onComplete: () => {
              gsap.to(p, {
                vx: p.baseVx,
                vy: p.baseVy,
                duration: 1.8,
                ease: 'power2.out',
              });
            },
          });
        }
      });
    };

    canvas.addEventListener('mouseenter', onMouseEnter);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    // Render loop
    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Ripple ring
      if (ripple.active && ripple.radius > 0) {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ACCENT}, ${ripple.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Particles
      particles.forEach((p) => {
        p.x += p.vx * state.speed;
        p.y += p.vy * state.speed;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(${ACCENT}, ${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mouseenter', onMouseEnter);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
    />
  );
}
