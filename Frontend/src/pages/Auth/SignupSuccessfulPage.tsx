import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/sbridge-logo.png";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthButton } from "../../components/auth/AuthComponents";
import { roleConfig } from "../../components/auth/authUtils";
import type { UserRole } from "../../context/DashboardContext";

interface LocationState {
  email?: string;
  role?: UserRole;
}

export default function SignupSuccessfulPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const email = state.email ?? "your email";
  const role = state.role ?? "student";
  const config = roleConfig[role];

  return (
    <AuthLayout>
      <AuthCard className="text-center">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="SBridge Logo" className="h-10 w-auto mb-4 select-none" />

          <div className={`p-4 rounded-full ${config.bg} mb-4`}>
            <CheckCircle2 size={40} className={config.text} />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">Account Created!</h2>
          <p className="text-xs text-slate-400 font-medium mt-2 max-w-xs">
            Your {config.label.toLowerCase()} account has been registered successfully.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <Mail size={18} className="text-slate-500 shrink-0" />
          <p className="text-xs text-slate-300 text-left">
            A verification email was sent to{" "}
            <span className={`font-bold ${config.text}`}>{email}</span>. Please verify before
            signing in.
          </p>
        </div>

        <AuthButton accentClass={config.accent} onClick={() => navigate("/login")}>
          <span>Go to Sign In</span>
          <ArrowRight size={14} />
        </AuthButton>

        <p className="text-[10px] text-slate-500 font-medium mt-4">
          Didn&apos;t get the email?{" "}
          <button type="button" className={`${config.text} hover:underline font-bold`}>
            Resend verification
          </button>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
