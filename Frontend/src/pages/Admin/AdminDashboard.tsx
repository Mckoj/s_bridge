import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminStats } from "../../hooks/useAdminStats";
import { useAdminStudents } from "../../hooks/useAdminStudents";
import { useAdminRecruiters } from "../../hooks/useAdminRecruiters";
import { useAdminReports } from "../../hooks/useAdminReports";
import { useAdminApplications } from "../../hooks/useAdminApplications";
import { useAdminInternships } from "../../hooks/useAdminInternships";
import { LoadingSkeleton, ErrorState, StatusBadge } from "../../components/admin";
import {
  Users,
  Building,
  Briefcase,
  FileText,
  TrendingUp,
  Download,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  UserCheck,
  Building2
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const navigate = useNavigate();
  const dark = theme === "dark";
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { loading: studentsLoading } = useAdminStudents();
  const { recruiters, loading: recruitersLoading } = useAdminRecruiters();
  const { reports, loading: reportsLoading } = useAdminReports();
  const { applications, loading: applicationsLoading } = useAdminApplications();
  const { loading: internshipsLoading } = useAdminInternships();

  const loading =
    statsLoading || studentsLoading || recruitersLoading || reportsLoading || applicationsLoading || internshipsLoading;

  const pendingRecruiters = useMemo(() => recruiters.filter((r) => !r.isApproved), [recruiters]);
  const pendingReports = useMemo(() => reports.filter((r) => r.status === "PENDING"), [reports]);
  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        .slice(0, 5),
    [applications]
  );

  // Top recruiters derived from application counts
  const topRecruiters = useMemo(() => {
    const map = new Map<string, number>();
    applications.forEach(a => {
      if (a.companyName) {
        map.set(a.companyName, (map.get(a.companyName) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [applications]);

  const getInitials = (name: string): string => {
    if (!name) return "SB";
    return name
      .split(" ")
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Admin User";

  const panelClass = dark
    ? "bg-slate-900/90 border-slate-800"
    : "bg-white border-slate-100";
  const mutedText = dark ? "text-slate-400" : "text-slate-500";
  const headingText = dark ? "text-white" : "text-slate-900";

  if (loading && !stats) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
          <LoadingSkeleton count={5} layout="grid" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12 font-sans">
        {/* ── Welcome Banner ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${headingText}`}>
              Welcome back, {displayName}!
            </h1>
            <p className={`text-sm mt-0.5 ${mutedText}`}>
              Here's what's happening with S-Bridge platform today.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard/reports")}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-lg shadow-purple-600/30 shrink-0"
          >
            <Download size={16} />
            Export Report
            <ChevronDown size={14} className="opacity-80" />
          </button>
        </div>

        {/* Error State */}
        {statsError && <ErrorState error={statsError} onRetry={refetchStats} />}

        {/* ── Top 5 KPI Cards ─────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {/* Card 1: Students */}
          <div className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${panelClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <Users size={22} />
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium block ${mutedText}`}>Total Students</span>
                <span className={`text-2xl font-black ${headingText}`}>
                  {stats?.totalStudents !== undefined ? stats.totalStudents.toLocaleString() : "—"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <span>↑ 12.5%</span>
              <span className={`font-normal ${mutedText}`}>from last month</span>
            </div>
          </div>

          {/* Card 2: Recruiters */}
          <div className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${panelClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Building size={22} />
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium block ${mutedText}`}>Total Recruiters</span>
                <span className={`text-2xl font-black ${headingText}`}>
                  {stats?.totalRecruiters !== undefined ? stats.totalRecruiters.toLocaleString() : "—"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <span>↑ 8.7%</span>
              <span className={`font-normal ${mutedText}`}>from last month</span>
            </div>
          </div>

          {/* Card 3: Internships */}
          <div className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${panelClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Briefcase size={22} />
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium block ${mutedText}`}>Active Internships</span>
                <span className={`text-2xl font-black ${headingText}`}>
                  {stats?.totalInternships !== undefined ? stats.totalInternships.toLocaleString() : "—"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <span>↑ 15.3%</span>
              <span className={`font-normal ${mutedText}`}>from last month</span>
            </div>
          </div>

          {/* Card 4: Applications */}
          <div className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${panelClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <FileText size={22} />
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium block ${mutedText}`}>Applications</span>
                <span className={`text-2xl font-black ${headingText}`}>
                  {stats?.totalApplications !== undefined ? stats.totalApplications.toLocaleString() : "—"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <span>↑ 18.6%</span>
              <span className={`font-normal ${mutedText}`}>from last month</span>
            </div>
          </div>

          {/* Card 5: Active Placements */}
          <div className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${panelClass}`}>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <TrendingUp size={22} />
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium block ${mutedText}`}>Active Placements</span>
                <span className={`text-2xl font-black ${headingText}`}>
                  {stats?.activePlacements !== undefined ? stats.activePlacements.toLocaleString() : "2,103"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                <span>↑ 11.4%</span>
                <span className={`font-normal ${mutedText}`}>from last month</span>
              </div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                Placement Rate: 64.7%
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Section: Overview & Recent Applications ─────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* SVG Platform Overview */}
          <div className={`flex flex-col justify-between rounded-2xl border p-6 shadow-xs lg:col-span-2 ${panelClass}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className={`text-base font-bold ${headingText}`}>Platform Overview</h2>
                <div className="mt-2 flex items-center gap-5 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                    <span className={mutedText}>Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className={mutedText}>Internships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className={mutedText}>Applications</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 focus:outline-none"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400" />
              </div>
            </div>

            <div className="mt-6 w-full h-52">
              <svg viewBox="0 0 650 200" preserveAspectRatio="none" className="w-full h-full">
                <line x1="0" y1="20" x2="650" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-800" />
                <line x1="0" y1="60" x2="650" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-800" />
                <line x1="0" y1="100" x2="650" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-800" />
                <line x1="0" y1="140" x2="650" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" className="dark:stroke-slate-800" />

                <path d="M 0 110 Q 95 110, 108 90 T 216 110 T 325 75 T 433 75 T 541 60 T 650 85" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                {[[0,110],[108,90],[216,110],[325,75],[433,75],[541,60],[650,85]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
                ))}

                <path d="M 0 150 Q 95 150, 108 135 T 216 135 T 325 115 T 433 115 T 541 100 T 650 115" fill="none" stroke="#f59e0b" strokeWidth="3" />
                {[[0,150],[108,135],[216,135],[325,115],[433,115],[541,100],[650,115]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                ))}

                <path d="M 0 180 Q 95 180, 108 170 T 216 170 T 325 155 T 433 155 T 541 140 T 650 155" fill="none" stroke="#3b82f6" strokeWidth="3" />
                {[[0,180],[108,170],[216,170],[325,155],[433,155],[541,140],[650,155]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                ))}
              </svg>
            </div>

            <div className={`mt-2 flex justify-between text-[11px] font-medium ${mutedText} px-1`}>
              <span>May 12</span>
              <span>May 13</span>
              <span>May 14</span>
              <span>May 15</span>
              <span>May 16</span>
              <span>May 17</span>
              <span>May 18</span>
            </div>
          </div>

          {/* Recent Applications List */}
          <div className={`flex flex-col justify-between rounded-2xl border p-6 shadow-xs ${panelClass}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className={`text-base font-bold ${headingText}`}>Recent Applications</h2>
              <button
                onClick={() => navigate("/admin/dashboard/applications")}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                View All
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {recentApplications.length === 0 ? (
                <div className={`p-8 text-center text-xs ${mutedText}`}>
                  No applications available.
                </div>
              ) : (
                recentApplications.map(app => (
                  <div key={app.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-xs dark:bg-purple-950/60 dark:text-purple-300">
                        {getInitials(app.studentName)}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-xs font-bold truncate ${headingText}`}>{app.studentName}</p>
                        <p className={`text-[11px] truncate ${mutedText}`}>{app.jobTitle} at {app.companyName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={app.status} />
                      <span className={`text-[10px] ${mutedText}`}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Section: Pending Approvals + Top Recruiters + System Alerts ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Approvals */}
          <div className={`rounded-2xl border p-6 shadow-xs ${panelClass}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className={`text-base font-bold ${headingText}`}>Pending Approvals</h2>
              <button onClick={() => navigate("/admin/dashboard/recruiters")} className="text-xs font-bold text-purple-600 dark:text-purple-400">View All</button>
            </div>
            <div className="mt-4 space-y-3">
              <Link to="/admin/dashboard/recruiters" className="flex items-center justify-between rounded-xl bg-slate-50/70 p-4 transition hover:bg-slate-100 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                    <UserCheck size={20} />
                  </div>
                  <span className={`text-xs font-bold ${headingText}`}>Recruiters Awaiting Approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-black ${headingText}`}>{pendingRecruiters.length}</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </Link>
              <Link to="/admin/dashboard/reports" className="flex items-center justify-between rounded-xl bg-slate-50/70 p-4 transition hover:bg-slate-100 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <FileText size={20} />
                  </div>
                  <span className={`text-xs font-bold ${headingText}`}>Reports Awaiting Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-black ${headingText}`}>{pendingReports.length}</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </Link>
            </div>
          </div>

          {/* Top Recruiters */}
          <div className={`rounded-2xl border p-6 shadow-xs ${panelClass}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className={`text-base font-bold ${headingText}`}>Top Recruiters</h2>
              <button onClick={() => navigate("/admin/dashboard/recruiters")} className="text-xs font-bold text-purple-600 dark:text-purple-400">View All</button>
            </div>
            <div className="mt-4 space-y-3">
              {topRecruiters.length === 0 ? (
                <div className={`py-6 text-center text-xs ${mutedText}`}>Top recruiter analytics are not currently available.</div>
              ) : (
                topRecruiters.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Building2 size={16} className="text-purple-600" />
                      </div>
                      <span className={`text-xs font-bold ${headingText}`}>{r.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${mutedText}`}>{r.count} Applications</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Alerts & Security Audit */}
          <div className={`rounded-2xl border p-6 shadow-xs ${panelClass}`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className={`text-base font-bold ${headingText}`}>System Alerts & Audit</h2>
              <button onClick={() => navigate("/admin/dashboard/audit-logs")} className="text-xs font-bold text-purple-600 dark:text-purple-400">System Audit Trail →</button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 dark:bg-slate-800/50">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-bold ${headingText}`}>High number of pending reports</p>
                  <p className={`text-[11px] ${mutedText} mt-0.5`}>There are {pendingReports.length} reports awaiting review.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50/70 p-3 dark:bg-slate-800/50">
                <Building2 size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-bold ${headingText}`}>System Audit Trail Status</p>
                  <p className={`text-[11px] ${mutedText} mt-0.5`}>Backend audit endpoint required. <Link to="/admin/dashboard/audit-logs" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">View System Audit Trail</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-8 flex flex-col items-center justify-between gap-2 border-t pt-6 text-[11px] font-medium ${mutedText} ${dark ? "border-slate-800" : "border-slate-100"} sm:flex-row`}>
          <span>© 2025 S-Bridge Platform. All rights reserved.</span>
          <span>Version 1.0.0</span>
        </footer>
      </div>
    </DashboardLayout>
  );
}
