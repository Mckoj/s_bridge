# 04 – Authentication Pages

> **Parent Doc:** [README.md](./README.md)
> **Source folder:** [`src/pages/Auth/`](../src/pages/Auth/)
> **Component library:** [`src/components/auth/`](../src/components/auth/)

---

## Auth Flow Overview

```
/signup ──────────────────────────────────── /signup-successful
   │ (role selection → form fill → register)
   │
/login ──────── validates role ──────────── /signin-successful
   │                                               │
   │                                          navigate("/dashboard")
   ▼
/forgot-password
   │
/reset-password-otp
   │
/reset-password
   │
/password-reset-successful
```

---

## Pages

### `LoginPage.tsx`

**Route:** `/login`

**Behaviour:**
1. On the **main portal** shows a 3-button role selector (Student / University / Recruiter) so the user declares their role before submitting credentials.
2. On **sub-portals** the role is pre-selected from `getDefaultRole()` and the selector is hidden.
3. Calls `AuthContext.login(email, password)` → receives `userData` from the backend.
4. **Role validation guard** — compares `userData.role.toLowerCase()` against the locally selected role. If they differ, it calls `logout()` to clear any stored token and shows an inline error.
5. On success: calls `setRole(selectedRole)` (DashboardContext) then navigates to `/signin-successful`.

**Key state:**
| State | Default | Description |
|-------|---------|-------------|
| `selectedRole` | from `getDefaultRole()` | Which role the user declares |
| `email` / `password` | `""` | Controlled inputs |
| `showPassword` | `false` | Toggle password visibility |
| `localError` | `null` | Role-mismatch error message |

**UI features:**
- Eye toggle on password field (`Eye` / `EyeOff`)
- "Forgot?" link to `/forgot-password` (role-accent coloured)
- Spinner `animate-spin` during `isLoading`
- Social Auth buttons (Google, GitHub, Facebook, LinkedIn) — wired to stub handlers
- "Don't have an account? Create Account" link

---

### `SignupPage.tsx`

**Route:** `/signup`

A **multi-step** registration form. The step progression depends on the active portal:

| Portal | Step 1 | Step 2 |
|--------|--------|--------|
| `main` | Role selection cards | Registration form |
| Any sub-portal | *(skipped)* | Registration form (role pre-set) |

**Step 1 — Role Selection (main portal only):**
- Three animated role cards: Student / University / Recruiter
- Each card shows icon, label, and one-line description
- Styled with `roleConfig[role].bg/color/glow`
- "Continue to Registration" button advances to step 2

**Step 2 — Registration Form:**
- **All roles:** Full Name, Email, Password
- **Student only:** Student ID, Index Number, University Name, Academic Major
- **University only:** Institution Name
- **Recruiter only:** Company / Organization name

**Form submission:**
```
handleSignup()
  ├─ STUDENT: splits name → firstName + lastName, adds studentId, indexNumber, programme
  ├─ RECRUITER: adds companyName
  └─ UNIVERSITY: adds universityName + derives domain from email (@domain part)
  
  → AuthContext.register(email, password, role, profileData)
  → navigate("/signup-successful", { state: { email, role } })
```

**Error display:** Red bordered box above form when `error` from `AuthContext` is truthy.

---

### `SignupOTPPage.tsx`

**Route:** `/signup-otp`

Email OTP verification screen shown after registration. Currently a UI scaffold — the backend OTP service (Nodemailer + `EmailVerificationToken`) is not yet wired to this page.

---

### `ForgotPasswordPage.tsx`

**Route:** `/forgot-password`

Accepts the user's email address and initiates a password reset. UI scaffold — navigates conceptually toward `/reset-password-otp`.

---

### `ResetPasswordOTPPage.tsx`

**Route:** `/reset-password-otp`

OTP code entry screen for the password-reset flow. 6-digit OTP input UI.

---

### `ResetPasswordPage.tsx`

**Route:** `/reset-password`

New password + confirm password form. Applies `zod` schema for client-side validation.

---

### `SignupSuccessfulPage.tsx`

**Route:** `/signup-successful`

Success confirmation screen after registration. Reads `location.state.email` and `location.state.role` (passed via `navigate(..., { state })`) to personalise the message.

---

### `SignInSuccessfulPage.tsx`

**Route:** `/signin-successful`

Brief success screen with a redirect countdown or button to proceed to `/dashboard`. Reads `location.state.role` to greet the user by role.

---

### `PasswordResetSuccessfulPage.tsx`

**Route:** `/password-reset-successful`

Confirmation that the password has been updated. Provides a "Back to Login" CTA.

---

## Shared Auth Component Library

All auth pages build their UI from shared primitives in `src/components/auth/AuthComponents.tsx`.

### `AuthCard`
Glassmorphism card container — `bg-slate-900/55 backdrop-blur-xl border border-slate-800/80 rounded-3xl`.

### `AuthInput`
Labelled icon-prefixed input with focus-ring styling. Props: `label`, `icon`, `type`, `value`, `onChange`, `required`, `trailing`.

### `AuthButton`
Full-width submit/action button. Accepts `accentClass` for role-theming (e.g. `bg-blue-600 hover:bg-blue-700`). Shows spinner slot via `children`.

### `AuthDivider`
Horizontal rule with centered label text (default: "or continue with").

### `SocialAuthButtons`
Row of 4 provider buttons: Google, GitHub, Facebook, LinkedIn. Each calls its `onXxx` prop (all currently pointing to `TODO` stubs in `AuthComponents.tsx`).

```tsx
/* Usage */
<SocialAuthButtons
  onGoogle={...}    // TODO: redirect to GET /auth/google
  onGitHub={...}    // TODO: redirect to GET /auth/github
  onFacebook={...}  // TODO
  onLinkedIn={...}  // TODO
/>
```

---

## `AuthLayout.tsx` — Page Wrapper

**File:** [`src/components/auth/AuthLayout.tsx`](../src/components/auth/AuthLayout.tsx)

Provides the dark radial-gradient full-screen background and centres the auth card. Accepts a `maxWidth` prop (`"md"` | `"lg"`) to control card width — `SignupPage` uses `"lg"` on step 1 (role selection) and `"md"` elsewhere.

```tsx
<AuthLayout maxWidth="md">
  <AuthCard>
    {/* form content */}
  </AuthCard>
</AuthLayout>
```

---

## Protected Redirect After Login

After a successful login, `navigate("/signin-successful", { state: { role } })` is called. The success page then either auto-redirects or the user clicks "Go to Dashboard", which hits the `ProtectedRoute`-guarded `/dashboard`.

The `ProtectedRoute` checks `isAuthenticated` (derived from `!!token && !!user` in `AuthContext`). Since the token was stored in `localStorage` during login, this check passes immediately.
