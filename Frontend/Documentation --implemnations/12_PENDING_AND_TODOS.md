# 12 – Pending Work & TODOs

> **Parent Doc:** [README.md](./README.md)

This document consolidates all `// TODO` comments found in the source, all stubbed/empty features, and recommended next steps for the frontend.

---

## 1. Dashboard Data Integration

The dashboard UIs are fully built but all data is either hardcoded to `0` or empty arrays. Every widget has a TODO marking where the API call should be wired.

### Student Dashboard (`StudentDashboard.tsx`)

| TODO | API Endpoint to connect |
|------|------------------------|
| Application stats (total, under review, accepted, rejected) | `GET /api/student/applications/stats` |
| Application steps (stepper) | `GET /api/student/applications/latest` |
| Tasks | `GET /api/student/tasks` (not yet built in backend) |
| Messages | `GET /api/student/messages` (not yet built in backend) |

### University Dashboard (`UniversityDashboard.tsx`)

| TODO | API Endpoint to connect |
|------|------------------------|
| Student count, internship count, pending approvals, completed | `GET /api/university/stats` |
| Approvals queue | `GET /api/university/approvals` |
| Activity feed | `GET /api/university/activities` |

### Company Dashboard (`CompanyDashboard.tsx`)

| TODO | API Endpoint to connect |
|------|------------------------|
| Active postings, applicants, interns, evaluations | `GET /api/company/stats` |
| Applicants list | `GET /api/company/applicants` |
| Active interns | `GET /api/company/interns` |

### DashboardContext (`DashboardContext.tsx`)

These are all called out explicitly in the file:

```ts
// TODO: fetch tasks from GET /api/student/tasks
// TODO: fetch messages from GET /api/student/messages
// TODO: fetch approvals from GET /api/university/approvals
// TODO: fetch activities from GET /api/university/activities
// TODO: fetch applicants from GET /api/company/applicants
// TODO: fetch interns from GET /api/company/interns
// TODO: fetch notifications from GET /api/notifications
```

---

## 2. Social / OAuth Authentication

All four social auth buttons are wired to empty stub handlers in `AuthComponents.tsx`:

```ts
// TODO: redirect to GET /auth/google
// TODO: redirect to GET /auth/github
// TODO: redirect to GET /auth/facebook
// TODO: redirect to GET /auth/linkedin
```

**What needs to happen:**
1. Backend: implement OAuth strategy (Passport.js or manual flow) for each provider
2. Backend: `GET /auth/google` → redirect to Google OAuth consent
3. Frontend: `onGoogle` prop → `window.location.href = "http://localhost:5000/auth/google"`

---

## 3. OTP Email Verification

`SignupOTPPage.tsx` and `ResetPasswordOTPPage.tsx` exist as UI screens but are not connected to backend OTP logic.

**Backend already has:**
- `EmailVerificationToken` model in Prisma schema
- `PasswordResetToken` model in Prisma schema
- `Nodemailer` installed (`^9.0.3`)

**What needs to happen on the Frontend:**
1. After `register()`, store the email in location state and navigate to `/signup-otp`
2. `SignupOTPPage`: call `POST /api/auth/verify-email` with `{ token: otpCode }`
3. On success: navigate to `/signup-successful`
4. Similarly wire `ResetPasswordOTPPage` → `POST /api/auth/verify-reset-otp`

---

## 4. Password Reset Flow

`ForgotPasswordPage` → `ResetPasswordOTPPage` → `ResetPasswordPage` → `PasswordResetSuccessfulPage`

All four pages exist as UI scaffolds. Backend endpoints need building and frontend needs to call them.

**Needed API calls:**
| Step | API call |
|------|----------|
| Forgot password form submit | `POST /api/auth/forgot-password { email }` |
| OTP verification | `POST /api/auth/verify-reset-otp { email, otp }` |
| Set new password | `POST /api/auth/reset-password { token, newPassword }` |

---

## 5. Dashboard Sub-Pages

Every sidebar link beyond "Dashboard" renders `DashboardSubPage` (the "under construction" stub). These are all pending implementation:

