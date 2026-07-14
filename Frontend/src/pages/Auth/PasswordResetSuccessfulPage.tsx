import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/sbridge-logo.png";
import { CheckCircle2, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthButton } from "../../components/auth/AuthComponents";

export default function PasswordResetSuccessfulPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <AuthCard className="text-center">
        <div className="mb-6 flex flex-col items-center">
          <img src={logo} alt="SBridge Logo" className="mb-4 h-10 w-auto select-none" />

          <div className="mb-4 rounded-full bg-emerald-600/10 p-4">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white">Password Reset Complete</h2>
          <p className="mt-2 max-w-xs text-xs font-medium text-slate-400">
            Your password has been updated successfully. You can now sign in with your new
            credentials.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
          <p className="text-[10px] text-slate-400 font-medium">
            For security, you&apos;ve been signed out of all other devices. Use your new password
            on your next login.
          </p>
        </div>

        <AuthButton
          accentClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20 shadow-blue-600/10"
          onClick={() => navigate("/login")}
        >
          <span>Sign In Now</span>
          <ArrowRight size={14} />
        </AuthButton>
      </AuthCard>
    </AuthLayout>
  );
}
