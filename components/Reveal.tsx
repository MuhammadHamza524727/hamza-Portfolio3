'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Constitution §4: every section uses Reveal — clip-path + opacity GSAP
// animation, triggered at top 85%. Skipped entirely for reduced motion.
export default function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-content',
        {
          clipPath: 'inset(0 0 100% 0)',
          opacity: 0,
          // Cloud-feel: content resolves out of a blur, matching the
          // fade+blur scene transitions inside the Story section.
          filter: 'blur(14px)',
        },
        {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, rootRef);

    return () => ctx.revert(); // clean up ScrollTrigger on unmount
  }, []);

  return (
    <div ref={rootRef} className={className}>
      <div className="reveal-content">{children}</div>
    </div>
  );
}
