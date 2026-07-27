# SBridge Frontend — 02. Routing System

> **Scope:** `src/routes/AppRouter.tsx`, Portal detection, Route tables, Role dispatchers

---

## 1. Portal Resolution (`getActivePortal`)

```typescript
export const getActivePortal = (): "student" | "university" | "recruiter" | "main" => {
  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const override = params.get("portal");

  if (override === "student" || hostname.startsWith("student.")) return "student";
  if (override === "university" || hostname.startsWith("university.")) return "university";
  if (
    override === "recruiter" ||
    override === "company" ||
    hostname.startsWith("recruiter.") ||
    hostname.startsWith("company.")
  )
    return "recruiter";
  return "main";
};
```

---

## 2. Dynamic Role Dispatching

For shared path endpoints (`/dashboard/reports`, `/dashboard/messages`, `/dashboard/notifications`, `/dashboard/settings`), `AppRouter.tsx` uses dynamic role dispatchers to prevent route precedence collisions:

- `RoleBasedReportsPage`: Renders `UniversityReportsPage` (Executive Analytics) for `UNIVERSITY` role and `StudentReportsPage` (Logbooks) for `STUDENT` role.
- `RoleBasedMessagesPage`: Renders `UniversityMessagesPage` for `UNIVERSITY` role and `StudentMessagesPage` for `STUDENT` role.
- `RoleBasedNotificationsPage`: Renders `UniversityNotificationsPage` for `UNIVERSITY` role and `StudentNotificationsPage` for `STUDENT` role.
- `RoleBasedSettingsPage`: Renders `UniversitySettingsPage` for `UNIVERSITY` role and `StudentSettingsPage` for `STUDENT` role.

---

## 3. Complete Route Table

### Student Portal Routes (`studentRoutes`)
- `/dashboard` $\rightarrow$ `StudentDashboard`
- `/dashboard/explore` $\rightarrow$ `ExploreOpportunitiesPage`
- `/dashboard/applications` $\rightarrow$ `StudentApplicationsPage`
- `/dashboard/interviews` $\rightarrow$ `StudentInterviewsPage`
- `/dashboard/placement-history` $\rightarrow$ `StudentPlacementHistoryPage`
- `/dashboard/ai-assistant` $\rightarrow$ `StudentAICareerAssistantPage`
- `/dashboard/saved-jobs` $\rightarrow$ `StudentSavedJobsPage`
- `/dashboard/resume-analyzer` $\rightarrow$ `StudentResumeAnalyzerPage`
- `/dashboard/profile` $\rightarrow$ `StudentProfilePage`
- Direct role alias: `/student/dashboard/*`

### University Portal Routes (`universityRoutes`)
- `/dashboard` $\rightarrow$ `UniversityDashboard`
- `/dashboard/students` $\rightarrow$ `UniversityStudentsPage`
- `/dashboard/departments` $\rightarrow$ `UniversityDepartmentsPage`
- `/dashboard/colleges` $\rightarrow$ `UniversityCollegesPage`
- `/dashboard/placement-overview` $\rightarrow$ `UniversityPlacementOverviewPage`
- `/dashboard/reports` $\rightarrow$ `UniversityReportsPage` (Executive Institutional Dashboard)
- `/dashboard/announcements` $\rightarrow$ `UniversityAnnouncementsPage`
- `/dashboard/company-directory` $\rightarrow$ `UniversityCompanyDirectoryPage`
- `/dashboard/approvals` $\rightarrow$ `UniversityApprovalsPage`
- `/dashboard/internships` $\rightarrow$ `UniversityInternshipsPage`
- Direct role alias: `/university/dashboard/*`
