'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // Poster is shown until the video can play without skipping frames.
    const video = videoRef.current;
    const showVideo = () => {
      if (video && video.readyState >= 3) video.classList.add('opacity-100');
    };
    if (video) {
      video.addEventListener('canplay', showVideo);
      if (video.readyState >= 3) video.classList.add('opacity-100');
    }

    // Gentle scroll-out drift as the hero leaves the viewport.
    // (no opacity fade — Story starts pinned and full-bright right after,
    // so fading the hero created a visible black gap between sections)
    const ctx = gsap.context(() => {
      gsap.to('.hero-media', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.from('.hero-copy', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
      });
    }, sectionRef);

    return () => {
      video?.removeEventListener('canplay', showVideo);
      ctx.revert(); // clean up ScrollTrigger instances on unmount
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="hero-media absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-0 transition-opacity duration-1000"
          src="/videos/hero.mp4"
          poster="/posters/hero.jpg"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />
        {/* Soft navy vignette so copy stays readable over the glow */}
        <div className="absolute inset-0 bg-[#0a0e17]/40" />
      </div>

      <div className="hero-copy relative z-10 px-6 text-center">
        <p className="eyebrow mb-4">Portfolio — 2026</p>
        <h1 className="text-5xl font-semibold tracking-tight text-white md:text-7xl">
          Muhammad Hamza
        </h1>
        <p className="text-glow mt-4 text-lg text-[#3af58c] md:text-2xl">
          Full-Stack &amp; Agentic AI Developer
        </p>
        <div className="mt-14 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <span className="block h-8 w-px animate-pulse bg-gradient-to-b from-[#3af58c] to-transparent" />
        </div>
      </div>
    </section>
  );
}
