import { useDashboard } from "../../context/DashboardContext";
import type { RecruiterApplication } from "../../services/recruiterService";

interface HiringPipelineProps {
  applications: RecruiterApplication[];
}

export default function HiringPipeline({ applications }: HiringPipelineProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const total = applications.length;
  const pending = applications.filter((a) => a.status === "PENDING").length;
  const reviewing = applications.filter((a) => a.status === "REVIEWING").length;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  const stages = [
    { label: "Submitted", count: total, color: "bg-emerald-500", text: "text-emerald-500", pct: total > 0 ? "100%" : "0%" },
    { label: "Pending", count: pending, color: "bg-amber-500", text: "text-amber-500", pct: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%" },
    { label: "Under Review", count: reviewing, color: "bg-teal-500", text: "text-teal-500", pct: total > 0 ? `${Math.round((reviewing / total) * 100)}%` : "0%" },
    { label: "Accepted", count: accepted, color: "bg-green-600", text: "text-green-600", pct: total > 0 ? `${Math.round((accepted / total) * 100)}%` : "0%" },
    { label: "Rejected", count: rejected, color: "bg-rose-500", text: "text-rose-500", pct: total > 0 ? `${Math.round((rejected / total) * 100)}%` : "0%" },
  ];

  return (
    <div
      className={`rounded-3xl border p-6 shadow-xl backdrop-blur-xl ${
        dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>
            Hiring Pipeline Funnel
          </h3>
          <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Live stage distribution across all submitted applications
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
          {total} Total Applications
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className={`rounded-2xl border p-3 flex flex-col justify-between transition-all ${
              dark ? "bg-slate-800/60 border-slate-700/80" : "bg-slate-50 border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`w-2 h-2 rounded-full ${stage.color}`} />
              <span className={`text-[10px] font-extrabold ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {stage.pct}
              </span>
            </div>
            <div>
              <p className={`text-2xl font-extrabold tabular-nums ${dark ? "text-white" : "text-slate-800"}`}>
                {stage.count}
              </p>
              <p className={`text-[11px] font-semibold mt-0.5 truncate ${dark ? "text-slate-400" : "text-slate-600"}`}>
                {stage.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
