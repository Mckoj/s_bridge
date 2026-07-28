# 10 – Hooks, Services & Constants

> **Parent Doc:** [README.md](./README.md)
> **Source files:**
> - [`src/hooks/useScrollAnimation.ts`](../src/hooks/useScrollAnimation.ts)
> - [`src/hooks/useStudentStats.ts`](../src/hooks/useStudentStats.ts)
> - [`src/hooks/useStudentInterviews.ts`](../src/hooks/useStudentInterviews.ts)
> - [`src/hooks/useSavedJobs.ts`](../src/hooks/useSavedJobs.ts)
> - [`src/services/api.ts`](../src/services/api.ts)
> - [`src/services/studentService.ts`](../src/services/studentService.ts)
> - [`src/services/interviewService.ts`](../src/services/interviewService.ts)
> - [`src/services/savedJobsService.ts`](../src/services/savedJobsService.ts)
> - [`src/utils/apiErrors.ts`](../src/utils/apiErrors.ts)
> - [`src/constants/navigation.ts`](../src/constants/navigation.ts)
> - [`src/constants/colors.ts`](../src/constants/colors.ts)

---

## Custom Hooks (`src/hooks/`)

### `useScrollAnimation<T extends HTMLElement>()`

**File:** [`src/hooks/useScrollAnimation.ts`](../src/hooks/useScrollAnimation.ts)

A generic GSAP + ScrollTrigger hook that makes any element fade in and slide up when it scrolls into view.

**Usage:**
```tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation";

function MySection() {
  const ref = useScrollAnimation<HTMLDivElement>();
  return <div ref={ref}>This fades in on scroll</div>;
}
```

---

### `useStudentStats()` ⭐ New

**File:** [`src/hooks/useStudentStats.ts`](../src/hooks/useStudentStats.ts)

Fetches dashboard statistics from `GET /api/students/stats` and maps backend field names to the frontend model.

```tsx
const { stats, loading, error, refetch } = useStudentStats();
```

**Returns:**

| Field | Type | Description |
|---|---|---|
| `stats` | `StudentStats` | Mapped frontend stats object |
| `loading` | `boolean` | True while request is in flight |
| `error` | `ClassifiedApiError \| null` | Typed error or null |
| `refetch` | `() => void` | Re-trigger the fetch |

**Backend → Frontend field mapping (via `mapStudentStats()`):**

| Backend | Frontend |
|---|---|
| `pendingReviews` | `underReview` |
| `acceptedOffers` | `accepted` |
| `submittedReports` | `submittedReports` |

---

### `useStudentInterviews()` ⭐ New

**File:** [`src/hooks/useStudentInterviews.ts`](../src/hooks/useStudentInterviews.ts)

> ⚠️ `GET /api/students/interviews` is **Phase 3** and not yet deployed. This hook gracefully returns `interviews: []` until the endpoint exists.

```tsx
const { interviews, loading, error, refetch } = useStudentInterviews();
```

---

### `useSavedJobs()` ⭐ New

**File:** [`src/hooks/useSavedJobs.ts`](../src/hooks/useSavedJobs.ts)

> ⚠️ `GET /api/students/saved-jobs` is **Phase 2** and not yet deployed. This hook gracefully returns `savedJobs: []` until the endpoint exists.

```tsx
const { savedJobs, loading, error, removingId, handleRemove, refetch } = useSavedJobs();
```

`handleRemove(id)` calls `DELETE /api/students/saved-jobs/:id` and updates local state on success.

---

## Services (`src/services/`)

### `api.ts` — Axios Instance

**File:** [`src/services/api.ts`](../src/services/api.ts)

