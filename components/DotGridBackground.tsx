'use client';

import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

const GRID_SPACING = 14;
const NOISE_SCALE = 0.006;
const TIME_SPEED = 0.003;
const BASE_SIZE = 1.5;
const MAX_SIZE = 3.0;
const MOUSE_RADIUS = 100;
const OPACITY_THRESHOLD = 0.35;

interface Dot {
  x: number;
  y: number;
}

export default function DotGridBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise3D = createNoise3D();
    let dots: Dot[] = [];
    let time = 0;
    let rafId: number;
    const mouse = { x: -9999, y: -9999 };

    const buildGrid = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      dots = [];
      const offsetX = (W % GRID_SPACING) / 2;
      const offsetY = (H % GRID_SPACING) / 2;
      const cols = Math.ceil(W / GRID_SPACING) + 1;
      const rows = Math.ceil(H / GRID_SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: offsetX + c * GRID_SPACING, y: offsetY + r * GRID_SPACING });
        }
      }
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const dot of dots) {
        const n = noise3D(dot.x * NOISE_SCALE, dot.y * NOISE_SCALE, time);
        const norm = (n + 1) / 2;

        let opacity = norm < OPACITY_THRESHOLD ? 0 : (norm - OPACITY_THRESHOLD) / (1 - OPACITY_THRESHOLD);
        let size = BASE_SIZE + (MAX_SIZE - BASE_SIZE) * norm;

        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const boost = 1 - dist / MOUSE_RADIUS;
          opacity = Math.min(1, opacity + boost * 0.65);
          size = Math.min(MAX_SIZE + 1.5, size + boost * 1.8);
        }

        if (opacity <= 0.01) continue;

        ctx.fillStyle = `rgba(216,216,216,${opacity})`;
        ctx.fillRect(dot.x - size / 2, dot.y - size / 2, size, size);
      }

      time += TIME_SPEED;
      rafId = requestAnimationFrame(draw);
    };

    buildGrid();
    draw();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () => buildGrid();

    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
