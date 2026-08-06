import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useRecruiterApplications } from "../../hooks/useRecruiterApplications";
import {
  PageHeader,
  RecentApplications,
  HiringPipeline,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/recruiter";
import { FileText, Search, ArrowUpDown } from "lucide-react";

export default function RecruiterApplicationsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortByMatchScore, setSortByMatchScore] = useState(false);

  const {
    applications,
    loading,
    error,
    updateStatus,
    updatingId,
    refetch,
  } = useRecruiterApplications({ sortBy: sortByMatchScore ? "matchScore" : undefined });

  const filtered = applications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      app.studentName.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      (app.programme && app.programme.toLowerCase().includes(q))
    );
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Application Pipeline"
          title="Manage Student Applications"
          description="Review student resumes, update recruitment stages, and evaluate candidate skill fit."
          actions={[
            {
              label: sortByMatchScore ? "Sorted by Match Score" : "Sort by Match Score",
              icon: ArrowUpDown,
              variant: sortByMatchScore ? "primary" : "secondary",
              onClick: () => setSortByMatchScore(!sortByMatchScore),
            },
          ]}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex max-w-md flex-1 items-center gap-2 rounded-xl border px-3 py-2 ${dark ? "border-slate-800 bg-slate-950/70" : "border-slate-200 bg-slate-50"} focus-within:border-emerald-500`}>
              <Search size={16} className={`shrink-0 ${dark ? "text-slate-400" : "text-slate-500"}`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate name, position, or programme..."
                className={`w-full bg-transparent text-xs outline-none ${dark ? "text-white placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"}`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold outline-none ${dark ? "border-slate-800 bg-slate-950/70 text-white" : "border-slate-200 bg-slate-50 text-slate-800"} focus:border-emerald-500`}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">Under Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </PageHeader>

        <HiringPipeline applications={applications} />

        {loading && <LoadingSkeleton count={4} layout="list" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<FileText size={28} />}
            title="No Applications Found"
            description="No student applications match your filter criteria or no submissions have been received yet."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <RecentApplications
            applications={filtered}
            onStatusChange={updateStatus}
            updatingId={updatingId}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
