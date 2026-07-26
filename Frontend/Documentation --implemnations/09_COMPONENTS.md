# 09 – Components

> **Parent Doc:** [README.md](./README.md)
> **Source folder:** [`src/components/`](../src/components/)

---

## Component Directory Map

```
src/components/
├── auth/
│   ├── AuthComponents.tsx   # Primitives: AuthCard, AuthInput, AuthButton, SocialAuthButtons
│   ├── AuthLayout.tsx       # Full-screen dark background wrapper
│   ├── ProtectedRoute.tsx   # JWT auth guard
│   └── authUtils.ts         # Portal detection + roleConfig
├── common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Container.tsx
│   └── SectionTitle.tsx
├── dashboard/
│   ├── CalendarWidget.tsx
│   ├── DonutChart.tsx
│   ├── LineChart.tsx
│   └── MetricCard.tsx
├── landing/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── Solution.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── About.tsx
│   ├── Statistics.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── navigation/   (empty — planned)
├── ui/           (empty — planned)
├── animations/   (empty — planned)
└── DebugMenu.tsx
```

---

## Auth Components (`components/auth/`)

> Full detail in [04_AUTHENTICATION_PAGES.md](./04_AUTHENTICATION_PAGES.md)

### `AuthCard`
```tsx
<AuthCard className?="">
  {children}
</AuthCard>
```
Glassmorphism card: `rounded-3xl border border-slate-800/80 bg-slate-900/55 backdrop-blur-xl`.

### `AuthInput`
```tsx
<AuthInput
  label="Email Address"
  icon={Mail}
  type="email"
  placeholder="you@domain.com"
  value={email}
  onChange={setEmail}
  required
  trailing?={<EyeToggleButton />}
/>
```
All inputs use the same base style. The `trailing` slot is used for the password toggle Eye button.

### `AuthButton`
```tsx
<AuthButton
  type="submit"
  disabled={isLoading}
  accentClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20"
>
  <span>Sign In</span>
  <ArrowRight size={14} />
</AuthButton>
```
Full-width, with `hover:-translate-y-0.5` lift animation.

### `AuthDivider`
```tsx
<AuthDivider label="or continue with" />
```
A horizontal line with centered text. Accepts a custom `label` string.

### `SocialAuthButtons`
```tsx
<SocialAuthButtons
  onGoogle={handleGoogle}
  onGitHub={handleGitHub}
  onFacebook={handleFacebook}
  onLinkedIn={handleLinkedIn}
/>
```
4 provider buttons in a flex row, each with an inline SVG icon. All handlers are currently stubs.

### `ProtectedRoute`
```tsx
<ProtectedRoute>
  <SomeDashboard />
</ProtectedRoute>
```
Reads `isAuthenticated` from `useAuth()`. If `false` → `<Navigate to="/login" replace />`.

---

## Common Components (`components/common/`)

Reusable design-system primitives used across the landing page sections.

### `Button.tsx`
General-purpose button component. Props: `variant` (primary / secondary / outline), `size`, `onClick`, `children`, `as` (renders as `<a>` or `<button>`).

### `Card.tsx`
Simple white/dark card shell with rounded corners and shadow. Used by landing page sections for feature/testimonial cards.

```tsx
<Card className?="">
  {children}
</Card>
```

### `Container.tsx`
Max-width container with horizontal padding, centred with `mx-auto`. Used to constrain landing section content.

```tsx
<Container>
  {/* section content */}
</Container>
```

### `SectionTitle.tsx`
Two-line section header: small eyebrow label + large heading.

```tsx
<SectionTitle
  eyebrow="Why SBridge"
  title="The smarter way to manage internships"
/>
```

---

## Dashboard Components (`components/dashboard/`)

> Shared chart and widget components used inside the role dashboards.

### `MetricCard.tsx`

Standalone metric card component (an alternative to the inline `StatCard` defined within each dashboard). Accepts:

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Metric label |
| `value` | `string \| number` | Big display number |
| `subtitle` | `string` | Sub-label below value |
| `icon` | `React.ElementType` | Lucide icon |
| `iconBg` | `string` | Icon badge background class |
| `iconColor` | `string` | Icon colour class |
| `trend?` | `{ value, direction }` | Optional % change badge |

### `DonutChart.tsx`

Pure-SVG animated donut chart. No external library.

**Props:**
```ts
interface Props {
  segments: { label: string; value: number; pct: string; color: string; dot: string }[];
  total: number;
  centerValue: string | number;
  centerLabel: string;
}
```

**How it works:**
- Circle circumference = `2 * π * r = 2 * π * 38 ≈ 238.76`
- Each segment is a `<circle>` with `stroke-dasharray={pct * 238.76}` and `stroke-dashoffset` rotated into position
- The `animate-draw-donut` CSS utility triggers the fill animation on mount
- Legend rendered below as coloured dots + label + percentage

### `LineChart.tsx`

Pure-SVG line chart for trend data.

**Key implementation:**
- Accepts `data: number[]` and `labels: string[]`
- Normalises values to SVG coordinate space
- Draws a `<path>` using `M` (move) + `L` (line) commands
- `stroke-draw` CSS utility triggers the line-drawing animation
- Area fill using a `<path>` with `fill-opacity`

### `CalendarWidget.tsx`

A richer version of the inline `MiniCalendar` in `StudentDashboard`, potentially with event markers. Can be imported as a drop-in replacement.

---

## Landing Components (`components/landing/`)

All landing section components are self-contained. They import from `components/common/` for shared primitives and from `hooks/useScrollAnimation.ts` for scroll-triggered animations.

| Component | Size | Notable |
|-----------|------|---------|
| `Navbar.tsx` | 5 KB | Mobile hamburger menu |
| `Hero.tsx` | 6.3 KB | Animated gradient background |
| `Problem.tsx` | 5.2 KB | Pain-point icon cards |
| `Solution.tsx` | 4.8 KB | Side-by-side layout |
| `Features.tsx` | 5.6 KB | 3-column feature grid |
| `HowItWorks.tsx` | 3.6 KB | Numbered step layout |
| `About.tsx` | 6.9 KB | Mission + stats |
| `Statistics.tsx` | 5.9 KB | Animated counters |
| `Testimonials.tsx` | 8.1 KB | Quote cards carousel-style |
| `FAQ.tsx` | 5.6 KB | Accordion |
| `CTA.tsx` | 3.6 KB | High-contrast CTA block |
| `Footer.tsx` | 5.5 KB | Link columns + socials |

---

## `DebugMenu.tsx`

**File:** [`src/components/DebugMenu.tsx`](../src/components/DebugMenu.tsx)

A developer-only overlay (`~5 KB`) that provides in-app controls to:
- Switch the active role (`student` / `university` / `recruiter`)
- Toggle the theme
- Inspect current auth and dashboard state

> **Not rendered in production.** Should be conditionally mounted only when `import.meta.env.DEV === true`.

---

## Planned but Empty Directories

| Directory | Intended Purpose |
|-----------|-----------------|
| `components/navigation/` | Shared nav components (breadcrumbs, tab bars) |
| `components/ui/` | Generic UI primitives (Modal, Dropdown, Badge, Tooltip) |
| `components/animations/` | Reusable Framer Motion / GSAP animation wrappers |
