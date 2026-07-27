# SBridge Frontend — 08. Dashboards & Portal Pages Specification

> **Scope:** Student Portal & University Portal pages implementation details.
> **AI Representation Standard:** All planned AI features across both portals are explicitly tagged with prominent **`AI Feature • Coming Soon`** badges and preview indicators.

---

## 1. Student Portal Pages (`#3B82F6` Electric Blue Accent)

1. **Dashboard (`StudentDashboard.tsx`):**
   - Hero welcome greeting & quick profile actions.
   - Next Action card (application status overview).
   - Metric stat cards row (Applications, Under Review, Accepted, Interviews Scheduled, Rejected).
   - **AI Recommended Opportunities:** Marked with `AI Feature • Coming Soon` badge.
   - Active Applications Tracker timeline.
   - **AI Match Score Breakdown:** Marked with `AI Feature • Coming Soon` badge.
   - **AI Career Assistant Teaser:** Marked with `AI Feature • Coming Soon` badge.

2. **Find Opportunities (`ExploreOpportunitiesPage.tsx`):**
   - Marketplace search with filters (Company, Location, Remote/Hybrid, Industry, Salary, Duration, Skills).
   - Opportunity cards displaying `AI Match • Preview` scores and direct application modals.

3. **My Applications (`StudentApplicationsPage.tsx`):** Application tracker displaying status badges across 7 stages with expandable step timeline.

4. **Interviews (`StudentInterviewsPage.tsx`):**
   - Upcoming technical/HR interview list, meeting links, notes, and attendance history.
   - **AI Interview Simulator:** Marked with `AI Feature • Coming Soon` badge and disabled practice mode button.

5. **Placement History (`StudentPlacementHistoryPage.tsx`):** Archived industrial attachment records, supervisor evaluation scores (4.9/5.0), and PDF completion certificates.

6. **AI Career Assistant (`StudentAICareerAssistantPage.tsx`):**
   - Header banner prominently tagged with `AI Feature • Coming Soon`.
   - Career Match Score (88%), XGBoost projected placement probability (92.4%), ATS strength score (85/100), skill gap analysis, and personalized learning roadmap.

7. **Saved Jobs (`StudentSavedJobsPage.tsx`):** Bookmarked opportunities categorized into Saved, Recently Viewed, Recommended, and Expired.

8. **Resume Analyzer (`StudentResumeAnalyzerPage.tsx`):**
   - Header banner prominently tagged with `AI Feature • Coming Soon`.
   - Drag-and-drop CV upload, ATS compatibility score (88%), missing keyword detection, and downloadable PDF reports.

9. **Profile (`StudentProfilePage.tsx`):** Personal information, education background, skills, portfolio links, and document upload.

10. **Settings (`StudentSettingsPage.tsx`):** Dark/light mode theme toggles, password reset, and notification preferences.

---

## 2. University Portal Pages (`#8B5CF6` Royal Violet Accent)

1. **Dashboard (`UniversityDashboard.tsx`):**
   - Macro placement stats (Total Enrolled, Placed Count, Placement Rate %, Pending Approvals).
   - Department Leaderboard & Ghana regional distribution cards.
   - Employer Verification Queue & At-Risk Student Alerts.
   - **AI Placement Insights:** Marked with `AI Feature • Coming Soon` badge.

2. **Students (`UniversityStudentsPage.tsx`):** Enrolled student management roster with GPA metrics, programme filters, placement status tags (`Placed`, `Pending`, `Unassigned`), and profile detail drawer with `AI Placement Risk (Coming Soon)` indicator.

3. **Departments (`UniversityDepartmentsPage.tsx`):** Department placement rates, avg CGPA, top hiring employers, and **AI Placement Forecast** marked with `AI Feature • Coming Soon` badge.

4. **Colleges (`UniversityCollegesPage.tsx`):** College performance rankings (#1 College of Engineering), aggregated placement rates, and accreditation reports.

5. **Placement Overview (`UniversityPlacementOverviewPage.tsx`):** 5-stage Master Placement Funnel (Eligible $\rightarrow$ Applied $\rightarrow$ Interviewed $\rightarrow$ Accepted $\rightarrow$ Verified Placed).

6. **Reports & Analytics (`UniversityReportsPage.tsx`):**
   - Executive Institutional Analytics Dashboard featuring 6 KPI cards, Placement Trend (Jan - Dec), Department bar charts, Top Recruiting Employers table, Student Risk Metrics, Generated Reports table, and Quick Actions.
   - **AI Placement Forecast KPI Card:** Marked with `AI Feature • Coming Soon` badge.
   - **AI Predictive Intelligence & SHAP Explainability Panel:** Tagged with `AI Feature • Coming Soon` badges.

7. **Announcements (`UniversityAnnouncementsPage.tsx`):** Broadcast publishing hub targeting all students, specific departments, colleges, or partner employers.

8. **Company Directory (`UniversityCompanyDirectoryPage.tsx`):** Directory of verified employer partners and pending recruiter accounts.

9. **Approvals (`UniversityApprovalsPage.tsx`):** Recruiter verification queue with `approveRecruiter()` integration.

10. **Settings (`UniversitySettingsPage.tsx`):** Institutional settings, domain integration (`knust.edu.gh`), placement period rules, and email templates.
