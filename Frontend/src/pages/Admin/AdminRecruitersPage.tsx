import { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminRecruiters } from "../../hooks/useAdminRecruiters";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState, StatusBadge } from "../../components/admin";
import { Building, Search, CheckCircle2, Mail } from "lucide-react";

export default function AdminRecruitersPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const { recruiters, loading, error, approveRecruiter, approvingId, refetch } = useAdminRecruiters();

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return [...recruiters]
      .filter((r) => r.companyName.toLowerCase().includes(query) || r.email.toLowerCase().includes(query) || (r.industry || "").toLowerCase().includes(query))
      .sort((a, b) => Number(a.isApproved) - Number(b.isApproved));
  }, [recruiters, search]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        <PageHeader badge="Employer Oversight" title="Recruiter Companies Roster" description="Review pending company verifications and keep the employer roster up to date." />

        <div className={`flex items-center gap-3 rounded-2xl border p-4 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
          <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search companies, contacts, or industries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search recruiter companies"
            className={`w-full bg-transparent text-xs focus:outline-none ${dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
          />
        </div>

        {loading && <LoadingSkeleton count={6} layout="list" />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState icon={<Building size={32} />} title="No Recruiters Found" description={search ? "No recruiter accounts match your search query." : "No recruiter company accounts found."} />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={`overflow-hidden rounded-3xl border shadow-sm ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" aria-label="Recruiter companies table">
                <thead>
                  <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-800/40 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                    <th scope="col" className="p-4">Company</th>
                    <th scope="col" className="p-4">Contact</th>
                    <th scope="col" className="p-4">Industry</th>
                    <th scope="col" className="p-4">Status</th>
                    <th scope="col" className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${dark ? "divide-slate-800/40" : "divide-slate-100"}`}>
                  {filtered.map((recruiter) => (
                    <tr key={recruiter.id} className={`transition-colors ${dark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-emerald-500 text-sm font-bold text-white">
                            {recruiter.logoUrl ? <img src={recruiter.logoUrl} alt={recruiter.companyName} className="h-full w-full object-cover" /> : recruiter.companyName[0]}
                          </div>
                          <div>
                            <p className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{recruiter.companyName}</p>
                            {recruiter.position && <p className={`mt-0.5 text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>{recruiter.position}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-slate-400" />
                          <span className={dark ? "text-slate-300" : "text-slate-600"}>{recruiter.email}</span>
                        </div>
                      </td>
                      <td className={`p-4 ${dark ? "text-slate-400" : "text-slate-500"}`}>{recruiter.industry || "—"}</td>
                      <td className="p-4"><StatusBadge status={recruiter.isApproved ? "APPROVED" : "PENDING"} /></td>
                      <td className="p-4 text-right">
                        {recruiter.isApproved ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-extrabold text-emerald-400">
                            <CheckCircle2 size={12} /> ACTIVE
                          </span>
                        ) : (
                          <button onClick={() => approveRecruiter(recruiter.id)} disabled={approvingId === recruiter.id} className="rounded-xl bg-amber-500 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-amber-600 disabled:opacity-50">
                            {approvingId === recruiter.id ? "Approving..." : "Approve"}
                          </button>
                        )}
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
