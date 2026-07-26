# 05 – State Management

> **Parent Doc:** [README.md](./README.md)
> **Source files:**
> - [`src/context/AuthContext.tsx`](../src/context/AuthContext.tsx)
> - [`src/context/DashboardContext.tsx`](../src/context/DashboardContext.tsx)

---

## Architecture Overview

State is managed using **React Context API** with two independent providers:

```
<AuthProvider>           ← Wraps entire app in App.tsx
  <DashboardProvider>    ← Wraps BrowserRouter in AppRouter.tsx
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </DashboardProvider>
</AuthProvider>
```

There is no Redux, Zustand, or external state library — the app intentionally uses built-in React primitives.

---

## `AuthContext` — Authentication State

**File:** [`src/context/AuthContext.tsx`](../src/context/AuthContext.tsx)

### What it manages

| State | Type | Description |
|-------|------|-------------|
| `user` | `AuthUser \| null` | Current user object (`{ id, email, role }`) |
| `token` | `string \| null` | Raw JWT string |
| `isAuthenticated` | `boolean` | Derived: `!!token && !!user` |
| `isLoading` | `boolean` | True while API call is in-flight |
| `error` | `string \| null` | Last auth error message |

### Persistence

On mount, state is initialised directly from `localStorage`:

```ts
const [user]  = useState<AuthUser | null>(() => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
});
const [token] = useState<string | null>(() => localStorage.getItem("token"));
```

Two `useEffect` hooks keep `localStorage` in sync whenever `user` or `token` change, so state survives page reloads.

### API Methods

#### `login(email, password): Promise<AuthUser>`

```
POST /api/auth/login  { email, password }
  ↓ success
  setToken(jwt)    → localStorage "token"
  setUser(userData) → localStorage "user"
  return userData
  ↓ failure
  setError(message)
  throw Error
```

#### `register(email, password, role, profileData): Promise<void>`

```
POST /api/auth/register  { email, password, role: UPPERCASE, ...profileData }
  ↓ success → no token stored (user must log in separately)
  ↓ failure → setError(message), throw Error
```

> Role is uppercased before sending: `role.toUpperCase()` because the backend enum is `STUDENT | RECRUITER | UNIVERSITY`.

#### `logout(): void`

```
setToken(null) + setUser(null) + remove localStorage "token" + "user"
```

#### `clearError(): void`
Sets `error` to `null`. Called at the start of every new form submission to clear stale errors.

### Hook

```ts
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
```

---

## `DashboardContext` — Application-Wide UI State

**File:** [`src/context/DashboardContext.tsx`](../src/context/DashboardContext.tsx)

### What it manages

#### Core UI State

| State | Type | Persistence | Description |
|-------|------|-------------|-------------|
| `theme` | `"light" \| "dark"` | `localStorage "theme"` | Colour scheme |
| `role` | `UserRole` | `localStorage "dashboard_role"` | Active user role |
| `searchQuery` | `string` | — | Global search box value |

#### Student-Specific State

| State | Type | Description |
|-------|------|-------------|
| `tasks` | `TaskItem[]` | Upcoming task list (currently empty — TODO) |
| `studentMessages` | `MessageItem[]` | Inbox messages (currently empty — TODO) |

#### University-Specific State

| State | Type | Description |
|-------|------|-------------|
| `approvals` | `ApprovalItem[]` | Student submissions awaiting review |
| `activities` | `ActivityItem[]` | Activity feed / event log |

#### Company-Specific State

| State | Type | Description |
|-------|------|-------------|
| `applicants` | `ApplicantItem[]` | Job applicants list |
| `interns` | `InternItem[]` | Active intern roster |

#### Notifications

| State | Type | Description |
|-------|------|-------------|
| `notifications` | `{ id, text, time, read }[]` | In-app notification list |

---

### Type Definitions

```ts
export type UserRole = "student" | "university" | "recruiter";

export interface TaskItem     { id, title, dueDate, completed }
export interface MessageItem  { id, sender, avatar, content, time }
export interface ActivityItem { id, user, action, time, type: "report"|"completion"|"approval" }
export interface ApprovalItem { id, studentName, avatar, type, submittedTime, status: "Pending"|"Approved"|"Rejected" }
export interface ApplicantItem{ id, name, avatar, role, appliedTime, status: "New"|"Under Review"|"Shortlisted"|"Rejected"|"Offered" }
export interface InternItem   { id, name, avatar, role, performance: "Good"|"Excellent"|"Average" }
```

---

### Role Resolution on Init

`DashboardContext` resolves the initial `role` using `getActivePortalRole()` which mirrors the same hostname/querystring logic as `getActivePortal()` in `AppRouter.tsx`, but also checks `localStorage "dashboard_role"` as a fallback for the main portal:

```ts
const getActivePortalRole = (): UserRole => {
  // hostname / ?portal checks first
  ...
  return (localStorage.getItem("dashboard_role") as UserRole) || "student";
};
```

### Theme Sync

When `theme` changes, a `useEffect` adds/removes the `"dark"` class on `<html>`:

```ts
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}, [theme]);
```

Initial theme is resolved from `localStorage` OR the user's OS preference:

```ts
useState(() => {
  const saved = localStorage.getItem("theme");
  return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? "dark" : "light";
});
```

---

### Action Methods

#### `toggleTheme()`
Flips `theme` between `"light"` and `"dark"`.

#### `setRole(role: UserRole)`
Updates the role in state AND persists it to `localStorage "dashboard_role"`.

#### `toggleTask(id: string)`
Finds a `TaskItem` by id and flips its `completed` boolean.

#### `handleApproval(id, action: "Approved" | "Rejected")`
1. Updates the matching `ApprovalItem.status`
2. Pushes a new `ActivityItem` to the activity feed
3. Pushes a new notification to the `notifications` list

#### `handleApplicant(id, action)`
1. Updates the matching `ApplicantItem.status`
2. Pushes a new notification

#### `markAllNotificationsRead()`
Maps all notifications to `{ ...n, read: true }`.

#### `clearNotifications()`
Resets the `notifications` array to `[]`.

---

### Hook

```ts
export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within a DashboardProvider");
  return ctx;
};
```

Used extensively in dashboard pages and `DashboardLayout`. A common pattern inside dashboard components:

```ts
// Theme-aware helper pattern (used in all 3 dashboards)
function useTheme() { return useDashboard().theme === "dark"; }
```

---

## Data Flow Summary

```
localStorage ──────────────────────────────────┐
   ↑ sync on change                            │
   │                                           │ init read
AuthContext ──── useAuth() ────────────────────►│ Pages / Components
   │                 login / logout            │
   │                 register                  │
   ↓                                           │
api.ts (Axios)                                 │
   │  POST /api/auth/login                     │
   │  POST /api/auth/register                  │
   ↓                                           │
Backend REST API                               │
                                               │
DashboardContext ─ useDashboard() ────────────►│ DashboardLayout / Dashboards
   role, theme, toggleTheme                    │
   tasks, approvals, applicants                │
   notifications                               │
```
