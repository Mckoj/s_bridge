# 08 – Dashboards

> **Parent Doc:** [README.md](./README.md)
> **Source files:**
> - [`src/pages/Student/StudentDashboard.tsx`](../src/pages/Student/StudentDashboard.tsx)
> - [`src/pages/University/UniversityDashboard.tsx`](../src/pages/University/UniversityDashboard.tsx)
> - [`src/pages/Recruiter/CompanyDashboard.tsx`](../src/pages/Recruiter/CompanyDashboard.tsx)
> - [`src/pages/Dashboard/RoleBasedDashboard.tsx`](../src/pages/Dashboard/RoleBasedDashboard.tsx)
> - [`src/pages/Dashboard/DashboardSubPage.tsx`](../src/pages/Dashboard/DashboardSubPage.tsx)

---

## Common Dashboard Patterns

All three dashboards follow the same structural patterns:

### 1. Layout Wrapper
Every dashboard is wrapped in `<DashboardLayout>` which provides the sidebar + topbar shell.

### 2. Theme-aware Helper
Each file defines a local `useTheme()` helper at the top:
```ts
function useTheme() { return useDashboard().theme === "dark"; }
```
This is used throughout to toggle between dark and light CSS class branches.

### 3. Local `Card` Component
Each dashboard defines its own internal `Card` component styled with the role's accent colour:
- Student: `hover:shadow-blue-400/28`
- University: `hover:shadow-violet-400/28`
- Company: `hover:shadow-emerald-400/28`

Cards use `backdrop-blur-xl`, rounded-3xl corners, and a gradient overlay for depth.

### 4. `StatCard` Component
All dashboards have a `StatCard` that shows a large number metric with an icon badge:
```
┌──────────────────────────────┐
│  Metric Label         [ICON] │
│  3                    [  ]   │
│  Subtitle text              │
└──────────────────────────────┘
```

### 5. `EmptyState` Component
When lists have no data, each dashboard shows a centered muted paragraph — ready for when real API data is connected.

### 6. Hero Banner
Each dashboard's first element is a branded hero banner with:
- Role badge (e.g. "Student experience")
- Personalized greeting (`Welcome back, {displayName}!`)
- Subtitle ("Here's what's happening with...")
- Accent-coloured gradient background matching the role colour

---

## Student Dashboard — `StudentDashboard.tsx`

**Route:** `/dashboard` (when role is student)

### Stats Row (4 cards)

| Card | Icon | Accent | Data Source |
|------|------|--------|-------------|
| Applications | `LayoutGrid` | Blue | `totalApplications` |
| Under Review | `Clock` | Orange | `underReview` |
| Accepted | `CheckCircle2` | Green | `accepted` |
| Rejected | `XCircle` | Red | `rejected` |

> All values are currently hard-coded to `0`. Commented with `// TODO: fetch from GET /api/student/applications/stats`.

### Panel Grid (2×2)

| Panel | Component | Data Source |
|-------|-----------|-------------|
| Application Status | `ApplicationStepper` | `applicationSteps` (empty array — TODO) |
| Upcoming Tasks | `TaskRow` list | `tasks` from `DashboardContext` |
| Messages | `MessageRow` list | `studentMessages` from `DashboardContext` |
| Calendar | `MiniCalendar` | Built from `new Date()` — no external data |

### `ApplicationStepper`
A horizontal stepper showing the stages of an internship application:
- Submitted → Under Review → Interview → Offer → Accepted
- Completed steps shown with `bg-blue-500 Check` icon
- Connector line between steps coloured blue when done
- Shows `EmptyState` when `steps.length === 0`

### `MiniCalendar`
A hand-built mini calendar (no external library):
- Shows current month and year
- Today's date highlighted in `bg-blue-500 text-white`
- Mon-Sun grid headers
- Calculated from `new Date()` — no user events yet

### `TaskRow`
A styled row item for each task:
- Blue vertical accent bar on the left
- Task title + due date
- ChevronRight arrow
- Hover state: slight background highlight

### `MessageRow`
A message preview row:
- Coloured initial avatar (cycles through blue, purple, emerald, amber)
- Sender name + truncated message preview + timestamp

