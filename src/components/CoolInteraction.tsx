'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const COUNT = 700;
const BASE_SPEED = 0.5;

interface Particle {
  x: number;
  y: number;
  opacity: number;
  size: number;
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

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      opacity: 0.04 + Math.random() * 0.5,
      size: 0.8 + Math.random() * 1.4,
    }));

    const pushes = particles.map(() => ({ vx: 0, vy: 0 }));
    const state = { speed: 1 };
    const ripple = { active: false, x: 0, y: 0, radius: 0, maxRadius: 0, opacity: 0 };

    let t = Math.random() * 100;

    const flowAngle = (x: number, y: number, time: number) => {
      const s = 0.0025;
      return (
        Math.sin(x * s + time * 0.4) * Math.cos(y * s + time * 0.25) * Math.PI * 2.5 +
        Math.sin((x - y) * s * 0.6 + time * 0.15) * Math.PI
      );
    };

    const onMouseEnter = () => gsap.to(state, { speed: 0.12, duration: 1, ease: 'power2.out' });
    const onMouseLeave = () => gsap.to(state, { speed: 1, duration: 2, ease: 'power2.out' });

    const onMouseUp = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const rx = (e.clientX - rect.left) * (W / rect.width);
      const ry = (e.clientY - rect.top) * (H / rect.height);

      ripple.active = true;
      ripple.x = rx;
      ripple.y = ry;
      ripple.radius = 0;
      ripple.opacity = 0.4;
      ripple.maxRadius = Math.sqrt(W * W + H * H);

      gsap.killTweensOf(ripple);
      gsap.to(ripple, {
        radius: ripple.maxRadius,
        opacity: 0,
        duration: 1.6,
        ease: 'power2.out',
        onComplete: () => { ripple.active = false; },
      });

      particles.forEach((p, i) => {
        const dx = p.x - rx;
        const dy = p.y - ry;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 280) {
          const force = ((280 - dist) / 280) * 6;
          gsap.killTweensOf(pushes[i]);
          pushes[i].vx = (dx / dist) * force;
          pushes[i].vy = (dy / dist) * force;
          gsap.to(pushes[i], { vx: 0, vy: 0, duration: 2.2, ease: 'power2.out' });
        }
      });
    };

    canvas.addEventListener('mouseenter', onMouseEnter);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('mouseup', onMouseUp);

    let rafId: number;

    const draw = () => {
      t += 0.004 * state.speed;
      ctx.clearRect(0, 0, W, H);

      if (ripple.active && ripple.radius > 0) {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(216, 216, 216, ${ripple.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      particles.forEach((p, i) => {
        const angle = flowAngle(p.x, p.y, t);
        p.x += (Math.cos(angle) * BASE_SPEED + pushes[i].vx) * state.speed;
        p.y += (Math.sin(angle) * BASE_SPEED + pushes[i].vy) * state.speed;

        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4) p.y = H + 4;
        if (p.y > H + 4) p.y = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 216, 216, ${p.opacity})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mouseenter', onMouseEnter);
      canvas.removeEventListener('mouseleave', onMouseLeave);
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
