import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
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
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 border flex-1 max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate name, position, or programme..."
                className="bg-transparent text-xs outline-none w-full text-slate-800 dark:text-white placeholder-slate-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border text-xs outline-none font-semibold bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
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
