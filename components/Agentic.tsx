'use client';

import { useEffect, useRef } from 'react';
import Reveal from './Reveal';
import SectionVideo from './SectionVideo';

// Constitution 5.5: independent glowing dots moving autonomously,
// connecting/disconnecting — no central structure. Decorative canvas,
// skipped entirely when reduced motion is on.
function AgentDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    interface Dot {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }
    const N = 26;
    const LINK_DIST = 130;
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots: Dot[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    const tick = () => {
      ctx2d.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = 1 - dist / LINK_DIST;
            ctx2d.strokeStyle = `rgba(58,245,140,${alpha * 0.35})`;
            ctx2d.lineWidth = 1;
            ctx2d.beginPath();
            ctx2d.moveTo(dots[i].x, dots[i].y);
            ctx2d.lineTo(dots[j].x, dots[j].y);
            ctx2d.stroke();
          }
        }
        ctx2d.fillStyle = 'rgba(58,245,140,0.9)';
        ctx2d.beginPath();
        ctx2d.arc(dots[i].x, dots[i].y, 2, 0, Math.PI * 2);
        ctx2d.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

export default function Agentic() {
  return (
    <section
      id="agentic"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <SectionVideo src="/videos/agentic.mp4" poster="/posters/agentic.jpg" />
      <AgentDots />
      <Reveal className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow">Agentic AI</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white md:text-6xl">
          Autonomous systems, no handrails.
        </h2>
        <p className="mt-6 max-w-xl leading-relaxed text-white/75">
          I build with agentic AI systems — independent agents that plan,
          use tools, and hand off to each other. Less prompt, more
          orchestration.
        </p>
      </Reveal>
    </section>
  );
}
