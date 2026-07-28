import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { Video, Building, Sparkles, CalendarCheck, Clock } from "lucide-react";
import { useStudentInterviews } from "../../hooks/useStudentInterviews";
import EmptyState from "../../components/student/EmptyState";
import LoadingSkeleton from "../../components/student/LoadingSkeleton";
import ErrorState from "../../components/student/ErrorState";
import { useState } from "react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentInterviewsPage() {
  const dark = useTheme();
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "HISTORY">("UPCOMING");

  // ─── Custom hook — all fetch/loading/error logic encapsulated ───
  const { interviews, loading, error, refetch } = useStudentInterviews();

  const upcoming = interviews.filter((i) => i.status === "UPCOMING");
  const past = interviews.filter((i) => i.status !== "UPCOMING");
  const displayed = activeTab === "UPCOMING" ? upcoming : past;

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
                Interview Management
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                My Scheduled Interviews
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Track upcoming technical and HR interview invitations, meeting links, and interviewer notes.
              </p>
            </div>

            <div className="flex items-center gap-2" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "UPCOMING"}
                onClick={() => setActiveTab("UPCOMING")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "UPCOMING"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                }`}
              >
                Upcoming ({upcoming.length})
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "HISTORY"}
                onClick={() => setActiveTab("HISTORY")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "HISTORY"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                }`}
              >
                History ({past.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton count={2} layout="list" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : displayed.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EmptyState
                icon={<CalendarCheck size={32} />}
                title={activeTab === "UPCOMING" ? "No Upcoming Interviews" : "No Interview History"}
                description={
                  activeTab === "UPCOMING"
                    ? "You have no scheduled interviews at this time. Interview scheduling will be available once companies respond to your applications."
                    : "Your completed interview records will appear here after interviews take place."
                }
              />
            </div>
            <AIMockInterviewCard dark={dark} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {displayed.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-3xl border shadow-xl flex flex-col space-y-4 ${
                    dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center" aria-hidden="true">
                        <Building size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{item.position}</h3>
                        <p className="text-xs font-semibold text-blue-400">{item.companyName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      item.status === "UPCOMING"
                        ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                        : item.status === "COMPLETED"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 text-xs py-2 border-y ${dark ? "border-slate-800/40" : "border-slate-100"}`}>
                    <div>
                      <span className={`block text-[10px] font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>Date &amp; Time</span>
                      <span className={`font-semibold flex items-center gap-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                        <Clock size={11} /> {item.interviewDate} • {item.interviewTime}
                      </span>
                    </div>
                    {item.platform && (
                      <div>
                        <span className={`block text-[10px] font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>Platform</span>
                        <span className={`font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.platform}</span>
                      </div>
                    )}
                    {item.interviewer && (
                      <div>
                        <span className={`block text-[10px] font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>Interviewer</span>
                        <span className={`font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.interviewer}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {item.notes && (
                      <p className={`text-xs italic ${dark ? "text-slate-400" : "text-slate-500"}`}>"{item.notes}"</p>
                    )}
                    {item.meetingLink && item.status === "UPCOMING" && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                        aria-label={`Join interview for ${item.position} at ${item.companyName}`}
                      >
                        <Video size={14} aria-hidden="true" /> Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <AIMockInterviewCard dark={dark} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── AI Mock Interview Card — Coming Soon overlay ───
function AIMockInterviewCard({ dark }: { dark: boolean }) {
  return (
    <div className={`relative overflow-hidden p-6 rounded-3xl border shadow-xl ${dark ? "bg-slate-900/80 border-purple-500/30" : "bg-white border-purple-200"}`}>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-md text-center rounded-3xl">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-2 animate-pulse">
          <Sparkles size={22} />
        </div>
        <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/40">
          AI FEATURE • COMING SOON
        </span>
        <p className="text-xs font-extrabold text-white mt-2">AI Voice &amp; Technical Simulator</p>
        <p className="text-[11px] text-slate-300 mt-1 max-w-xs leading-relaxed font-medium">
          Automated technical question generator and AI voice evaluator currently in development.
        </p>
      </div>
      <div className="filter blur-xs opacity-50 pointer-events-none select-none p-4 space-y-3" aria-hidden="true">
        <div className={`h-4 rounded-full w-3/4 ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
        <div className={`h-3 rounded-full w-1/2 ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
        <div className={`h-3 rounded-full w-5/6 ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
        <div className={`h-8 rounded-xl w-full mt-4 ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
      </div>
    </div>
  );
}
