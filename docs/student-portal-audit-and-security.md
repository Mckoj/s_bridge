# S-Bridge — Student Portal Technical Audit, Security Architecture & Implementation Roadmap

This document provides a detailed technical audit of the Student Portal, highlighting security vulnerabilities (IDOR, missing authorization checks, file upload risks), data representation inconsistencies, database schema gaps, and a step-by-step roadmap to achieve complete production readiness.

---

## 1. Technical Audit & Security Findings

### 🛡️ A. Security & Access Control Vulnerabilities

1. **Unrestricted Profile Read Access (IDOR Vulnerability):**
   - **Location:** `studentController.js` (`getStudentById`)
   - **Finding:** `GET /api/students/:id` returns full student records (phone, GPA, programme, CV URL, applications, and logbook reports) without verifying if `req.user` is the student themselves, an assigned recruiter, or their university coordinator.
   - **Risk:** Any logged-in student can iterate through student IDs to extract sensitive PII and academic details of other students.

2. **Application Detail Exposure:**
   - **Location:** `applicationController.js` (`getApplicationById`)
   - **Finding:** `GET /api/applications/:id` returns application details without validating that `req.user.student.id === application.studentId`.
   - **Risk:** Students can inspect competitor cover letters or match scores by probing application IDs.

3. **Missing File MIME-Type & Extension Filtering:**
   - **Location:** `middleware/upload.js`
   - **Finding:** Multer configuration lacks a `fileFilter` validation function to verify file signatures or MIME types before streaming to Cloudinary.
   - **Risk:** Users could upload invalid or malicious file formats under the guise of CVs or avatars.

---

### ⚡ B. Data Representation & Interface Inconsistencies

1. **Dashboard Stats Field Mismatch:**
   - **Frontend expects:** `{ totalApplications, underReview, accepted, rejected, interviews }`
   - **Backend provides:** `{ totalApplications, pendingReviews, acceptedOffers, submittedReports }`
   - **Impact:** Frontend stats fallback renders zeros if service key transformation is not enforced.

2. **Hardcoded Fallbacks & Static Mock Data:**
   - **`StudentInterviewsPage.tsx`:** Renders static mock interviews (`MTN Ghana`, `GCB Bank PLC`) rather than querying real backend interview schedules.
   - **`StudentSavedJobsPage.tsx`:** Bookmarks exist only in React component state and are lost on page refresh.
   - **`StudentInternshipPage.tsx`:** `universitySupervisor` details default to hardcoded dummy strings (`"University Placement Coordinator"`, `"coordinator@university.edu"`) instead of pulling real institutional coordinator data.

3. **Placeholder Glassmorphism Screens:**
   - Pages such as `StudentAICareerAssistantPage.tsx` and `StudentResumeAnalyzerPage.tsx` render "COMING SOON" overlay stubs without active AI backend processing endpoints.

---

## 2. Universal Security & Authorization Rules for Student Data

```
                          ┌──────────────────────────────────────────────┐
                          │         Authenticated JWT Student            │
                          └──────────────────────┬───────────────────────┘
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │   Ownership & Authorization Guard            │
                          │   (req.user.student.id === target.studentId) │
                          └──────────────────────┬───────────────────────┘
                                                 │
                                 ┌───────────────┴───────────────┐
                                 ▼                               ▼
              ┌────────────────────────────────────┐   ┌────────────────────────────────────┐
              │      Student Own Records           │   │      Third-Party Access Check      │
              │  (Full Read / Update / CV Upload)  │   │   (Only Verified Recruiter/Univ)   │
              └────────────────────────────────────┘   └────────────────────────────────────┘
```

1. **Strict Ownership Enforcement:**
   - Students can only view, update, or upload files for their own profile.
   - Recruiters can only view student profiles if the student has submitted an active application to their job posting.
   - University Liaisons can only view profiles belonging to students enrolled in their institution.

2. **Strict Upload Pipeline:**
   - Multer middleware enforces file type limits (`application/pdf` for CVs; `image/png`, `image/jpeg`, `image/webp` for avatars) with a 5MB size limit.

---

## 3. Implementation Roadmap

### Phase 1: Security & IDOR Authorization Hardening
- Update `studentController.js` (`getStudentById`) to enforce access rules:
  - Allow if `req.user.role === 'ADMIN'`.
  - Allow if `req.user.student?.id === student.id`.
  - Allow if `req.user.role === 'UNIVERSITY'` AND student belongs to university.
  - Allow if `req.user.role === 'RECRUITER'` AND student applied to recruiter's internship.
- Add Multer `fileFilter` validation in `middleware/upload.js`.

### Phase 2: Database Schema Additions
Add `SavedJob` and `Interview` models to `prisma/schema.prisma`:
```prisma
model SavedJob {
  id           String     @id @default(uuid())
  studentId    String
  student      Student    @relation(fields: [studentId], references: [id], onDelete: Cascade)
  internshipId String
  internship   Internship @relation(fields: [internshipId], references: [id], onDelete: Cascade)
  createdAt    DateTime   @default(now())

  @@unique([studentId, internshipId])
}

model Interview {
  id             String      @id @default(uuid())
  applicationId  String
  application    Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  scheduledAt    DateTime
  duration       String
  platform       String      // e.g. Google Meet, MS Teams
  meetingLink    String
  interviewer    String
  notes          String?     @db.Text
  createdAt      DateTime    @default(now())
}
```

### Phase 3: Real Backend Wiring for Student Sub-Pages
- **Interviews API:** Implement `GET /api/students/interviews` querying scheduled interviews.
- **Saved Jobs API:** Implement `POST`, `GET`, `DELETE /api/students/saved-jobs`.
- **Active Placement Details:** Replace dummy coordinator email in `getActiveInternship` with actual university domain contact data.

### Phase 4: Frontend UI Cleanup & Key Synchronization
- Align `studentService.ts` stats payload directly with backend key names (`pendingReviews`, `acceptedOffers`, `submittedReports`).
