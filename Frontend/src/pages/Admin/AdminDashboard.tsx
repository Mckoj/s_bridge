import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminStats } from "../../hooks/useAdminStats";
import { useAdminStudents } from "../../hooks/useAdminStudents";
import { useAdminRecruiters } from "../../hooks/useAdminRecruiters";
import { StatCard, PageHeader, LoadingSkeleton, ErrorState } from "../../components/admin";
import { Users, Building, Briefcase, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { students, loading: studentsLoading } = useAdminStudents();
  const { recruiters, loading: recruitersLoading, approveRecruiter, approvingId } = useAdminRecruiters();

  const loading = statsLoading || studentsLoading || recruitersLoading;

  const pendingRecruiters = recruiters.filter((r) => !r.isApproved);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="System Control Center"
          title={`Welcome back, ${user?.email?.split("@")[0] || "Admin"}! 🛡️`}
          description="Monitor platform activity, approve recruiter accounts, and manage system resources."
        />

        {loading && !stats && <LoadingSkeleton count={4} layout="grid" />}

        {statsError && !loading && !stats && (
          <ErrorState error={statsError} onRetry={refetchStats} />
        )}

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              subtitle="Registered student profiles"
              icon={Users}
              iconBg={dark ? "bg-blue-500/10" : "bg-blue-50"}
              iconColor="text-blue-500"
            />
            <StatCard
              title="Total Recruiters"
              value={stats.totalRecruiters}
              subtitle="Company employer accounts"
              icon={Building}
              iconBg={dark ? "bg-emerald-500/10" : "bg-emerald-50"}
              iconColor="text-emerald-500"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              subtitle="Awaiting recruiter verification"
              icon={ShieldAlert}
              iconBg={dark ? "bg-amber-500/10" : "bg-amber-50"}
              iconColor="text-amber-500"
            />
            <StatCard
              title="Active Listings"
              value={stats.totalInternships}
              subtitle="Published opportunities"
              icon={Briefcase}
              iconBg={dark ? "bg-rose-500/10" : "bg-rose-50"}
              iconColor="text-rose-500"
            />
          </div>
        )}

        {/* Two Columns: Pending Recruiter Approvals & Recent Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Recruiter Approvals */}
          <div className={`rounded-3xl border p-6 space-y-4 shadow-xl ${
            dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
                  Pending Recruiter Approvals
                </h3>
                <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Companies awaiting platform access verification
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {pendingRecruiters.length} Pending
              </span>
            </div>

            {pendingRecruiters.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                <p className={`text-xs font-bold ${dark ? "text-slate-300" : "text-slate-700"}`}>
                  All recruiter accounts verified!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRecruiters.slice(0, 5).map((recruiter) => (
                  <div
                    key={recruiter.id}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-3 ${
                      dark ? "bg-slate-800/60 border-slate-700/80" : "bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div>
                      <h4 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        {recruiter.companyName}
                      </h4>
                      <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {recruiter.email} {recruiter.position ? `• ${recruiter.position}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => approveRecruiter(recruiter.id)}
                      disabled={approvingId === recruiter.id}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {approvingId === recruiter.id ? "Approving..." : "Approve"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registered Students Overview */}
          <div className={`rounded-3xl border p-6 space-y-4 shadow-xl ${
            dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
                  Registered Students
                </h3>
                <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Latest student users on platform
                </p>
              </div>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto text-slate-400 mb-2" />
                <p className={`text-xs font-bold ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  No student records found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div
                    key={student.id}
                    className={`rounded-2xl border p-3.5 flex items-center justify-between ${
                      dark ? "bg-slate-800/60 border-slate-700/80" : "bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xs">
                        {student.name[0]}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                          {student.name}
                        </h4>
                        <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          {student.email} {student.programme ? `• ${student.programme}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
