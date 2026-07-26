# 06 – Layouts

> **Parent Doc:** [README.md](./README.md)
> **Source folder:** [`src/layouts/`](../src/layouts/)

---

## Layout Overview

| File | Used by | Purpose |
|------|---------|---------|
| `DashboardLayout.tsx` | All three dashboards + `DashboardSubPage` | Full-page shell with collapsible sidebar, topbar, notifications panel |
| `AuthLayout.tsx` | All auth pages (via `AuthComponents`) | Dark full-screen background centring the auth card |
| `MainLayout.tsx` | (scaffold — not yet used) | Planned wrapper for main-portal pages |

---

## `DashboardLayout.tsx`

**File:** [`src/layouts/DashboardLayout.tsx`](../src/layouts/DashboardLayout.tsx)

The most complex layout component. It renders the complete authenticated user shell.

### Props

```ts
interface Props {
  children: React.ReactNode;  // The page content rendered in the main area
}
```

### Context Dependencies

| Hook | Values consumed |
|------|----------------|
| `useDashboard()` | `role`, `theme`, `toggleTheme`, `notifications`, `markAllNotificationsRead` |
| `useAuth()` | `user`, `logout` |
| `useNavigate()` | For post-logout redirect |
| `useLocation()` | For active sidebar link highlighting |

---

### Sidebar Navigation Items

Navigation items are defined as a static map keyed by role:

```ts
const roleNav = {
  student: [
    { label: "Dashboard",       icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Applications", icon: FileText,         path: "/dashboard/applications" },
    { label: "My Internship",   icon: Briefcase,        path: "/dashboard/internship" },
    { label: "Reports",         icon: BarChart2,        path: "/dashboard/reports" },
    { label: "Messages",        icon: MessageSquare,    path: "/dashboard/messages" },
    { label: "Notifications",   icon: Bell,             path: "/dashboard/notifications" },
    { label: "Profile",         icon: User,             path: "/dashboard/profile" },
    { label: "Settings",        icon: Settings,         path: "/dashboard/settings" },
  ],
  university: [
    "Dashboard", "Students", "Internships", "Approvals",
    "Reports & Analytics", "Messages", "Notifications", "Settings"
  ],
  recruiter: [
    "Dashboard", "Internship Postings", "Applications",
    "My Interns", "Evaluations", "Messages", "Analytics", "Settings"
  ],
};
```

### Role Accent Colours

Each role has its own accent colour used for the active sidebar item background and the user avatar:

| Role | Active BG | Avatar BG | Role Label |
|------|-----------|-----------|------------|
| `student` | `bg-blue-500` | `bg-blue-500` | "Student" |
| `university` | `bg-purple-600` | `bg-purple-600` | "University Admin" |
| `recruiter` | `bg-emerald-600` | `bg-emerald-600` | "Company Admin" |

### Active Link Detection

```ts
const isActive = (path: string) =>
  path === "/dashboard"
    ? location.pathname === "/dashboard"          // exact match for root
    : location.pathname.startsWith(path);          // prefix match for sub-pages
```

### Sidebar Structure

```
┌─────────────────────────────┐
│  Logo + "SBridge" wordmark  │
├─────────────────────────────┤
│  User avatar + display name │
│  Role badge                 │
├─────────────────────────────┤
│  Nav items (role-specific)  │
│  Each: Icon + Label         │
│  Active: accent bg pill     │
├─────────────────────────────┤
│  [Logout] button            │
└─────────────────────────────┘
```

The sidebar is **responsive**:
- Desktop: always visible, fixed on the left
- Mobile: hidden by default, toggled with the `Menu` / `X` icon button in the topbar. An overlay backdrop closes it on tap.

### Topbar Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [☰ Menu (mobile)] │ [🔍 Search input] │ [🔔] │ [☀️/🌙] │
└─────────────────────────────────────────────────────────────┘
```

- **Search input** — controlled input, updates `searchQuery` in `DashboardContext` (filter integration is a TODO)
- **Bell icon** — shows red dot badge when `unread > 0`; clicking opens the notifications panel
- **Theme toggle** — calls `toggleTheme()`, switches between Sun and Moon icons with a rotation animation

### Notifications Panel

A slide-in panel on the top-right. Shows all `notifications` from `DashboardContext`:
- Each entry: time-stamped text, read/unread indicator
- "Mark all read" button calls `markAllNotificationsRead()`
- "Clear" button calls `clearNotifications()`

### Logout Flow

```ts
const handleLogout = () => {
  logout();             // clears token + user from context + localStorage
  navigate("/login");   // redirect to login
};
```

---

## `AuthLayout.tsx`

**File:** [`src/components/auth/AuthLayout.tsx`](../src/components/auth/AuthLayout.tsx)

A lightweight wrapper used by all auth pages. Provides:
- Full-screen dark background (`min-h-screen bg-slate-950`)
- Radial gradient overlay
- Centred flex container
- Configurable max-width via `maxWidth` prop (`"md"` default, `"lg"` for the signup role-selection step)

```tsx
// Usage
<AuthLayout maxWidth="md">
  <AuthCard>
    {/* form content */}
  </AuthCard>
</AuthLayout>
```
