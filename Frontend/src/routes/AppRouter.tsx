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
import UniversityDashboard from "../pages/University/UniversityDashboard";
import CompanyDashboard from "../pages/Recruiter/CompanyDashboard";
import PortalLanding from "../pages/Landing/PortalLanding";
import DebugMenu from "../components/DebugMenu";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { DashboardProvider } from "../context/DashboardContext";

const getActivePortal = (): "student" | "university" | "recruiter" | "main" => {
  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const override = params.get("portal");

  if (override === "student" || hostname.startsWith("student.")) return "student";
  if (override === "university" || hostname.startsWith("university.")) return "university";
  if (override === "recruiter" || override === "company" || hostname.startsWith("recruiter.") || hostname.startsWith("company.")) return "recruiter";
  return "main";
};

const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/signup-otp" element={<SignupOTPPage />} />
    <Route path="/register" element={<Navigate to="/signup" replace />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password-otp" element={<ResetPasswordOTPPage />} />
    <Route path="/signup-successful" element={<SignupSuccessfulPage />} />
    <Route path="/signin-successful" element={<SignInSuccessfulPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/password-reset-successful" element={<PasswordResetSuccessfulPage />} />
  </>
);

export default function AppRouter() {
  const activePortal = getActivePortal();

  return (
    <DashboardProvider>
      <BrowserRouter>
        <DebugMenu />
        <Routes>
          {activePortal === "student" && (
            <>
              <Route path="/" element={<PortalLanding portal="student" />} />
              {authRoutes}
              <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}

          {activePortal === "university" && (
            <>
              <Route path="/" element={<PortalLanding portal="university" />} />
              {authRoutes}
              <Route path="/dashboard" element={<ProtectedRoute><UniversityDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}

          {activePortal === "recruiter" && (
            <>
              <Route path="/" element={<PortalLanding portal="recruiter" />} />
              {authRoutes}
              <Route path="/dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}

          {activePortal === "main" && (
            <>
              <Route path="/" element={<LandingPage />} />
              {authRoutes}
              <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/university/dashboard" element={<ProtectedRoute><UniversityDashboard /></ProtectedRoute>} />
              <Route path="/company/dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}
