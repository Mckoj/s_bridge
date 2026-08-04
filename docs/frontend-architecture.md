# S-Bridge Frontend Architecture Guide

This document defines the mandatory engineering standards, data flow patterns, component responsibilities, error classification model, and production readiness guidelines for the **S-Bridge** web platform across all role portals (Student, University, Recruiter, and Admin).

---

## 1. Project Philosophy

### Backend First & Single Source of Truth
The backend API and database schemas are the single source of truth. The frontend is strictly a presentational and interaction layer consuming existing backend contracts.

#### Core Rules:
- **Zero Fabricated Data**: Never invent statistics, analytics, heatmaps, match scores, or candidate rankings.
- **Zero Mock Production Data**: Never render fake KPI cards or simulated business numbers.
- **Honest UI States**: If a backend endpoint or metric is unavailable, the UI must render an explicit `LoadingSkeleton`, `EmptyState`, `ErrorState`, or an honest `"Coming Soon"` banner (`isEndpointUnavailable = true`).
- **Portal Color Theme Isolation**:
  - 🟦 **Student Portal**: Blue Theme (`blue-*`)
  - 🟪 **University Portal**: Purple / Violet Theme (`purple-*` / `violet-*`)
  - 🟩 **Recruiter Portal**: Emerald / Green Theme (`emerald-*` / `green-*` / `teal-*`)
  - 🟥 **Admin Portal**: Crimson / Slate Theme (`rose-*` / `slate-*`)

---

## 2. Directory & Folder Structure

```
src/
├── components/
│   ├── common/          # Low-level UI primitives (Button, Card, Container)
│   ├── shared/          # App-wide guards and cross-portal components (RoleGuard)
│   ├── student/         # Student portal components (LoadingSkeleton, EmptyState, ErrorState)
│   ├── university/      # University portal components (StatCard, PageHeader)
│   ├── recruiter/       # Recruiter portal components (StatCard, HiringPipeline, Modals)
│   └── admin/           # Admin portal components (StatCard, PageHeader, AdminTable)
│
├── hooks/               # State & data-fetching custom hooks (useStudentStats, useRecruiterStats)
├── services/            # API client layer (api.ts, studentService.ts, recruiterService.ts)
├── pages/               # Presentation pages grouped by portal (Student/, University/, Recruiter/, Admin/)
├── layouts/             # Dashboard shell and navigation wrappers (DashboardLayout.tsx)
├── routes/              # Client-side routing definitions (AppRouter.tsx)
├── utils/               # Helpers, API error classification (apiErrors.ts, queryCache.ts)
├── context/             # React context providers (AuthContext.tsx, DashboardContext.tsx)
└── types/               # Shared global TypeScript definitions
```

---

## 3. Standardized Data Flow Pipeline

Every feature must follow the 9-stage architectural pipeline:

```
[Backend API]
     ↓  (HTTP JSON Payload)
[Axios Client (api.ts)]
     ↓  (Raw Data)
[Service Layer (e.g. recruiterService.ts)]
     ↓  (Backend DTO)
[Runtime Type Validation (isBackendRecruiterStats)]
     ↓  (Type Guard Verified)
[Mapper Function (mapBackendRecruiterStats)]
     ↓  (Normalized Frontend Model)
[Custom Hook (useRecruiterStats)]
     ↓  ({ data, loading, error, isEndpointUnavailable })
[Reusable Components (StatCard, CandidateCard)]
     ↓  (JSX Composition)
[Presentation Page (CompanyDashboard.tsx)]
```

---

## 4. Service Layer Standards

Service files (e.g., `studentService.ts`, `universityService.ts`, `recruiterService.ts`, `adminService.ts`) are responsible for communicating with the backend.

