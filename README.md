# WISA — Premium Football Landing Page

A cinematic, scroll-driven landing page for the World International Sports Association.

## Tech Stack
- React 19 + TypeScript
- Vite 6 + @tailwindcss/vite (Tailwind CSS v4)
- Motion (Framer Motion v12+)
- GSAP 3 + ScrollTrigger
- Lucide React icons

## Setup

```bash
npm install
npm run dev
```

## Project Structure

```
wisa/
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx            ← Main page (hero, sections, footer)
    ├── index.css          ← Tailwind v4 + keyframe animations
    └── components/
        ├── ScrollReveal.tsx  ← GSAP word-by-word reveal
        ├── Reveal.tsx        ← Motion viewport fade-in
        └── NavItem.tsx       ← Cycle-counter fly animation
```

## Key Features

### Scroll-Driven Video Background
- Fixed video layer (z-0) with cinematic gradient overlays
- `isSeeking` ref guard prevents frame tearing from rapid scroll events
- Maps scroll fraction 0→1 from page top to footer 20%-from-top

### Fixed Header
- `motion.header` with `useTransform` sliding out at scroll 500–800px
- WISA SVG logo, 5 NavItem links, "BUY MATCH PASS" CTA

### Hero Section (Section 1)
- 12-column grid: heading bottom-left, stats card center-right
- Heading: `clamp(2.5rem, 6vw, 5rem)` cinematic size
- CTA button: glassmorphism → solid white on hover
- Arrow icon: cycle-counter fly-out/fly-in animation

### Capabilities Section (Section 2)
- GSAP `ScrollReveal`: 3 simultaneous ScrollTrigger animations
  (rotation, opacity stagger, blur)
- 3-column bordered grid with animated bar charts and tier indicators

### Glassmorphism Footer (Section 3)
- `rgba(26,26,26,0.6)` + `backdrop-filter: blur(80px)`
- Top CTA, 4-column grid (Brand, Company, Services, Connect), copyright bar

## Video Note
Video is served from Google Drive via direct download URL.
If the video doesn't load, ensure the Drive file sharing is set to "Anyone with the link".
