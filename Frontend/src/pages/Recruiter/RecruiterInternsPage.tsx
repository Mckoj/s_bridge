import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useRecruiterInterns } from "../../hooks/useRecruiterInterns";
import {
  PageHeader,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/recruiter";
import { Users, FileText, CheckCircle, XCircle } from "lucide-react";

export default function RecruiterInternsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"interns" | "reports">("interns");
  const { reports, acceptedInterns, loading, error, updateStatus, updatingReportId, refetch } = useRecruiterInterns();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Intern Management"
          title="Placed Interns & Weekly Logbooks"
          description="Monitor accepted intern placements and review weekly logbook reports submitted by active interns."
        >
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab("interns")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "interns"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : dark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Active Interns ({acceptedInterns.length})
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "reports"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : dark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Logbook Reports ({reports.length})
            </button>
          </div>
        </PageHeader>

        {loading && <LoadingSkeleton count={3} layout="list" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && activeTab === "interns" && (
          <>
            {acceptedInterns.length === 0 ? (
              <EmptyState
                icon={<Users size={28} />}
                title="No Placed Interns Yet"
                description="When candidate applications are updated to 'Accepted', placed interns will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedInterns.map((intern) => (
                  <div
                    key={intern.studentId}
                    className={`rounded-3xl border p-5 transition-all ${
                      dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm overflow-hidden shrink-0">
                        {intern.profilePicUrl ? (
                          <img src={intern.profilePicUrl} alt={intern.studentName} className="w-full h-full object-cover" />
                        ) : (
                          intern.studentName[0]
                        )}
                      </div>
                      <div>
                        <h4 className={`text-sm font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
                          {intern.studentName}
                        </h4>
                        <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          {intern.jobTitle}
                        </p>
                        {intern.programme && (
                          <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                          }`}>
                            {intern.programme}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !error && activeTab === "reports" && (
          <>
            {reports.length === 0 ? (
              <EmptyState
                icon={<FileText size={28} />}
                title="No Logbook Reports Submitted"
                description="Weekly progress reports submitted by placed interns will be listed here for approval."
              />
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${
                          report.status === "APPROVED"
                            ? dark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : report.status === "REJECTED"
                            ? dark ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200"
                            : dark ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {report.status}
                        </span>
                        <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        {report.title}
                      </h4>
                      <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        Submitted by <span className="font-semibold text-emerald-500">{report.studentName}</span> ({report.internshipTitle})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {report.fileUrl && (
                        <a
                          href={report.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                            dark ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <FileText size={14} /> View File
                        </a>
                      )}

                      {report.status === "PENDING" && (
                        <>
                          <button
                            disabled={updatingReportId === report.id}
                            onClick={() => updateStatus(report.id, "APPROVED")}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            disabled={updatingReportId === report.id}
                            onClick={() => updateStatus(report.id, "REJECTED")}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
