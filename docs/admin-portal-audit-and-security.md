# Admin Portal Audit & Security Documentation

This document details the backend API audit, authorization rules, service contract, frontend
integration status, and production readiness checklist for the **System Admin Portal** of S-Bridge.

---

## 1. Verified Backend Audit Report

Every endpoint below was directly verified against backend source files
(`backend/src/routes/*.js` and `backend/src/controllers/*.js`).

| Endpoint | Method | Controller Function | Auth & Authorization | Backend File & Line Reference | Frontend Integration Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/students` | GET | `getAllStudents` | Authenticated (ADMIN, UNIVERSITY) | [studentRoute.js:L9](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/studentRoute.js#L9), [studentController.js:L4-L21](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/controllers/studentController.js#L4-L21) | ✅ Integrated — `getAdminStudents()` |
| `/api/students/:id` | DELETE | `deleteStudent` | Authenticated (ADMIN only) | [studentRoute.js:L42](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/studentRoute.js#L42) | ✅ Integrated — `deleteAdminStudent()` |
| `/api/recruiters` | GET | `getAllRecruiters` | Authenticated (ADMIN, UNIVERSITY) | [recruiterRoute.js:L8](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/recruiterRoute.js#L8), [recruiterController.js:L4-L19](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/controllers/recruiterController.js#L4-L19) | ✅ Integrated — `getAdminRecruiters()` |
| `/api/universities/recruiters/:id/approve` | PATCH | `approveRecruiter` | Authenticated (ADMIN, UNIVERSITY) | [universityRoute.js:L10](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/universityRoute.js#L10), [universityController.js:L76-L104](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/controllers/universityController.js#L76-L104) | ✅ Integrated — `approveAdminRecruiter()` |
| `/api/internships` | GET | `getAllInternships` | Authenticated | [internshipRoute.js:L10](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/internshipRoute.js#L10) | ✅ Integrated — `getAdminInternships()` |
| `/api/internships/:id` | DELETE | `deleteInternship` | Authenticated (ADMIN, RECRUITER) | [internshipRoute.js:L19](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/internshipRoute.js#L19) | ✅ Integrated — `deleteAdminInternship()` |
| `/api/applications` | GET | `getApplications` | Authenticated (ADMIN, UNIVERSITY, RECRUITER) | [applicationRoute.js:L10](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/applicationRoute.js#L10) | ✅ Integrated — `getAdminApplications()` |
| `/api/reports` | GET | `getReports` | Authenticated | [reportRoute.js:L10](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/reportRoute.js#L10), [reportController.js:L55-L103](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/controllers/reportController.js#L55-L103) | ✅ Integrated — `getAdminReports()` |
| `/api/reports/:id/status` | PATCH | `updateReportStatus` | Authenticated (ADMIN, UNIVERSITY, RECRUITER) | [reportRoute.js:L16](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/reportRoute.js#L16), [reportController.js:L130-L171](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/controllers/reportController.js#L130-L171) | ✅ Integrated — `updateAdminReportStatus()` |
| `/api/universities/stats` | GET | `getUniversityStats` | Authenticated (ADMIN, UNIVERSITY) | [universityRoute.js:L7](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/universityRoute.js#L7), [universityController.js:L7-L70](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/controllers/universityController.js#L7-L70) | ✅ Integrated (v2) — `getAdminUniversityStats()` |
| `/api/notifications` | GET | `getUserNotifications` | Authenticated | [notificationRoute.js:L7](file:///c:/Users/LENOVO/Downloads/Sbridge/Parent/SB/s_bridge/backend/src/routes/notificationRoute.js#L7) | ✅ Available — `useAdminNotifications` hook |
| `/api/admin/stats` | GET | N/A | N/A | Not found in backend source | ❌ Missing — derived from sub-resources |
| `/api/admin/audit-logs` | GET | N/A | N/A | Not found in backend source | ❌ Missing — `EmptyState` (HTTP 501) |
| `/api/admin/analytics` | GET | N/A | N/A | Not found in backend source | ❌ Missing — `EmptyState` (HTTP 501) |
| `/api/admin/system-settings` | GET/PUT | N/A | N/A | Not found in backend source | ❌ Missing — static Coming Soon page |

---

## 2. Backend Response DTOs (Verified)

These interfaces exactly mirror the backend response payload shapes.

### `BackendAdminStudent`
```ts
// Source: GET /api/students → res.json({ success: true, students })
interface BackendAdminStudent {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  studentId: string | null;
  programme: string | null;
  gpa: number | string | null;
  phone: string | null;
  cvUrl: string | null;
  profilePicUrl: string | null;
  createdAt: string;
  skills: Array<{ skill?: { name?: string } }>;
  user: { email: string; isVerified: boolean } | null;
}
```

### `BackendAdminRecruiter`
```ts
// Source: GET /api/recruiters → res.json({ success: true, recruiters })
interface BackendAdminRecruiter {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite: string | null;
  position: string | null;
  isApproved: boolean;
  createdAt: string;
  companyProfile: { logoUrl?: string | null; industry?: string | null } | null;
  user: { email: string; isVerified: boolean } | null;
}
```

### `BackendAdminInternship`
```ts
// Source: GET /api/internships → res.json({ success: true, internships })
interface BackendAdminInternship {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary: number | null;
  duration: string;
  status: "OPEN" | "CLOSED" | "EXPIRED";
  createdAt: string;
  recruiter: { id?: string; companyName?: string } | null;
  _count: { applications?: number };
}
```

### `BackendUniversityStatsForAdmin`
```ts
// Source: GET /api/universities/stats → res.json({ success: true, stats: {...} })
interface BackendUniversityStatsForAdmin {
  totalStudents: number;
  totalRecruiters: number;
  pendingRecruiters: number;
  totalInternships: number;
  totalApplications: number;
  activePlacements: number;
  studentsPlaced: number;
  placementRate: number;   // 0–100
  pending: number;
  rejected: number;
}
```

---

## 3. Runtime Type Guards (Validated)

| Guard Function | Validates | Located In |
| :--- | :--- | :--- |
| `isBackendAdminStudent()` | `BackendAdminStudent` | `adminService.ts` |
| `isBackendAdminStudentArray()` | `BackendAdminStudent[]` | `adminService.ts` |
| `isBackendAdminRecruiter()` | `BackendAdminRecruiter` | `adminService.ts` |
| `isBackendAdminRecruiterArray()` | `BackendAdminRecruiter[]` | `adminService.ts` |
| `isBackendAdminInternship()` | `BackendAdminInternship` | `adminService.ts` |
| `isBackendUniversityStatsForAdmin()` | `BackendUniversityStatsForAdmin` | `adminService.ts` |

All guards return `false` (never throw) on unexpected payload shapes — prevents UI crashes.

---

## 4. DTO → Frontend Model Mappers

| Mapper Function | Input DTO | Output Model |
| :--- | :--- | :--- |
| `mapBackendAdminStudent()` | `BackendAdminStudent` | `AdminStudent` |
| `mapBackendAdminRecruiter()` | `BackendAdminRecruiter` | `AdminRecruiter` |
| `mapBackendAdminInternship()` | `BackendAdminInternship` | `AdminInternship` |
| `mapBackendAdminApplication()` | `BackendAdminApplication` | `AdminApplication` |
| `mapBackendAdminReport()` | `BackendAdminReport` | `AdminReport` |

---

## 5. Custom Hooks Inventory

| Hook | Endpoint(s) | Returns |
| :--- | :--- | :--- |
| `useAdminStats` | `GET /api/universities/stats` (fallback: 4 sub-resources) | `{ stats, loading, error, isEndpointUnavailable, refetch }` |
| `useAdminStudents` | `GET /api/students`, `DELETE /api/students/:id` | `{ students, loading, error, deleteStudent, deletingId, refetch }` |
| `useAdminRecruiters` | `GET /api/recruiters`, `PATCH /api/universities/recruiters/:id/approve` | `{ recruiters, loading, error, approveRecruiter, approvingId, refetch }` |
| `useAdminInternships` | `GET /api/internships`, `DELETE /api/internships/:id` | `{ internships, loading, error, deleteInternship, deletingId, refetch }` |
| `useAdminApplications` | `GET /api/applications` | `{ applications, loading, error, refetch }` |
| `useAdminReports` | `GET /api/reports`, `PATCH /api/reports/:id/status` | `{ reports, loading, error, updateStatus, updatingId, refetch }` |
| `useAdminNotifications` | `GET /api/notifications` | `{ notifications, unreadCount, loading, error, markRead, markAllRead, clear, refetch }` |

---

## 6. Shared Component Inventory

### Admin-Specific Components
| Component | File | Purpose |
| :--- | :--- | :--- |
| `StatCard` | `components/admin/StatCard.tsx` | KPI metric display card with theme support |
| `PageHeader` | `components/admin/PageHeader.tsx` | Consistent page title / badge / description header |

### Shared Cross-Portal Components (src/components/common/)
| Component | File | Purpose |
| :--- | :--- | :--- |
| `ConfirmDialog` | `components/common/ConfirmDialog.tsx` | Accessible modal replacing native `confirm()` |
| `StatusBadge` | `components/common/StatusBadge.tsx` | Unified status pill (PENDING/APPROVED/REJECTED/etc.) |

### Shared State Components (re-exported from student portal)
| Component | Source | Purpose |
| :--- | :--- | :--- |
| `LoadingSkeleton` | `components/student/LoadingSkeleton.tsx` | Animated skeleton for data loading states |
| `EmptyState` | `components/student/EmptyState.tsx` | Honest empty data state with icon + message |
| `ErrorState` | `components/student/ErrorState.tsx` | API error state with retry action |

---

## 7. Error Handling Matrix

| HTTP Status | `classifyApiError` Result | Admin Frontend Behavior |
| :--- | :--- | :--- |
| 400 | `isValidationError = true` | Shows field-level error or toast |
| 401 | Intercepted by Axios | Auto-redirect to `/login` |
| 403 | `isForbidden = true` | `ErrorState` — "Insufficient permissions" |
| 404 | `isNotFound = true` | `ErrorState` — "Resource not found" |
| 501 | `isEndpointUnavailable = true` | `EmptyState` — "Coming Soon" / endpoint not implemented |
| 500 | `isServerError = true` | `ErrorState` — "Server error, please retry" |
| Network | `isNetworkError = true` | `ErrorState` — "Check your connection" |

---

## 8. Zero Fabrication Rules

> **Enforced:** No fake KPIs, stats, trends, charts, or hardcoded counts are permitted anywhere in the Admin Portal.

1. Dashboard stats derive exclusively from `GET /api/universities/stats` or four parallel verified sub-resource calls.
2. "Active Placements" and "Placement Rate" are only shown when `GET /api/universities/stats` returns valid data.
3. System audit logs render an honest `EmptyState` with message referencing HTTP 501 — never a fake log list.
4. System Settings displays static role information only — no platform config controls are fabricated.
5. The internship title fallback renders `"—"` not `"Internship"` when the title is unknown.

---

## 9. Backend Prerequisites (Missing Endpoints)

The following endpoints do not yet exist in the backend and must be implemented before the corresponding Admin features can go live:

| Feature | Required Endpoint | Priority |
| :--- | :--- | :--- |
| Admin audit logs | `GET /api/admin/audit-logs` | High |
| System health dashboard | `GET /api/admin/system-health` | Medium |
| Global platform settings | `GET /api/admin/settings`, `PUT /api/admin/settings` | Medium |
| Admin-scoped analytics | `GET /api/admin/analytics` | Low |

Until these endpoints exist, all corresponding pages display a transparent `EmptyState` or "Coming Soon" state.

---

## 10. Production Readiness Checklist

| Criterion | Status |
| :--- | :--- |
| No backend code modified | ✅ |
| All API calls use verified endpoints | ✅ |
| Zero fabricated data | ✅ |
| Backend DTOs defined for every endpoint | ✅ |
| Runtime type guards on all responses | ✅ |
| DTO → Frontend model mappers in service layer | ✅ |
| Custom hooks with `{ data, loading, error, refetch }` | ✅ |
| All pages render Loading state | ✅ |
| All pages render Error state with retry | ✅ |
| All pages render EmptyState | ✅ |
| Unavailable endpoints show EmptyState / Coming Soon | ✅ |
| No native `confirm()` / `alert()` calls | ✅ (replaced with `ConfirmDialog`) |
| Light mode renders correctly | ✅ (all hardcoded dark colors removed) |
| Dark mode renders correctly | ✅ |
| All icon-only buttons have `aria-label` | ✅ |
| All dialogs have `role="dialog"` + `aria-modal` + `aria-labelledby` | ✅ |
| All dialogs support Escape key dismiss | ✅ |
| All dialogs have focus trapping | ✅ |
| Admin routes lazy-loaded (route code splitting) | ✅ |
| `npm run build` completes with 0 TypeScript errors | ✅ (verified) |
| `npm run build` completes with 0 ESLint errors | ✅ (verified) |
| Shared components in `src/components/common/` | ✅ |
| No duplicated badge / status logic across pages | ✅ (unified `StatusBadge`) |
| Documentation matches recruiter/university standard | ✅ |

---

## 11. Architecture Diagram

```
Backend API (verified endpoints only)
        │
        ▼
