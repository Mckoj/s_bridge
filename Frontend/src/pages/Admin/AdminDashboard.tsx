import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// ── Small inline chart helper ──────────────────────────────────────────────
function useSevenDaySeries(items: ({ createdAt?: string; appliedAt?: string } )[]) {
  const days: { label: string; iso: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), iso });
  }
  const counts = days.map((day) =>
    items.filter((it) => {
      const ts = (it as any).createdAt ?? (it as any).appliedAt ?? "";
      return typeof ts === "string" && ts.startsWith(day.iso);
    }).length
  );
  return { days, counts };
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardBigProps {
  title: string;
  value: string | number | undefined;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  extra?: React.ReactNode;
  dark: boolean;
}

function StatCardBig({ title, value, icon: Icon, iconBg, iconColor, extra, dark }: StatCardBigProps) {
  const displayValue = value === undefined || value === null ? "—" : value.toLocaleString();
  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col gap-3 ${
        dark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div className="flex-1 text-right">
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {title}
          </p>
          <p className={`text-2xl font-black mt-1 tabular-nums ${dark ? "text-white" : "text-slate-900"}`}>
            {displayValue}
          </p>
        </div>
      </div>
      {extra && (
        <div className={`pt-2 border-t text-[11px] ${dark ? "border-slate-800" : "border-slate-100"}`}>
          {extra}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const navigate = useNavigate();
  const dark = theme === "dark";

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { students, loading: studentsLoading } = useAdminStudents();
  const { recruiters, loading: recruitersLoading, approveRecruiter, approvingId } = useAdminRecruiters();
  const { reports, loading: reportsLoading } = useAdminReports();
  const { applications, loading: applicationsLoading } = useAdminApplications();
  const { internships, loading: internshipsLoading } = useAdminInternships();

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

  // Top recruiters by application count derived from real internship data
  const topRecruiters = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    internships.forEach((i) => {
      const existing = map.get(i.companyName);
      if (existing) {
        existing.count += i.applicantCount;
      } else {
        map.set(i.companyName, { name: i.companyName, count: i.applicantCount });
      }
    });
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [internships]);

  // 7-day series derived from backend items (createdAt) — keeps backend as source of truth
  const studentsSeries = useSevenDaySeries(students);
  const internshipsSeries = useSevenDaySeries(internships);
  const applicationsSeries = useSevenDaySeries(applications);

  // System alerts derived from real backend data
  const systemAlerts = useMemo(() => {
    const alerts: { id: string; type: "warning" | "info" | "success"; title: string; desc: string; time: string }[] = [];
    if (pendingReports.length > 0) {
      alerts.push({
        id: "pending-reports",
        type: "warning",
        title: "High number of pending reports",
        desc: `There are ${pendingReports.length} report${pendingReports.length > 1 ? "s" : ""} awaiting review`,
        time: pendingReports[0]?.createdAt ?? new Date().toISOString(),
      });
    }
    if (pendingRecruiters.length > 0) {
      alerts.push({
        id: "pending-recruiters",
        type: "info",
        title: "Recruiter approvals pending",
        desc: `${pendingRecruiters.length} recruiter${pendingRecruiters.length > 1 ? "s" : ""} awaiting verification`,
        time: pendingRecruiters[0]?.createdAt ?? new Date().toISOString(),
      });
    }
    if (students.length > 0) {
      alerts.push({
        id: "students-ok",
        type: "success",
        title: "Student registrations active",
        desc: `${students.length} student accounts registered on the platform`,
        time: students[0]?.createdAt ?? new Date().toISOString(),
      });
    }
    return alerts.slice(0, 3);
  }, [pendingReports, pendingRecruiters, students]);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Admin";

  const panelClass = dark
    ? "bg-[#0f172a] border-slate-800"
    : "bg-white border-slate-200";
  const mutedText = dark ? "text-slate-400" : "text-slate-500";
  const headingText = dark ? "text-white" : "text-slate-800";
  const rowHover = dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12">

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
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2.5 text-sm font-bold text-white transition-colors shadow-lg shadow-violet-500/20 shrink-0"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        {/* ── Loading / Error ─────────────────────────────────────────────── */}
        {loading && !stats && <LoadingSkeleton count={5} layout="grid" />}
        {statsError && !loading && !stats && (
          <ErrorState error={statsError} onRetry={refetchStats} />
        )}

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCardBig
              dark={dark}
              title="Total Students"
              value={stats.totalStudents}
              icon={Users}
              iconBg={dark ? "bg-blue-500/15" : "bg-blue-50"}
              iconColor="text-blue-500"
            />
            <StatCardBig
              dark={dark}
              title="Total Recruiters"
              value={stats.totalRecruiters}
              icon={Building}
              iconBg={dark ? "bg-emerald-500/15" : "bg-emerald-50"}
              iconColor="text-emerald-500"
            />
            <StatCardBig
              dark={dark}
              title="Active Internships"
              value={stats.totalInternships}
              icon={Briefcase}
              iconBg={dark ? "bg-amber-500/15" : "bg-amber-50"}
              iconColor="text-amber-500"
            />
            <StatCardBig
              dark={dark}
              title="Applications"
              value={stats.totalApplications}
              icon={FileText}
              iconBg={dark ? "bg-violet-500/15" : "bg-violet-50"}
              iconColor="text-violet-500"
            />
            {stats.activePlacements !== undefined ? (
              <StatCardBig
                dark={dark}
                title="Active Placements"
                value={stats.activePlacements}
                icon={TrendingUp}
                iconBg={dark ? "bg-rose-500/15" : "bg-rose-50"}
                iconColor="text-rose-500"
                extra={
                  stats.placementRate !== undefined ? (
                    <span className="font-bold text-violet-500">
                      Placement Rate: {stats.placementRate.toFixed(1)}%
                    </span>
                  ) : null
                }
              />
            ) : (
              <StatCardBig
                dark={dark}
                title="Pending Approvals"
                value={stats.pendingApprovals}
                icon={Clock}
                iconBg={dark ? "bg-rose-500/15" : "bg-rose-50"}
                iconColor="text-rose-500"
              />
            )}
          </div>
        )}

        {/* ── Main Grid (Chart left, stacked cards on right) ─────────────── */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">

          {/* LEFT: Platform Overview (SVG chart) */}
          <div className={`rounded-2xl border shadow-sm p-5 ${panelClass}`}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className={`text-sm font-extrabold ${headingText}`}>Platform Overview</h3>
                <p className={`text-xs mt-1 ${mutedText}`}>Students · Internships · Applications</p>
              </div>
              <div>
                <select className={`text-xs rounded-md px-2 py-1 ${dark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}>
                  <option>Last 7 Days</option>
                </select>
              </div>
            </div>

            {/* Simple SVG sparkline chart built from backend timestamps */}
            <div className="w-full h-44">
              <svg viewBox="0 0 700 220" preserveAspectRatio="none" className="w-full h-full">
                {/* Background grid lines */}
                <g opacity="0.04" stroke={dark ? "#ffffff" : "#000000"}>
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1={0} y1={(i * 55).toString()} x2={700} y2={(i * 55).toString()} />
                  ))}
                </g>
                {/* Lines: students (blue), internships (amber), applications (violet) */}
                {(() => {
                  const max = Math.max(...studentsSeries.counts, ...internshipsSeries.counts, ...applicationsSeries.counts, 1);
                  const wStep = 700 / (studentsSeries.counts.length - 1 || 1);
                  const toPath = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * wStep} ${220 - (v / max) * 200}`).join(' ');
                  return (
                    <g fill="none" strokeWidth={2} strokeLinecap="round">
                      <path d={toPath(studentsSeries.counts)} stroke="#6366F1" strokeOpacity={0.9} />
                      <path d={toPath(internshipsSeries.counts)} stroke="#F59E0B" strokeOpacity={0.9} />
                      <path d={toPath(applicationsSeries.counts)} stroke="#A78BFA" strokeOpacity={0.9} />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#6366F1] rounded-sm" /> <span className="text-xs">Students</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#F59E0B] rounded-sm" /> <span className="text-xs">Internships</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#A78BFA] rounded-sm" /> <span className="text-xs">Applications</span></div>
            </div>
          </div>

          {/* RIGHT: stack Recent Applications + System Alerts */}
          <div className="flex flex-col gap-6">
            {/* Recent Applications (top) */}
            <div className={`rounded-2xl border shadow-sm ${panelClass}`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <h3 className={`text-sm font-extrabold ${headingText}`}>Recent Applications</h3>
                <button
                  onClick={() => navigate("/admin/dashboard/applications")}
                  className={`text-xs font-semibold ${dark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"} transition-colors`}
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {applicationsLoading ? (
                  <div className="p-5">
                    <LoadingSkeleton count={3} layout="list" />
                  </div>
                ) : recentApplications.length === 0 ? (
                  <div className={`p-8 text-center text-sm ${mutedText}`}>
                    No recent applications.
                  </div>
                ) : (
                  recentApplications.map((app) => {
                    const initials = getInitials(app.studentName);
                    const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500"];
                    const colorIdx = app.studentName.charCodeAt(0) % colors.length;
                    return (
                      <div key={app.id} className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${rowHover}`}>
                        <div className={`w-9 h-9 rounded-full ${colors[colorIdx]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold truncate ${headingText}`}>{app.studentName}</p>
                          <p className={`text-[11px] truncate ${mutedText}`}>
                            {app.jobTitle} at {app.companyName}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StatusBadge status={app.status} />
                          <span className={`text-[10px] ${mutedText}`}>{relativeTime(app.appliedAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* System Alerts (bottom) */}
            <div className={`rounded-2xl border shadow-sm ${panelClass}`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <h3 className={`text-sm font-extrabold ${headingText}`}>System Alerts</h3>
                <button
                  onClick={() => navigate("/admin/dashboard/reports")}
                  className={`text-xs font-semibold ${dark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"} transition-colors`}
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {systemAlerts.length === 0 ? (
                  <div className={`p-8 text-center text-sm ${mutedText}`}>
                    <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500" />
                    All systems operating normally.
                  </div>
                ) : (
                  systemAlerts.map((alert) => {
                    const Icon =
                      alert.type === "warning"
                        ? AlertTriangle
                        : alert.type === "success"
                        ? CheckCircle2
                        : Info;
                    const iconColor =
                      alert.type === "warning"
                        ? "text-amber-500"
                        : alert.type === "success"
                        ? "text-emerald-500"
                        : "text-blue-500";
                    const iconBg =
                      alert.type === "warning"
                        ? dark ? "bg-amber-500/10" : "bg-amber-50"
                        : alert.type === "success"
                        ? dark ? "bg-emerald-500/10" : "bg-emerald-50"
                        : dark ? "bg-blue-500/10" : "bg-blue-50";

                    return (
                      <div key={alert.id} className={`flex items-start gap-3 px-5 py-4 transition-colors ${rowHover}`}>
                        <div className={`p-1.5 rounded-lg shrink-0 ${iconBg}`}>
                          <Icon size={14} className={iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${headingText}`}>{alert.title}</p>
                          <p className={`text-[11px] mt-0.5 ${mutedText}`}>{alert.desc}</p>
                        </div>
                        <span className={`text-[10px] shrink-0 ${mutedText}`}>{relativeTime(alert.time)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Grid (3 columns) ───────────────────────────────────── */}
        <div className="grid gap-6 xl:grid-cols-3">

          {/* Pending Approvals ───────────────────────────────────────────── */}
          <div className={`rounded-2xl border shadow-sm ${panelClass}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
              <h3 className={`text-sm font-extrabold ${headingText}`}>Pending Approvals</h3>
              <button
                onClick={() => navigate("/admin/dashboard/recruiters")}
                className={`text-xs font-semibold ${dark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"} transition-colors`}
              >
                View All
              </button>
            </div>

            <div className="p-3 space-y-2">
              {/* Recruiters Awaiting Approval */}
              <button
                onClick={() => navigate("/admin/dashboard/recruiters")}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  dark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${dark ? "bg-violet-500/10" : "bg-violet-50"}`}>
                  <Building size={15} className="text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${headingText}`}>Recruiters Awaiting Approval</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-sm font-black ${dark ? "text-white" : "text-slate-800"}`}>
                    {recruitersLoading ? "…" : pendingRecruiters.length}
                  </span>
                  <ChevronRight size={14} className={mutedText} />
                </div>
              </button>

              {/* Reports Awaiting Review */}
              <button
                onClick={() => navigate("/admin/dashboard/reports")}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  dark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${dark ? "bg-amber-500/10" : "bg-amber-50"}`}>
                  <FileText size={15} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${headingText}`}>Reports Awaiting Review</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-sm font-black ${dark ? "text-white" : "text-slate-800"}`}>
                    {reportsLoading ? "…" : pendingReports.length}
                  </span>
                  <ChevronRight size={14} className={mutedText} />
                </div>
              </button>

              {/* Internships Awaiting Review */}
              <button
                onClick={() => navigate("/admin/dashboard/internships")}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  dark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${dark ? "bg-blue-500/10" : "bg-blue-50"}`}>
                  <Briefcase size={15} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${headingText}`}>Internships Awaiting Review</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-sm font-black ${dark ? "text-white" : "text-slate-800"}`}>
                    {internshipsLoading ? "…" : internships.filter((i) => i.status === "OPEN").length}
                  </span>
                  <ChevronRight size={14} className={mutedText} />
                </div>
              </button>

              {/* Quick Approve pending recruiters inline */}
              {pendingRecruiters.slice(0, 2).map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    dark ? "border-slate-800 bg-slate-800/30" : "border-slate-100 bg-slate-50/80"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                    {r.companyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-semibold truncate ${headingText}`}>{r.companyName}</p>
                    <p className={`text-[10px] truncate ${mutedText}`}>{r.email}</p>
                  </div>
                  <button
                    onClick={() => approveRecruiter(r.id)}
                    disabled={approvingId === r.id}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[10px] font-bold text-white transition-colors disabled:opacity-50 shrink-0"
                  >
                    {approvingId === r.id ? "…" : "Approve"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Recruiters ─────────────────────────────────────────────── */}
          <div className={`rounded-2xl border shadow-sm ${panelClass}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
              <h3 className={`text-sm font-extrabold ${headingText}`}>Top Recruiters</h3>
              <button
                onClick={() => navigate("/admin/dashboard/recruiters")}
                className={`text-xs font-semibold ${dark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"} transition-colors`}
              >
                View All
              </button>
            </div>

            <div className="p-3 space-y-1">
              {internshipsLoading ? (
                <LoadingSkeleton count={4} layout="list" />
              ) : topRecruiters.length === 0 ? (
                <p className={`text-center text-xs p-6 ${mutedText}`}>No internship data available.</p>
              ) : (
                topRecruiters.map((r, idx) => {
                  const colors = [
                    "bg-violet-500",
                    "bg-blue-500",
                    "bg-emerald-500",
                    "bg-amber-500",
                    "bg-rose-500",
                  ];
                  return (
                    <div
                      key={r.name}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${rowHover}`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${colors[idx % colors.length]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                        {r.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${headingText}`}>{r.name}</p>
                      </div>
                      <span className={`text-[11px] font-bold tabular-nums shrink-0 ${mutedText}`}>
                        {r.count} {r.count === 1 ? "Application" : "Applications"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Stats Summary ─────────────────────────────────────────── */}
          <div className={`rounded-2xl border shadow-sm ${panelClass}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
              <h3 className={`text-sm font-extrabold ${headingText}`}>Platform Summary</h3>
            </div>

            <div className="p-5 space-y-4">
              {[
                {
                  label: "Total Students",
                  value: stats?.totalStudents,
                  color: "bg-blue-500",
                  max: Math.max(stats?.totalStudents ?? 1, 1),
                },
                {
                  label: "Total Recruiters",
                  value: stats?.totalRecruiters,
                  color: "bg-emerald-500",
                  max: Math.max(stats?.totalStudents ?? 1, 1),
                },
                {
                  label: "Active Internships",
                  value: stats?.totalInternships,
                  color: "bg-amber-500",
                  max: Math.max(stats?.totalStudents ?? 1, 1),
                },
                {
                  label: "Applications",
                  value: stats?.totalApplications,
                  color: "bg-violet-500",
                  max: Math.max(stats?.totalApplications ?? 1, 1),
                },
              ].map((item) => {
                const pct =
                  item.max > 0 && item.value !== undefined
                    ? Math.min(100, Math.round((item.value / item.max) * 100))
                    : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-medium ${mutedText}`}>{item.label}</span>
                      <span className={`text-xs font-bold tabular-nums ${dark ? "text-white" : "text-slate-800"}`}>
                        {item.value?.toLocaleString() ?? "—"}
                      </span>
                    </div>
                    <div className={`h-1.5 rounded-full ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {stats?.placementRate !== undefined && (
                <div className={`mt-4 pt-4 border-t ${dark ? "border-slate-800" : "border-slate-100"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${mutedText}`}>Placement Rate</span>
                    <span className="text-xs font-black text-violet-500">
                      {stats.placementRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className={`flex items-center justify-between text-[11px] pt-2 ${mutedText}`}>
          <span>© 2025 S-Bridge Platform. All rights reserved.</span>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
