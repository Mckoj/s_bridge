# SBridge Frontend — Documentation Index

> **Scope:** Frontend  · **Stack:** React 19 + Vite + TypeScript + Tailwind CSS v4
> **Last Updated:** July 2026 · **Version:** 1.3.0

---

## 📁 Sub-Document Map

| # | File | What it covers |
|---|------|---------------|
| 01 | [01_TECH_STACK_AND_SETUP.md](./01_TECH_STACK_AND_SETUP.md) | Dependencies, env variables, scripts, folder structure |
| 02 | [02_ROUTING.md](./02_ROUTING.md) | `AppRouter`, portal detection, route table, `ProtectedRoute`, role dispatchers |
| 03 | [03_PORTAL_SYSTEM.md](./03_PORTAL_SYSTEM.md) | Multi-portal architecture — Main / Student / University / Recruiter |
| 04 | [04_AUTHENTICATION_PAGES.md](./04_AUTHENTICATION_PAGES.md) | All auth pages, flows, form logic, OTP & password-reset screens |
| 05 | [05_STATE_MANAGEMENT.md](./05_STATE_MANAGEMENT.md) | `AuthContext` + `DashboardContext` — state, hooks, persistence |
| 06 | [06_LAYOUTS.md](./06_LAYOUTS.md) | `DashboardLayout`, `AuthLayout`, `MainLayout` |
| 07 | [07_LANDING_PAGES.md](./07_LANDING_PAGES.md) | Main landing page + per-portal `PortalLanding` |
| 08 | [08_DASHBOARDS.md](./08_DASHBOARDS.md) | Full Student & University Portal pages + Recruiter dashboard |
| 09 | [09_COMPONENTS.md](./09_COMPONENTS.md) | All shared UI components — auth, common, dashboard, landing, **student (EmptyState, LoadingSkeleton, ErrorState)** |
| 10 | [10_HOOKS_SERVICES_CONSTANTS.md](./10_HOOKS_SERVICES_CONSTANTS.md) | Services, **custom hooks (useStudentStats, useStudentInterviews, useSavedJobs)**, api.ts, **apiErrors.ts** |
| 11 | [11_STYLING_AND_ANIMATIONS.md](./11_STYLING_AND_ANIMATIONS.md) | `index.css`, Tailwind v4 utilities, keyframe animations |
| 12 | [12_PENDING_AND_TODOS.md](./12_PENDING_AND_TODOS.md) | Completed deliverables, remaining tasks, next steps |

---

## 🗂 Source Directory Tree

