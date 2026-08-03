import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminReports } from "../../hooks/useAdminReports";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState } from "../../components/admin";
import { FileText, Search, CheckCircle, XCircle, ExternalLink } from "lucide-react";

export default function AdminReportsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const { reports, loading, error, updateStatus, updatingId, refetch } = useAdminReports();

  const filtered = reports.filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.internshipTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Compliance & Logbooks"
          title="Internship Logbook Reports"
          description="Audit weekly logbooks and report approvals across all participating students."
        />

        {/* Search Bar */}
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
          dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by student name or report title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-transparent text-xs focus:outline-none ${
              dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {loading && <LoadingSkeleton count={6} layout="list" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<FileText size={32} />}
            title="No Logbook Reports Found"
            description={search ? "No reports match your search query." : "No internship logbook reports uploaded yet."}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${
            dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${
                    dark ? "border-slate-800 bg-slate-800/40 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"
                  }`}>
                    <th className="p-4">Student</th>
                    <th className="p-4">Report Title</th>
                    <th className="p-4">Internship</th>
                    <th className="p-4">File</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs">
                  {filtered.map((report) => (
                    <tr key={report.id} className={`transition-colors ${dark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                      <td className="p-4 font-bold text-white">
                        {report.studentName}
                      </td>
                      <td className={`p-4 font-semibold ${dark ? "text-slate-200" : "text-slate-700"}`}>
                        {report.title}
                      </td>
                      <td className={`p-4 ${dark ? "text-slate-300" : "text-slate-600"}`}>
                        {report.internshipTitle}
                      </td>
                      <td className="p-4">
                        {report.fileUrl ? (
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:underline"
                          >
                            <FileText size={14} /> View File <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-slate-500">No file</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                          report.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          report.status === "REJECTED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                          "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateStatus(report.id, "APPROVED")}
                            disabled={updatingId === report.id || report.status === "APPROVED"}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-30 cursor-pointer"
                            title="Approve Report"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => updateStatus(report.id, "REJECTED")}
                            disabled={updatingId === report.id || report.status === "REJECTED"}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30 cursor-pointer"
                            title="Reject Report"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
