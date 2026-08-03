import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { useRecruiterStats } from "../../hooks/useRecruiterStats";
import { useRecruiterApplications } from "../../hooks/useRecruiterApplications";
import { useRecruiterInterviews } from "../../hooks/useRecruiterInterviews";
import { useRecruiterInternships } from "../../hooks/useRecruiterInternships";
import {
  StatCard,
  PageHeader,
  HiringPipeline,
  RecentApplications,
  UpcomingInterviews,
  PostOpportunityModal,
  ScheduleInterviewModal,
  LoadingSkeleton,
  ErrorState,
} from "../../components/recruiter";
import {
  Briefcase,
  Users,
  UserCheck,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const rawName = user?.email?.split("@")[0] ?? "Recruiter";
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useRecruiterStats();
  const { applications, loading: appsLoading, error: appsError, updateStatus, updatingId, refetch: refetchApps } = useRecruiterApplications();
  const { interviews, loading: interviewsLoading, error: interviewsError, createInterview, refetch: refetchInterviews } = useRecruiterInterviews();
  const { createPosting, creating } = useRecruiterInternships();

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const loading = statsLoading || appsLoading || interviewsLoading;
  const mainError = statsError || appsError || interviewsError;

  const handleRefresh = () => {
    refetchStats();
    refetchApps();
    refetchInterviews();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Page Header */}
        <PageHeader
          badge="Company Portal"
          title={`Welcome back, ${name}! 👋`}
          description="Monitor active postings, review candidate applications, and schedule interviews."
          actions={[
            {
              label: "Post Opportunity",
              icon: Plus,
              variant: "primary",
              onClick: () => setPostModalOpen(true),
            },
            {
              label: "Schedule Interview",
              icon: Calendar,
              variant: "secondary",
              onClick: () => setScheduleModalOpen(true),
            },
          ]}
        />

        {/* Loading Skeleton */}
        {loading && !stats && (
          <LoadingSkeleton count={4} layout="grid" />
        )}

        {/* Error State */}
        {mainError && !loading && !stats && (
          <ErrorState error={mainError} onRetry={handleRefresh} />
        )}

        {/* Real Backend Statistics Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Postings"
              value={stats.totalListings}
              subtitle="Published listings"
              icon={Briefcase}
              iconBg={dark ? "bg-emerald-500/10" : "bg-emerald-50"}
              iconColor="text-emerald-500"
            />
            <StatCard
              title="Total Applicants"
              value={stats.totalApplications}
              subtitle="Submissions received"
              icon={Users}
              iconBg={dark ? "bg-blue-500/10" : "bg-blue-50"}
              iconColor="text-blue-500"
            />
            <StatCard
              title="Pending Reviews"
              value={stats.pendingReviews}
              subtitle="Awaiting action"
              icon={Clock}
              iconBg={dark ? "bg-amber-500/10" : "bg-amber-50"}
              iconColor="text-amber-500"
            />
            <StatCard
              title="Accepted Candidates"
              value={stats.acceptedCandidates}
              subtitle="Placed interns"
              icon={UserCheck}
              iconBg={dark ? "bg-purple-500/10" : "bg-purple-50"}
              iconColor="text-purple-500"
            />
          </div>
        )}

        {/* Hiring Pipeline Funnel */}
        <HiringPipeline applications={applications} />

        {/* Two Column Layout: Recent Applications & Upcoming Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
                  Recent Candidate Submissions
                </h3>
                <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Latest student applications across your listings
                </p>
              </div>
            </div>

            <RecentApplications
              applications={applications}
              onStatusChange={updateStatus}
              updatingId={updatingId}
            />
          </div>

          {/* Upcoming Interviews & AI Banner (1 Col) */}
          <div className="space-y-6">
            {/* Honest AI Insights Banner */}
            <div
              className={`rounded-3xl border p-5 relative overflow-hidden ${
                dark
                  ? "bg-slate-900/80 border-emerald-500/20"
                  : "bg-gradient-to-br from-emerald-500/5 via-white to-emerald-500/10 border-emerald-200/80"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                  AI Recruitment Insights
                </span>
                <span className="ml-auto text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Coming Soon
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Machine learning fit predictions, skill gap analysis, and candidate matching scores will become available when the AI recommendation engine is deployed.
              </p>
            </div>

            {/* Upcoming Interviews Widget */}
            <div
              className={`rounded-3xl border p-5 space-y-4 shadow-xl ${
                dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
                    Upcoming Interviews
                  </h3>
                  <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    Scheduled candidate calls
                  </p>
                </div>
                <button
                  onClick={() => setScheduleModalOpen(true)}
                  className="text-xs font-bold text-emerald-500 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Schedule <ChevronRight size={12} />
                </button>
              </div>

              <UpcomingInterviews interviews={interviews} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PostOpportunityModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        onSubmit={async (payload) => {
          await createPosting(payload);
          refetchStats();
        }}
        loading={creating}
      />

      <ScheduleInterviewModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        applications={applications}
        onSubmit={async (payload) => {
          await createInterview(payload);
          refetchInterviews();
        }}
      />
    </DashboardLayout>
  );
}