```
Frontend/
├── src/
│   ├── App.tsx                   # Root — wraps AuthProvider + AppRouter
│   ├── main.tsx                  # Vite entry
│   ├── index.css                 # Global styles + Tailwind import + keyframes
│   │
│   ├── routes/
│   │   └── AppRouter.tsx         # Central router with portal & role-based route dispatching
│   │
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication state + JWT management
│   │   └── DashboardContext.tsx  # Role, theme, dashboard data state
│   │
│   ├── services/
│   │   ├── api.ts                # Axios instance + JWT auth header interceptors
│   │   ├── studentService.ts     # Student profile, stats (with DTO + mapper + runtime guard), CV upload
│   │   ├── interviewService.ts   # ⭐ NEW — Phase 3 interviews (graceful 404 handling)
│   │   ├── savedJobsService.ts   # ⭐ NEW — Phase 2 saved jobs (graceful 404 handling)
│   │   ├── universityService.ts  # University stats, roster, recruiter approvals
│   │   ├── internshipService.ts  # Internship listings search & filters
│   │   ├── applicationService.ts # Application submission & timeline tracking
│   │   ├── reportService.ts      # Institutional report status reviews
│   │   └── notificationService.ts# User notifications feed & mark read
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
│   │   │   ├── RoleBasedDashboard.tsx     # Role-based dashboard dispatcher
│   │   │   ├── RoleBasedReportsPage.tsx   # Role-based reports dispatcher (Student vs University)
│   │   │   ├── RoleBasedMessagesPage.tsx  # Role-based messages dispatcher
│   │   │   ├── RoleBasedNotificationsPage.tsx
│   │   │   ├── RoleBasedSettingsPage.tsx
│   │   │   └── DashboardSubPage.tsx       # Sub-page fallback
│   │   ├── Student/
│   │   │   ├── StudentDashboard.tsx            # Electric Blue theme dashboard
│   │   │   ├── ExploreOpportunitiesPage.tsx    # Internship marketplace with filters
│   │   │   ├── StudentApplicationsPage.tsx     # 7-stage application timeline tracker
│   │   │   ├── StudentInterviewsPage.tsx       # Scheduled interviews & meeting links
│   │   │   ├── StudentPlacementHistoryPage.tsx # Attachment history & certificates
│   │   │   ├── StudentAICareerAssistantPage.tsx# XGBoost probability & skill roadmap
│   │   │   ├── StudentSavedJobsPage.tsx        # Bookmarked listings
│   │   │   ├── StudentResumeAnalyzerPage.tsx   # ATS CV upload analyzer
│   │   │   ├── StudentReportsPage.tsx          # Student logbook submissions
│   │   │   ├── StudentMessagesPage.tsx         # Chat inbox
│   │   │   ├── StudentNotificationsPage.tsx    # Feed & alerts
│   │   │   ├── StudentProfilePage.tsx          # Student profile & education details
│   │   │   └── StudentSettingsPage.tsx         # Preferences & theme
│   │   ├── University/
│   │   │   ├── UniversityDashboard.tsx         # Royal Violet theme dashboard
│   │   │   ├── UniversityStudentsPage.tsx      # Roster table (Placed, Pending, Unassigned)
│   │   │   ├── UniversityDepartmentsPage.tsx   # Department performance & forecasts
│   │   │   ├── UniversityCollegesPage.tsx      # College rankings & accreditation
│   │   │   ├── UniversityPlacementOverviewPage.tsx # 5-stage Master Placement Funnel
│   │   │   ├── UniversityReportsPage.tsx       # Executive Institutional Analytics Dashboard
│   │   │   ├── UniversityAnnouncementsPage.tsx # Broadcast publishing hub
│   │   │   ├── UniversityCompanyDirectoryPage.tsx # Verified employer partners directory
│   │   │   ├── UniversityApprovalsPage.tsx     # Recruiter verification queue
│   │   │   ├── UniversityInternshipsPage.tsx   # Employer active listings
│   │   │   ├── UniversityMessagesPage.tsx      # Multi-thread communication hub
│   │   │   ├── UniversityNotificationsPage.tsx # Real-time notification feed
│   │   │   └── UniversitySettingsPage.tsx      # Domain & policy settings
│   │   └── Recruiter/
│   │       └── CompanyDashboard.tsx
│   │
│   │
│   ├── hooks/
│   │   ├── useScrollAnimation.ts    # GSAP scroll-triggered fade-in animation
│   │   ├── useStudentStats.ts       # ⭐ NEW — Fetch + map dashboard stats
│   │   ├── useStudentInterviews.ts  # ⭐ NEW — Fetch interviews (graceful until Phase 3)
│   │   └── useSavedJobs.ts          # ⭐ NEW — Fetch + remove saved jobs (graceful until Phase 2)
│   │
│   ├── utils/
│   │   └── apiErrors.ts             # ⭐ NEW — classifyApiError(), ClassifiedApiError, ApiErrorCode
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.tsx   # Sidebar + topbar layout with theme toggling
│   │   ├── AuthLayout.tsx        # Centred auth container
│   │   └── MainLayout.tsx
│   │
│   └── components/
│       ├── auth/                 # AuthCard, AuthInput, AuthButton, ProtectedRoute
│       ├── common/               # Button, Card, Container, SectionTitle
│       ├── dashboard/            # MetricCard, DonutChart, LineChart, CalendarWidget
│       ├── student/              # ⭐ NEW — EmptyState, LoadingSkeleton, ErrorState
│       ├── landing/              # Navbar, Hero, Problem, Solution, Features, ...
│       └── DebugMenu.tsx
```
