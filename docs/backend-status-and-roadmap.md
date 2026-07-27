# S-Bridge — Backend Implementation & Roadmap Status

This document provides a detailed breakdown of what has been completed for the S-Bridge backend architecture, database layer, authentication system, profile APIs, and core platform services.

---

## 1. Completed Backend Implementations

### A. Database Architecture & Schema (Prisma v7 & PostgreSQL)
- **Prisma v7 Integration:** Upgraded to Prisma v7 using `@prisma/adapter-pg` driver adapter with Node `pg` connection pooling (`src/config/db.js`).
- **Complete Data Model (`prisma/schema.prisma`):**
  - **`User`**: Base authentication table storing email, `passwordHash`, `role` (`STUDENT`, `RECRUITER`, `UNIVERSITY`, `ADMIN`), `isVerified`, `studentId`, and `indexNumber`.
  - **`Student`**: Holds student details (GPA, programme, experience, CV URL, profile picture) and maps to skills, applications, and weekly logbooks.
  - **`Recruiter`**: Profile for corporate employers linked to company descriptions and internship job postings.
  - **`University`**: Placement administrator profiles linked by email domain verification.
  - **`CompanyProfile`**: Stores detailed company profile info (description, industry, size, logo URL, address, website).
  - **`Internship` & `Skill` Join Tables:** Represents internship job listings and skill tag associations (`StudentSkill`, `InternshipSkill`).
  - **`Application`**: Handles student internship applications with match scores and status workflows (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`).
  - **`Report`**: Handles weekly progress logbook submissions from students to university supervisors.
  - **`Notification`**: System and application event notifications.
  - **`PasswordResetToken` & `EmailVerificationToken`**: Security tokens for auth verification flows.
- **Database Seeder (`prisma/seed.js`):** Script to reset and seed initial testing data (skills, test accounts, internships).

### B. Authentication, Password Reset & Security
- **Transactional Account & Profile Creation (`src/services/authServices.js`):**
  - User registration wrapped in a Prisma `$transaction` block, atomically creating matching role profiles (`Student`, `Recruiter`, or `University`).
- **JWT & Pre-joined Profile Serialization (`src/controllers/authController.js`):**
  - Password hashing with `bcryptjs` and token signing with `jsonwebtoken`.
  - `POST /api/auth/login` includes pre-joined profile name details (`firstName`, `lastName`, `companyName`, `universityName`) in the user response.
- **Password Reset & Verification OTP Engine:**
  - `POST /api/auth/forgot-password` — Generates 6-digit OTP and dispatches reset instructions.
  - `POST /api/auth/reset-password` — Validates OTP and updates password.
  - `POST /api/auth/verify-email` & `POST /api/auth/resend-verification` — Email verification workflows.
  - `PUT /api/auth/change-password` — Authenticated password change endpoint.
- **Authorization & Role Middleware (`src/middleware/auth.js`):**
  - `authenticate`: Validates JWT Bearer token and attaches user profile.
  - `authorizeRoles(...roles)`: Restricts endpoints by role (`ADMIN`, `UNIVERSITY`, `RECRUITER`, `STUDENT`).

### C. Cloudinary File Upload Integration
- **Multer Memory Buffer Middleware (`src/middleware/upload.js`):** Intercepts multipart/form-data uploads without writing to local disk.
- **Cloudinary SDK Utility (`src/utils/cloudinary.js`):** Upload stream pipeline supporting PDF CVs, profile avatars, and company logos.
- **Upload Endpoints:**
  - `POST /api/students/upload-cv` — Upload PDF resume to Cloudinary.
  - `POST /api/students/upload-avatar` — Upload profile avatar image.
  - `POST /api/recruiters/upload-logo` — Upload company logo.

### D. Internships & Match Scoring Engine
- **Internship Management (`src/controllers/internshipController.js` & `src/routes/internshipRoute.js`):**
  - `POST /api/internships` — Create internship posting with skill requirements.
  - `GET /api/internships` — List all open internships. When requested by a student, dynamically computes a `matchScore` percentage based on skill tag overlap.
  - `GET /api/internships/:id` — Fetch internship listing details.
  - `PUT /api/internships/:id` & `DELETE /api/internships/:id` — Update or delete listing.

### E. Applications Engine
- **Application Workflows (`src/controllers/applicationController.js` & `src/routes/applicationRoute.js`):**
  - `POST /api/applications` — Submit application with cover letter.
  - `GET /api/applications` — Retrieve applications with status filters.
  - `PATCH /api/applications/:id/status` — Update application status (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`).

### F. Logbook & Weekly Reports API
- **Progress Reporting (`src/controllers/reportController.js` & `src/routes/reportRoute.js`):**
  - `POST /api/reports` — Submit weekly report (validates student active accepted placement).
  - `GET /api/reports` — List submitted reports for student or supervisor.
  - `PATCH /api/reports/:id/status` — Supervisor approval/rejection with comments.

### G. University Portal API
- **Administration & Analytics (`src/controllers/universityController.js` & `src/routes/universityRoute.js`):**
  - `GET /api/universities/stats` — Aggregated stats (total students, active placements, total applications, verified recruiters, placement rate).
  - `PATCH /api/universities/recruiters/:id/approve` — Approve recruiter organization profiles.

---

## 2. Next Steps & Backend Roadmap

1. **Messaging & Conversation API:**
   - Create models, controllers, and routes for direct messaging between students, recruiters, and university liaisons (`/api/conversations`).

2. **Automated Notification Triggers:**
   - Wire up notification generation on application status changes and report feedback events (`/api/notifications`).

3. **Production Mailgun DNS Verification:**
   - Transition Mailgun from Sandbox mode to a custom verified domain for production email dispatch.
