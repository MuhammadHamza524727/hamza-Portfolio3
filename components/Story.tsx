'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToY } from './SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

// Subscribe to the prefers-reduced-motion media query without setState-in-effect.
const reducedMqSubscribe = (onChange: () => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

// Constitution 5.2 — 6 scenes, color grade shifts warm -> cool -> navy/green.
const SCENES = [
  {
    video: '/videos/story-01.mp4',
    poster: '/posters/story-01.jpg',
    label: '01 / Sofa',
    caption: 'One day, I was just scrolling when I came across a GIAIC video claiming you could earn $5,000 a month.',
    tint: 'linear-gradient(to top, rgba(255,170,70,0.22), rgba(10,14,23,0.25))',
  },
  {
    video: '/videos/story-02.mp4',
    poster: '/posters/story-02.jpg',
    label: '02 / Struggle',
    caption:
      'As a GenAI beginner, GIAIC’s TypeScript-heavy first quarter challenged me to learn from scratch.',
    tint: 'linear-gradient(to top, rgba(220,130,50,0.25), rgba(10,14,23,0.35))',
  },
  {
    video: '/videos/story-03.mp4',
    poster: '/posters/story-03.jpg',
    label: '03 / Dual grind',
    caption: 'Working at my shop while learning the MERN stack at SMIT on nights and weekends.',
    tint: 'linear-gradient(to right, rgba(255,160,60,0.16), rgba(40,110,170,0.16))',
  },
  {
    video: '/videos/story-04.mp4',
    poster: '/posters/story-04.jpg',
    label: '04 / Build',
    caption: 'Participated in multiple hackathons at SMIT and GIAIC, and was selected as a top student for an interview at SMIT’s Zaitoon Ashraf IT Park.',
    tint: 'linear-gradient(to top, rgba(40,200,160,0.16), rgba(10,14,23,0.30))',
  },
  {
    video: '/videos/story-05.mp4',
    poster: '/posters/story-05.jpg',
    label: '05 / Closed',
    caption: 'First client deals — signed.',
    tint: 'linear-gradient(to top, rgba(60,190,120,0.14), rgba(10,14,23,0.32))',
  },
  {
    video: '/videos/story-06.mp4',
    poster: '/posters/story-06.jpg',
    label: '06 / Cafe',
    caption: 'Now: freelancing, creating YouTube content, and coding from a cozy café — living life on my own terms.',
    tint: 'radial-gradient(ellipse at center, rgba(58,245,140,0.12), rgba(10,14,23,0.45))',
  },
];

const N = SCENES.length;
// How much scroll travel each 8s clip gets, in viewport screens.
// KNOB: 0.6 = scenes fly by fast; 1.1 ≈ comfortable cinematic pace;
// higher = each scene lingers longer under your finger.
const SCREENS_PER_SCENE = 1.1;
// Crossfade half-length in progress units: each transition takes half a
// scene's worth of scroll — slow enough to read as a soft blur-mix, not a cut.
const TRANSITION = 0.5 / N;
const MAX_BLUR = 16; // px of blur at the exact middle of a transition

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function Story() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const reduced = useSyncExternalStore(
    reducedMqSubscribe,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false // SSR: assume motion allowed; client corrects on hydration
  );

  // TRUE SCROLL-SCRUBBING: video frames are 1:1 bound to scroll position.
  // Scroll stop => video freezes mid-frame. Reverse => video rewinds.
  // Fast flick => fast-forward. No playback loops at all.
  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Applied per frame: fade+blur crossfade between adjacent scenes and
      // each scene's currentTime mapped to its scroll segment.
      const applyFrame = (p: number) => {
        const seg = 1 / N;
        const active = Math.min(N - 1, Math.floor(p * N));

        for (let i = 0; i < N; i++) {
          const scene = sceneRefs.current[i];
          const video = videoRefs.current[i];
          if (!scene) continue;

          const start = i * seg;
          const end = (i + 1) * seg;

          // Opacity: fade in around `start`, fade out around `end`.
          // First scene starts visible; last scene never fades out
          // (the pin releases straight into the About section).
          let opacity = 1;
          if (i > 0) {
            opacity = Math.min(opacity, clamp01((p - (start - TRANSITION)) / (2 * TRANSITION)));
          }
          if (i < N - 1) {
            opacity = Math.min(opacity, 1 - clamp01((p - (end - TRANSITION)) / (2 * TRANSITION)));
          }
          scene.style.opacity = String(opacity);
          // Blur only while actually inside a transition — a constant
          // blur(0) would force an extra compositor layer for every scene.
          scene.style.filter = opacity < 1 ? `blur(${((1 - opacity) * MAX_BLUR).toFixed(1)}px)` : 'none';

          // Scrub window spans the scene's whole visible span (fade-in
          // included) so the clip is already moving as it fades in.
          const scrubStart = i === 0 ? 0 : start - TRANSITION;
          const local = clamp01((p - scrubStart) / (seg + TRANSITION));
          if (video && Number.isFinite(video.duration) && video.duration > 0) {
            const t = local * (video.duration - 0.04);
            // Skip no-op seeks and don't queue onto an in-flight seek —
            // each extra seek costs a full decode round-trip.
            if (!video.seeking && Math.abs(video.currentTime - t) > 0.03) {
              video.currentTime = t;
            }
          }
        }

        setActiveIndex((prev) => (prev === active ? prev : active));
      };

      const st = ScrollTrigger.create({
        // id lets scrollToSection() target the pin START from anywhere —
        // a pinned section's live element position below the pin is the
        // pin END, which would drop nav-clickers at the last scene.
        id: 'story-pin',
        trigger: rootRef.current,
        start: 'top top',
        // Per-scene travel: see SCREENS_PER_SCENE. Total = 6.6 screens.
        end: () => '+=' + window.innerHeight * N * SCREENS_PER_SCENE,
        pin: true,
        pinSpacing: true,
        scrub: true, // 1:1 — Lenis already provides the easing
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onUpdate: (self) => applyFrame(self.progress),
        onRefresh: (self) => applyFrame(self.progress),
      });
      triggerRef.current = st;

      applyFrame(st.progress);
    }, rootRef);

    // Snapshot the ref array now: current may have changed by cleanup time.
    const videos = [...videoRefs.current];
    return () => {
      videos.forEach((v) => v?.pause());
      triggerRef.current = null;
      ctx.revert(); // kills pinned ScrollTrigger instance on unmount
    };
  }, [reduced]);

  // Lazy-load: only load sources within ±1 scene of the active one.
  useEffect(() => {
    if (reduced) return;
    const videos = [...videoRefs.current];
    videos.forEach((video, i) => {
      if (!video) return;
      if (Math.abs(i - activeIndex) <= 1 && video.readyState === 0) {
        video.src = SCENES[i].video;
        video.preload = 'auto';
        video.load();
      }
      if (i !== activeIndex && !video.paused) video.pause();
    });
  }, [activeIndex, reduced]);

  // Progress-dot click: jump straight to a scene's scroll position.
  const jumpToScene = (i: number) => {
    const st = triggerRef.current;
    if (!st) return;
    const target = st.start + ((i + 0.5) / N) * (st.end - st.start);
    scrollToY(target, 1.2);
  };

  return (
    <section ref={rootRef} id="story" className="relative w-full">
      {reduced ? (
        // Reduced motion: no pinning, no videos — static posters per scene.
        SCENES.map((scene, i) => (
          <div key={i} className="relative flex h-screen items-end">
            <Image
              src={scene.poster}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div
              className="absolute inset-0"
              style={{ background: scene.tint }}
            />
            <StoryCaption scene={scene} />
          </div>
        ))
      ) : (
        <div className="relative h-screen w-full overflow-hidden bg-[#0a0e17]">
          {SCENES.map((scene, i) => (
            <div
              key={i}
              ref={(el) => {
                sceneRefs.current[i] = el;
              }}
              className="story-scene absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="h-full w-full object-cover"
                poster={scene.poster}
                muted
                playsInline
                preload="none" // below-the-fold scenes are lazy-loaded
              />
              <div className="absolute inset-0" style={{ background: scene.tint }} />
              <StoryCaption scene={scene} />
            </div>
          ))}

          {/* Persistent header + clickable progress dots */}
          <div className="absolute left-6 top-8 z-20 md:left-12">
            <p className="eyebrow">My Story</p>
            <div className="mt-4 flex gap-2">
              {SCENES.map((scene, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Jump to scene ${i + 1}: ${scene.label}`}
                  onClick={() => jumpToScene(i)}
                  className={`h-1 cursor-pointer rounded-full transition-all duration-500 ${
                    i === activeIndex
                      ? 'w-6 bg-[#3af58c]'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StoryCaption({
  scene,
}: {
  scene: (typeof SCENES)[number];
}) {
  return (
    <div className="absolute bottom-16 left-6 z-10 max-w-md md:bottom-24 md:left-12">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
        {scene.label}
      </p>
      <p className="mt-2 max-w-xl text-2xl font-medium leading-snug text-white md:text-4xl">
        {scene.caption}
      </p>
    </div>
  );
}
