import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import SignupPage from "../pages/Auth/SignupPage";
import SignupOTPPage from "../pages/Auth/SignupOTPPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordOTPPage from "../pages/Auth/ResetPasswordOTPPage";
import SignupSuccessfulPage from "../pages/Auth/SignupSuccessfulPage";
import SignInSuccessfulPage from "../pages/Auth/SignInSuccessfulPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import PasswordResetSuccessfulPage from "../pages/Auth/PasswordResetSuccessfulPage";

import StudentDashboard from "../pages/Student/StudentDashboard";
import StudentApplicationsPage from "../pages/Student/StudentApplicationsPage";
import StudentInternshipPage from "../pages/Student/StudentInternshipPage";
import StudentReportsPage from "../pages/Student/StudentReportsPage";
import StudentMessagesPage from "../pages/Student/StudentMessagesPage";
import StudentNotificationsPage from "../pages/Student/StudentNotificationsPage";
import StudentProfilePage from "../pages/Student/StudentProfilePage";
import StudentSettingsPage from "../pages/Student/StudentSettingsPage";
import ExploreOpportunitiesPage from "../pages/Student/ExploreOpportunitiesPage";
import StudentInterviewsPage from "../pages/Student/StudentInterviewsPage";
import StudentPlacementHistoryPage from "../pages/Student/StudentPlacementHistoryPage";
import StudentAICareerAssistantPage from "../pages/Student/StudentAICareerAssistantPage";
import StudentSavedJobsPage from "../pages/Student/StudentSavedJobsPage";
import StudentResumeAnalyzerPage from "../pages/Student/StudentResumeAnalyzerPage";

import UniversityDashboard from "../pages/University/UniversityDashboard";
import UniversityStudentsPage from "../pages/University/UniversityStudentsPage";
import UniversityInternshipsPage from "../pages/University/UniversityInternshipsPage";
import UniversityApprovalsPage from "../pages/University/UniversityApprovalsPage";
import UniversityReportsPage from "../pages/University/UniversityReportsPage";
import UniversityMessagesPage from "../pages/University/UniversityMessagesPage";
import UniversityNotificationsPage from "../pages/University/UniversityNotificationsPage";
import UniversitySettingsPage from "../pages/University/UniversitySettingsPage";
import UniversityDepartmentsPage from "../pages/University/UniversityDepartmentsPage";
import UniversityCollegesPage from "../pages/University/UniversityCollegesPage";
import UniversityPlacementOverviewPage from "../pages/University/UniversityPlacementOverviewPage";
import UniversityAnnouncementsPage from "../pages/University/UniversityAnnouncementsPage";
import UniversityCompanyDirectoryPage from "../pages/University/UniversityCompanyDirectoryPage";

import RoleBasedReportsPage from "../pages/Dashboard/RoleBasedReportsPage";
import RoleBasedMessagesPage from "../pages/Dashboard/RoleBasedMessagesPage";
import RoleBasedNotificationsPage from "../pages/Dashboard/RoleBasedNotificationsPage";
import RoleBasedSettingsPage from "../pages/Dashboard/RoleBasedSettingsPage";

import CompanyDashboard from "../pages/Recruiter/CompanyDashboard";
import RecruiterPostingsPage from "../pages/Recruiter/RecruiterPostingsPage";
import RecruiterApplicationsPage from "../pages/Recruiter/RecruiterApplicationsPage";
import RecruiterCandidatesPage from "../pages/Recruiter/RecruiterCandidatesPage";
import RecruiterInterviewsPage from "../pages/Recruiter/RecruiterInterviewsPage";
import RecruiterInternsPage from "../pages/Recruiter/RecruiterInternsPage";
import RecruiterAnalyticsPage from "../pages/Recruiter/RecruiterAnalyticsPage";
import RecruiterMessagesPage from "../pages/Recruiter/RecruiterMessagesPage";
import RecruiterSettingsPage from "../pages/Recruiter/RecruiterSettingsPage";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminStudentsPage from "../pages/Admin/AdminStudentsPage";
import AdminRecruitersPage from "../pages/Admin/AdminRecruitersPage";
import AdminInternshipsPage from "../pages/Admin/AdminInternshipsPage";
import AdminApplicationsPage from "../pages/Admin/AdminApplicationsPage";
import AdminReportsPage from "../pages/Admin/AdminReportsPage";
import AdminAuditLogsPage from "../pages/Admin/AdminAuditLogsPage";
import AdminSettingsPage from "../pages/Admin/AdminSettingsPage";

import PortalLanding from "../pages/Landing/PortalLanding";
import RoleBasedDashboard from "../pages/Dashboard/RoleBasedDashboard";
import DashboardSubPage from "../pages/Dashboard/DashboardSubPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { DashboardProvider } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";

