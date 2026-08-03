import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Briefcase,
  Download,
  Calendar,
  Sparkles,
  Star
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentPlacementHistoryPage() {
  const dark = useTheme();

  const history = [
    {
      id: "hist-1",
      companyName: "Vodafone Ghana (Telecel)",
      position: "IT Support & Network Intern",
      startDate: "June 2025",
      endDate: "August 2025",
      supervisor: "Ing. Emmanuel Osei",
      evaluationScore: "4.9 / 5.0 (Exemplary)",
      certificateAvailable: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
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
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-blue-200 bg-blue-100/80 text-blue-700"
                }`}
              >
                <Sparkles size={14} />
                Verified Attachment Record
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Placement & Internship History
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Archived records of your previous industrial attachments, supervisor evaluations, and completion certificates.
              </p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 text-blue-400 font-extrabold flex items-center justify-center shrink-0">
                  <Briefcase size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{item.position}</h3>
                  <p className="text-sm font-semibold text-blue-400">{item.companyName}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {item.startDate} - {item.endDate}</span>
                    <span>•</span>
                    <span>Supervisor: {item.supervisor}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <Star size={13} /> Evaluation: {item.evaluationScore}
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert("Downloading Internship Completion Certificate...")}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Download size={15} /> Certificate (PDF)
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
