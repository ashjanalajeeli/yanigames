import React, { useEffect, useRef } from 'react';

interface ConfettiOverlayProps {
  triggerKey: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  shape: 'rect' | 'circle' | 'tri';
  life: number;
}

const COLORS = ['#4FD1A5', '#FF6B6B', '#FFD95A', '#5B9BD5', '#182230'];

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({ triggerKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (triggerKey <= 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];
    const shapes: Array<'rect' | 'circle' | 'tri'> = ['rect', 'circle', 'tri'];

    for (let i = 0; i < 85; i++) {
      const fromLeft = i % 2 === 0;
      particles.push({
        x: fromLeft ? width * 0.25 : width * 0.75,
        y: height * 0.65,
        vx: (Math.random() - 0.5) * 16 + (fromLeft ? 3 : -3),
        vy: -(Math.random() * 14 + 7),
        size: Math.random() * 8 + 6,
        color: COLORS[i % COLORS.length],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.22,
        shape: shapes[i % shapes.length],
        life: 1,
      });
    }

    let rafId = 0;
    let lastTime = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const p of particles) {
        if (p.life <= 0) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.36 * dt;
        p.vx *= 0.99;
        p.rotation += p.vr * dt;
        p.life -= 0.0085 * dt;

        if (p.y < height + 40 && p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(0, -p.size / 2);
            ctx.lineTo(p.size / 2, p.size / 2);
            ctx.lineTo(-p.size / 2, p.size / 2);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (alive) {
        rafId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 w-full h-full"
    />
  );
};
