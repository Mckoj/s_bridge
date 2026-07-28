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
├── student/                 ⭐ New — shared Student Portal components
│   ├── EmptyState.tsx       # Reusable empty state with icon, title, description, actions
│   ├── LoadingSkeleton.tsx  # Animated skeleton cards (list or grid layout)
│   └── ErrorState.tsx       # Typed HTTP error display with code-specific icons + retry
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

## Student Components (`components/student/`) ⭐ New

Shared components used across all Student Portal pages to provide consistent loading, empty, and error states. All three are theme-aware — they read `theme` from `DashboardContext`.

### `EmptyState.tsx`

**File:** [`src/components/student/EmptyState.tsx`](../src/components/student/EmptyState.tsx)

Displayed when an API call succeeds but returns no data.

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `icon` | `React.ReactNode` | ✅ | Icon to display in the badge (Lucide icon element) |
| `title` | `string` | ✅ | Short heading |
| `description` | `string` | ✅ | Explanatory sub-text |
| `action` | `{ label, onClick }` | — | Primary CTA button |
| `secondaryAction` | `{ label, onClick }` | — | Secondary button |

**Usage:**
```tsx
<EmptyState
  icon={<Bookmark size={32} />}
  title="No Saved Jobs Yet"
  description="Browse the marketplace and save opportunities to find them here."
  action={{ label: "Browse Opportunities", onClick: () => navigate("/dashboard/explore") }}
/>
```

**Consistency rule:** Every Student Portal page that can have zero results must use this component. Do not render `null` or a plain `<p>` for empty states.

---

### `LoadingSkeleton.tsx`

**File:** [`src/components/student/LoadingSkeleton.tsx`](../src/components/student/LoadingSkeleton.tsx)

Displayed while an API request is in flight. Uses `animate-pulse` for the loading animation.

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `3` | Number of skeleton cards to render |
| `layout` | `"list" \| "grid"` | `"list"` | Card arrangement (single column vs 2-column grid) |

**Design principle:** The skeleton should resemble the final populated card layout. Match the number of skeleton cards to the expected number of data items.

```tsx
// For a list page (e.g. Interviews)
<LoadingSkeleton count={3} layout="list" />

// For a grid page (e.g. Saved Jobs)
<LoadingSkeleton count={4} layout="grid" />
```

---

### `ErrorState.tsx`

**File:** [`src/components/student/ErrorState.tsx`](../src/components/student/ErrorState.tsx)

Displayed when an API call fails. Accepts a `ClassifiedApiError` from `src/utils/apiErrors.ts` for code-specific rendering, or a plain string for simple messages.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `error` | `ClassifiedApiError \| string` | Structured error object (preferred) or plain string |
| `onRetry` | `() => void` | Optional retry callback. Not shown for `403`/`401` (retrying won't help). |

**Error code → visual mapping:**

| Code | Icon | Background colour |
|---|---|---|
| `NETWORK_ERROR` | WifiOff | Amber |
| `FORBIDDEN` | ShieldX | Orange |
| `UNAUTHORIZED` | Lock | Yellow |
| `SERVER_ERROR` / others | AlertTriangle | Red |

```tsx
// With ClassifiedApiError (preferred — rich messaging)
const { error, refetch } = useStudentInterviews();
<ErrorState error={error} onRetry={refetch} />

// With plain string (simple usage)
<ErrorState error="Could not load data." onRetry={handleRetry} />
```

**Retry suppression:** The retry button is hidden for `FORBIDDEN` and `UNAUTHORIZED` errors because retrying those is pointless — the user needs to sign in or contact an admin.

---

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
