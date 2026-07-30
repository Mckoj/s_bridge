# S-Bridge — University Portal Technical Audit, Architecture & Production Readiness

**Version:** 2.0.0 — Production Refactor Complete  
**Last Updated:** July 2026

---

## 1. Summary of Refactor

The University Portal frontend has been refactored from a prototype-quality implementation
to a production-ready architecture matching the quality standards of the Student Portal.

### Issues Resolved

| # | Issue | Severity | Resolution |
|---|-------|----------|------------|
| 1 | Fabricated GPA fallback `"3.65"` | 🔴 Critical | Replaced with `"Not Set"` |
| 2 | Fabricated skills fallback `"React, Node.js"` | 🔴 Critical | Replaced with `"No Skills Added"` |
| 3 | 5 hardcoded fake departments with invented placement rates | 🔴 Critical | Removed — `EmptyState` shown |
| 4 | 5 hardcoded fake regions with invented percentages | 🔴 Critical | Removed — `EmptyState` shown |
| 5 | 9 fabricated KPI cards in Reports page | 🔴 Critical | Removed — real stats only |
| 6 | 6 fake monthly trend data points | 🔴 Critical | Removed — `EmptyState` shown |
| 7 | 6 fake department placement bars | 🔴 Critical | Removed — `EmptyState` shown |
| 8 | 6 fake company analytics rows | 🔴 Critical | Removed — `EmptyState` shown |
| 9 | 5-stage funnel with hardcoded numbers (12,458 / 9,820…) | 🔴 Critical | Removed — `EmptyState` shown |
| 10 | 2 hardcoded mock announcements in React state | 🟡 Medium | Removed — API-driven only |
| 11 | `universityService.ts` — no DTOs, no type guards, no mappers | 🟡 Medium | Fully rewritten |
| 12 | No custom hooks — fetch logic inside pages | 🟡 Medium | 4 hooks created |
| 13 | No shared components — duplicated loading/error UI | 🟡 Medium | Shared components created |
| 14 | `alert()` stubs for unimplemented actions | 🟡 Medium | Replaced with disabled buttons |
| 15 | `useState<any[]>` — untyped backend data | 🟡 Medium | Fully typed |
| 16 | Stats field mismatch (frontend ≠ backend payload shape) | 🟡 Medium | DTO + mapper alignment |

---

## 2. Architecture

### Data Flow

```
Backend REST API
      ↓
GET /api/universities/stats  →  { activePlacements, totalApplications, pendingRecruiters }
GET /api/students            →  { students: BackendStudent[] }
GET /api/recruiters          →  { recruiters: BackendRecruiter[] }
GET /api/universities/announcements  →  404 (not yet deployed)
      ↓
universityService.ts
  BackendDTO  →  isBackendXxx() type guard  →  mapXxx()  →  Frontend Model
      ↓
Custom Hooks
  useUniversityStats()
  useUniversityStudents()
  useRecruiterApprovals()
  useUniversityAnnouncements()
      ↓
Shared Components
  StatCard  |  PageHeader  |  LoadingSkeleton  |  EmptyState  |  ErrorState
      ↓
Page Components (presentation only — no business logic)
```

### Directory Structure

```
Frontend/src/
├── services/
│   └── universityService.ts          ← [REWRITTEN] DTOs + guards + mappers + API
├── hooks/
│   ├── useUniversityStats.ts         ← [NEW]
│   ├── useUniversityStudents.ts      ← [NEW]
│   ├── useRecruiterApprovals.ts      ← [NEW]
│   └── useUniversityAnnouncements.ts ← [NEW]
├── components/
│   └── university/
│       ├── index.ts                  ← [NEW] barrel export
│       ├── StatCard.tsx              ← [NEW] undefined-safe stat display
│       └── PageHeader.tsx            ← [NEW] reusable page header banner
│       (LoadingSkeleton/EmptyState/ErrorState re-exported from components/student/)
├── pages/
│   └── University/
│       ├── UniversityDashboard.tsx           ← [REFACTORED]
│       ├── UniversityStudentsPage.tsx        ← [REFACTORED]
│       ├── UniversityAnnouncementsPage.tsx   ← [REFACTORED]
│       ├── UniversityApprovalsPage.tsx       ← [REFACTORED]
│       ├── UniversityReportsPage.tsx         ← [REFACTORED]
│       ├── UniversityPlacementOverviewPage.tsx ← [REFACTORED]
│       └── UniversityInternshipsPage.tsx     ← [REFACTORED]
└── utils/
    └── apiErrors.ts                  ← [UNCHANGED] classifyApiError used throughout
```

---

## 3. Service Layer — universityService.ts

### Backend DTOs

| Interface | Endpoint | Fields |
|-----------|----------|--------|
| `BackendUniversityStats` | `GET /api/universities/stats` | `activePlacements`, `totalApplications`, `pendingRecruiters` |
| `BackendRecruiter` | `GET /api/recruiters` | `id`, `companyName`, `companyWebsite`, `isApproved`, `user.email` |
| `BackendStudent` | `GET /api/students` | `id`, `firstName`, `lastName`, `programme`, `gpa`, `phone`, `studentId`, `skills`, `applications`, `user.email` |
| `BackendAnnouncement` | `GET /api/universities/announcements` | `id`, `title`, `content`, `targetGroup`, `priority`, `status`, `publishedAt`, `expiresAt` |

### Frontend Models

| Interface | Maps From | Notes |
|-----------|-----------|-------|
| `UniversityStats` | `BackendUniversityStats` | `placementRate` and `totalStudents` typed as `undefined` — never fabricated |
| `UniversityRecruiter` | `BackendRecruiter` | Flattened `user.email` → `email` |
| `UniversityStudent` | `BackendStudent` | Derives `placementStatus`, `skills[]`, `placedAt` from nested data |
| `UniversityAnnouncement` | `BackendAnnouncement` | Direct mapping with null coalescing |