### Student Sub-Pages
- `/dashboard/applications` — List + filter all applications
- `/dashboard/internship` — Active internship details + logbook
- `/dashboard/reports` — Submit and view weekly/monthly reports
- `/dashboard/messages` — Inbox and messaging
- `/dashboard/notifications` — Notification centre
- `/dashboard/profile` — Edit student profile, upload CV
- `/dashboard/settings` — Account settings

### University Sub-Pages
- `/dashboard/students` — Student directory with search/filter
- `/dashboard/internships` — Browse all internship listings
- `/dashboard/approvals` — Manage report approvals
- `/dashboard/reports` — Analytics and export
- `/dashboard/messages` — Communication centre
- `/dashboard/notifications` — Notification centre
- `/dashboard/settings` — University account settings

### Recruiter Sub-Pages
- `/dashboard/postings` — Create and manage internship listings
- `/dashboard/applications` — Review all applications
- `/dashboard/interns` — Manage active intern roster
- `/dashboard/evaluations` — Submit intern evaluations
- `/dashboard/messages` — Communication
- `/dashboard/analytics` — Hiring analytics
- `/dashboard/settings` — Company account settings

---

## 6. Dashboard Topbar Search

The search input in `DashboardLayout` updates `searchQuery` in `DashboardContext`, but nothing currently consumes this value.

```ts
// TODO: Implement global search filtering in each dashboard
// Currently: setSearchQuery(value) is called but no component reads it
```

---

## 7. File Uploads

**CV Upload** (Student profile): `cvUrl` field exists in the `Student` model but no file upload UI or backend endpoint is implemented.

**Report Upload**: `fileUrl` field exists in the `Report` model but upload UI is pending.

**Recommended approach:**
- Use a cloud storage service (e.g. Cloudinary, AWS S3, Supabase Storage)
- Add a `POST /api/upload` endpoint that returns the public URL
- Integrate a `<FileInput>` component into the student profile and report submission forms

---

## 8. Admin Portal

The `src/pages/Admin/` directory exists but is empty. The database schema has an `ADMIN` role. The admin portal is planned but not started.

**Planned admin features:**
- User management (view, suspend, delete accounts)
- Recruiter approval (set `isApproved: true` on `Recruiter` model)
- Platform-wide analytics
- System notifications

---

## 9. Planned but Empty Module Directories

These directories were created as scaffolding but have no files yet:

| Directory | Purpose |
|-----------|---------|
| `src/student/` | Student-specific layouts/pages (feature-based organisation) |
| `src/recruiter/` | Recruiter-specific layouts/pages |
| `src/university/` | University-specific layouts/pages |
| `src/components/navigation/` | Shared nav components |
| `src/components/ui/` | Generic UI primitives (Modal, Dropdown, Badge) |
| `src/components/animations/` | Reusable animation wrappers |
| `src/types/` | Shared TypeScript interfaces |
| `src/utils/` | Utility functions |
| `src/config/` | App configuration objects |
| `src/lib/` | Third-party library wrappers |
| `src/shared/` | Shared domain logic |

---

## 10. TypeScript Improvements

- `src/types/` is empty — shared API response types should be defined here and imported by services and components
- Some `profileData` params in `AuthContext.register()` are typed as `any` and should be narrowed with role-specific interfaces
- `DebugMenu.tsx` should be conditionally compiled out of the production bundle

---

## Priority Order (Recommended)

| Priority | Task |
|----------|------|
| 🔴 High | Connect dashboard stats and lists to backend API |
| 🔴 High | Wire OTP email verification flow |
| 🔴 High | Complete password reset API integration |
| 🟡 Medium | Build Student sub-pages (profile, applications, reports) |
| 🟡 Medium | Build Recruiter sub-pages (postings, applications) |
| 🟡 Medium | File upload integration (CV + reports) |
| 🟡 Medium | Implement search filtering with `searchQuery` |
| 🟢 Low | Social OAuth integration |
| 🟢 Low | Admin portal |
| 🟢 Low | TypeScript shared types cleanup |
