import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  FileText,
  Lock,
  ArrowRight,
  Bot,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentResumeAnalyzerPage() {
  const dark = useTheme();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 relative min-h-[70vh]">
        {/* Full-Page Glassmorphic Coming Soon Overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 lg:p-8 bg-slate-950/65 backdrop-blur-xl rounded-[32px] border border-blue-500/30 shadow-2xl my-2">
          <div className="max-w-lg text-center space-y-6 p-8 lg:p-10 rounded-[28px] bg-slate-900/95 border border-blue-500/40 shadow-2xl backdrop-blur-2xl">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/30 to-indigo-600/20 text-blue-400 border border-blue-500/40 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20 animate-pulse">
              <FileText size={36} />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40 tracking-wider">
                <Lock size={12} /> AI FEATURE • COMING SOON
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                AI Resume Analyzer & ATS Scanner
              </h2>
              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-medium max-w-md mx-auto">
                Our automated ATS resume parser, keyword density calculator, and AI formatting critique engine are undergoing final optimization. Check back soon for the complete resume audit functionality!
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/25 transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="px-6 py-3 rounded-2xl text-xs font-bold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                Update Profile CV <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Blurred Underlying Preview Content */}
        <div className="filter blur-md opacity-40 pointer-events-none select-none space-y-6">
          {/* Header Banner */}
          <div
            className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
              dark
                ? "bg-slate-900/80 border-blue-500/20"
                : "bg-gradient-to-br from-blue-50/90 via-white to-blue-50/50 border-blue-200/80"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Sparkles size={14} />
                  ATS & Resume Optimization Engine
                </div>
                <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                  AI Resume Analyzer
                </h1>
                <p className="mt-1 text-xs lg:text-sm font-medium text-slate-400">
                  Upload your CV to scan for ATS formatting errors, keyword density, grammar, and missing skills.
                </p>
              </div>
            </div>
          </div>

          {/* Results Section Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-5 rounded-3xl border text-center ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block mb-1">ATS Compatibility</span>
              <span className="text-3xl font-extrabold text-emerald-400">88%</span>
            </div>
            <div className={`p-5 rounded-3xl border text-center ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block mb-1">Keyword Score</span>
              <span className="text-3xl font-extrabold text-blue-400">82 / 100</span>
            </div>
            <div className={`p-5 rounded-3xl border text-center ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block mb-1">Grammar & Impact</span>
              <span className="text-3xl font-extrabold text-purple-400">94%</span>
            </div>
            <div className={`p-5 rounded-3xl border text-center ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block mb-1">Formatting Check</span>
              <span className="text-3xl font-extrabold text-amber-400">Passed</span>
            </div>
          </div>

          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${dark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Bot size={18} className="text-blue-500" />
              AI Improvement Recommendations
            </h3>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <span><strong>Skills Found:</strong> React, TypeScript, Node.js, SQL, Express.js, Git.</span>
              </li>
              <li className="flex items-start gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Missing Industry Keywords:</strong> Docker, RESTful APIs, Unit Testing (Jest), CI/CD.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
