# Muhammad Hamza — Portfolio Landing Page Constitution

Single source of truth for the cinematic scroll portfolio build. Built with Freebuff, deployed on Vercel.

---

## 1. Identity

- **Owner:** Muhammad Hamza — Full-Stack Developer (Next.js, React, MERN) + Agentic AI Developer
- **Purpose:** Personal portfolio for client-facing use
- **Tone:** Calm, premium, cinematic. No clutter, no generic stock-AI look.
- **Style reference:** 2026 Awwwards-style scroll-driven sites (Lenis + GSAP ScrollTrigger + Framer Motion)

## 2. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js (App Router) | scaffolded via Freebuff |
| Smooth scroll | Lenis | `npm install lenis` |
| Scroll animation | GSAP + ScrollTrigger | `npm install gsap` |
| Page/UI motion | Framer Motion | `npm install framer-motion` |
| Styling | Tailwind CSS | utility classes only |
| Hosting | Vercel | free tier |
| Visual assets | Google Flow (image + image-to-video) | paid Flow subscription, not shown on camera |

## 3. Brand System

- **Background:** dark navy `#0a0e17`
- **Accent:** green (highlight key words/glows), white for body text
- **Font:** Coolvetica-style sans-serif for headings
- **Motion feel:** slow, physics-based (Lenis lerp ~0.08), restrained parallax, no overkill
- **Accessibility:** respect `prefers-reduced-motion` everywhere; fallback to a static poster image per section when reduced motion is on

## 4. Global Behavior

- Lenis wraps the whole app (`SmoothScroll` provider in `app/layout.jsx`)
- Every section uses a `Reveal` component (clip-path + opacity GSAP animation, triggered at `top 85%`)
- Page transitions handled by `app/template.jsx` (Framer Motion fade + slide)
- All background videos: muted, autoplay, loop, lazy-loaded below the fold
- Film-grain overlay class (`.grain`) applied globally for texture

## 5. Section-by-Section Spec

### 5.1 Hero
- **Visual:** scattered glowing green light ribbons drifting into a soft focal glow (no code text, no wireframe nodes — avoid stock-AI cliché)
- **Copy:** name + one-line identity ("Full-Stack & Agentic AI Developer")
- **Asset:** `hero.mp4` + `hero-poster.jpg`

### 5.2 My Story (scroll narrative — 6 scenes)
Personal journey, photorealistic cinematic character (Hamza's own likeness), color grade shifts warm → cool as the story progresses, ending in the site's navy/green palette.

| # | Scene | Beat | Lighting |
|---|---|---|---|
| 1 | Sofa | Sees a video about earning through Generative AI | warm golden |
| 2 | Struggle | Enrolled in GenAI course, stuck on TypeScript-heavy first quarter | warm, dimmer |
| 3 | Dual grind | Running his own shop by day, studying MERN stack at SMIT by night | warm → cool split |
| 4 | Hackathon/build | Building big projects, hackathons | cool teal-green |
| 5 | Deal closed | Lands client deals | cool navy-green |
| 6 | Cafe (transition) | Calm, coding in a cafe abroad; camera pushes through the glass into the laptop screen, which becomes the Projects section | full navy `#0a0e17` + green glow |

- **Assets:** `story-01.mp4` … `story-06.mp4` (+ matching posters)
- Scene 6's final frame glow must visually match the Hero section's opening glow, for a seamless cut.

### 5.3 About / Skills
- **Visual:** three transparent glass layers floating independently, each a different green shade (literal "full stack")
- **Copy:** stack summary — Next.js, React, MERN, agentic AI tooling
- **Asset:** `about.mp4`

### 5.4 Projects
One node-style scene per project, abstracted to the project's core idea.

| Project | Visual concept |
|---|---|
| Tikchen (MERN admin panel, JWT auth) | glowing node with a secure/locked gate motif |
| PicnicIQ (AI picnic-planning app) | organic curved lines merging with a data grid |

- **Assets:** `project-tikchen.mp4`, `project-picniciq.mp4`
- Each project card: name, one-line description, tech used, live link/GitHub link

### 5.5 Agentic AI
- **Visual:** independent glowing dots moving autonomously, connecting/disconnecting, no central structure (represents autonomous agents)
- **Copy:** short note on his interest/work in agentic AI systems
- **Asset:** `agentic.mp4`

### 5.6 Contact / CTA
- **Visual:** light trails converging into a single bright point
- **Copy:** short CTA + contact links
- **Links:**
  - LinkedIn: https://linkedin.com/in/muhammad-hamza-1461432a5
  - GitHub: https://github.com/MuhammadHamza524727
  - Instagram: https://www.instagram.com/hmzarj77
- **Asset:** `contact.mp4`

## 6. Video Asset Pipeline

1. Generate character reference image in Flow (photorealistic, from Hamza's own photo)
2. Generate each scene's still image using the reference, lock the look before animating
3. Convert the locked image to a short loopable clip (image-to-video) — 4-6 seconds per clip
4. Download at Flow's highest available resolution
5. Compress + resize for web:

```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 -c:v libx264 -crf 28 -preset slow -c:a none output.mp4
```
Target: 1920x1080, 3-6MB per clip. Export a static poster frame (JPG) from each clip for the reduced-motion fallback and for initial page load before video buffers.

## 7. Folder Structure

```
public/
  videos/
    hero.mp4
    story-01.mp4 ... story-06.mp4
    about.mp4
    project-tikchen.mp4
    project-picniciq.mp4
    agentic.mp4
    contact.mp4
  posters/
    (matching .jpg for each video above)
components/
  SmoothScroll.jsx
  Reveal.jsx
  Hero.jsx
  Story.jsx
  About.jsx
  Projects.jsx
  Agentic.jsx
  Contact.jsx
app/
  layout.jsx
  template.jsx
  page.jsx
  globals.css
```

## 8. Performance Checklist

- [ ] All videos compressed to target size before upload
- [ ] Poster image shown until video is ready
- [ ] `prefers-reduced-motion` disables Lenis + heavy GSAP motion, shows static posters
- [ ] Videos below the fold are lazy-loaded
- [ ] GSAP ScrollTrigger instances cleaned up on unmount (no scroll-jank or memory leaks)
- [ ] Lighthouse check before final deploy