### Service Layer Requirements:
1. **Backend DTOs**: Explicit interfaces mirroring the raw backend response fields.
2. **Type Guards**: Runtime functions (e.g. `isBackendAdminStats(data: unknown): data is BackendAdminStats`) ensuring API responses match expectations before processing.
3. **Mappers**: Pure functions converting raw backend DTOs into clean Frontend Models. Optional/missing metrics map to `undefined` (never fabricated numbers).
4. **API Wrappers**: Axios calls wrapped with `classifyApiError(err)` for unified error handling.
5. **Caching**: Invalidation and reads using `queryCache.set(key, mapped, TTL)`.

---

## 5. Custom Hook Standards

Hooks isolate state management, data fetching, optimistic updates, and cache handling from presentation components.

### Hook Contract:
Every hook must return an object adhering to:
```ts
export interface UseHookResult<T> {
  data: T | null;
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  refetch: () => void;
}
```

#### Rules:
- Presentation pages **must never** call Axios (`api.get`, `api.post`) directly.
- HTTP 404 or 501 status codes must set `isEndpointUnavailable = true` instead of throwing unhandled exceptions.

---

## 6. Reusable Component Guidelines

Before building a new component, search `src/components/` for an existing component to extend.

### Key Shared Components:
- **`LoadingSkeleton`**: Theme-aware animated pulse placeholders during initial data load.
- **`EmptyState`**: Rendered when a list is empty or an endpoint is not yet implemented.
- **`ErrorState`**: Uniform error UI driven by `ClassifiedApiError` (supports retry for network errors).
- **`PageHeader`**: Portal-themed header banner with title, description, and actions with disabled tooltips (`"Coming Soon"`).
- **`StatCard`**: Metric display card. Renders `"—"` when value is `undefined`.

---

## 7. Page Component Responsibilities

Presentation pages in `src/pages/` are strictly presentational wrappers.

### Allowed in Pages:
- Calling custom hooks
- Layout composition (grids, containers)
- Event triggers (opening modal dialogs)

### Forbidden in Pages:
- Direct Axios HTTP calls
- Raw DTO mapping logic
- Hardcoded KPI values or fake charts

---

## 8. Unified Error Classification

All API failures pass through `classifyApiError(err)` in `src/utils/apiErrors.ts`.

| Status Code | Error Code | Component Action | User Experience |
| :--- | :--- | :--- | :--- |
| **401** | `UNAUTHORIZED` | Axios interceptor clears token | Redirects to `/login` |
| **403** | `FORBIDDEN` | Renders `ErrorState` | Displays "Access Denied" |
| **404** | `NOT_FOUND` | Sets `isEndpointUnavailable = true` | Renders "Coming Soon / Feature Unavailable" |
| **501** | `NOT_IMPLEMENTED` | Sets `isEndpointUnavailable = true` | Renders "Coming Soon / Under Construction" |
| **500+** | `SERVER_ERROR` | Renders `ErrorState` | Displays "Server Error" with Try Again button |
| **Network** | `NETWORK_ERROR` | Renders `ErrorState` | Displays "Connection Failed" with Try Again button |

---

## 9. Production Readiness Checklist

Before committing any portal refactor, verify that all checklist items are met:

```
[✓] Backend DTOs match actual controller output
[✓] Runtime Type Guards validate API response shapes
[✓] Mappers normalize DTOs into Frontend Models without fabricating numbers
[✓] Custom Hooks provide { data, loading, error, isEndpointUnavailable, refetch }
[✓] Reusable Components are used across pages without duplicate markup
[✓] LoadingSkeleton rendered during initial fetch
[✓] EmptyState rendered for empty data
[✓] ErrorState rendered on failure
[✓] "Coming Soon" state rendered when isEndpointUnavailable = true
[✓] Portal Theme Color strictly enforced (Student: Blue, Uni: Purple, Recruiter: Green, Admin: Slate/Rose)
[✓] Zero 'any' types in newly created interfaces
[✓] Zero fabricated statistics or fake AI predictions
[✓] Zero TypeScript errors (`npm run build`)
[✓] Zero ESLint errors
```
