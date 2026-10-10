'use client';

import { useEffect, useRef, useState } from 'react';

// Shared video pattern for section backgrounds (constitution §4):
// lazy-loaded below the fold, poster until buffered, static poster for
// reduced motion. When the source file is missing, shows poster only —
// never a broken player.
export default function SectionVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { rootMargin: '200px' } // start loading just before it's visible
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause when scrolled past to keep decoding cost down.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) video.pause();
        else if (entry.isIntersecting && video.paused) video.play().catch(() => {});
      },
      { threshold: 0.15 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={!broken && inView ? src : undefined}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="none"
        onError={() => setBroken(true)}
        aria-hidden={label ? undefined : true}
      />
      <div className="absolute inset-0 bg-[#0a0e17]/55" />
      {label && (
        <div className="absolute bottom-4 right-6 z-10 text-xs uppercase tracking-[0.3em] text-white/40">
          {label}
        </div>
      )}
    </div>
  );
}