export const getActivePortal = (): "student" | "university" | "recruiter" | "main" => {
  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const override = params.get("portal");

  if (override === "student" || hostname.startsWith("student.")) return "student";
  if (override === "university" || hostname.startsWith("university.")) return "university";
  if (
    override === "recruiter" ||
    override === "company" ||
    hostname.startsWith("recruiter.") ||
    hostname.startsWith("company.")
  )
    return "recruiter";
  return "main";
};

const authRoutes = (
  <>
    <Route path="/login"                     element={<LoginPage />} />
    <Route path="/signup"                    element={<SignupPage />} />
    <Route path="/signup-otp"               element={<SignupOTPPage />} />
    <Route path="/register"                  element={<Navigate to="/signup" replace />} />
    <Route path="/forgot-password"           element={<ForgotPasswordPage />} />
    <Route path="/reset-password-otp"       element={<ResetPasswordOTPPage />} />
    <Route path="/signup-successful"         element={<SignupSuccessfulPage />} />
    <Route path="/signin-successful"         element={<SignInSuccessfulPage />} />
    <Route path="/reset-password"            element={<ResetPasswordPage />} />
    <Route path="/password-reset-successful" element={<PasswordResetSuccessfulPage />} />
  </>
);

const sharedRoleRoutes = (
  <>
    <Route path="/dashboard/reports"       element={<ProtectedRoute><RoleBasedReportsPage /></ProtectedRoute>} />
    <Route path="/dashboard/messages"      element={<ProtectedRoute><RoleBasedMessagesPage /></ProtectedRoute>} />
    <Route path="/dashboard/notifications" element={<ProtectedRoute><RoleBasedNotificationsPage /></ProtectedRoute>} />
    <Route path="/dashboard/settings"      element={<ProtectedRoute><RoleBasedSettingsPage /></ProtectedRoute>} />
  </>
);

const recruiterRoutes = (
  <>
    <Route path="/dashboard/postings"     element={<ProtectedRoute><RecruiterPostingsPage /></ProtectedRoute>} />
    <Route path="/dashboard/applications" element={<ProtectedRoute><RecruiterApplicationsPage /></ProtectedRoute>} />
    <Route path="/dashboard/candidates"   element={<ProtectedRoute><RecruiterCandidatesPage /></ProtectedRoute>} />
    <Route path="/dashboard/interviews"   element={<ProtectedRoute><RecruiterInterviewsPage /></ProtectedRoute>} />
    <Route path="/dashboard/interns"      element={<ProtectedRoute><RecruiterInternsPage /></ProtectedRoute>} />
    <Route path="/dashboard/analytics font text" element={<Navigate to="/dashboard/analytics" replace />} />
    <Route path="/dashboard/analytics"    element={<ProtectedRoute><RecruiterAnalyticsPage /></ProtectedRoute>} />

    {/* Recruiter Role-Prefixed Aliases */}
    <Route path="/recruiter/dashboard/postings"     element={<ProtectedRoute><RecruiterPostingsPage /></ProtectedRoute>} />
    <Route path="/recruiter/dashboard/applications" element={<ProtectedRoute><RecruiterApplicationsPage /></ProtectedRoute>} />
    <Route path="/recruiter/dashboard/candidates"   element={<ProtectedRoute><RecruiterCandidatesPage /></ProtectedRoute>} />
    <Route path="/recruiter/dashboard/interviews"   element={<ProtectedRoute><RecruiterInterviewsPage /></ProtectedRoute>} />
    <Route path="/recruiter/dashboard/interns"      element={<ProtectedRoute><RecruiterInternsPage /></ProtectedRoute>} />
    <Route path="/recruiter/dashboard/analytics"    element={<ProtectedRoute><RecruiterAnalyticsPage /></ProtectedRoute>} />
    <Route path="/recruiter/dashboard/messages"     element={<ProtectedRoute><RecruiterMessagesPage /></ProtectedRoute>} />
    <Route path="/recruiter/dashboard/settings font text" element={<Navigate to="/recruiter/dashboard/settings" replace />} />
    <Route path="/recruiter/dashboard/settings font" element={<Navigate to="/recruiter/dashboard/settings" replace />} />
    <Route path="/recruiter/dashboard/settings"     element={<ProtectedRoute><RecruiterSettingsPage /></ProtectedRoute>} />

    <Route path="/company/dashboard/postings"     element={<ProtectedRoute><RecruiterPostingsPage /></ProtectedRoute>} />
    <Route path="/company/dashboard/applications" element={<ProtectedRoute><RecruiterApplicationsPage /></ProtectedRoute>} />
    <Route path="/company/dashboard/candidates"   element={<ProtectedRoute><RecruiterCandidatesPage /></ProtectedRoute>} />
    <Route path="/company/dashboard/interviews"   element={<ProtectedRoute><RecruiterInterviewsPage /></ProtectedRoute>} />
    <Route path="/company/dashboard/interns"      element={<ProtectedRoute><RecruiterInternsPage /></ProtectedRoute>} />
    <Route path="/company/dashboard/analytics"    element={<ProtectedRoute><RecruiterAnalyticsPage /></ProtectedRoute>} />
    <Route path="/company/dashboard/messages"     element={<ProtectedRoute><RecruiterMessagesPage /></ProtectedRoute>} />
    <Route path="/company/dashboard/settings"     element={<ProtectedRoute><RecruiterSettingsPage /></ProtectedRoute>} />
  </>
);