---

## University Dashboard — `UniversityDashboard.tsx`

**Route:** `/dashboard` (when role is university)

Accent colour: **Purple / Violet**

### Stats Row (4 cards)

| Card | Icon | Description |
|------|------|-------------|
| Total Students | `Users` | Registered students |
| Active Internships | `Briefcase` | Open placements |
| Pending Approvals | `Clock` | Reports awaiting review |
| Completed | `CheckCircle2` | Finished attachments |

> All values are `0` — marked with `// TODO: fetch from backend`.

### Panel Grid

| Panel | Description |
|-------|-------------|
| Approvals Queue | List of `ApprovalItem` from `DashboardContext.approvals` with Approve / Reject action buttons |
| Activity Feed | Chronological `ActivityItem` list from `DashboardContext.activities` |
| Reports Distribution | Donut chart (`DonutChart`) showing report statuses |
| Calendar | Same `MiniCalendar` as student dashboard |

### `ApprovalRow`
Each pending approval item shows:
- Student avatar + name + submission type + time
- Two buttons: "Approve" (green) and "Reject" (red)
- Calling `handleApproval(id, "Approved" | "Rejected")` from `DashboardContext`

### `ActivityRow`
Each activity shows:
- User + action text + time
- Coloured activity type badge (report / completion / approval)

---

## Company Dashboard — `CompanyDashboard.tsx`

**Route:** `/dashboard` (when role is recruiter)

Accent colour: **Emerald / Teal**

### Stats Row (4 cards)

| Card | Icon | Description |
|------|------|-------------|
| Active Postings | `Briefcase` | Open internship listings |
| Total Applicants | `Users` | All applicants received |
| Hired / Interns | `UserCheck` | Active interns |
| Evaluations | `Award` | Completed evaluations |

> All values are `0` — marked with `// TODO`.

### Panel Grid

| Panel | Description |
|-------|-------------|
| Applicants | `ApplicantItem` list with status chips and action dropdown |
| Active Interns | `InternItem` list with performance badge |
| Application Distribution | `DonutChart` showing applicant stages |
| Monthly Trend | `LineChart` (from dashboard components) |

### `ApplicantRow`
Each applicant shows:
- Name + role applied for + time submitted
- Status chip (New / Under Review / Shortlisted / Rejected / Offered)
- Dropdown or buttons calling `handleApplicant(id, newStatus)` from `DashboardContext`

### `InternRow`
Each active intern shows:
- Name + role + performance badge (Good / Excellent / Average)
- Performance badge colour: Excellent → green, Good → blue, Average → amber

---

## Shared Dashboard UI Components

Located in `src/components/dashboard/`:

| File | Description |
|------|-------------|
| `MetricCard.tsx` | Standalone reusable metric card (alternative to inline StatCard) |
| `DonutChart.tsx` | SVG donut chart with animated `stroke-dashoffset` fill and legend |
| `LineChart.tsx` | SVG line chart for time-series data (monthly trends) |
| `CalendarWidget.tsx` | Richer calendar widget (alternative to the inline `MiniCalendar`) |

### `DonutChart.tsx` — Implementation
- Pure SVG — no external charting library
- `stroke-dasharray` + `stroke-dashoffset` for segment arcs
- Uses `@utility animate-draw-donut` from `index.css` for the fill animation on mount
- Accepts `segments: { label, value, pct, color, dot }[]`, `total`, `centerValue`, `centerLabel`

### `LineChart.tsx` — Implementation
- Pure SVG path calculated from data points
- `@utility stroke-draw` animation for the line drawing effect on mount
- Grid lines and X/Y axis labels

---

## Dashboard Sub-Page Stub — `DashboardSubPage.tsx`

**Route:** `/dashboard/*`

Any sidebar link that navigates to a sub-page (e.g. Applications, My Internship, Reports) hits this component until those pages are implemented.

**Behaviour:**
- Renders inside `DashboardLayout` (sidebar + topbar present)
- Reads the last URL path segment and title-cases it as the page name
- Shows a `Hammer` icon + "under construction" message

```
/dashboard/applications     →  "Applications"
/dashboard/find-opportunities →  "Find Opportunities"
```
