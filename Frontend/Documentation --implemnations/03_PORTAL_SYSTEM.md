# 03 – Portal System

> **Parent Doc:** [README.md](./README.md)
> **Key files:** [`AppRouter.tsx`](../src/routes/AppRouter.tsx) · [`authUtils.ts`](../src/components/auth/authUtils.ts) · [`PortalLanding.tsx`](../src/pages/Landing/PortalLanding.tsx) · [`DashboardContext.tsx`](../src/context/DashboardContext.tsx)

---

## What is the Portal System?

SBridge serves **four distinct user experiences** from a single React SPA:

| Portal | Audience | Landing Route |
|--------|----------|--------------|
| **Main** | General visitors | `/` → `LandingPage` |
| **Student** | Students applying for internships | `/` → `PortalLanding portal="student"` |
| **University** | University admin / coordinators | `/` → `PortalLanding portal="university"` |
| **Recruiter** | Company HR / hiring managers | `/` → `PortalLanding portal="recruiter"` |

Each portal shares the same auth pages and dashboard shell, but surfaces different content, accent colours, sidebar navigation items, and dashboard widgets.

---

## How Portal is Determined

The active portal is resolved **once at app start** by `getActivePortal()`, which is called in two separate places:

1. `AppRouter.tsx` — to branch which routes to register
2. `authUtils.ts` (imported by Login/Signup pages) — to pre-select the role and apply the right colour accent

### Detection Logic

```
window.location.search ?portal=X   →  highest priority
window.location.hostname            →  subdomain prefix check
fallback                            →  "main"
```

| Trigger | Resolves to |
|---------|-------------|
| `?portal=student` or `student.*` host | `"student"` |
| `?portal=university` or `university.*` host | `"university"` |
| `?portal=recruiter`, `?portal=company`, `recruiter.*`, `company.*` | `"recruiter"` |
| Anything else | `"main"` |

---

## `authUtils.ts` — Shared Portal Helpers

**File:** [`src/components/auth/authUtils.ts`](../src/components/auth/authUtils.ts)

Exported from this file and used by both `LoginPage` and `SignupPage`:

### `getActivePortal(): ActivePortal`
Same detection logic as `AppRouter.tsx` (kept in sync manually).

### `getDefaultRole(portal): UserRole`
Returns the pre-selected role for the auth form:
- `"main"` → `"student"` (users pick their own role)
- Any other portal → returns the portal name directly as the role

### `roleConfig` — Visual Config Object

Each role has a complete visual config used to theme auth forms and role-selection cards:

```ts
const roleConfig = {
  student: {
    label: "Student",
    color:  "border-blue-500 text-blue-500 bg-blue-500/5",
    accent: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20",
    text:   "text-blue-400",
    glow:   "shadow-blue-500/10",
    bg:     "bg-blue-600/10",
    iconBg: "bg-blue-500",
  },
  university: { /* purple palette */ },
  recruiter:  { /* emerald palette */ },
}
```

| Role | Colour | Hex Approx. |
|------|--------|-------------|
| Student | Blue | `#3B82F6` |
| University | Purple | `#9333EA` |
| Recruiter | Emerald | `#059669` |

---

## `PortalLanding.tsx` — Role-Specific Entry Page

**File:** [`src/pages/Landing/PortalLanding.tsx`](../src/pages/Landing/PortalLanding.tsx)

Shown as the home page (`/`) when a sub-portal is active. Each portal has its own `portalConfig` object:

```ts
const portalConfig = {
  student: {
    icon:      GraduationCap,
    label:     "Student Portal",
    color:     "from-blue-600 to-indigo-600",
    headline:  "Your internship journey starts here.",
    sub:       "Browse verified placements, submit logbooks...",
    perks: [
      "Apply to verified companies",
      "Digital weekly logbook",
      "Supervisor sign-offs instantly",
      "Real-time placement tracking",
    ],
  },
  university: { /* purple, different perks */ },
  recruiter:  { /* emerald, different perks */ },
};
```

**Page structure:**
1. Gradient badge + Icon
2. Headline + sub-heading  
3. Perks list (`<CheckCircle2>` items)
4. Two CTA buttons: **Sign In** and **Create Account**
5. GSAP entrance animation (cards fade + slide up)

---

## Portal Routing Isolation

Each sub-portal registers **only its own routes**. A student-portal user cannot accidentally navigate to a university dashboard because those routes simply don't exist in the active portal's route tree.

```
Student portal active:
  / → PortalLanding (student)
  /dashboard → StudentDashboard (protected)
  /dashboard/* → DashboardSubPage (protected)
  * → redirect /

University portal active:
  / → PortalLanding (university)
  /dashboard → UniversityDashboard (protected)
  ...

Main portal active:
  / → LandingPage
  /dashboard → RoleBasedDashboard (dispatches by role from context)
  /student/dashboard, /university/dashboard, /company/dashboard → legacy aliases
```

---

## Portal vs. Role

These two concepts are related but distinct:

| Concept | Source | Scope |
|---------|--------|-------|
| **Portal** | URL (hostname/querystring) | Determines which routes + landing are shown |
| **Role** | JWT token + `DashboardContext` | Determines which dashboard + sidebar items are shown |

When logging in on the **main portal**, the user selects their role from a 3-button toggle in the login form. The selected role is then validated against the role stored in their JWT — if they mismatch, the login is rejected with a clear error message.

```ts
// LoginPage.tsx — role validation after login
const backendRole = (userData?.role || "").toLowerCase();
if (backendRole !== selectedRole) {
  await logout();
  setLocalError(`Selected role does not match account role (${backendRole}).`);
  return;
}
setRole(selectedRole);        // saves to DashboardContext + localStorage
navigate("/signin-successful");
```
