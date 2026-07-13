import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/sbridge-logo.png";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthInput, AuthButton } from "../../components/auth/AuthComponents";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/password-reset-successful");
    }, 1000);
  };

  const eyeToggle = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-slate-500 hover:text-slate-300 focus:outline-none"
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="SBridge Logo" className="h-12 w-auto mb-3 select-none" />
          <h2 className="text-xl font-extrabold tracking-tight">Reset Your Password</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Enter a new password for your SBridge account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            label="New Password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            required
            trailing={eyeToggle(showPassword, () => setShowPassword(!showPassword))}
          />

          <AuthInput
            label="Confirm Password"
            icon={Lock}
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            trailing={eyeToggle(showConfirm, () => setShowConfirm(!showConfirm))}
          />

          {error && (
            <p className="text-[10px] text-red-400 font-semibold text-center">{error}</p>
          )}

          <AuthButton
            type="submit"
            disabled={isLoading}
            accentClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20 shadow-blue-600/10"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight size={14} />
              </>
            )}
          </AuthButton>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
