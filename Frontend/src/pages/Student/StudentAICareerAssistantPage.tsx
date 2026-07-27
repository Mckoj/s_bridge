import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Brain,
  Lock,
  ArrowRight
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentAICareerAssistantPage() {
  const dark = useTheme();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12 relative min-h-[70vh]">
        {/* Full-Page Glassmorphic Coming Soon Overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 lg:p-8 bg-slate-950/65 backdrop-blur-xl rounded-[32px] border border-purple-500/30 shadow-2xl my-2">
          <div className="max-w-lg text-center space-y-6 p-8 lg:p-10 rounded-[28px] bg-slate-900/95 border border-purple-500/40 shadow-2xl backdrop-blur-2xl">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/30 to-violet-600/20 text-purple-400 border border-purple-500/40 mx-auto flex items-center justify-center shadow-xl shadow-purple-500/20 animate-pulse">
              <Sparkles size={36} />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 tracking-wider">
                <Lock size={12} /> AI FEATURE • COMING SOON
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                AI Career Assistant & Intelligence Engine
              </h2>
              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-medium max-w-md mx-auto">
                Our XGBoost predictive placement probability model, ATS skill gap analysis, and tailored learning roadmap engines are currently in final model training. Check back soon for the full AI launch!
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-500/25 transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => navigate("/dashboard/explore")}
                className="px-6 py-3 rounded-2xl text-xs font-bold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
              >
                Browse Marketplace <ArrowRight size={14} />
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
                ? "bg-slate-900/80 border-purple-500/20"
                : "bg-gradient-to-br from-purple-50/90 via-white to-purple-50/50 border-purple-200/80"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold border-purple-500/30 bg-purple-500/10 text-purple-400">
                  <Sparkles size={14} />
                  S-Bridge AI Intelligence Engine
                </div>
                <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                  AI Career Assistant & Skill Roadmap
                </h1>
                <p className="mt-1 text-xs lg:text-sm font-medium text-slate-400">
                  Personalized placement predictions, XGBoost probability score, skill gap analysis, and tailored learning paths.
                </p>
              </div>
            </div>
          </div>

          {/* Predictive Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-3xl border shadow-xl ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Career Match Score</span>
              </div>
              <p className="text-4xl font-extrabold text-purple-400">88%</p>
              <p className="text-xs text-slate-500 mt-2">Strong alignment with Software Engineering and Data Analyst roles.</p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Projected Placement Probability</span>
              </div>
              <p className="text-4xl font-extrabold text-emerald-400">92.4%</p>
              <p className="text-xs text-slate-500 mt-2">Based on current GPA, verified skills, and active application speed.</p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Resume Strength Index</span>
              </div>
              <p className="text-4xl font-extrabold text-blue-400">85 / 100</p>
              <p className="text-xs text-slate-500 mt-2">High keyword density for React, Node.js, and SQL skills.</p>
            </div>
          </div>

          {/* Skill Gap Analysis & Recommended Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Brain size={18} className="text-purple-400" /> Skill Gap & Demand Analysis
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <span className="font-bold text-purple-400 block mb-1">High Demand Skill Gap: Docker & Containerization</span>
                  <p className="text-slate-400">78% of top employer listings require basic DevOps/Docker knowledge.</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <BookOpen size={18} className="text-purple-400" /> Personalized Learning Roadmap
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Phase 1: React & Frontend Architecture (Completed)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
