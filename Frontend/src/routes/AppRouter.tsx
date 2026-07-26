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
import UniversityDashboard from "../pages/University/UniversityDashboard";
import CompanyDashboard from "../pages/Recruiter/CompanyDashboard";
import PortalLanding from "../pages/Landing/PortalLanding";
import RoleBasedDashboard from "../pages/Dashboard/RoleBasedDashboard";
import DashboardSubPage from "../pages/Dashboard/DashboardSubPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { DashboardProvider } from "../context/DashboardContext";

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

const studentRoutes = (
  <>
    <Route path="/dashboard/applications"  element={<ProtectedRoute><StudentApplicationsPage /></ProtectedRoute>} />
    <Route path="/dashboard/internship text" element={<Navigate to="/dashboard/internship" replace />} />
    <Route path="/dashboard/internship"    element={<ProtectedRoute><StudentInternshipPage /></ProtectedRoute>} />
    <Route path="/dashboard/reports"       element={<ProtectedRoute><StudentReportsPage /></ProtectedRoute>} />
    <Route path="/dashboard/messages text"  element={<Navigate to="/dashboard/messages" replace />} />
    <Route path="/dashboard/messages"      element={<ProtectedRoute><StudentMessagesPage /></ProtectedRoute>} />
    <Route path="/dashboard/notifications" element={<ProtectedRoute><StudentNotificationsPage /></ProtectedRoute>} />
    <Route path="/dashboard/profile"       element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
    <Route path="/dashboard/settings"      element={<ProtectedRoute><StudentSettingsPage /></ProtectedRoute>} />
    <Route path="/dashboard/explore"       element={<ProtectedRoute><ExploreOpportunitiesPage /></ProtectedRoute>} />

    {/* Student role-prefixed path aliases */}
    <Route path="/student/dashboard/applications"  element={<ProtectedRoute><StudentApplicationsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/internship"    element={<ProtectedRoute><StudentInternshipPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/reports"       element={<ProtectedRoute><StudentReportsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/messages"      element={<ProtectedRoute><StudentMessagesPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/notifications" element={<ProtectedRoute><StudentNotificationsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/profile"       element={<ProtectedRoute><StudentProfilePage /></ProtectedRoute>} />
    <Route path="/student/dashboard/settings"      element={<ProtectedRoute><StudentSettingsPage /></ProtectedRoute>} />
    <Route path="/student/dashboard/explore"       element={<ProtectedRoute><ExploreOpportunitiesPage /></ProtectedRoute>} />
  </>
);

const subPageRoute = (
  <Route
    path="/dashboard/*"
    element={<ProtectedRoute><DashboardSubPage /></ProtectedRoute>}
  />
);

export default function AppRouter() {
  const activePortal = getActivePortal();

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

              {/* Student specific sub-routes */}
              {studentRoutes}

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
