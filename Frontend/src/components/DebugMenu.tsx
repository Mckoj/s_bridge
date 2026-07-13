import { useState } from "react";
import { ChevronDown, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getActivePortal } from "./auth/authUtils";

const authScreens = [
  { label: "Login", path: "/login" },
  { label: "Signup", path: "/signup" },
  { label: "Signup OTP", path: "/signup-otp", state: { email: "dev@test.com" } },
  { label: "Signup Successful", path: "/signup-successful", state: { email: "dev@test.com", role: "student" } },
  { label: "Forgot Password", path: "/forgot-password" },
  { label: "Reset Password OTP", path: "/reset-password-otp", state: { email: "dev@test.com" } },
  { label: "Reset Password", path: "/reset-password" },
  { label: "Password Reset Successful", path: "/password-reset-successful" },
  { label: "Sign In Successful", path: "/signin-successful", state: { role: "student" } },
];

export default function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const activePortal = getActivePortal();

  // Build dashboard paths based on active portal
  const getDashboards = () => {
    if (activePortal === "main") {
      return [
        { label: "Student Dashboard", path: "/student/dashboard" },
        { label: "University Dashboard", path: "/university/dashboard" },
        { label: "Recruiter Dashboard", path: "/company/dashboard" },
      ];
    } else if (activePortal === "student") {
      return [{ label: "Student Dashboard", path: "/dashboard" }];
    } else if (activePortal === "university") {
      return [{ label: "University Dashboard", path: "/dashboard" }];
    } else if (activePortal === "recruiter") {
      return [{ label: "Recruiter Dashboard", path: "/dashboard" }];
    }
    return [];
  };

  const dashboards = getDashboards();

  const handleNavigation = (path: string, state?: any) => {
    navigate(path, state ? { state } : undefined);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md rounded-full px-3 py-2 hover:bg-slate-800/80 transition-all group cursor-pointer"
          title="Dev Menu - Auth & Dashboard Preview"
        >
          <Code2 size={16} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden min-w-max mt-2"
          >
            {/* Auth Screens */}
            <div className="border-b border-slate-700/50 py-2">
              <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Auth Screens
              </p>
              {authScreens.map((screen, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigation(screen.path, screen.state)}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/50 hover:text-blue-400 transition-colors"
                >
                  {screen.label}
                </button>
              ))}
            </div>

            {/* Dashboards */}
            <div className="py-2">
              <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Dashboards
              </p>
              {dashboards.map((dash, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigation(dash.path)}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/50 hover:text-emerald-400 transition-colors"
                >
                  {dash.label}
                </button>
              ))}
            </div>

            {/* Portal Info */}
            <div className="border-t border-slate-700/50 py-2 px-4">
              <p className="text-[9px] text-slate-500 font-mono">
                Portal: <span className="text-slate-300 font-bold">{activePortal}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