### Runtime Validation

Every API function validates the response shape before mapping:

```ts
if (!isBackendUniversityStats(raw)) {
  console.warn("[universityService] Unexpected payload shape — using safe defaults:", raw);
  return DEFAULT_UNIVERSITY_STATS;
}
return mapUniversityStats(raw);
```

---

## 4. Custom Hooks

| Hook | Data Source | Special Behavior |
|------|-------------|------------------|
| `useUniversityStats()` | `/api/universities/stats` | Returns `DEFAULT_UNIVERSITY_STATS` on payload mismatch |
| `useUniversityStudents()` | `/api/students` | Maps `BackendStudent[]` → `UniversityStudent[]` |
| `useRecruiterApprovals()` | `/api/recruiters` | Optimistic approve; derives `pendingRecruiters` / `approvedRecruiters` |
| `useUniversityAnnouncements()` | `/api/universities/announcements` | Sets `isEndpointUnavailable=true` on 404/501 |

All hooks expose: `{ data, loading, error, refetch }` (plus hook-specific extras).

---

## 5. Error Classification

All API errors flow through `classifyApiError()` from `utils/apiErrors.ts`:

| HTTP Status | `ApiErrorCode` | UI Treatment |
|-------------|---------------|--------------|
| Network down | `NETWORK_ERROR` | ErrorState with WifiOff icon |
| 401 | `UNAUTHORIZED` | ErrorState — session expired |
| 403 | `FORBIDDEN` | ErrorState — access denied (no retry) |
| 404 | `NOT_FOUND` | `isEndpointUnavailable=true` → EmptyState "Coming Soon" |
| 501 | `NOT_IMPLEMENTED` | `isEndpointUnavailable=true` → EmptyState "Coming Soon" |
| 500+ | `SERVER_ERROR` | ErrorState with retry |

---

## 6. Multi-Tenant Awareness

The frontend assumes the backend enforces tenant isolation via JWT and middleware.

- The frontend never constructs `universityId` filters
- The frontend never bypasses or duplicates backend scoping
- No tenant-sensitive data is cached globally
- All student/recruiter data is fetched per-request within the authenticated session

---

## 7. Page States

Every API-driven page supports all five states:

| State | Component | Trigger |
|-------|-----------|---------|
| Loading | `LoadingSkeleton` | While API request is in-flight |
| Success | Page content | API returned valid data |
| Empty | `EmptyState` | API returned `[]` or no data |
| Unavailable | `EmptyState` (Coming Soon variant) | 404 / 501 — endpoint not deployed |
| Error | `ErrorState` | Network failure, 500, 403, etc. |

---

## 8. Remaining Backend Prerequisites

The following features are **frontend-ready** but require backend implementation:

| Feature | Required Endpoint | Status |
|---------|-------------------|--------|
| Announcement history | `GET /api/universities/announcements` | 🔲 Not deployed |
| Publish announcement | `POST /api/universities/announcements` | 🔲 Not deployed |
| Placement rate | `GET /api/universities/stats` → `placementRate` field | 🔲 Not in payload |
| Total students | `GET /api/universities/stats` → `totalStudents` field | 🔲 Not in payload |
| Department leaderboard | `GET /api/universities/departments/analytics` | 🔲 Not deployed |
| Regional distribution | `GET /api/universities/analytics/regional` | 🔲 Not deployed |
| Monthly trend chart | `GET /api/universities/analytics/monthly` | 🔲 Not deployed |
| Company analytics | `GET /api/universities/analytics/companies` | 🔲 Not deployed |
| At-risk students | `GET /api/universities/students/at-risk` | 🔲 Not deployed |
| Placement funnel | `GET /api/universities/analytics/funnel` | 🔲 Not deployed |
| Report generation | `POST /api/universities/reports/generate` | 🔲 Not deployed |
| CSV/Excel/PDF export | `GET /api/universities/reports/export` | 🔲 Not deployed |

---

## 9. Security & Data Privacy

### What was fixed (frontend)

- Fabricated student data (GPA, skills) was removed — backend is the single source of truth
- Fabricated institutional statistics were removed — no locally computed placement rates
- Recruiter approvals are optimistically updated locally but confirmed by backend PATCH

### Outstanding backend concerns (not frontend scope)

1. **Multi-tenancy flaw**: `GET /api/students` and `GET /api/recruiters` currently execute without `universityId` scoping — any authenticated university user can see all students/recruiters system-wide
2. **Cross-tenant recruiter approval**: `PATCH /api/universities/recruiters/:id/approve` does not verify recruiter–university association
3. These are **backend security issues** and require backend changes outside the scope of this refactor

---

## 10. Production Readiness Assessment

| Criterion | Status |
|-----------|--------|
| Zero fabricated data | ✅ Complete |
| Backend DTO + mapper pattern | ✅ Complete |
| Runtime validation | ✅ Complete |
| Typed API error classification | ✅ Complete |
| Custom hooks (data separated from UI) | ✅ Complete |
| Shared reusable components | ✅ Complete |
| Loading / Empty / Error / Unavailable states | ✅ Complete |
| Accessible HTML (ARIA, semantics, keyboard) | ✅ Improved |
| No `alert()` stubs | ✅ Complete |
| No `useState<any[]>` | ✅ Complete |
| TypeScript build passes | ✅ Verified |
| Backend multi-tenancy enforcement | ⚠️ Backend prerequisite |
| Full analytics (placement rate, departments…) | ⚠️ Backend prerequisite |
| Announcement API | ⚠️ Backend prerequisite |
