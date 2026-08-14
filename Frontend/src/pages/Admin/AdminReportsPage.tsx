import { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminReports } from "../../hooks/useAdminReports";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState, StatusBadge } from "../../components/admin";
import { FileText, Search, CheckCircle, XCircle, ExternalLink, Download, FileSpreadsheet, ChevronDown, Loader2 } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "../../utils/exportData";

export default function AdminReportsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const { reports, loading, error, updateStatus, updatingId, refetch } = useAdminReports();
  const [exporting, setExporting] = useState<"pdf"|"excel"|"csv"|null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const buildExportRows = () => filtered.map((r) => ({
    Student: r.studentName, Title: r.title, Internship: r.internshipTitle,
    Status: r.status, "File URL": r.fileUrl ?? "",
  })) as Record<string, unknown>[];
  const exportHeaders = ["Student", "Title", "Internship", "Status", "File URL"];
  const exportKeys = ["Student", "Title", "Internship", "Status", "File URL"];

  const handleExport = async (type: "pdf"|"excel"|"csv") => {
    setExporting(type); setExportOpen(false);
    try {
      const ts = new Date().toISOString().split("T")[0];
      const rows = buildExportRows();
      if (type === "csv") exportToCSV(rows, exportHeaders, exportKeys, `logbook-reports-${ts}.csv`);
      else if (type === "excel") await exportToExcel(rows, exportHeaders, exportKeys, "Logbook Reports", `logbook-reports-${ts}.xlsx`);
      else await exportToPDF(rows, exportHeaders, exportKeys, "Internship Logbook Reports", `logbook-reports-${ts}.pdf`);
    } finally { setExporting(null); }
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return [...reports]
      .filter((r) => r.studentName.toLowerCase().includes(query) || r.title.toLowerCase().includes(query) || r.internshipTitle.toLowerCase().includes(query))
      .sort((a, b) => Number(b.status === "PENDING") - Number(a.status === "PENDING"));
  }, [reports, search]);

  const pendingCount = reports.filter((r) => r.status === "PENDING").length;
  const reviewedCount = reports.length - pendingCount;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        <PageHeader badge="Compliance & Logbooks" title="Internship Logbook Reports" description="Audit weekly logbooks and resolve the reports that still need moderator attention.">
          {/* Export Dropdown */}
          <div className="relative">
            <button onClick={() => setExportOpen(v => !v)} disabled={!filtered.length || !!exporting}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filtered.length ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}>
              {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Export <ChevronDown size={12} className={`transition-transform ${exportOpen ? "rotate-180" : ""}`} />
            </button>
            {exportOpen && !!filtered.length && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
                <div className="absolute right-0 mt-2 z-50 w-44 rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-700 shadow-2xl overflow-hidden">
                  <div className="p-1 space-y-0.5">
                    <button onClick={() => handleExport("pdf")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"><FileText size={14} className="text-rose-500" /> Download PDF</button>
                    <button onClick={() => handleExport("excel")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 cursor-pointer"><FileSpreadsheet size={14} className="text-emerald-500" /> Download Excel</button>
                    <button onClick={() => handleExport("csv")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 cursor-pointer"><FileText size={14} className="text-blue-500" /> Download CSV</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </PageHeader>

        <div className={`flex items-center gap-3 rounded-2xl border p-4 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
          <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input type="text" placeholder="Search by student, report title, or internship…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search logbook reports" className={`w-full bg-transparent text-xs focus:outline-none ${dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-2xl border p-4 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
            <p className={`text-[11px] font-extrabold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>Pending review</p>
            <p className={`mt-2 text-2xl font-bold ${dark ? "text-white" : "text-slate-800"}`}>{pendingCount}</p>
          </div>
          <div className={`rounded-2xl border p-4 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
            <p className={`text-[11px] font-extrabold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>Reviewed</p>
            <p className={`mt-2 text-2xl font-bold ${dark ? "text-white" : "text-slate-800"}`}>{reviewedCount}</p>
          </div>
        </div>

        {loading && <LoadingSkeleton count={6} layout="list" />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && <EmptyState icon={<FileText size={32} />} title="No Logbook Reports Found" description={search ? "No reports match your search query." : "No internship logbook reports uploaded yet."} />}

        {!loading && !error && filtered.length > 0 && (
          <div className={`overflow-hidden rounded-3xl border shadow-sm ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" aria-label="Logbook reports table">
                <thead>
                  <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-800/40 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                    <th scope="col" className="p-4">Student</th>
                    <th scope="col" className="p-4">Report Title</th>
                    <th scope="col" className="p-4">Internship</th>
                    <th scope="col" className="p-4">Status</th>
                    <th scope="col" className="p-4">File</th>
                    <th scope="col" className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${dark ? "divide-slate-800/40" : "divide-slate-100"}`}>
                  {filtered.map((report) => (
                    <tr key={report.id} className={`transition-colors ${dark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                      <td className={`p-4 font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{report.studentName}</td>
                      <td className={`p-4 ${dark ? "text-slate-200" : "text-slate-700"}`}>{report.title}</td>
                      <td className={`p-4 ${dark ? "text-slate-300" : "text-slate-600"}`}>{report.internshipTitle !== "Internship" ? report.internshipTitle : "—"}</td>
                      <td className="p-4"><StatusBadge status={report.status} /></td>
                      <td className="p-4">
                        {report.fileUrl ? (
                          <a href={report.fileUrl} target="_blank" rel="noreferrer" aria-label={`View file for report: ${report.title}`} className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:underline">
                            <FileText size={14} /> View <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className={dark ? "text-slate-500" : "text-slate-400"}>—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => updateStatus(report.id, "APPROVED")} disabled={updatingId === report.id || report.status === "APPROVED"} aria-label={`Approve report: ${report.title}`} className="rounded-lg p-1.5 text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-30">
                            <CheckCircle size={16} />
                          </button>
                          <button onClick={() => updateStatus(report.id, "REJECTED")} disabled={updatingId === report.id || report.status === "REJECTED"} aria-label={`Reject report: ${report.title}`} className="rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-30">
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
