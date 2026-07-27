# S-Bridge — University Portal Technical Audit, Multi-Tenant Architecture & Data Security Strategy

This document provides a comprehensive technical audit of the University Portal, detailing identified security vulnerabilities, data representation inconsistencies, and the architectural design required to enforce strict multi-tenant isolation, data privacy (FERPA/GDPR/Data Protection Act compliance), and role-consistent statistics.

---

## 1. Technical Audit & Security Findings

### 🛡️ A. Security & Data Breach Vulnerabilities
1. **Global Unscoped Data Exposure (Multi-Tenancy Flaw):**
   - In `universityController.js` (`getUniversityStats`) and `studentController.js` (`getAllStudents`), queries execute system-wide without institution filtering (`prisma.student.findMany()`, `prisma.student.count()`).
   - **Risk:** University A can view, list, and inspect profiles, GPAs, index numbers, and CV links of students from University B.
2. **Unrestricted Cross-Tenant Recruiter Approvals:**
   - `approveRecruiter` updates `isApproved: true` on any recruiter record globally without verifying if the recruiter is partnered with or requesting approval from that specific university.
3. **Missing Foreign Key Link (`universityId`):**
   - The `Student` and `Recruiter` tables in `prisma/schema.prisma` lack explicit relation attributes linking them to a specific `University` model (`universityId`).

### ⚡ B. Data Representation & Interface Inconsistencies
1. **Frontend vs. Backend Stat Payload Mismatch:**
   - `UniversityDashboard.tsx` expects `{ studentsPlaced, placementRate, pending, rejected }`.
   - Backend `getUniversityStats` outputs `{ activePlacements, totalApplications, pendingRecruiters }`.
   - **Impact:** Frontend renders `0% Placement Rate` and `0 Pending` fallbacks even when active placements exist.
2. **Misleading Hardcoded Fallbacks:**
   - In `UniversityStudentsPage.tsx`, missing student GPAs fall back to displaying `"3.65"`, and missing skills default to `"React, Node.js"`.
3. **Orphaned UI Actions:**
   - Features such as "Send Announcement", "Department Placement Leaderboard", and "Generate Placement Report" rely on component-level state or alert stubs without persistent database schemas (`Announcement` model).

---

## 2. Universal Strategy for Multi-Tenant Data Security & Role Consistency

To prevent data breaches and ensure strict data consistency across all user roles (**Student**, **Recruiter**, **University**, **Admin**), S-Bridge enforces the following architectural principles:

```
                  ┌──────────────────────────────────────────────┐
                  │          Authenticated JWT Request           │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Tenant Isolation & Scoping Middleware     │
                  │   Attaches req.tenant = { universityId }    │
                  └──────────────────────┬───────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
      ┌────────────────────────────────────┐   ┌────────────────────────────────────┐
      │   Student / Recruiter Queries      │   │     University Aggregations        │
      │  WHERE student.universityId = X    │   │   WHERE student.universityId = X   │
      └────────────────────────────────────┘   └────────────────────────────────────┘
```

### 1. Explicit Tenant Association in Database Schema
Every role profile and entity must be anchored to an institution or organization:
- **`Student.universityId`**: Linked automatically upon registration by verifying institutional email domain (`@ug.edu.gh`, `@knust.edu.gh`).
- **`Recruiter.universityId`** (or `UniversityRecruiter` join table): Links employer partnerships to specific university placement boards.

### 2. Tenant Isolation Middleware (`tenantScope.js`)
Instead of leaving `where` clauses up to individual controller methods, a central tenant scoping helper automatically injects the tenant filter:
```javascript
// Example Tenant Filter Builder
function getTenantFilter(req) {
  if (req.user.role === 'ADMIN') return {}; // System Admins see global
  if (req.user.role === 'UNIVERSITY') {
    return { universityId: req.user.university.id };
  }
  return { id: req.user.student?.id };
}
```

### 3. Single Source of Truth for Derived Statistics (Canonical Math)
All statistics (Placement Rate, Application Counts, Active Placements) must use standard, unified formulas across all 3 portal views:
$$\text{Placement Rate (\%)} = \left( \frac{\text{Accepted Placements}}{\text{Total Enrolled Students}} \right) \times 100$$
- **Student Portal**: Sees personal placement status (`PLACED` / `SEARCHING`).
- **Recruiter Portal**: Sees total applicants and offer acceptance rate for their specific listings.
- **University Portal**: Sees institution-level aggregated totals derived exclusively from their tenant's student body.

---

## 3. Implementation Roadmap

### Phase 1: Database Schema Enhancements
- Add `universityId` foreign key to `Student` model in `schema.prisma`.
- Add `Announcement` model (`id`, `universityId`, `title`, `content`, `targetGroup`, `createdAt`).
- Add `UniversityRecruiterApproval` model for tenant-specific employer verification.

### Phase 2: Backend Tenant Isolation & Endpoint Scoping
- Refactor `studentController.js` (`getAllStudents`) to scope results by `req.user.university.id`.
- Refactor `universityController.js` (`getUniversityStats`) to compute scoped stats:
  - `totalStudents`, `activePlacements`, `placementRate`, `pendingApplications`.
- Implement `POST` & `GET` `/api/universities/announcements`.

### Phase 3: Frontend Data Contract & UI Cleanup
- Update `universityService.ts` to match the exact backend stats shape.
- Replace deceptive hardcoded string fallbacks (`"3.65"`, `"React, Node.js"`) with explicit empty-state indicators (`"Not Set"`, `"Unassigned"`).
- Connect `UniversityAnnouncementsPage.tsx` to the live backend announcements API.

### Phase 4: Audit & Export Capabilities
- Implement real CSV report generation for university placement officers.
