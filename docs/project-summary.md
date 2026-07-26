# S-Bridge — Master Project Summary & Integration Overview

S-Bridge is a multi-portal web platform connecting **Students**, **Recruiters (Employers)**, and **University Placement Officers** to streamline internship placement, skill-based AI matching, and weekly logbook reporting.

---

## 1. Documentation Index

The root `docs/` directory contains detailed status and roadmap reports for each tier of the project:

- 📘 [Backend Status & Roadmap](file:///c:/Users/HP/Desktop/Mini%20Project/Main-Project/s_bridge/docs/backend-status-and-roadmap.md) — PostgreSQL/Prisma v7 schema, JWT authentication, transactional account registration, role-based authorization, and profile REST APIs.
- 🎨 [Frontend Status & Roadmap](file:///c:/Users/HP/Desktop/Mini%20Project/Main-Project/s_bridge/docs/frontend-status-and-roadmap.md) — Multi-portal sub-domain routing, auth screen flows, Axios interceptors, Dark/Light mode theme system, and dashboard layouts.

---

## 2. Executive Status Matrix

| Layer / Feature | Status | Key Highlights |
| :--- | :---: | :--- |
| **Database Schema** | **Completed** | Full Prisma v7 schema with 13 models (`User`, `Student`, `Recruiter`, `University`, `Internship`, `Application`, `Report`, etc.) deployed on Neon PostgreSQL. |
| **Authentication Flow** | **Completed** | Full-stack JWT auth with bcrypt password hashing, transactional `$transaction` multi-role signup, and local storage token management. |
| **Student Registration Fields** | **Completed** | Added unique `studentId` and `indexNumber` fields across database schema, backend services, auth context, and signup form. |
| **Profile REST APIs** | **Completed** | `GET`/`PUT`/`DELETE` endpoints for Student and Recruiter profiles secured by JWT `authenticate` and `authorizeRoles` middleware. |
| **Multi-Portal UI Routing** | **Completed** | React Router setup with sub-domain switching (`student.`, `university.`, `recruiter.`) and client-side `ProtectedRoute` guards. |
| **Dashboard UI Framework** | **Completed** | Dark/Light mode theme system with glassmorphism styling for Student, Recruiter, and University dashboards. |
| **Internships & Matching API** | *In Progress* | Backend schema ready; controller/routes and skill-matching scoring algorithm next to build. |
| **Dashboard Sub-Pages** | *In Progress* | Placeholders (`DashboardSubPage.tsx`) active; full sub-page forms (Job Search, Post Job, Report Upload, Monitoring Roster) next to build. |
| **Logbook & Progress Reports** | *Pending* | Backend model ready; report upload endpoints and supervisor review interfaces next to build. |
| **File Storage Integration** | *Pending* | Integration of file upload middleware (S3 / Cloudinary) for CVs, logos, and logbook PDFs. |

---

## 3. How to Run & Verify the Project

### A. Backend Server Setup
```bash
cd backend
npm install
# Set environment variables in backend/.env (DATABASE_URL, JWT_SECRET, PORT=5000)
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
