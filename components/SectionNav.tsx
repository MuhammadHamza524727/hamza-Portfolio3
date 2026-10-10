'use client';

import { useEffect, useState } from 'react';
import { scrollToSection } from './SmoothScroll';

// Fixed side nav — click any section to jump straight there (no long
// scroll-through). Works with the pinned Story because Lenis measures
// the target position live at click time.
const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'story', label: 'Story' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'agentic', label: 'Agentic' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionNav() {
  const [activeId, setActiveId] = useState<string>('hero');

  // Track which section crosses the viewport middle. rootMargin collapses
  // the observation band to a thin strip so exactly one section counts.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {SECTIONS.map((section) => {
        const isActive = section.id === activeId;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="group flex cursor-pointer items-center gap-3"
          >
            <span
              className={`text-[0.65rem] uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? 'text-[#3af58c]'
                  : 'text-white/0 group-hover:text-white/60'
              }`}
            >
              {section.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-2.5 w-2.5 bg-[#3af58c] shadow-[0_0_12px_rgba(58,245,140,0.7)]'
                  : 'h-1.5 w-1.5 bg-white/30 group-hover:bg-white/70'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
