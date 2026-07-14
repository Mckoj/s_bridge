import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo/sbridge-logo.png";
import { CheckCircle2, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthButton } from "../../components/auth/AuthComponents";
import { roleConfig, getActivePortal } from "../../components/auth/authUtils";
import type { UserRole } from "../../context/DashboardContext";

interface LocationState {
  role?: UserRole;
}

export default function SignInSuccessfulPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const role = state.role ?? "student";
  const config = roleConfig[role];
  getActivePortal();

  // Auto-redirect to /dashboard after 3 s — works on all portals
  useEffect(() => {
    const timer = setTimeout(() => navigate("/dashboard"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleDashboardRedirect = () => navigate("/dashboard");

  return (
    <AuthLayout>
      <AuthCard className="text-center">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="SBridge Logo" className="h-10 w-auto mb-4 select-none" />

          <div className={`p-4 rounded-full ${config.bg} mb-4 animate-pulse`}>
            <CheckCircle2 size={40} className={config.text} />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">Welcome Back!</h2>
          <p className="text-xs text-slate-400 font-medium mt-2 max-w-xs">
            You have been successfully signed in to your {config.label.toLowerCase()} account.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6">
          <p className="text-[10px] text-slate-300 font-medium">
            Redirecting to your dashboard in a few seconds...
          </p>
        </div>

        <AuthButton
          accentClass={config.accent}
          onClick={handleDashboardRedirect}
        >
          <span>Go to Dashboard Now</span>
          <ArrowRight size={14} />
        </AuthButton>
      </AuthCard>
    </AuthLayout>
  );
}
