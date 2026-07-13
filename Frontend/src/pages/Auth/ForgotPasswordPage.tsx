import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/sbridge-logo.png";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthInput, AuthButton } from "../../components/auth/AuthComponents";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/reset-password-otp", { state: { email } });
    }, 1000);
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="SBridge Logo" className="h-12 w-auto mb-3 select-none" />
          <h2 className="text-xl font-extrabold tracking-tight">Forgot Password?</h2>
          <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs">
            Enter your email and we'll send you a code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={setEmail}
            required
          />

          <AuthButton
            type="submit"
            disabled={isLoading}
            accentClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20 shadow-blue-600/10"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight size={14} />
              </>
            )}
          </AuthButton>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
