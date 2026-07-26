# 02 – Routing

> **Parent Doc:** [README.md](./README.md)
> **Source file:** [`src/routes/AppRouter.tsx`](../src/routes/AppRouter.tsx)

---

## Overview

All routing is defined in a single file: **`AppRouter.tsx`**. React Router DOM v7 (`BrowserRouter`) is used. The router is wrapped in `DashboardProvider` so every page component can access dashboard-wide state.

```
<DashboardProvider>
  <BrowserRouter>
    <Routes>
      {/* branching on activePortal */}
    </Routes>
  </BrowserRouter>
</DashboardProvider>
```

---

## Portal Detection — `getActivePortal()`

This exported utility function determines which portal is active **at runtime**, without any server-side logic.

```ts
export const getActivePortal = (): "student" | "university" | "recruiter" | "main" => {
  const hostname = window.location.hostname;
  const params   = new URLSearchParams(window.location.search);
  const override = params.get("portal");

  if (override === "student"    || hostname.startsWith("student."))    return "student";
  if (override === "university" || hostname.startsWith("university.")) return "university";
  if (override === "recruiter"  || override === "company" ||
      hostname.startsWith("recruiter.") || hostname.startsWith("company.")) return "recruiter";
  return "main";
};
```

**Detection priority (highest → lowest):**

| Priority | Mechanism | Example |
|----------|-----------|---------|
| 1 | `?portal=` query parameter | `/?portal=student` |
| 2 | Subdomain prefix | `student.sbridge.app` |
| 3 | Fallback | Everything else → `"main"` |

> During local development, use `?portal=student`, `?portal=university`, or `?portal=recruiter` to switch portals.

---

## Shared Auth Routes

Auth routes are identical across all portals and extracted into a reusable JSX fragment `authRoutes`:

| Path | Component |
|------|-----------|
| `/login` | `LoginPage` |
| `/signup` | `SignupPage` |
| `/signup-otp` | `SignupOTPPage` |
| `/register` | → redirect to `/signup` |
| `/forgot-password` | `ForgotPasswordPage` |
| `/reset-password-otp` | `ResetPasswordOTPPage` |
| `/reset-password` | `ResetPasswordPage` |
| `/signup-successful` | `SignupSuccessfulPage` |
| `/signin-successful` | `SignInSuccessfulPage` |
| `/password-reset-successful` | `PasswordResetSuccessfulPage` |

---

## Route Table by Portal

### Main Portal (default)

| Path | Component | Auth Guard |
|------|-----------|-----------|
| `/` | `LandingPage` | ❌ |
| *(auth routes)* | — | ❌ |
| `/dashboard` | `RoleBasedDashboard` | ✅ |
| `/student/dashboard` | `StudentDashboard` | ✅ |
| `/university/dashboard` | `UniversityDashboard` | ✅ |
| `/company/dashboard` | `CompanyDashboard` | ✅ |
| `/dashboard/*` | `DashboardSubPage` | ✅ |
| `/student/dashboard/*` | `DashboardSubPage` | ✅ |
| `/university/dashboard/*` | `DashboardSubPage` | ✅ |
| `/company/dashboard/*` | `DashboardSubPage` | ✅ |
| `*` | → redirect `/` | — |

### Student Portal (`?portal=student`)

| Path | Component | Auth Guard |
|------|-----------|-----------|
| `/` | `PortalLanding portal="student"` | ❌ |
| *(auth routes)* | — | ❌ |
| `/dashboard` | `StudentDashboard` | ✅ |
| `/dashboard/*` | `DashboardSubPage` | ✅ |
| `*` | → redirect `/` | — |

### University Portal (`?portal=university`)

| Path | Component | Auth Guard |
|------|-----------|-----------|
| `/` | `PortalLanding portal="university"` | ❌ |
| *(auth routes)* | — | ❌ |
| `/dashboard` | `UniversityDashboard` | ✅ |
| `/dashboard/*` | `DashboardSubPage` | ✅ |
| `*` | → redirect `/` | — |

### Recruiter Portal (`?portal=recruiter`)

| Path | Component | Auth Guard |
|------|-----------|-----------|
| `/` | `PortalLanding portal="recruiter"` | ❌ |
| *(auth routes)* | — | ❌ |
| `/dashboard` | `CompanyDashboard` | ✅ |
| `/dashboard/*` | `DashboardSubPage` | ✅ |
| `*` | → redirect `/` | — |

---

## `ProtectedRoute` Component

**File:** [`src/components/auth/ProtectedRoute.tsx`](../src/components/auth/ProtectedRoute.tsx)

A thin wrapper that reads `isAuthenticated` from `AuthContext`. If the user is not authenticated it **redirects to `/login`** immediately with `replace` (no back-button loopback).

```tsx
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

All dashboard routes are wrapped: `<ProtectedRoute><SomeDashboard /></ProtectedRoute>`.

---

## `DashboardSubPage` — Under Construction Stub

**File:** [`src/pages/Dashboard/DashboardSubPage.tsx`](../src/pages/Dashboard/DashboardSubPage.tsx)

Any `/dashboard/*` path that doesn't have a dedicated component renders this stub inside `DashboardLayout`. It reads the last URL segment and converts it to a human-readable title (e.g. `/dashboard/find-opportunities` → **"Find Opportunities"**).

```
/dashboard/applications   →  "Applications"
/dashboard/internship     →  "Internship"
/dashboard/reports        →  "Reports"
/dashboard/messages       →  "Messages"
...
```

---

## `RoleBasedDashboard` — Role Dispatcher

**File:** [`src/pages/Dashboard/RoleBasedDashboard.tsx`](../src/pages/Dashboard/RoleBasedDashboard.tsx)

Used only on the **main portal's** `/dashboard` route. It reads `role` from `DashboardContext` and renders the correct dashboard:

```ts
if (role === "university") return <UniversityDashboard />;
if (role === "recruiter")  return <CompanyDashboard />;
return <StudentDashboard />;  // default
```

---

## Navigation Flow Diagram

```
User visits /
      │
      ▼
getActivePortal()
      │
   ┌──┴──────────────────────────────────┐
   │                                     │
"main"                           "student" | "university" | "recruiter"
   │                                     │
LandingPage                     PortalLanding (role-specific)
   │                                     │
   └──────────┬──────────────────────────┘
              │
         /login or /signup
              │
         AuthContext.login()
              │
         /signin-successful
              │
         navigate("/dashboard")
              │
         ProtectedRoute (checks isAuthenticated)
              │
         RoleBasedDashboard (main portal)
         OR StudentDashboard / UniversityDashboard / CompanyDashboard (sub-portals)
```
