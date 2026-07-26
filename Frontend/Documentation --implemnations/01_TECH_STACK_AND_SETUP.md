# 01 – Tech Stack & Setup

> **Parent Doc:** [README.md](./README.md)

---

## Tech Stack

| Concern | Package | Version |
|---------|---------|---------|
| Language | TypeScript | ~6.0.2 |
| UI Library | React | ^19.2.7 |
| Build Tool | Vite | ^8.1.1 |
| Router | React Router DOM | ^7.18.1 |
| CSS Framework | Tailwind CSS v4 | ^4.3.2 |
| Animation (declarative) | Framer Motion | ^12.42.0 |
| Animation (imperative/scroll) | GSAP + ScrollTrigger | ^3.15.0 |
| Smooth scroll | @studio-freight/lenis | ^1.0.42 |
| HTTP client | Axios | ^1.18.1 |
| Form management | React Hook Form | ^7.80.0 |
| Schema validation | Zod | ^4.4.3 |
| Icon set | Lucide React | ^1.23.0 |
| Icon set (alt) | React Icons | ^5.7.0 |
| Toasts | React Hot Toast | ^2.6.0 |
| Fonts | @fontsource/inter + @fontsource/poppins | ^5 |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@vitejs/plugin-react` | React fast-refresh for Vite |
| `typescript-eslint` | TypeScript-aware lint rules |
| `eslint-plugin-react-hooks` | Hooks rule enforcement |
| `eslint-plugin-react-refresh` | HMR-safety lint |
| `@types/react`, `@types/react-dom` | React type declarations |
| `@types/node` | Node.js types for Vite config |

---

## Environment Variables

The Frontend reads a single environment variable from `.env`:

```
VITE_API_URL=http://localhost:5000
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Base URL for all API calls |

> **Note:** In production this should point to the deployed backend URL. Vite exposes only variables prefixed with `VITE_` to the client bundle.

---

## NPM Scripts

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # TypeScript compile then Vite production bundle → dist/
npm run preview   # Serve the dist/ folder locally
npm run lint      # Run ESLint across the entire src/
```

---

## Project Entry Points

### `index.html`

Vite's HTML entry. Contains:
- `<title>SBridge</title>` placeholder
- `<div id="root">` mount point
- `<script type="module" src="/src/main.tsx">` Vite entry

### `src/main.tsx`

The JavaScript entry point that:
1. Imports Inter and Poppins fonts from `@fontsource`
2. Initialises **Lenis** smooth-scroll and hooks it into the GSAP ticker for synchronized animations
3. Mounts `<App />` inside `<React.StrictMode>` on `document.getElementById('root')`

```tsx
// src/main.tsx — key logic
const lenis = new Lenis();
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `src/App.tsx`

The component tree root. Wraps everything in `AuthProvider` so authentication state is globally available, then renders `AppRouter`.

```tsx
// src/App.tsx
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
```

---

## Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Tailwind CSS v4 is wired in via the official `@tailwindcss/vite` Vite plugin — no separate `tailwind.config.js` is needed.

---

## TypeScript Configuration

Three tsconfig files are in use:

| File | Scope |
|------|-------|
| `tsconfig.json` | References both `app` and `node` configs |
| `tsconfig.app.json` | Compiles `src/` for the browser (`"lib": ["ES2020","DOM","DOM.Iterable"]`) |
| `tsconfig.node.json` | Compiles `vite.config.ts` for Node.js |

`tsconfig.app.json` key settings:
- `"strict": true` — full strict mode
- `"moduleResolution": "bundler"` — Vite-compatible resolution
- `"jsx": "react-jsx"` — React 17+ JSX transform (no `import React` needed)

---

## Folder Naming Conventions

| Convention | Example |
|---|---|
| Page-level directories | `PascalCase/` — `Auth/`, `Student/` |
| Page components | `PascalCase.tsx` — `LoginPage.tsx` |
| Context files | `PascalCase.tsx` — `AuthContext.tsx` |
| Utility / helper files | `camelCase.ts` — `authUtils.ts`, `api.ts` |
| CSS files | `camelCase.css` or `index.css` |
