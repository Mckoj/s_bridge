import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { Sparkles } from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityPlacementOverviewPage() {
  const dark = useTheme();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-violet-500/20"
              : "bg-gradient-to-br from-violet-50/90 via-white to-violet-50/50 border-violet-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    : "border-violet-200 bg-violet-100/80 text-violet-700"
                }`}
              >
                <Sparkles size={14} />
                University Command Center
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Placement Funnel & Master Overview
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Real-time tracking of the 5-stage placement funnel from student eligibility to verified company attachment.
              </p>
            </div>
          </div>
        </div>

        {/* Placement Funnel Stepper */}
        <div className={`p-6 rounded-3xl border shadow-xl ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
          <h3 className="font-bold text-base mb-6">University Master Placement Funnel</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            {[
              { stage: "Eligible Students", count: "12,458", pct: "100%", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
              { stage: "Applications Submitted", count: "9,820", pct: "78.8%", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
              { stage: "Interviews Conducted", count: "8,540", pct: "68.5%", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
              { stage: "Offers Extended", count: "8,100", pct: "65.0%", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
              { stage: "Verified Placed", count: "7,842", pct: "62.8%", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
            ].map((f, idx) => (
              <div key={f.stage} className={`p-4 rounded-2xl border ${f.color} flex flex-col justify-between space-y-2`}>
                <span className="text-[10px] font-extrabold tracking-wider uppercase">Stage {idx + 1}</span>
                <p className="text-2xl font-extrabold">{f.count}</p>
                <p className="text-xs font-bold">{f.stage}</p>
                <span className="text-[10px] opacity-80">{f.pct} Conversion</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