const studentRoutes = (
  <>
    <Route path="/dashboard/applications"     element={<ProtectedRoute><StudentApplicationsPage /></ProtectedRoute>} />
    <Route path="/dashboard/internship"       element={<ProtectedRoute><StudentInternshipPage /></ProtectedRoute>} />
    <Route path="/dashboard/profile"          element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
    <Route path="/dashboard/explore"          element={<ProtectedRoute><ExploreOpportunitiesPage /></ProtectedRoute>} />
    <Route path="/dashboard/interviews"       element={<ProtectedRoute><StudentInterviewsPage /></ProtectedRoute>} />
    <Route path="/dashboard/placement-history"element={<ProtectedRoute><StudentPlacementHistoryPage /></ProtectedRoute>} />
    <Route path="/dashboard/reports"          element={<ProtectedRoute><StudentReportsPage /></ProtectedRoute>} />
    <Route path="/dashboard/ai-assistant"     element={<ProtectedRoute><StudentAICareerAssistantPage /></ProtectedRoute>} />
    <Route path="/dashboard/saved-jobs"       element={<ProtectedRoute><StudentSavedJobsPage /></ProtectedRoute>} />
    <Route path="/dashboard/resume-analyzer"  element={<ProtectedRoute><StudentResumeAnalyzerPage /></ProtectedRoute>} />

    {/* Student Role-Prefixed Aliases */}
    <Route path="/student/dashboard/explore"          element={<ProtectedRoute><ExploreOpportunitiesPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/applications"     element={<ProtectedRoute><StudentApplicationsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/interviews"       element={<ProtectedRoute><StudentInterviewsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/placement-history"element={<ProtectedRoute><StudentPlacementHistoryPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/ai-assistant"     element={<ProtectedRoute><StudentAICareerAssistantPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/messages"         element={<ProtectedRoute><StudentMessagesPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/notifications"    element={<ProtectedRoute><StudentNotificationsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/saved-jobs"       element={<ProtectedRoute><StudentSavedJobsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/reports"          element={<ProtectedRoute><StudentReportsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/resume-analyzer"  element={<ProtectedRoute><StudentResumeAnalyzerPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/profile text"      element={<Navigate to="/student/dashboard/profile" replace />} />
    <Route path="/student/dashboard/profile"          element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
    <Route path="/student/dashboard/settings"         element={<ProtectedRoute><StudentSettingsPage /></ProtectedRoute>} />
  </>
);

const universityRoutes = (
  <>
    <Route path="/dashboard/students"          element={<ProtectedRoute><UniversityStudentsPage /></ProtectedRoute>} />
    <Route path="/dashboard/internships"       element={<ProtectedRoute><UniversityInternshipsPage /></ProtectedRoute>} />
    <Route path="/dashboard/approvals"         element={<ProtectedRoute><UniversityApprovalsPage /></ProtectedRoute>} />
    <Route path="/dashboard/departments"       element={<ProtectedRoute><UniversityDepartmentsPage /></ProtectedRoute>} />
    <Route path="/dashboard/colleges"          element={<ProtectedRoute><UniversityCollegesPage /></ProtectedRoute>} />
    <Route path="/dashboard/placement-overview" element={<ProtectedRoute><UniversityPlacementOverviewPage /></ProtectedRoute>} />
    <Route path="/dashboard/announcements"     element={<ProtectedRoute><UniversityAnnouncementsPage /></ProtectedRoute>} />
    <Route path="/dashboard/company-directory" element={<ProtectedRoute><UniversityCompanyDirectoryPage /></ProtectedRoute>} />

    {/* University Role-Prefixed Aliases */}
    <Route path="/university/dashboard/students"          element={<ProtectedRoute><UniversityStudentsPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/departments font text" element={<Navigate to="/university/dashboard/departments" replace />} />
    <Route path="/university/dashboard/departments"       element={<ProtectedRoute><UniversityDepartmentsPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/colleges"          element={<ProtectedRoute><UniversityCollegesPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/placement-overview" element={<ProtectedRoute><UniversityPlacementOverviewPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/reports font text" element={<Navigate to="/university/dashboard/reports" replace />} />
    <Route path="/university/dashboard/reports"           element={<ProtectedRoute><UniversityReportsPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/announcements"     element={<ProtectedRoute><UniversityAnnouncementsPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/company-directory" element={<ProtectedRoute><UniversityCompanyDirectoryPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/approvals"         element={<ProtectedRoute><UniversityApprovalsPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/messages"          element={<ProtectedRoute><UniversityMessagesPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/notifications"     element={<ProtectedRoute><UniversityNotificationsPage /></ProtectedRoute>} />
    <Route path="/university/dashboard/settings"          element={<ProtectedRoute><UniversitySettingsPage /></ProtectedRoute>} />
  </>
);

const subPageRoute = (
  <Route
    path="/dashboard/*"
    element={<ProtectedRoute><DashboardSubPage /></ProtectedRoute>}
  />
);

const adminRoutes = (
  <>
    <Route path="/admin/dashboard"            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/dashboard/students"   element={<ProtectedRoute><AdminStudentsPage /></ProtectedRoute>} />
    <Route path="/admin/dashboard/recruiters" element={<ProtectedRoute><AdminRecruitersPage /></ProtectedRoute>} />
    <Route path="/admin/dashboard/internships" element={<ProtectedRoute><AdminInternshipsPage /></ProtectedRoute>} />
    <Route path="/admin/dashboard/applications" element={<ProtectedRoute><AdminApplicationsPage /></ProtectedRoute>} />
    <Route path="/admin/dashboard/reports"     element={<ProtectedRoute><AdminReportsPage /></ProtectedRoute>} />
    <Route path="/admin/dashboard/audit-logs text" element={<Navigate to="/admin/dashboard/audit-logs" replace />} />
    <Route path="/admin/dashboard/audit-logs"  element={<ProtectedRoute><AdminAuditLogsPage /></ProtectedRoute>} />
    <Route path="/admin/dashboard/settings font text" element={<Navigate to="/admin/dashboard/settings" replace />} />
    <Route path="/admin/dashboard/settings"    element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
  </>
);

export default function AppRouter() {
  const activePortal = getActivePortal();
  const { user } = useAuth();
  const currentRole = user?.role?.toLowerCase();
  const roleSpecificRoutes =
    currentRole === "recruiter"
      ? recruiterRoutes
      : currentRole === "student"
      ? studentRoutes
      : currentRole === "university"
      ? universityRoutes
      : null;

  return (
    <DashboardProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Student portal ─────────────────────────────────── */}
          {activePortal === "student" && (
            <>
              <Route path="/"          element={<PortalLanding portal="student" />} />
              {authRoutes}
              <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              {studentRoutes}
              {sharedRoleRoutes}
              {subPageRoute}
              <Route path="*"          element={<Navigate to="/" replace />} />
            </>
          )}

          {/* ── University portal ──────────────────────────────── */}
          {activePortal === "university" && (
            <>
              <Route path="/"          element={<PortalLanding portal="university" />} />
              {authRoutes}
              <Route path="/dashboard" element={<ProtectedRoute><UniversityDashboard /></ProtectedRoute>} />
              {sharedRoleRoutes}
              {universityRoutes}
              {subPageRoute}
              <Route path="*"          element={<Navigate to="/" replace />} />
            </>
          )}

          {/* ── Recruiter portal ───────────────────────────────── */}
          {activePortal === "recruiter" && (
            <>
              <Route path="/"          element={<PortalLanding portal="recruiter" />} />
              {authRoutes}
              <Route path="/dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
              {recruiterRoutes}
              {sharedRoleRoutes}
              {subPageRoute}
              <Route path="*"          element={<Navigate to="/" replace />} />
            </>
          )}

          {/* ── Main portal ────────────────────────────────────── */}
          {activePortal === "main" && (
            <>
              <Route path="/" element={<LandingPage />} />
              {authRoutes}

              <Route
                path="/dashboard"
                element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>}
              />
              {sharedRoleRoutes}
              {roleSpecificRoutes}
              {adminRoutes}

              {/* Legacy role-prefixed paths kept as aliases */}
              <Route path="/student/dashboard"    element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/university/dashboard" element={<ProtectedRoute><UniversityDashboard /></ProtectedRoute>} />
              <Route path="/company/dashboard"    element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />

              {/* Fallback Sub-pages */}
              {subPageRoute}
              <Route path="/student/dashboard/*"    element={<ProtectedRoute><DashboardSubPage /></ProtectedRoute>} />
              <Route path="/university/dashboard/*" element={<ProtectedRoute><DashboardSubPage /></ProtectedRoute>} />
              <Route path="/company/dashboard/*"    element={<ProtectedRoute><DashboardSubPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}

        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}
