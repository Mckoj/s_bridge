# S-Bridge — Student Registration ID and Index Number Fields

This document records the updates made to include `studentId` and `indexNumber` fields during student registration.

---

## 1. Database Schema Update

We added `studentId` and `indexNumber` as optional unique string fields to the `User` model in `schema.prisma`. 

```prisma
model User {
  id                      String                    @id @default(uuid())
  email                   String                    @unique
  passwordHash            String
  role                    Role                      @default(STUDENT)
  isVerified              Boolean                   @default(false)
  studentId               String?                   @unique
  indexNumber             String?                   @unique
  createdAt               DateTime                  @default(now())
  updatedAt               DateTime                  @updatedAt
  emailVerificationTokens EmailVerificationToken[]
  passwordResetTokens     PasswordResetToken[]

  @@index([email])
}
```

The database schema was successfully pushed to Neon PostgreSQL with:
```bash
npx prisma db push --accept-data-loss
npx prisma generate
```

---

## 2. Backend Logic Updates

### A. Registration Service (`src/services/authServices.js`)
- Updated the `register` function to accept `studentId` and `indexNumber` parameters.
- Added validation checks before saving to prevent duplicate database constraints errors:
  - Verifies that the requested `studentId` is not already in use.
  - Verifies that the requested `indexNumber` is not already in use.
- Saves the values during `User` creation when the registration role is `STUDENT`.

### B. Route Controller (`src/controllers/authController.js`)
- Extracted `studentId` and `indexNumber` from `req.body`.
- Passed the extracted fields to the registration service.

---

## 3. Frontend Integration

### A. Authentication Context (`src/context/AuthContext.tsx`)
- Updated the `register` function signature to accept the optional strings `studentId` and `indexNumber`.
- Passed these parameters inside the API request payload to `POST /api/auth/register`.

### B. Signup Component (`src/pages/Auth/SignupPage.tsx`)
- Added `studentId` and `indexNumber` to the form state management.
- Conditionally renders input fields for both fields only when registering with the **Student** role.
- Forwards these inputs to `register()` during the form submission handler.
