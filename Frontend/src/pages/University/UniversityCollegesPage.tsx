import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Sparkles,
  Download
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityCollegesPage() {
  const dark = useTheme();

  const colleges = [
    {
      id: "col-1",
      rank: "#1",
      name: "College of Engineering",
      placementRate: "68.4%",
      departmentsCount: 8,
      studentsCount: 3850,
      placedCount: 2633,
    },
    {
      id: "col-2",
      rank: "#2",
      name: "College of Science",
      placementRate: "57.3%",
      departmentsCount: 6,
      studentsCount: 2900,
      placedCount: 1661,
    },
    {
      id: "col-3",
      rank: "#3",
      name: "College of Humanities and Social Sciences",
      placementRate: "52.1%",
      departmentsCount: 10,
      studentsCount: 4200,
      placedCount: 2188,
    },
  ];

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
                Institutional College Comparison
              </div>
              <h1 className={`mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                Colleges Performance Ranking & Breakdown
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Aggregated placement analytics, college rankings, and department breakdown metrics.
              </p>
            </div>

            <button
              onClick={() => alert("Exporting College Accreditation Comparison...")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-500/20"
            >
              <Download size={15} /> Export Accreditation Report
            </button>
          </div>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((col) => (
            <div
              key={col.id}
              className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 ${
                dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center">
                    {col.rank}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {col.placementRate} Placed
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">{col.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{col.departmentsCount} Departments | {col.studentsCount} Students</p>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-800/40 pt-3">
                  <p><strong>Placed Students:</strong> {col.placedCount} / {col.studentsCount}</p>
                  <p><strong>Performance Status:</strong> Exceeding Annual Benchmark</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
