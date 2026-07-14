import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserRole } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/sbridge-logo.png";
import {
  GraduationCap,
  Building2,
  Briefcase,
  Mail,
  Lock,
  User,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthCard, AuthInput, AuthButton } from "../../components/auth/AuthComponents";
import { getActivePortal, getDefaultRole, roleConfig } from "../../components/auth/authUtils";

export default function SignupPage() {
  const navigate = useNavigate();
  const activePortal = getActivePortal();
  const { register, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>(() => getDefaultRole(activePortal));
  const [step, setStep] = useState(activePortal === "main" ? 1 : 2);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    department: "",
    studentId: "",
    indexNumber: "",
  });

  const config = roleConfig[selectedRole];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      let profileData: any = {};
      if (selectedRole === "student") {
        const nameParts = formData.name.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "Student";
        profileData = {
          firstName,
          lastName,
          studentId: formData.studentId,
          indexNumber: formData.indexNumber,
          programme: formData.department,
        };
      } else if (selectedRole === "recruiter") {
        profileData = {
          companyName: formData.orgName,
        };
      } else if (selectedRole === "university") {
        profileData = {
          universityName: formData.orgName,
          domain: formData.email.split("@")[1] || "",
        };
      }
      await register(formData.email, formData.password, selectedRole, profileData);
      navigate("/signup-successful", { state: { email: formData.email, role: selectedRole } });
    } catch {
      // error is already set in AuthContext
    }
  };

  const roleCards = (
    <div className="space-y-3">
      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block text-center">
        Select Account Type
      </label>
      {(["student", "university", "recruiter"] as UserRole[]).map((role) => {
        const icons = { student: GraduationCap, university: Building2, recruiter: Briefcase };
        const descriptions = {
          student: "Find placements, build your CV, and submit logbooks.",
          university: "Administer placements, authorize reports, view analytics.",
          recruiter: "Create vacancies, schedule interviews, and evaluate interns.",
        };
        const Icon = icons[role];
        const isSelected = selectedRole === role;

        return (
          <button
            key={role}
            type="button"
            onClick={() => setSelectedRole(role)}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 text-left ${
              isSelected
                ? `${roleConfig[role].bg} ${roleConfig[role].color.split(" ")[0]} shadow-lg ${roleConfig[role].glow}`
                : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
            }`}
          >
            <div
              className={`p-3 rounded-xl transition-colors ${
                isSelected ? `${roleConfig[role].iconBg} text-white` : "bg-slate-800 text-slate-400"
              }`}
            >
              <Icon size={22} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-100 text-sm">{roleConfig[role].label}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{descriptions[role]}</p>
            </div>
          </button>
        );
      })}

      <AuthButton accentClass={config.accent} onClick={() => setStep(2)}>
        <span>Continue to Registration</span>
        <ArrowRight size={14} />
      </AuthButton>
    </div>
  );

  const signupForm = (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${config.text}`}>
          Register as {config.label}
        </span>
        {activePortal === "main" && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
        )}
      </div>

      <AuthInput
        label="Full Name"
        icon={User}
        placeholder="John Doe"
        value={formData.name}
        onChange={(v) => handleInputChange("name", v)}
        required
      />

      <AuthInput
        label="Email Address"
        icon={Mail}
        type="email"
        placeholder="you@domain.com"
        value={formData.email}
        onChange={(v) => handleInputChange("email", v)}
        required
      />

      <AuthInput
        label="Password"
        icon={Lock}
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(v) => handleInputChange("password", v)}
        required
      />

      {selectedRole === "student" && (
        <>
          <AuthInput
            label="Student ID"
            icon={User}
            placeholder="ST-12345"
            value={formData.studentId}
            onChange={(v) => handleInputChange("studentId", v)}
            required
          />
          <AuthInput
            label="Index Number"
            icon={BookOpen}
            placeholder="IDX-98765"
            value={formData.indexNumber}
            onChange={(v) => handleInputChange("indexNumber", v)}
            required
          />
          <AuthInput
            label="University Name"
            icon={Building2}
            placeholder="Harvard University"
            value={formData.orgName}
            onChange={(v) => handleInputChange("orgName", v)}
            required
          />
          <AuthInput
            label="Academic Major"
            icon={BookOpen}
            placeholder="Computer Science"
            value={formData.department}
            onChange={(v) => handleInputChange("department", v)}
            required
          />
        </>
      )}

      {selectedRole === "university" && (
        <AuthInput
          label="Institution Name"
          icon={Building2}
          placeholder="MIT University"
          value={formData.orgName}
          onChange={(v) => handleInputChange("orgName", v)}
          required
        />
      )}

      {selectedRole === "recruiter" && (
        <AuthInput
          label="Company / Organization"
          icon={Briefcase}
          placeholder="Google LLC"
          value={formData.orgName}
          onChange={(v) => handleInputChange("orgName", v)}
          required
        />
      )}

      <AuthButton type="submit" disabled={isLoading} accentClass={config.accent}>
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight size={14} />
          </>
        )}
      </AuthButton>
    </form>
  );

  return (
    <AuthLayout maxWidth={step === 1 && activePortal === "main" ? "lg" : "md"}>
      <div className="flex flex-col items-center text-center mb-6">
        <img src={logo} alt="SBridge Logo" className="h-10 w-auto mb-3 select-none" />
        <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Create your SBridge Account
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Join the network connecting students, universities, and employers.
        </p>
      </div>

      {step === 1 && activePortal === "main" ? (
        <AuthCard>{roleCards}</AuthCard>
      ) : (
        <AuthCard>
          {signupForm}
          <div className="text-center mt-6 pt-4 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className={`${config.text} hover:underline font-bold`}>
                Sign In
              </Link>
            </p>
          </div>
        </AuthCard>
      )}
    </AuthLayout>
  );
}
