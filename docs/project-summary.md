# S-Bridge — Master Project Summary & Integration Overview

S-Bridge is a multi-portal web platform connecting **Students**, **Recruiters (Employers)**, and **University Placement Officers** to streamline internship placement, skill-based AI matching, and weekly logbook reporting.

---

## 1. Documentation Index

The root `docs/` directory contains detailed status and roadmap reports for each tier of the project:

- 📘 [Backend Status & Roadmap](file:///c:/Users/HP/Desktop/Mini%20Project/Main-Project/s_bridge/docs/backend-status-and-roadmap.md) — PostgreSQL/Prisma v7 schema, JWT authentication, transactional account registration, file uploads (Cloudinary), match scoring engine, and REST APIs.
- 🎨 [Frontend Status & Roadmap](file:///c:/Users/HP/Desktop/Mini%20Project/Main-Project/s_bridge/docs/frontend-status-and-roadmap.md) — Multi-portal routing, Auth flows, Explore page with match scores, Applications tracker, Logbook management, and Profile CV/Avatar uploads.

---

## 2. Executive Status Matrix

| Layer / Feature | Status | Key Highlights |
| :--- | :---: | :--- |
| **Database Schema** | **Completed** | Full Prisma v7 schema with 13 models (`User`, `Student`, `Recruiter`, `University`, `Internship`, `Application`, `Report`, etc.) deployed on Neon PostgreSQL. |
| **Authentication Flow** | **Completed** | Full-stack JWT auth with bcrypt password hashing, transactional `$transaction` multi-role signup, and pre-joined profile name serialization. |
| **Password Reset & Change** | **Completed** | OTP generation/validation (`forgot-password`, `reset-password`) and authenticated password change (`PUT /api/auth/change-password`). |
| **Profile REST APIs** | **Completed** | `GET`/`PUT`/`DELETE` endpoints for Student and Recruiter profiles secured by JWT `authenticate` and `authorizeRoles` middleware. |
| **File Storage Integration** | **Completed** | Multer memory storage + Cloudinary streaming pipeline for Student CVs (`upload-cv`), Avatars (`upload-avatar`), and Company Logos (`upload-logo`). |
| **Internships & Matching API** | **Completed** | `GET /api/internships` dynamically calculates a `matchScore` percentage (0–100%) for students based on skill tag overlap. |
| **Applications Engine** | **Completed** | `POST /api/applications` submission with cover letter and status management (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`). |
| **Explore Opportunities Page** | **Completed** | Dedicated `/dashboard/explore` view featuring color-coded match badges, match score sorting, type filtering, and quick application modal. |
| **Logbook & Progress Reports** | **Completed** | `/api/reports` API for submitting weekly reports (with active placement validation) and supervisor status updates. |
| **University Analytics API** | **Completed** | `/api/universities/stats` endpoint returning student totals, active placements, application counts, and recruiter approval status. |
| **Recruiter & University UI Wiring** | *In Progress* | Recruiter job posting form and University student roster views next to finalize. |

---

## 3. How to Run & Verify the Project

### A. Backend Server Setup
```bash
cd backend
npm install
# Set environment variables in backend/.env (DATABASE_URL, JWT_SECRET, PORT=5000, CLOUDINARY_*)
npx prisma generate
npx prisma db seed
npm run dev
```
- Health Check: `GET http://localhost:5000/api/health` $\rightarrow$ `{ "status": "OK" }`

### B. Frontend Setup
```bash
cd Frontend
npm install
# Set environment variables in Frontend/.env (VITE_API_URL=http://localhost:5000)
npm run dev
```
- Application access: `http://localhost:5173/`
