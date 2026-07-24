# S-Bridge — Frontend Implementation & Roadmap Status

This document provides a detailed breakdown of what has been completed for the S-Bridge frontend architecture, user interface, authentication integration, and design system, as well as the remaining frontend tasks.

---

## 1. Completed Frontend Implementations

### A. Multi-Portal Architecture & Routing (`src/routes/AppRouter.tsx`)
- **Sub-domain & Parameter Portal Switching:** Dynamically detects sub-domains (`student.`, `university.`, `recruiter.`) or URL parameters (`?portal=student`) to render tailored portal experiences.
- **Portals Implemented:**
  - **Student Portal:** Dedicated landing and student dashboard layout.
  - **University Portal:** Dedicated landing and placement administration layout.
  - **Recruiter / Company Portal:** Dedicated landing and hiring dashboard layout.
  - **Main Portal:** Combined landing page for general visitors with links to all sub-portals.
- **Protected Routing (`src/components/auth/ProtectedRoute.tsx`):** Client-side route guard enforcing authentication checks before granting access to `/dashboard` routes.
- **Sub-Page Fallback Route (`src/pages/Dashboard/DashboardSubPage.tsx`):** Handles deep nested routes under `/dashboard/*` with a user-friendly "Under Construction" placeholder interface.

### B. Authentication UI & Full Flow (`src/pages/Auth`)
- **Login Page (`LoginPage.tsx`):** Role-aware login form connected directly to `POST /api/auth/login`. Displays backend validation and error messages.
- **Signup Page (`SignupPage.tsx`):** Interactive signup form supporting all 3 roles (`Student`, `Recruiter`, `University`).
  - Dynamically renders input fields for `Student ID` and `Index Number` when registering as a Student.
  - Dynamically renders `Company Name` for Recruiters and `University Name` for Universities.
  - Connected directly to `POST /api/auth/register`.
- **Auth Auxiliary Views:**
  - `SignupOTPPage.tsx` & `SignupSuccessfulPage.tsx`
  - `SignInSuccessfulPage.tsx`
  - `ForgotPasswordPage.tsx`, `ResetPasswordOTPPage.tsx`, `ResetPasswordPage.tsx`, & `PasswordResetSuccessfulPage.tsx`

### C. State Management & API Integration
- **Axios HTTP Client (`src/services/api.ts`):**
  - Base URL configuration using `import.meta.env.VITE_API_URL` (defaults to `http://localhost:5000`).
  - Request interceptor attaching `Authorization: Bearer <token>` header on all requests.
  - Response interceptor handling `401 Unauthorized` globally (clears session and redirects to `/login`).
- **Auth Context (`src/context/AuthContext.tsx`):** Global React context handling user credentials, JWT token, login/register calls, logout action, and `localStorage` synchronization.

### D. Design System & Dashboard Framework
- **Theme Engine (`src/context/DashboardContext.tsx`):** Supports instant Dark/Light mode toggle across all portal layouts.
- **Rich Aesthetic Styling:** Built with Vanilla CSS, glassmorphism containers, smooth backdrop blurs, micro-animations, and custom typography.
- **Dashboard Layouts:**
  - **Student Dashboard (`StudentDashboard.tsx`):** Cards for AI match scores, active application trackers, skill tags, and timeline feeds.
  - **Recruiter Dashboard (`CompanyDashboard.tsx`):** Cards for active job listings, total applicant counts, company overview stats, and candidate cards.
  - **University Dashboard (`UniversityDashboard.tsx`):** Cards for student placement statistics, company approvals, and logbook report review queues.

---

## 2. Next Steps & Frontend Roadmap

1. **Connect Main Dashboards to Live Backend Data:**
   - Replace static mock data on student, recruiter, and university dashboards with live API data from backend endpoints (`GET /api/students/:id`, `GET /api/recruiters/:id`, etc.).

2. **Build Full Sub-Pages (Replacing `DashboardSubPage.tsx` Placeholders):**
   - **Student Views:**
     - *Find Opportunities / Job Search:* Interactive searchable job list with filters (location, type, skill tag) and an "Apply Now" modal.
     - *My Applications:* Status tracking timeline (`Pending`, `Reviewing`, `Accepted`, `Rejected`) with cover letter details.
     - *Profile & Skills Editor:* Profile editor form allowing students to update GPA, Programme, CV URL, and skill tags.
     - *Weekly Logbook Submission:* Upload form for weekly progress reports submitted to university supervisors.
   - **Recruiter Views:**
     - *Post an Internship / Job Builder:* Form to create new job listings with target programmes and required skills.
     - *Manage Listings & Applicants:* Candidate review interface displaying match scores, applicant details, and status update actions.
     - *Company Profile Settings:* Form to edit company bio, logo URL, industry, and address.
   - **University Views:**
     - *Student Monitoring Roster:* Table displaying all enrolled students, placement statuses, and assigned companies.
     - *Logbook Review Center:* Interface to inspect submitted student progress reports, leave comments, and approve/reject submissions.
     - *Company Verification:* Approval workflow view to verify newly registered employer accounts.

3. **File Upload UI Dropzones:**
   - Implement drag-and-drop file upload interfaces for Student CVs, Profile pictures, Company logos, and Logbook PDFs.

4. **Notifications UI Component:**
   - Header bell icon with an interactive notifications dropdown drawer showing real-time updates on applications and reports.

5. **OTP Email Verification Flow Wiring:**
   - Connect the OTP input pages (`SignupOTPPage`, `ResetPasswordOTPPage`) to backend email verification endpoints when SMTP dispatch is enabled.
