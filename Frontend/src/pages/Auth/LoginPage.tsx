import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";
import type { UserRole } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/sbridge-logo.png";
import { GraduationCap, Building2, Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthInput, AuthButton } from "../../components/auth/AuthComponents";
import { getActivePortal, getDefaultRole, roleConfig } from "../../components/auth/authUtils";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useDashboard();
  const { login, isLoading, error, clearError } = useAuth();
  const activePortal = getActivePortal();

  const [selectedRole, setSelectedRole] = useState<UserRole>(() => getDefaultRole(activePortal));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const config = roleConfig[selectedRole];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      setRole(selectedRole);
      navigate("/signin-successful", { state: { role: selectedRole } });
    } catch {
      // error is already set in AuthContext
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="SBridge Logo" className="h-12 w-auto mb-3 select-none" />
          <h2 className="text-xl font-extrabold tracking-tight">Welcome to SBridge</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Access your attachment and internship portal.
          </p>
        </div>

        {activePortal === "main" && (
          <div className="mb-6">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-3 text-center">
              Identify Your Portal Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["student", "university", "recruiter"] as UserRole[]).map((role) => {
                const icons = { student: GraduationCap, university: Building2, recruiter: Briefcase };
                const Icon = icons[role];
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all duration-200 flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedRole === role
                        ? roleConfig[role].color
                        : "border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{roleConfig[role].label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <AuthInput
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={setEmail}
            required
          />

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <Link
                to="/forgot-password"
                className={`text-[10px] font-semibold ${config.text} hover:underline`}
              >
                Forgot?
              </Link>
            </div>
            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl px-4 py-3 focus-within:border-slate-700 transition-all duration-200">
              <Lock size={16} className="text-slate-500 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs outline-none border-none w-full text-white placeholder-slate-500 font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <AuthButton type="submit" disabled={isLoading} accentClass={config.accent}>
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={14} />
              </>
            )}
          </AuthButton>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="text-xs font-semibold text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className={`${config.text} hover:underline font-bold`}>
              Create Account
            </Link>
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">
            By signing in, you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
