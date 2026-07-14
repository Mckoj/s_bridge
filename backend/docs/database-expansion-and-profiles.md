# S-Bridge — Database Schema Expansion & Profile APIs Documentation

This document records the updates made to expand S-Bridge database models, enforce transactional user and profile generation, and implement Student/Recruiter REST APIs.

---

## 1. Complete Database Models & Relations

The PostgreSQL schema has been updated to support the full data structure of S-Bridge:

- **`User`**: Base credentials table (holds email, passwordHash, role, verification flags). Relates to role profiles (`Student`, `Recruiter`, `University`) and system notifications.
- **`Student`**: Holds details about student attachments (names, index/student IDs, GPA, programme, experience summaries). Relates to student applications, logbook reports, and skills.
- **`Recruiter`**: Represents employer accounts. Relates to posting internship vacancies.
- **`University`**: Represents university placements administrators monitoring students.
- **`CompanyProfile`**: Stores company descriptive details, address, size, and logo URL.
- **`Internship`**: Holds active job details (title, type, location, salary, duration, and target academic programmes).
- **`Skill`, `StudentSkill`, `InternshipSkill`**: Represents join-tables for tags/skills mapped to students and internships to feed the matching engine.
- **`Application`**: Represents student internship applications with calculated match scores.
- **`Report`**: Handles weekly progress logbook submissions from students to universities.
- **`Notification`**: Standard user notification triggers.

---

## 2. Transactional Account & Profile Creation

To guarantee referential integrity and avoid orphaned profile tables:
1. Registration now receives extra fields (`firstName`, `lastName`, `studentId`, `indexNumber`, `companyName`, `universityName`, `domain`) inside a structured `profileData` payload.
2. In [authServices.js](file:///c:/Users/HP/Desktop/Mini%20Project/Main-Project/s_bridge/backend/src/services/authServices.js), the user account creation is wrapped in a Prisma `$transaction`.
3. If the user account is created successfully, the matching role profile (e.g. `Student`, `Recruiter`, `University`) is generated atomically. If any part of the process fails, the entire transaction is rolled back.

---

## 3. Secured Profile Endpoints

All secure profile endpoints are wrapped in JWT authorization checking middlewares.

### Authentication Middleware (`src/middleware/auth.js`)
- **`authenticate`**: Parses and validates the JWT token, then includes the user object (along with pre-loaded profiles) inside the Express `req.user` context.
- **`authorizeRoles(...roles)`**: Restricts routing execution to specific roles (e.g., `'ADMIN'`, `'UNIVERSITY'`).

### APIs Implemented

#### Student Profiles
- `GET /api/students` — Fetch all students (accessible by University Administrators and System Administrators).
- `GET /api/students/:id` — Get a specific student profile.
- `PUT /api/students/:id` — Update student profile data. Dynamically deletes, upserts, and syncs tag associations inside a transactional block.
- `DELETE /api/students/:id` — Delete student account (System Admins only).

#### Recruiter Profiles
- `GET /api/recruiters` — Fetch all recruiters list (System Admins & University only).
- `GET /api/recruiters/:id` — Fetch recruiter details.
- `PUT /api/recruiters/:id` — Update recruiter profile and nested company details.

---

## 4. Verification Methods

### A. Populating Mock Data
To initialize the schema with a complete testing environment, execute:
```bash
npx prisma db seed
```
This drops any existing records and populates standard testing users (e.g., student@sbridge.com, recruiter@sbridge.com, uni@sbridge.com), skills, company descriptions, and internships.

### B. Health Status Query
To ensure routing stability, make a request to:
`GET http://localhost:5000/api/health`
Expected payload: `{ "status": "OK" }`.
