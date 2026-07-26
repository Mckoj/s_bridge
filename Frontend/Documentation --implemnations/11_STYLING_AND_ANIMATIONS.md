# 11 – Styling & Animations

> **Parent Doc:** [README.md](./README.md)
> **Source files:**
> - [`src/index.css`](../src/index.css)
> - [`vite.config.ts`](../vite.config.ts)

---

## Styling Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Utility classes | **Tailwind CSS v4** | Via `@tailwindcss/vite` plugin — no config file needed |
| Global styles | **`index.css`** | Imports Tailwind + custom keyframes + Lenis overrides |
| Component-scoped | Tailwind classes inline in JSX | No CSS Modules or styled-components |
| Animation (scroll) | **GSAP + ScrollTrigger** | Imperative, via `useScrollAnimation` hook |
| Animation (UI) | **Framer Motion** | Declarative, used in landing sections |
| Smooth scroll | **Lenis** | Replaces native scroll behaviour |
| Fonts | **@fontsource** | Inter + Poppins, loaded in `main.tsx` |

---

## Tailwind CSS v4

The project uses **Tailwind CSS v4**, which differs from v3 in key ways:

- **No `tailwind.config.js`** — configuration is done in CSS or via the Vite plugin
- **`@import "tailwindcss"`** — single import replaces the three `@tailwind base/components/utilities` directives
- **`@utility` directive** — used to define custom utility classes (replaces `@layer utilities`)
- Colours and design tokens are defined in CSS using `@theme`

```css
/* index.css — v4 import */
@import "tailwindcss";
```

---

## `index.css` — Global Stylesheet

**File:** [`src/index.css`](../src/index.css)

### 1. Tailwind Import
```css
@import "tailwindcss";
```

### 2. Lenis Smooth Scroll Overrides

The Lenis scroll library takes over all scrolling. Native browser smooth-scroll must be disabled to prevent conflicts:

```css
html {
  scroll-behavior: auto !important;
}

html.lenis {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;   /* contained scroll for modal/panels */
}

.lenis.lenis-stopped {
  overflow: hidden;               /* locks body when a modal is open */
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;           /* prevents iframe from stealing scroll events */
}
```

> **`data-lenis-prevent`** is an attribute you can add to any element (e.g. a scrollable modal) to opt it out of Lenis and keep native scroll behaviour inside it.

### 3. Custom Keyframe Animations

Three `@keyframes` are defined for chart and UI animations:

#### `draw-donut`
```css
@keyframes draw-donut {
  from { stroke-dashoffset: 238.76; }
}
```
Used by `DonutChart.tsx`. Starts with the full stroke offset (equal to the circle circumference `2πr ≈ 238.76` for `r=38`) and transitions to whatever offset the segment requires, creating a "filling" effect.

#### `draw-line`
```css
@keyframes draw-line {
  to { stroke-dashoffset: 0; }
}
```
Used by `LineChart.tsx`. Combined with a pre-set `stroke-dasharray` matching the path length, this animates the line "drawing" itself onto the screen.

#### `fade-in`
```css
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```
A simple opacity fade. Used for elements that appear without a positional animation.

### 4. Custom Utility Bindings (`@utility`)

Tailwind v4's `@utility` directive creates named utility classes that apply the keyframe animations:

```css
@utility animate-draw-donut {
  animation: draw-donut 0.8s ease-out forwards;
}

@utility stroke-draw {
  animation: draw-line 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@utility animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
```

**Usage in TSX:**
```tsx
<circle className="animate-draw-donut" ... />
<path   className="stroke-draw" ... />
<div    className="animate-fade-in" />
```

---

## Dark Mode Implementation

Dark mode is a **class-based** toggle (not `prefers-color-scheme` media query). The `"dark"` class is added/removed on `<html>` by `DashboardContext`:

```ts
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}, [theme]);
```

Initial resolution order:
1. `localStorage "theme"` (user's last choice)
2. `window.matchMedia("(prefers-color-scheme: dark)")` (OS preference)
3. Default: `"light"`

Components use conditional Tailwind classes based on the `theme` value:

```tsx
// Pattern used throughout all dashboard components:
const dark = useDashboard().theme === "dark";

<div className={dark ? "bg-slate-900 text-white" : "bg-white text-slate-800"}>
```

> Note: Because the `DashboardContext` class toggle approach is used instead of Tailwind's built-in `dark:` prefix utilities, most dashboard components use this manual conditional class pattern rather than `dark:bg-slate-900`.

---

## GSAP Animations

GSAP is used in two contexts:

### 1. Scroll-Triggered Entrance Animations (via `useScrollAnimation`)
- **What:** Elements fade in and slide up as they scroll into view
- **Where:** Landing page sections (imported via `useScrollAnimation` hook)
- **Plugin:** `ScrollTrigger` — registered once via `gsap.registerPlugin(ScrollTrigger)`
- **Cleanup:** `gsap.context().revert()` in `useEffect` cleanup to prevent memory leaks

### 2. Portal Landing GSAP Entrance (in `PortalLanding.tsx`)
- **What:** Icon card and content block animate in on page load
- **How:** `gsap.fromTo()` inside a `useEffect` with `gsap.context()` for cleanup

---

## Framer Motion

Used in landing page sections for declarative UI animations (hover effects, entrance transitions). Common patterns:

```tsx
// Fade in from below
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

```tsx
// Hover lift + shadow
<motion.div whileHover={{ y: -4, boxShadow: "..." }}>
```

---

## Lenis Smooth Scroll

Configured in `main.tsx`:

```ts
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";

const lenis = new Lenis();

// Sync Lenis RAF loop with GSAP ticker for coordinated animations
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

`gsap.ticker.lagSmoothing(0)` prevents GSAP from compensating for large frame time gaps (which would cause scroll jumps after a tab becomes inactive).

---

## Typography

Two fonts are loaded via `@fontsource` (self-hosted, no Google CDN):

```ts
// main.tsx
import "@fontsource/inter";
import "@fontsource/poppins";
```

Tailwind's default `font-sans` is extended/used across the app. `Inter` is the primary UI font; `Poppins` is used for marketing headings in landing components.

---

## Visual Design System

While there is no explicit `tailwind.config.js`, the project follows these design conventions consistently:

| Property | Value |
|----------|-------|
| Border radius (cards) | `rounded-3xl` / `rounded-[24px]` |
| Card background (dark) | `bg-slate-900/70 backdrop-blur-xl` |
| Card background (light) | `bg-white/80 backdrop-blur-xl` |
| Card border (dark) | `border-slate-800/80` |
| Shadow style | `shadow-[0_20px_60px_-30px_rgba(...)]` |
| Hover lift | `hover:-translate-y-1` |
| Student accent | Blue (`#3B82F6`) |
| University accent | Purple (`#9333EA`) |
| Recruiter accent | Emerald (`#059669`) |
| Input style | `rounded-2xl bg-slate-950/70 border-slate-800/80` |
| Button style | `rounded-2xl py-3.5 font-bold hover:-translate-y-0.5` |
