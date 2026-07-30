import React, { memo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Send,
  Building,
  Bot,
  TrendingUp,
} from "lucide-react";
import { useUniversityStats } from "../../hooks/useUniversityStats";
import { useRecruiterApprovals } from "../../hooks/useRecruiterApprovals";
import {
  StatCard,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";
import { useDashboard } from "../../context/DashboardContext";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border shadow-xl backdrop-blur-xl transition-all duration-300 ${
        dark
          ? "bg-slate-900/80 border-slate-800/80 text-white"
          : "bg-white/90 border-slate-200/80 text-slate-900"
      } ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
          dark
            ? "from-violet-500/10 via-transparent to-transparent"
            : "from-violet-100/50 via-transparent to-transparent"
        }`}
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Recruiter Approval Queue
// ─────────────────────────────────────────────────────────────────────────────

const RecruiterApprovalQueue = memo(function RecruiterApprovalQueue() {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const {
    pendingRecruiters,
    loading,
    error,
    approving,
    approveError,
    handleApprove,
    refetch,
  } = useRecruiterApprovals();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Building size={16} className="text-violet-500" aria-hidden="true" />
          Employer Verification Queue
        </h2>
        <span
          className="text-xs text-slate-500 font-bold"
          aria-live="polite"
          aria-atomic="true"
        >
          {loading ? "—" : `${pendingRecruiters.length} Pending`}
        </span>
      </div>

      {approveError && (
        <div
          className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold"
          role="alert"
        >
          {approveError.message}{" "}
          <button
            onClick={refetch}
            className="underline ml-1 cursor-pointer"
            aria-label="Retry loading recruiters"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton count={2} layout="list" />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : pendingRecruiters.length === 0 ? (
        <div
          className="py-4 text-center text-xs text-slate-500"
          aria-live="polite"
        >
          All registered employers are verified!
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="Pending recruiters">
          {pendingRecruiters.map((rec) => (
            <div
              key={rec.id}
              role="listitem"
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                dark
                  ? "bg-slate-800/40 border-slate-700/50"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <p className="text-xs font-bold">{rec.companyName}</p>
                <p className="text-[10px] text-slate-400">{rec.email ?? "—"}</p>
              </div>
              <button
                onClick={() => handleApprove(rec.id)}
                disabled={approving === rec.id}
                aria-label={`Approve ${rec.companyName}`}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-all ${
                  approving === rec.id
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {approving === rec.id ? "Approving…" : "Approve"}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function UniversityDashboard() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } =
    useUniversityStats();

  const rawName = user?.email?.split("@")[0] ?? "Admin";
  const displayName =
    "Dr. " + rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Page Header */}
        <PageHeader
          badge="S-Bridge University Portal"
          title={`Welcome back, ${displayName}! 👋`}
          description="Monitor and improve student placement success across all faculties and departments."
          actions={[
            {
              label: "Generate Placement Report",
              icon: FileSpreadsheet,
              onClick: () => {},
              variant: "primary",
              disabled: true,
              disabledReason: "Placement report generation requires a future backend endpoint. Coming soon.",
            },
            {
              label: "Send Announcement",
              icon: Send,
              onClick: () => {},
              variant: "secondary",
              disabled: true,
              disabledReason: "Announcement API is not yet available. Coming soon.",
            },
          ]}
        />

        {/* Stats Row — only backend-provided values are displayed */}
        {statsError ? (
          <ErrorState error={statsError} onRetry={refetchStats} />
        ) : statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <LoadingSkeleton count={5} layout="grid" />
          </div>
        ) : (
          <div
            className="grid grid-cols-2 lg:grid-cols-5 gap-4"
            role="region"
            aria-label="University statistics"
          >
            {/* activePlacements — from backend */}
            <StatCard
              title="Active Placements"
              value={stats.activePlacements}
              subtitle="Currently placed"
              icon={CheckCircle2}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-500"
            />
            {/* totalApplications — from backend */}
            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              subtitle="All time applications"
              icon={Briefcase}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
            {/* pendingRecruiters — from backend */}
            <StatCard
              title="Pending Recruiters"
              value={stats.pendingRecruiters}
              subtitle="Awaiting verification"
              icon={Clock}
              iconBg="bg-amber-500/10"
              iconColor="text-amber-500"
            />
            {/* totalStudents — NOT yet from backend → shows "—" */}
            <StatCard
              title="Total Enrolled"
              value={stats.totalStudents}
              subtitle="Not yet available"
              icon={Users}
              iconBg="bg-violet-500/10"
              iconColor="text-violet-500"
            />
            {/* placementRate — NOT yet from backend → shows "—" */}
            <StatCard
              title="Placement Rate"
              value={stats.placementRate}
              subtitle="Not yet available"
              icon={TrendingUp}
              iconBg="bg-purple-500/10"
              iconColor="text-purple-500"
            />
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Future Analytics Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Leaderboard — future backend feature */}
            <Card className="p-6">
              <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-violet-500" aria-hidden="true" />
                Department Placement Leaderboard
              </h2>
              <EmptyState
                icon={<TrendingUp size={28} />}
                title="Analytics Coming Soon"
                description="Department-level placement leaderboards will be available once the analytics backend is deployed."
              />
            </Card>

            {/* Regional Distribution — future backend feature */}
            <Card className="p-6">
              <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                <Briefcase size={18} className="text-violet-500" aria-hidden="true" />
                Placement Distribution by Region
              </h2>
              <EmptyState
                icon={<Briefcase size={28} />}
                title="Analytics Coming Soon"
                description="Regional placement distribution data will be available in a future release."
              />
            </Card>
          </div>

          {/* Right: Approvals & Coming-Soon Features */}
          <div className="space-y-6">
            {/* Recruiter Approval Queue — real backend data */}
            <RecruiterApprovalQueue />

            {/* AI Placement Insights — Coming Soon */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Bot size={18} className="text-violet-500" aria-hidden="true" />
                  AI Placement Insights
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  aria-label="Feature coming soon"
                >
                  Coming Soon
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                AI-powered placement prediction and SHAP explainability insights
                will be available once the ML backend pipeline is deployed.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
