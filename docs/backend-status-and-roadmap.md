# S-Bridge — Backend Implementation & Roadmap Status

This document provides a detailed breakdown of what has been completed for the S-Bridge backend architecture, database layer, authentication system, and profile APIs, as well as the remaining backend tasks.

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

### B. Authentication & Security
- **Transactional Account & Profile Creation (`src/services/authServices.js`):**
  - User registration is wrapped in a Prisma `$transaction` block.
  - Generates the base `User` record and atomically creates the matching role profile (`Student`, `Recruiter`, or `University`).
  - Validates uniqueness for `email`, `studentId`, and `indexNumber` before creation.
- **JWT & Hashing (`src/controllers/authController.js`):**
  - Secure password hashing using `bcryptjs`.
  - JWT token generation using `jsonwebtoken` with environment secret configuration (`JWT_SECRET`, `JWT_EXPIRES_IN`).
- **Authorization & Role Middleware (`src/middleware/auth.js`):**
  - `authenticate`: Extracts Bearer token from headers, verifies JWT signature, and attaches full user object with pre-loaded profile context to `req.user`.
  - `authorizeRoles(...roles)`: Restricts routes to specified user roles (e.g. `'ADMIN'`, `'UNIVERSITY'`).

### C. Profile REST APIs
- **Student Profiles (`src/controllers/studentController.js` & `src/routes/studentRoute.js`):**
  - `GET /api/students` — List all student profiles (University / Admin only).
  - `GET /api/students/:id` — Fetch specific student profile with skill details.
  - `PUT /api/students/:id` — Update student profile fields and sync skill tags inside a transaction.
  - `DELETE /api/students/:id` — Delete student profile and user record (Admin only).
- **Recruiter Profiles (`src/controllers/recruiterController.js` & `src/routes/recruiterRoute.js`):**
  - `GET /api/recruiters` — List recruiter accounts.
  - `GET /api/recruiters/:id` — Get recruiter details with nested company profile.
  - `PUT /api/recruiters/:id` — Update recruiter details and company profile.
- **System Health:** `GET /api/health` endpoint returning `{ "status": "OK" }`.

---

## 2. Next Steps & Backend Roadmap

1. **Internship Management API:**
   - Implement controller, service, and routes for job listings (`POST`, `GET`, `PUT`, `DELETE /api/internships`).
   - Support filtering/searching listings by title, location, type (Remote/Hybrid/On-Site), and required skill tags.

2. **Application & Skill Match Scoring Engine:**
   - Endpoint for students to apply to internships (`POST /api/applications`).
   - Match scoring algorithm calculating overlap percentage between `StudentSkill` tags and `InternshipSkill` tags.
   - Endpoint for recruiters to update application status (`PENDING` -> `REVIEWING` / `ACCEPTED` / `REJECTED`).

3. **Weekly Logbook & Progress Report API:**
   - Endpoints for students to submit weekly reports (`POST /api/reports`).
   - Endpoints for university supervisors to review reports, add comments, and approve/reject submissions (`PUT /api/reports/:id/status`).

4. **File Storage & Upload Middleware:**
   - Middleware (e.g. Multer with S3 / Cloudinary / local storage) for managing file uploads: CV PDFs, profile pictures, company logos, and weekly logbook files.

5. **Notification Engine:**
   - Endpoints to fetch and mark notifications as read (`GET /api/notifications`, `PATCH /api/notifications/:id/read`).
   - Automated event triggers on application updates and report reviews.

6. **Email Dispatch Integration:**
   - Configure `nodemailer` to dispatch account verification tokens and password reset link emails.

7. **University Dashboard Backend API:**
   - Aggregated analytics endpoints for university admins to track overall student attachment ratios and approve recruiter accounts (`isApproved`).
