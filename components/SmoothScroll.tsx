'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Live Lenis scroll velocity (px/frame), readable by any component that
// wants to react to scroll speed (e.g. Story's velocity-linked playback).
// Kept in a module singleton so consumers don't need context plumbing.
let lenisVelocity = 0;
export const getScrollVelocity = () => lenisVelocity;

// Lenis instance + mount state, so nav buttons can smooth-scroll to any
// section (works with pinned sections too — positions are measured live).
let lenisInstance: Lenis | null = null;
export function scrollToY(y: number, duration = 1.4) {
  if (lenisInstance) {
    lenisInstance.scrollTo(y, { duration });
  } else {
    // Reduced-motion path (no Lenis): native smooth scroll.
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Pinned sections: the element's live position below the pin is the pin
  // END (ScrollTrigger parks it at the spacer's bottom), so measuring it
  // would land nav-clickers at the story's LAST scene. Use the pin start.
  const pin = id === 'story' ? ScrollTrigger.getById('story-pin') : undefined;
  const target: number | HTMLElement = pin ? pin.start : el;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.4 });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    // Reduced-motion path (no Lenis): native smooth scroll.
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Store actual page height before hydration so the announcement bar
// (browser URL/search UI) doesn't shift the layout when Lenis init changes
// scroll dimensions.
const setBodyMinHeight = () => {
  document.body.style.minHeight = '100svh';
};

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Reduced motion: skip Lenis entirely, but still refresh ScrollTrigger
    // so triggers positioned for native scroll work correctly.
    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    setBodyMinHeight();

    const lenis = new Lenis({
      // NOTE: since the raf-time fix below, these values behave per the
      // docs again (they were effectively dead before — see raf comment).
      // 0.12: smooth but follows your wheel closely (Lenis default is 0.1).
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.6,
    });

    // Drive Lenis via GSAP's ticker and keep ScrollTrigger in sync.
    lenis.on('scroll', () => {
      lenisVelocity = lenis.velocity;
      ScrollTrigger.update();
    });

    // Scrollbar-drag / keyboard takeover: while Lenis is animating (our
    // scrollTo or wheel inertia) it IGNORES native scroll events
    // (see onNativeScroll: only honored when isScrolling is false/'native'),
    // so dragging the scrollbar gets yanked back to the animation target.
    // Detect the mismatch and cancel the animation — the user's drag wins.
    const onNativeScrollTakeover = () => {
      if (!lenis.isScrolling) return;
      if (Math.abs(window.scrollY - lenis.animatedScroll) > 5) {
        // stop() resets the animation and syncs to the real scroll
        // position; start() immediately re-enables user scrolling.
        lenis.stop();
        lenis.start();
      }
    };
    window.addEventListener('scroll', onNativeScrollTakeover, { passive: true });

    lenisInstance = lenis;

    const raf = (time: number) => {
      // GSAP's ticker passes `time` in SECONDS, but Lenis.raf() expects
      // MILLISECONDS (it does `advance(delta * 0.001)`). Passing seconds
      // made every Lenis animation run 1000× slow — nav scrollTo looked
      // dead, the scrollbar got ignored (Lenis stuck in 'smooth' state),
      // and the wheel felt underwater. This is the official integration:
      // gsap.ticker.add((time) => lenis.raf(time * 1000))
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger needs to measure Lenis's scroll position on refresh.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener('scroll', onNativeScrollTakeover);
      lenis.destroy();
      lenisVelocity = 0;
      lenisInstance = null;
      document.body.style.minHeight = '';
      // Kill only triggers created while this provider was mounted.
      // (child ctx.revert() calls handle their own cleanup first)
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <div data-lenis-wrapper>{children}</div>;
}
