# 10 – Hooks, Services & Constants

> **Parent Doc:** [README.md](./README.md)
> **Source files:**
> - [`src/hooks/useScrollAnimation.ts`](../src/hooks/useScrollAnimation.ts)
> - [`src/services/api.ts`](../src/services/api.ts)
> - [`src/constants/navigation.ts`](../src/constants/navigation.ts)
> - [`src/constants/colors.ts`](../src/constants/colors.ts)

---

## Custom Hooks (`src/hooks/`)

### `useScrollAnimation<T extends HTMLElement>()`

**File:** [`src/hooks/useScrollAnimation.ts`](../src/hooks/useScrollAnimation.ts)

A generic GSAP + ScrollTrigger hook that makes any element fade in and slide up when it scrolls into view.

**Usage:**
```tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation";

function MySection() {
  const ref = useScrollAnimation<HTMLDivElement>();
  return <div ref={ref}>This fades in on scroll</div>;
}
```

**What it does:**
1. Creates a `ref` using `useRef<T>(null)`
2. On mount, runs `gsap.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" })`
3. `ScrollTrigger` starts the animation when the element's **top edge hits 85%** of the viewport height (`start: "top 85%"`)
4. `once: true` means the animation only plays once (not replayed on scroll up)
5. Returns a `gsap.context()` cleanup in the `useEffect` return to prevent memory leaks

**Animation parameters:**

| Property | Value | Notes |
|----------|-------|-------|
| `from.opacity` | `0` | Starts invisible |
| `from.y` | `60` | Starts 60px below natural position |
| `to.opacity` | `1` | Fully visible |
| `to.y` | `0` | Natural position |
| `duration` | `0.9s` | Total animation time |
| `ease` | `power3.out` | Fast start, gentle deceleration |
| `trigger start` | `"top 85%"` | Fires when element top is 85% down viewport |
| `once` | `true` | Does not replay |

**Generic parameter:** `T extends HTMLElement` defaults to `HTMLDivElement`. Can be used on any DOM element type:
```ts
const ref = useScrollAnimation<HTMLElement>();   // for a section
const ref = useScrollAnimation<HTMLUListElement>(); // for a list
```

---

## Services (`src/services/`)

### `api.ts` — Axios Instance

**File:** [`src/services/api.ts`](../src/services/api.ts)

A pre-configured Axios instance exported as `api` and used as the single HTTP client throughout the entire frontend.

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});
```

#### Request Interceptor — Auto-attach JWT

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Every outgoing request automatically includes the stored JWT in the `Authorization` header. No manual token passing is needed in any component.

#### Response Interceptor — Global 401 Handler

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

If **any** API call returns a `401 Unauthorized`, the interceptor:
1. Clears `token` and `user` from `localStorage`
2. Hard-redirects to `/login`

This handles session expiry without needing to check 401s in every component.

#### Usage

```ts
import api from "../services/api";

// In AuthContext:
const response = await api.post("/api/auth/login", { email, password });

// Future usage (Dashboard API calls):
const data = await api.get("/api/students");
const data = await api.put(`/api/students/${id}`, updatePayload);
```

---

## Constants (`src/constants/`)

### `navigation.ts`

**File:** [`src/constants/navigation.ts`](../src/constants/navigation.ts)

Defines the landing page anchor navigation links used by `Navbar.tsx`:

```ts
export const NAVIGATION = [
  { name: "Home",         href: "#home" },
  { name: "Problem",      href: "#problem" },
  { name: "Solution",     href: "#solution" },
  { name: "How It Works", href: "#how-it-works" },
];
```

These map to `id` attributes on the corresponding landing section elements. Smooth scrolling is handled by Lenis (configured in `main.tsx`).

---

### `colors.ts`

**File:** [`src/constants/colors.ts`](../src/constants/colors.ts)

Brand colour constants for use in charts, SVG elements, or anywhere Tailwind class strings aren't applicable (e.g. inline styles for SVG `stroke`/`fill`).

> The specific values are defined in this file and consumed by chart components like `DonutChart.tsx` and `LineChart.tsx`.

---

## Planned but Empty Directories

| Directory | Intended Purpose |
|-----------|-----------------|
| `src/types/` | Shared TypeScript interface / type definitions (API response shapes, shared models) |
| `src/utils/` | Pure utility functions (e.g. date formatting, string helpers, file size formatting) |
| `src/config/` | App-wide configuration objects (e.g. feature flags, environment config) |
| `src/lib/` | Third-party library wrappers or shared initialisation (e.g. a configured `dayjs` instance) |
| `src/shared/` | Shared domain-specific logic (e.g. role permissions, route matchers) |
