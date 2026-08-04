import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminApplications } from "../../hooks/useAdminApplications";
import {
  PageHeader,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
  StatusBadge,
} from "../../components/admin";
import { FileText, Search, Building } from "lucide-react";

export default function AdminApplicationsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const { applications, loading, error, refetch } = useAdminApplications();

  const filtered = applications.filter(
    (a) =>
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Audit Pipeline"
          title="System Applications Directory"
          description="Audit all student placement submissions and employer application decisions."
        />

        {/* Search Bar */}
        <div
          className={`rounded-2xl border p-4 flex items-center gap-3 ${
            dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <Search size={18} className="text-slate-400 shrink-0" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by student, position, or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search applications"
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
            title="No Applications Found"
            description={
              search
                ? "No application records match your search query."
                : "No student applications found in the database."
            }
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div
            className={`rounded-3xl border overflow-hidden shadow-xl ${
              dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Applications table">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${
                      dark
                        ? "border-slate-800 bg-slate-800/40 text-slate-400"
                        : "border-slate-100 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <th scope="col" className="p-4">Student</th>
                    <th scope="col" className="p-4">Position</th>
                    <th scope="col" className="p-4">Company</th>
                    <th scope="col" className="p-4">Status</th>
                    <th scope="col" className="p-4">Applied Date</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-xs ${
                    dark ? "divide-slate-800/40" : "divide-slate-100"
                  }`}
                >
                  {filtered.map((app) => (
                    <tr
                      key={app.id}
                      className={`transition-colors ${
                        dark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="p-4">
                        <p
                          className={`font-bold ${
                            dark ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {app.studentName}
                        </p>
                        {app.programme && (
                          <p
                            className={`text-[11px] ${
                              dark ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {app.programme}
                          </p>
                        )}
                      </td>
                      <td
                        className={`p-4 font-semibold ${
                          dark ? "text-slate-200" : "text-slate-700"
                        }`}
                      >
                        {app.jobTitle}
                      </td>
                      <td
                        className={`p-4 font-medium ${
                          dark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Building size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
                          <span>{app.companyName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td
                        className={`p-4 ${
                          dark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {new Date(app.appliedAt).toLocaleDateString()}
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
