# SBridge Frontend — Documentation Index

> **Scope:** Frontend  · **Stack:** React 19 + Vite + TypeScript + Tailwind CSS v4
> **Last Updated:** July 2026 · **Version:** 1.0.0

---

## 📁 Sub-Document Map

| # | File | What it covers |
|---|------|---------------|
| 01 | [01_TECH_STACK_AND_SETUP.md](./01_TECH_STACK_AND_SETUP.md) | Dependencies, env variables, scripts, folder structure |
| 02 | [02_ROUTING.md](./02_ROUTING.md) | `AppRouter`, portal detection, route table, `ProtectedRoute` |
| 03 | [03_PORTAL_SYSTEM.md](./03_PORTAL_SYSTEM.md) | Multi-portal architecture — Main / Student / University / Recruiter |
| 04 | [04_AUTHENTICATION_PAGES.md](./04_AUTHENTICATION_PAGES.md) | All auth pages, flows, form logic, OTP & password-reset screens |
| 05 | [05_STATE_MANAGEMENT.md](./05_STATE_MANAGEMENT.md) | `AuthContext` + `DashboardContext` — state, hooks, persistence |
| 06 | [06_LAYOUTS.md](./06_LAYOUTS.md) | `DashboardLayout`, `AuthLayout`, `MainLayout` |
| 07 | [07_LANDING_PAGES.md](./07_LANDING_PAGES.md) | Main landing page + per-portal `PortalLanding` |
| 08 | [08_DASHBOARDS.md](./08_DASHBOARDS.md) | Student, University & Company dashboards + sub-page scaffold |
| 09 | [09_COMPONENTS.md](./09_COMPONENTS.md) | All shared UI components — auth, common, dashboard, landing |
| 10 | [10_HOOKS_SERVICES_CONSTANTS.md](./10_HOOKS_SERVICES_CONSTANTS.md) | `useScrollAnimation`, `api.ts`, `navigation.ts`, `colors.ts` |
| 11 | [11_STYLING_AND_ANIMATIONS.md](./11_STYLING_AND_ANIMATIONS.md) | `index.css`, Tailwind v4 utilities, keyframe animations, Lenis |
| 12 | [12_PENDING_AND_TODOS.md](./12_PENDING_AND_TODOS.md) | All `// TODO` markers, stubbed features, next steps |

---

## 🗂 Source Directory Tree

```
Frontend/
├── src/
│   ├── App.tsx                   # Root — wraps AuthProvider + AppRouter
│   ├── main.tsx                  # Vite entry, Lenis smooth scroll init
│   ├── index.css                 # Global styles + Tailwind import + keyframes
│   │
│   ├── routes/
│   │   └── AppRouter.tsx         # Central router with portal branching
│   │
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication state + JWT management
│   │   └── DashboardContext.tsx  # Role, theme, dashboard data state
│   │
│   ├── pages/
│   │   ├── Landing/
│   │   │   ├── LandingPage.tsx   # Main marketing landing page
│   │   │   └── PortalLanding.tsx # Role-specific portal entry page
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── SignupOTPPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordOTPPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   ├── SignupSuccessfulPage.tsx
│   │   │   ├── SignInSuccessfulPage.tsx
│   │   │   └── PasswordResetSuccessfulPage.tsx
│   │   ├── Dashboard/
│   │   │   ├── RoleBasedDashboard.tsx  # Dispatch by role
│   │   │   └── DashboardSubPage.tsx    # "Under Construction" stub
│   │   ├── Student/
│   │   │   └── StudentDashboard.tsx
│   │   ├── University/
│   │   │   └── UniversityDashboard.tsx
│   │   ├── Recruiter/
│   │   │   └── CompanyDashboard.tsx
│   │   └── Admin/                # (empty — planned)
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.tsx   # Full-page layout with sidebar + topbar
│   │   ├── AuthLayout.tsx        # Centred dark auth card wrapper
│   │   └── MainLayout.tsx        # (scaffold)
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthComponents.tsx  # AuthCard, AuthInput, AuthButton, SocialAuthButtons
│   │   │   ├── AuthLayout.tsx      # Auth page background wrapper
│   │   │   ├── ProtectedRoute.tsx  # JWT guard redirect
│   │   │   └── authUtils.ts        # getActivePortal, roleConfig, getDefaultRole
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Container.tsx
│   │   │   └── SectionTitle.tsx
│   │   ├── dashboard/
│   │   │   ├── CalendarWidget.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   └── MetricCard.tsx
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Problem.tsx
│   │   │   ├── Solution.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Statistics.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── navigation/           # (empty — planned)
│   │   ├── ui/                   # (empty — planned)
│   │   └── animations/           # (empty — planned)
│   │
│   ├── hooks/
│   │   └── useScrollAnimation.ts # GSAP ScrollTrigger fade-in helper
│   │
│   ├── services/
│   │   └── api.ts                # Axios instance with auth interceptors
│   │
│   ├── constants/
│   │   ├── navigation.ts         # NAVIGATION anchor links array
│   │   └── colors.ts             # Brand colour constants
│   │
│   ├── types/                    # (empty — TypeScript types planned)
│   ├── utils/                    # (empty — helpers planned)
│   ├── config/                   # (empty — config planned)
│   ├── lib/                      # (empty)
│   ├── shared/                   # (empty)
│   ├── student/                  # (scaffold — layouts + pages dirs)
│   ├── recruiter/                # (scaffold — layouts + pages dirs)
│   └── university/               # (scaffold — layouts + pages dirs)
│
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── Documentation --implemnations/  ← YOU ARE HERE
```

---

## 🚀 Quick Start

```bash
cd Frontend
npm install
npm run dev      # http://localhost:5173
```

### Portal Switching (Dev)

Since subdomain routing isn't available locally, use query params to test each portal:

| Portal | URL |
|--------|-----|
| Main | `http://localhost:5173/` |
| Student | `http://localhost:5173/?portal=student` |
| University | `http://localhost:5173/?portal=university` |
| Recruiter | `http://localhost:5173/?portal=recruiter` |

---

## ✅ Implementation Status

| Feature Area | Status |
|---|---|
| Main Landing Page (all sections) | ✅ Done |
| Portal Landing Pages (3 roles) | ✅ Done |
| Auth UI — Login | ✅ Done |
| Auth UI — Signup (multi-role, multi-step) | ✅ Done |
| Auth UI — OTP verification screen | ✅ Done |
| Auth UI — Forgot / Reset Password flow | ✅ Done |
| Auth UI — Success screens (signup, login, reset) | ✅ Done |
| AuthContext (login, register, logout, persist) | ✅ Done |
| DashboardContext (role, theme, state) | ✅ Done |
| DashboardLayout (sidebar, topbar, notifications) | ✅ Done |
| Student Dashboard | ✅ Scaffolded |
| University Dashboard | ✅ Scaffolded |
| Company Dashboard | ✅ Scaffolded |
| Dashboard Sub-pages | 🔄 Under Construction stub |
| Dark / Light Theme toggle | ✅ Done |
| Smooth scroll (Lenis) | ✅ Done |
| GSAP scroll animations | ✅ Done |
| API service (Axios + interceptors) | ✅ Done |
| Dashboard ↔ API data integration | ⏳ Pending |
| File uploads (CV, reports) | ⏳ Pending |
| Admin page | ⏳ Pending |