A pre-configured Axios instance exported as `api` and used as the single HTTP client throughout the entire frontend.

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});
```

#### Request Interceptor — Auto-attach JWT

Every outgoing request automatically includes the stored JWT in the `Authorization` header.

#### Response Interceptor — Global 401 Handler

If **any** API call returns a `401 Unauthorized`, the interceptor clears `token` and `user` from `localStorage` and hard-redirects to `/login`.

---

### `studentService.ts` ⭐ Updated

**File:** [`src/services/studentService.ts`](../src/services/studentService.ts)

Core student API layer. All backend field-name transformations live here.

**Key exports:**

| Export | Purpose |
|---|---|
| `BackendStudentStats` | Exact DTO matching backend `/api/students/stats` response |
| `StudentStats` | Normalized frontend model |
| `isBackendStudentStats(data)` | Runtime type guard — validates response before mapping |
| `mapStudentStats(raw)` | Transforms backend DTO → frontend model |
| `validateCVFile(file)` | Returns error string if file is not PDF or exceeds 5 MB |
| `validateAvatarFile(file)` | Returns error string if image MIME type or size is invalid |
| `getStudentStats()` | Fetches stats, validates, maps, and returns `StudentStats` |
| `uploadCV(file)` | POST `/api/students/upload-cv` — PDF only, enforced by `validateCVFile` |

**Runtime validation flow:**

```
GET /api/students/stats
↓
isBackendStudentStats(raw)   ← validates shape at runtime
↓ (passes)
mapStudentStats(raw)          ← transforms field names
↓
StudentStats                  ← consumed by useStudentStats() hook
↓
Dashboard StatCards
```

If `isBackendStudentStats()` fails (backend payload changed unexpectedly), the function logs a warning and returns a safe zero-state instead of crashing.

---

### `interviewService.ts` ⭐ New

**File:** [`src/services/interviewService.ts`](../src/services/interviewService.ts)

Isolated service for `GET /api/students/interviews` (Phase 3, not yet deployed).

**Error handling:**

| HTTP Status | Behaviour |
|---|---|
| `200` | Returns `InterviewItem[]` |
| `404 / 501` | Returns `[]` — endpoint not yet deployed |
| `403` | Re-throws `FORBIDDEN` — UI shows "Access Denied" |
| `500+` | Re-throws `SERVER_ERROR` — UI shows error state + retry |
| No response | Re-throws `NETWORK_ERROR` — UI shows "Connection failed" + retry |

---

### `savedJobsService.ts` ⭐ New

**File:** [`src/services/savedJobsService.ts`](../src/services/savedJobsService.ts)

Isolated service for `GET /api/students/saved-jobs` (Phase 2, not yet deployed).

Same error handling strategy as `interviewService.ts`.

---

## Utilities (`src/utils/`)

### `apiErrors.ts` ⭐ New

**File:** [`src/utils/apiErrors.ts`](../src/utils/apiErrors.ts)

Centralized HTTP error classification utility. Converts raw Axios errors into structured `ClassifiedApiError` objects with a typed `code` field.

**Error codes:**

| Code | HTTP | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Session expired — sign in again |
| `FORBIDDEN` | 403 | No permission to access resource |
| `NOT_FOUND` | 404 | Feature / resource not yet available |
| `NOT_IMPLEMENTED` | 501 | Server endpoint not implemented |
| `SERVER_ERROR` | 5xx | Backend failure |
| `NETWORK_ERROR` | — | No response received |
| `UNKNOWN` | other | Unexpected status code |

The `isEndpointUnavailable` flag is `true` for `NOT_FOUND` and `NOT_IMPLEMENTED` — services use this to return empty data instead of throwing.

**Usage in services:**
```ts
} catch (err) {
  const classified = classifyApiError(err);
  if (classified.isEndpointUnavailable) return []; // not deployed yet
  throw classified;                                 // real error — let UI handle
}
```

**Usage in ErrorState component:**
```tsx
<ErrorState error={classified} onRetry={refetch} />
```

---

## Constants (`src/constants/`)

### `navigation.ts`

Defines the landing page anchor navigation links used by `Navbar.tsx`.

### `colors.ts`

Brand colour constants for charts and SVG elements.

---

## Planned but Empty Directories

| Directory | Intended Purpose |
|---|---|
| `src/types/` | Shared TypeScript interface / type definitions (API response shapes, shared models) |
| `src/utils/` | Pure utility functions — `apiErrors.ts` now lives here |
| `src/config/` | App-wide configuration objects (feature flags, environment config) |
| `src/lib/` | Third-party library wrappers or shared initialisation |
| `src/shared/` | Shared domain-specific logic (role permissions, route matchers) |

> **Future refactor:** As the codebase grows, consider grouping services by feature domain:
> ```
> services/
>   student/
>     studentService.ts
>     interviewService.ts
>     savedJobsService.ts
>   university/
>     universityService.ts
>   recruiter/
>     recruiterService.ts
> ```
> This is not required at current scale but will help as the recruiter portal expands.
