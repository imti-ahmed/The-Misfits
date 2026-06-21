'use client';

import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

const GRID_SPACING = 8;
const NOISE_SCALE = 0.005;
const TIME_SPEED = 0.018;
const FLOW_X = 0.7;
const FLOW_Y = 0.25;
const BASE_SIZE = 2;
const MAX_SIZE = 4;
const MOUSE_RADIUS = 100;
const OPACITY_THRESHOLD = 0.28;
const RIPPLE_SPEED = 6;
const RIPPLE_BAND = 14;

interface Dot { x: number; y: number; }
interface Ripple { x: number; y: number; radius: number; maxRadius: number; }

export default function DotGridBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pill = pillRef.current;
    if (!canvas || !pill) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise2D_a = createNoise2D();
    const noise2D_b = createNoise2D();

    let dots: Dot[] = [];
    let ripples: Ripple[] = [];
    let time = 0;
    let rafId: number;
    const mouse = { x: -9999, y: -9999 };

    const buildGrid = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      ctx.imageSmoothingEnabled = false;
      dots = [];
      const offsetX = Math.round((W % GRID_SPACING) / 2);
      const offsetY = Math.round((H % GRID_SPACING) / 2);
      const cols = Math.ceil(W / GRID_SPACING) + 1;
      const rows = Math.ceil(H / GRID_SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: offsetX + c * GRID_SPACING, y: offsetY + r * GRID_SPACING });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const tX = time * FLOW_X;
      const tY = time * FLOW_Y;

      for (const dot of dots) {
        const nx = dot.x * NOISE_SCALE;
        const ny = dot.y * NOISE_SCALE;
        const a = noise2D_a(nx + tX, ny + tY);
        const b = noise2D_b(nx * 1.8 - tX * 0.4, ny * 1.8 + tY * 0.6);
        const norm = ((a * 0.65 + b * 0.35) + 1) / 2;

        let opacity = norm < OPACITY_THRESHOLD ? 0 : (norm - OPACITY_THRESHOLD) / (1 - OPACITY_THRESHOLD);
        let size = BASE_SIZE + (MAX_SIZE - BASE_SIZE) * norm;

        const mdx = dot.x - mouse.x;
        const mdy = dot.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < MOUSE_RADIUS) {
          const boost = 1 - mdist / MOUSE_RADIUS;
          opacity = Math.min(1, opacity + boost * 0.65);
          size = Math.min(MAX_SIZE + 1.5, size + boost * 1.8);
        }

        for (const rip of ripples) {
          const rdx = dot.x - rip.x;
          const rdy = dot.y - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const diff = Math.abs(rdist - rip.radius);
          if (diff < RIPPLE_BAND) {
            const wave = 1 - diff / RIPPLE_BAND;
            opacity = Math.min(1, opacity + wave * 0.45);
            size = Math.min(MAX_SIZE + 1.2, size + wave * 1.2);
          }
        }

        if (opacity <= 0.01) continue;

        const px = Math.round(size);
        ctx.fillStyle = `rgba(216,216,216,${opacity})`;
        ctx.fillRect(dot.x - (px >> 1), dot.y - (px >> 1), px, px);
      }

      for (const rip of ripples) rip.radius += RIPPLE_SPEED;
      ripples = ripples.filter(rip => rip.radius <= rip.maxRadius);

      time += TIME_SPEED;
      rafId = requestAnimationFrame(draw);
    };

    buildGrid();
    draw();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const relY = (e.clientY - rect.top) * (canvas.height / rect.height);
      mouse.x = relX;
      mouse.y = relY;

      pill.style.opacity = '1';
      pill.style.transform = `translate(${relX + 14}px, ${relY + 14}px)`;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      pill.style.opacity = '0';
    };

    const onMouseUp = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      ripples.push({ x, y, radius: 0, maxRadius: Math.sqrt(canvas.width ** 2 + canvas.height ** 2) });
    };

    window.addEventListener('resize', buildGrid);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', buildGrid);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className={className} style={{ position: 'absolute', inset: 0 }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', cursor: 'none' }}
      />
      <div
        ref={pillRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.15s',
        }}
      >
        <span style={{
          display: 'inline-block',
          border: '1px solid rgba(216,216,216,0.4)',
          borderRadius: '999px',
          padding: '5px 14px',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: '#ffffff',
          backgroundColor: '#181818',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          CLICK HERE
        </span>
      </div>
    </div>
  );
}
