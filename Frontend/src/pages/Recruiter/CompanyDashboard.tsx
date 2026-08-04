import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronRight,
  Clock,
  ShieldAlert,
  ArrowRight,
  FileText,
} from "lucide-react";

type RecruiterAuthUser = {
  recruiter?: {
    isApproved?: boolean;
  };
};

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const recruiterApproval = (user as (typeof user & RecruiterAuthUser) | null)?.recruiter?.isApproved;

  const rawName = user?.email?.split("@")[0] ?? "Recruiter";
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useRecruiterStats();
  const { applications, loading: appsLoading, error: appsError, refetch: refetchApps } = useRecruiterApplications();
  const { interviews, loading: interviewsLoading, error: interviewsError, createInterview, refetch: refetchInterviews } = useRecruiterInterviews();
  const { createPosting, creating } = useRecruiterInternships();

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const loading = statsLoading || appsLoading || interviewsLoading;
  const mainError = statsError || appsError || interviewsError;
  const pendingApplications = applications.filter((application) => application.status === "PENDING").length;
  const reviewingApplications = applications.filter((application) => application.status === "REVIEWING").length;
  const latestApplications = [...applications]
    .sort((first, second) => new Date(second.appliedAt).getTime() - new Date(first.appliedAt).getTime())
    .slice(0, 3);

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
          description="A focused operational overview of your hiring activity. Use the dedicated workspaces to manage listings and applications."
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

        {/* Unapproved Recruiter Warning Banner */}
        {user?.role === "RECRUITER" && recruiterApproval === false && (
          <div className={`rounded-2xl border p-4 flex items-start gap-3.5 transition-all ${
            dark ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <ShieldAlert size={20} className="shrink-0 mt-0.5 text-amber-500" />
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-sm flex items-center gap-2">
                Account Pending Verification
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  PENDING APPROVAL
                </span>
              </p>
              <p className={dark ? "text-amber-300/80" : "text-amber-700"}>
                Your recruiter profile is currently awaiting verification by a University Administrator. While pending, creating job listings, updating candidate applications, and scheduling interviews are restricted.
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !stats && (
          <LoadingSkeleton count={4} layout="grid" />
        )}

        {/* Error State */}
        {mainError && !loading && !stats && (
          <ErrorState error={mainError} onRetry={handleRefresh} />
        )}

        {/* Real Backend Statistics Row (Emerald/Green Theme Only) */}
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
              iconBg={dark ? "bg-teal-500/10" : "bg-teal-50"}
              iconColor="text-teal-500"
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
              iconBg={dark ? "bg-green-500/10" : "bg-green-50"}
              iconColor="text-green-500"
            />
          </div>
        )}

        {/* Operational snapshot — read-only. Application management belongs in its own workspace. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <section className={`rounded-3xl border p-6 shadow-xl ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`} aria-labelledby="recruiter-work-queue">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-500">Today’s focus</p>
                  <h2 id="recruiter-work-queue" className={`mt-1 text-lg font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>Recruiting work queue</h2>
                  <p className={`mt-1 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>A read-only summary of backend application data.</p>
                </div>
                <FileText size={20} className="text-emerald-500" aria-hidden="true" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <QueueMetric label="Pending review" value={pendingApplications} dark={dark} />
                <QueueMetric label="In review" value={reviewingApplications} dark={dark} />
                <QueueMetric label="Upcoming calls" value={interviews.length} dark={dark} />
              </div>

              <div className={`mt-5 border-t pt-4 ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`text-sm font-bold ${dark ? "text-slate-200" : "text-slate-700"}`}>Latest submissions</h3>
                  <button onClick={() => navigate("/dashboard/applications")} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline">Open applications <ArrowRight size={12} /></button>
                </div>
                {latestApplications.length === 0 ? (
                  <p className={`rounded-xl px-3 py-4 text-center text-xs ${dark ? "bg-slate-800/60 text-slate-400" : "bg-slate-50 text-slate-500"}`}>No applications have been received yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {latestApplications.map((application) => (
                      <li key={application.id} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${dark ? "bg-slate-800/60" : "bg-slate-50"}`}>
                        <div className="min-w-0"><p className={`truncate text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>{application.studentName}</p><p className={`truncate text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>{application.jobTitle}</p></div>
                        <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">{application.status.replace("_", " ")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => navigate("/dashboard/applications")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-colors hover:bg-emerald-700">Review applications <ArrowRight size={14} /></button>
                <button onClick={() => navigate("/dashboard/postings")} className={`rounded-xl border px-4 py-2 text-xs font-bold transition-colors ${dark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>Manage postings</button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
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

function QueueMetric({ label, value, dark }: { label: string; value: number; dark: boolean }) {
  return (
    <div className={`rounded-2xl border p-3 ${dark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"}`}>
      <p className="text-xl font-extrabold tabular-nums text-emerald-500">{value}</p>
      <p className={`mt-0.5 text-[11px] font-semibold ${dark ? "text-slate-400" : "text-slate-600"}`}>{label}</p>
    </div>
  );
}
