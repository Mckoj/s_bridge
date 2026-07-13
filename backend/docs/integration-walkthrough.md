# S-Bridge — Integration & Architecture Walkthrough

This document records the architectural updates, bug fixes, and integration steps implemented during the connection of the S-Bridge Frontend and Backend.

---

## 1. Backend Architecture & Database Layer (Prisma v7)

### TypeScript Environment Fix
- **Problem:** Compiling/type-checking `prisma.config.ts` resulted in a `Cannot find name 'process'` compilation error.
- **Fix:** Installed `@types/node` under devDependencies to supply the TypeScript compiler with type definitions for Node.js globals (like `process.env`).

### Prisma v7 Driver Adapter Upgrade
- **Problem:** In Prisma v7, the old automatic query engine was deprecated. Calling `new PrismaClient()` without arguments threw a `PrismaClientInitializationError` demanding explicit config or an adapter.
- **Fix:** 
  1. Installed `@prisma/adapter-pg` and `pg`.
  2. Configured a `pg.Pool` connection pool using the `DATABASE_URL` environment variable.
  3. Passed a new `PrismaPg` driver adapter instance directly to the `PrismaClient` constructor in both the active configuration and seed files.
  4. Regenerated the Prisma Client using `npx prisma generate`.

**Database Seeder Configuration (`prisma/seed.js`):**
Reverted to destructured default imports (`const { PrismaClient } = pkg`) to properly support Node.js's ES module interop wrapper with CommonJS module structures after client generation.

**Prisma Instance Entry Point (`src/config/db.js`):**
```javascript
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

module.exports = prisma;
```

---

## 2. Backend Authentication Fixes

- **User Model Schema Sync:** Aligned database schema mappings in the registration service. The signup service was updated to write to `passwordHash` (matching the `User` model in `schema.prisma`) instead of `password`.
- **Express Login Controller Integration:** Implemented the `login` function inside the controller (`src/controllers/authController.js`) using `bcryptjs` and `jsonwebtoken`. This resolved an Express routing error (`argument handler must be a function`) caused by mapping undefined routes.
- **CORS & Environment Setup:** Added `JWT_SECRET` and `JWT_EXPIRES_IN` variables to the `.env` file to support token signing.

---

## 3. Frontend ↔ Backend Integration

We converted the frontend from a purely mocked prototype to a functional full-stack application communicating with the Express API.

### A. Environment & Client Configuration (`.env` & `src/services/api.ts`)
- Configured Axios to dynamically point to the backend API base url.
- Added a request interceptor to automatically attach `Authorization: Bearer <token>` from local storage if available.
- Added a response interceptor to handle `401 Unauthorized` responses globally, clearing credentials and redirecting to `/login`.

### B. Authentication State Management (`src/context/AuthContext.tsx`)
- Created a separate `AuthContext` supplying `user`, `token`, `login()`, `register()`, and `logout()` utilities.
- Persists authentication state in `localStorage` across page refreshes.
- Automatically normalizes frontend role names (e.g. `student` -> `STUDENT`) before performing backend API calls.

### C. Route Guarding (`src/components/auth/ProtectedRoute.tsx`)
- Added a client-side route guard checking user authentication.
- Guarded all dashboard paths (`/student/dashboard`, `/university/dashboard`, and `/company/dashboard`) in `AppRouter.tsx`.

### D. Form Submissions & UX
- Wired `LoginPage.tsx` and `SignupPage.tsx` to use the authentication context.
- Implemented error banners displaying API error responses (e.g., "User already exists", "Invalid email or password").
- Skipped local OTP verification steps for a faster development and prototype testing flow, going straight to `/signup-successful` after registration.

---

## 4. How to Verify / Test

1. **Verify Backend Connection:**
   Start the backend:
   ```bash
   npm run dev
   ```
   Check health check: `GET http://localhost:5000/api/health` should respond with `{ "status": "OK" }`.

2. **Verify Frontend Application:**
   Start the frontend:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/`. Attempt to navigate to a `/dashboard` route — you should be immediately redirected to `/login`.

3. **Verify Auth Flow:**
   - Register a new account at `/signup`.
   - Log in with the registered credentials at `/login`.
   - You should be logged in, see a success page, and then access your specific dashboard.