adminService.ts
  ├── BackendDTOs         — exact contracts from backend controllers
  ├── Type Guards         — isBackend*() runtime validators
  ├── Frontend Models     — AdminStudent, AdminRecruiter, AdminInternship, etc.
  ├── Mapper Functions    — mapBackendAdmin*()
  └── Service Functions   — getAdmin*(), deleteAdmin*(), approveAdmin*()
        │
        ▼
Custom Hooks (src/hooks/useAdmin*.ts)
  └── { data, loading, error, refetch, [action, actioningId] }
        │
        ▼
Shared Components
  ├── StatCard, PageHeader        (admin-specific)
  ├── ConfirmDialog, StatusBadge  (common — shared cross-portal)
  └── LoadingSkeleton, EmptyState, ErrorState  (shared from student)
        │
        ▼
Presentation Pages (src/pages/Admin/)
  └── Render only: Loading | Success | Empty | Error | EndpointUnavailable
      Zero business logic in pages.
```

---

## 12. Future Roadmap

| Feature | Depends On | Notes |
| :--- | :--- | :--- |
| Audit Logs Page | `GET /api/admin/audit-logs` backend endpoint | Frontend page + hook complete and ready for backend contract |
| System Health Dashboard | `GET /api/admin/system-health` | Could show DB connection, queue status, etc. |
| Platform Settings | `GET/PUT /api/admin/settings` | Global feature flags, maintenance mode toggle |
| Admin Analytics | `GET /api/admin/analytics` | Cross-portal KPI trends; requires time-series data |
| Admin Bulk Actions | Backend bulk delete endpoints | Delete multiple students/recruiters in one operation |
| Admin Impersonation | Requires auth middleware changes | View portal as any user role for debugging |

---

## 13. System Audit Trail Specification & Roadmap

### Current Backend Capability
- Backend inspection of `backend/src/` routes, controllers, middleware, and `backend/prisma/schema.prisma` confirms:
  - **No `AuditLog` Prisma model exists**.
  - **No `auditController.js` or `auditService.js` exists**.
  - **No `GET /api/admin/audit-logs` route exists**.
- **Frontend Source-of-Truth Compliance (Case B):** The Admin Portal does **not** fabricate fake audit records, mock timestamps, or fake IP addresses. The UI displays an honest, polished **"System Audit Trail Unavailable / Backend Required"** state until a real backend endpoint is deployed.

### Required Backend Roadmap & Schema Specification
To activate live administrative activity logging, the backend must implement the following capability:

1. **Prisma Model (`backend/prisma/schema.prisma`):**
   ```prisma
   model AuditLog {
     id             String   @id @default(uuid())
     timestamp      DateTime @default(now())
     actorId        String?
     actorName      String?
     actorEmail     String?
     actorRole      Role?
     action         String
     category       String   // e.g. ADMINISTRATIVE, SECURITY, PERMISSION, SYSTEM
     targetResource String?
     targetId       String?
     status         String?  // SUCCESS, FAILED
     ipAddress      String?
     userAgent      String?
     details        String?  @db.Text
     metadata       Json?
     createdAt      DateTime @default(now())

     @@index([timestamp])
     @@index([category])
     @@index([actorId])
   }
   ```

2. **Controller & Route (`GET /api/admin/audit-logs`):**
   - Query filters: `query`, `category`, `startDate`, `endDate`, `page`, `limit`.
   - Authorization: Restricted exclusively to `Role.ADMIN` (or `SUPER_ADMIN` if configured).
   - Response DTO:
     ```json
     {
       "success": true,
       "auditLogs": [
         {
           "id": "uuid",
           "timestamp": "2026-08-12T02:00:00.000Z",
           "actorName": "System Admin",
           "actorRole": "ADMIN",
           "action": "RECRUITER_APPROVED",
           "category": "RECRUITER_MANAGEMENT",
           "targetResource": "Recruiter: Tech Corp",
           "status": "SUCCESS",
           "ipAddress": "192.168.1.1",
           "userAgent": "Mozilla/5.0...",
           "details": "Approved recruiter profile Tech Corp"
         }
       ]
     }
     ```

3. **Frontend Integration:**
   - The frontend architecture (`BackendAdminAuditEvent` DTO, `isBackendAdminAuditEvent` runtime guard, `mapBackendAdminAuditEvent` mapper, `useAdminAuditLogs` hook, and `AdminAuditLogsPage`) is already fully built and ready to ingest live backend audit records immediately upon deployment of the endpoint.

