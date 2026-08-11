import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
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
        <div className={`absolute inset-0 z-30 flex items-center justify-center p-4 lg:p-8 backdrop-blur-xl rounded-[32px] border shadow-2xl my-2 ${
          dark
            ? "bg-slate-950/65 border-blue-500/30"
            : "bg-white/70 border-blue-300/60"
        }`}>
          <div className={`max-w-lg text-center space-y-6 p-8 lg:p-10 rounded-[28px] border shadow-2xl backdrop-blur-2xl ${
            dark
              ? "bg-slate-900/95 border-blue-500/40"
              : "bg-white/95 border-blue-300/60 shadow-blue-100"
          }`}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 text-blue-400 border border-blue-500/40 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20 animate-pulse">
              <Sparkles size={36} />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-500 border border-blue-500/40 tracking-wider">
                <Lock size={12} /> AI FEATURE • COMING SOON
              </span>
              <h2 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
                dark ? "text-white" : "text-slate-900"
              }`}>
                AI Career Assistant & Intelligence Engine
              </h2>
              <p className={`text-xs lg:text-sm leading-relaxed font-medium max-w-md mx-auto ${
                dark ? "text-slate-300" : "text-slate-600"
              }`}>
                Our XGBoost predictive placement probability model, ATS skill gap analysis, and tailored learning roadmap engines are currently in final model training. Check back soon for the full AI launch!
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
                onClick={() => navigate("/dashboard/explore")}
                className={`px-6 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  dark
                    ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
                    : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
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
                ? "bg-slate-900/80 border-blue-500/20"
                : "bg-gradient-to-br from-blue-50/90 via-white to-blue-50/50 border-blue-200/80"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Sparkles size={14} />
                  S-Bridge AI Intelligence Engine
                </div>
                <h1 className={`mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                  AI Career Assistant & Skill Roadmap
                </h1>
                <p className="mt-1 text-xs lg:text-sm font-medium text-slate-400">
                  Personalized placement predictions, XGBoost probability score, skill gap analysis, and tailored learning paths.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Description Cards — no fake AI metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Career Match Score",
                desc: "Matches your skills, GPA, and programmes against active internship requirements to surface the most relevant opportunities.",
                color: "text-blue-400"
              },
              {
                label: "Placement Probability",
                desc: "Uses an ML model trained on historical placements to estimate your likelihood of securing a placement in your chosen field.",
                color: "text-blue-400"
              },
              {
                label: "Resume Strength Index",
                desc: "Evaluates the quality and completeness of your profile — skills, experience, GPA, and CV — to provide an overall readiness score.",
                color: "text-blue-400"
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className={`p-6 rounded-3xl border shadow-xl ${
                  dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <span className={`text-xs font-bold block mb-2 ${feature.color}`}>{feature.label}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Planned Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Brain size={18} className="text-blue-400" /> Skill Gap & Demand Analysis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compares your verified skills against the most in-demand skills across active internship listings.
                Surfaces actionable gaps to guide your upskilling before your next application.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <h3 className="text-base font-bold flex items-center gap-2">
                <BookOpen size={18} className="text-blue-400" /> Personalized Learning Roadmap
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates a step-by-step learning path tailored to your skills, target role, and timeline.
                Includes recommended certifications, courses, and projects to accelerate placement readiness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
