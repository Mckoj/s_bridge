import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminRecruiters } from "../../hooks/useAdminRecruiters";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState } from "../../components/admin";
import { Building, Search, CheckCircle2, Clock, Mail } from "lucide-react";

export default function AdminRecruitersPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const { recruiters, loading, error, approveRecruiter, approvingId, refetch } = useAdminRecruiters();

  const filtered = recruiters.filter(
    (r) =>
      r.companyName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Employer Oversight"
          title="Recruiter Companies Roster"
          description="Manage employer accounts and review pending company verification requests."
        />

        {/* Search Bar */}
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
          dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by company name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-transparent text-xs focus:outline-none ${
              dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {loading && <LoadingSkeleton count={6} layout="grid" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<Building size={32} />}
            title="No Recruiters Found"
            description={search ? "No recruiter accounts match your search query." : "No recruiter company accounts found."}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((recruiter) => (
              <div
                key={recruiter.id}
                className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  dark ? "bg-slate-900/80 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                        {recruiter.logoUrl ? (
                          <img src={recruiter.logoUrl} alt={recruiter.companyName} className="w-full h-full object-cover" />
                        ) : (
                          recruiter.companyName[0]
                        )}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold leading-tight ${dark ? "text-white" : "text-slate-800"}`}>
                          {recruiter.companyName}
                        </h4>
                        <p className={`text-xs flex items-center gap-1 mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          <Mail size={12} /> {recruiter.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {recruiter.industry && (
                    <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      Industry: <span className="font-semibold">{recruiter.industry}</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between">
                  {recruiter.isApproved ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={12} /> APPROVED
                    </span>
                  ) : (
                    <button
                      onClick={() => approveRecruiter(recruiter.id)}
                      disabled={approvingId === recruiter.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      <Clock size={12} /> {approvingId === recruiter.id ? "Approving..." : "Approve Account"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
