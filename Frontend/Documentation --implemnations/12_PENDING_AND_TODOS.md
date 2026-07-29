# SBridge Frontend — 12. Pending Items & Completed Deliverables

> **Scope:** Progress tracker & roadmap status.
> **Last Updated:** July 2026

---

## 🟢 Completed Deliverables (v1.3.0 — Student Portal Production Audit)

### 1. API Services Layer (`Frontend/src/services/`)
- `studentService.ts` — API calls for student stats, applications, profile, and CV/avatar uploads.
  - Added `BackendStudentStats` DTO, `StudentStats` frontend model, `mapStudentStats()` mapper.
  - Added `isBackendStudentStats()` runtime type guard — validates backend payload shape before mapping.
  - Added `validateCVFile()` — PDF only, max 5 MB validation helper.
  - Added `validateAvatarFile()` — MIME type + size validation helper.
- `internshipService.ts` — API calls for searching and filtering internship listings.
- `applicationService.ts` — API calls for application submission, status updates, and withdrawals.
- `reportService.ts` — API calls for logbook report submissions and status reviews.
- `notificationService.ts` — API calls for user notifications and mark-as-read.
- `universityService.ts` — API calls for university placement stats, student list, recruiter approval.
- **`interviewService.ts`** ⭐ NEW — Isolated service for Phase 3 `GET /api/students/interviews`. Returns `[]` gracefully when endpoint is unavailable (404/501). All other errors bubble up to the UI with correct classification.
- **`savedJobsService.ts`** ⭐ NEW — Isolated service for Phase 2 `GET /api/students/saved-jobs`. Same graceful 404 handling.

### 2. API Error Utilities (`Frontend/src/utils/`)
- **`apiErrors.ts`** ⭐ NEW — Centralized `classifyApiError()` utility. Converts raw Axios errors into typed `ClassifiedApiError` objects with codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `NOT_IMPLEMENTED`, `SERVER_ERROR`, `NETWORK_ERROR`. The `isEndpointUnavailable` flag cleanly separates "planned but not deployed" from real failures.

### 3. Custom Hooks (`Frontend/src/hooks/`)
- `useScrollAnimation.ts` — GSAP scroll animation hook.
- **`useStudentStats.ts`** ⭐ NEW — Encapsulates fetch lifecycle for dashboard statistics.
- **`useStudentInterviews.ts`** ⭐ NEW — Encapsulates fetch lifecycle for interviews (Phase 3).
- **`useSavedJobs.ts`** ⭐ NEW — Encapsulates fetch lifecycle + remove action for saved jobs (Phase 2).

### 4. Shared Student Components (`Frontend/src/components/student/`)
- **`EmptyState.tsx`** ⭐ NEW — Reusable empty state: icon, title, description, primary + secondary actions.
- **`LoadingSkeleton.tsx`** ⭐ NEW — Animated skeleton cards in list or grid layout.
- **`ErrorState.tsx`** ⭐ NEW — Typed HTTP error messages with code-specific icons, colors, and optional retry button. Accepts `ClassifiedApiError` objects directly.

### 5. Student Portal Pages — Production Audit (v1.3.0)

| Page | Status | Changes |
|---|---|---|
| `StudentDashboard.tsx` | ✅ Fixed | Correct stat keys via mapper (`pendingReviews→underReview`, `acceptedOffers→accepted`). Replaced Interviews card with Reports Submitted. CV upload: PDF only, 5 MB client-side validation. |
| `StudentInterviewsPage.tsx` | ✅ Rewritten | Hardcoded data (MTN Ghana, GCB Bank, Hubtel) removed. Uses `useStudentInterviews()` hook. Shows loading → empty → error states. Empty until Phase 3 endpoint deployed. |
| `StudentSavedJobsPage.tsx` | ✅ Rewritten | Local `useState` bookmarks removed. Uses `useSavedJobs()` hook. Remove action calls API. Empty until Phase 2 endpoint deployed. |
| `StudentInternshipPage.tsx` | ✅ Fixed | Graceful coordinator field fallbacks — shows "Coordinator information unavailable" when fields are missing. |
| `StudentResumeAnalyzerPage.tsx` | ✅ Fixed | Fake metric scores (88%, 82/100, 94%) removed from blurred preview. Replaced with feature descriptions. Coming Soon overlay preserved. |
| `StudentAICareerAssistantPage.tsx` | ✅ Fixed | Fake AI metrics (88% Career Match, 92.4% Placement) removed. Replaced with descriptive feature cards. Coming Soon overlay preserved. |

### 6. University Portal Pages (100% Implemented)
- `UniversityDashboard.tsx` — Royal Violet theme matching mockup.
- `UniversityStudentsPage.tsx` — Student roster table.
- `UniversityDepartmentsPage.tsx` — Department performance & AI placement forecasts.
- `UniversityCollegesPage.tsx` — College rankings & accreditation reports.
- `UniversityPlacementOverviewPage.tsx` — 5-stage Master Placement Funnel.
- `UniversityReportsPage.tsx` — Executive Institutional Analytics Dashboard.
- `UniversityAnnouncementsPage.tsx` — Broadcast publishing hub.
- `UniversityCompanyDirectoryPage.tsx` — Verified employer directory.
- `UniversityApprovalsPage.tsx` — Recruiter verification queue.
- `UniversitySettingsPage.tsx` — Institution profile, domain integration & policies.

### 7. Router & Routing Resolution
- Created `RoleBasedReportsPage`, `RoleBasedMessagesPage`, `RoleBasedNotificationsPage`, `RoleBasedSettingsPage` to dispatch shared routes based on `user?.role`.
- `npm run build` passes with **0 TypeScript errors — 510 modules, built in 1.46s**.

---

## 🟡 Planned Future Phases

### Phase 2 (Backend work required first)
- **SavedJobs backend model** — Add `SavedJob` model to Prisma schema and implement `GET /api/students/saved-jobs` + `DELETE /api/students/saved-jobs/:id`. The frontend service (`savedJobsService.ts`) is already isolated and ready to connect.

### Phase 3 (Backend work required first)
- **Interviews backend model** — Add `Interview` model to Prisma schema and implement `GET /api/students/interviews`. The frontend service (`interviewService.ts`) is already isolated and ready to connect.

### Engineering Improvements (Frontend)
- **Unit tests** — Add tests for `mapStudentStats()`, `validateCVFile()`, `classifyApiError()`, `isBackendStudentStats()`, and the new hooks. These are pure logic and easy to test with Vitest.
- **Service folder reorganization** — When the recruiter portal expands, group services by feature domain (`services/student/`, `services/university/`, `services/recruiter/`).
- **Dashboard stat trends** — If the backend later exposes historical data, add `↑12% last 30 days` trend indicators to stat cards.
- **WebSocket messaging** — Real-time connection for live notification badges.
- **Company / Recruiter Portal** — `CompanyDashboard.tsx`, `PostOpportunityPage`, `CandidatePipelinePage`.
