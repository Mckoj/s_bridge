import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  Send,
  Building,
  MapPin,
  Bot
} from "lucide-react";
import {
  getUniversityStats,
  getAllStudentsForUniversity,
  getAllRecruitersForUniversity,
  approveRecruiter
} from "../../services/universityService";
import type { UniversityStats } from "../../services/universityService";

function useTheme() {
  return useDashboard().theme === "dark";
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const dark = useTheme();
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
        dark
          ? "bg-slate-900/80 border-slate-800/80 text-white"
          : "bg-white/90 border-slate-200/80 text-slate-900"
      } ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
          dark ? "from-violet-500/10 via-transparent to-transparent" : "from-violet-100/50 via-transparent to-transparent"
        }`}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  const dark = useTheme();
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <p className={`text-xs font-semibold mb-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>{title}</p>
        <p className="text-3xl font-extrabold leading-none tabular-nums">{value}</p>
        <p className={`text-[11px] font-medium mt-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{subtitle}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} shadow-sm`}>
        <Icon size={22} className={iconColor} />
      </div>
    </Card>
  );
}

export default function UniversityDashboard() {
  const { user } = useAuth();
  const dark = useTheme();

  const [stats, setStats] = useState<UniversityStats>({
    totalStudents: 0,
    studentsPlaced: 0,
    placementRate: 0,
    pending: 0,
    rejected: 0,
  });
  const [students, setStudents] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);

  const rawName = user?.email?.split("@")[0] ?? "Admin";
  const displayName = "Dr. " + rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const fetchData = async () => {
    try {
      const [statsRes, studentsRes, recruitersRes] = await Promise.allSettled([
        getUniversityStats(),
        getAllStudentsForUniversity(),
        getAllRecruitersForUniversity(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (studentsRes.status === "fulfilled") setStudents(studentsRes.value);
      if (recruitersRes.status === "fulfilled") setRecruiters(recruitersRes.value);
    } catch (err) {
      console.error("Error loading university dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRecruiter = async (recruiterId: string) => {
    try {
      await approveRecruiter(recruiterId);
      fetchData();
    } catch (err) {
      alert("Failed to approve recruiter");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Top Hero Banner */}
        <div
          className={`relative overflow-hidden rounded-[30px] border p-6 lg:p-8 shadow-2xl ${
            dark
              ? "border-violet-500/20 bg-slate-900/80"
              : "border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-violet-50/50"
          }`}
        >
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                    dark
                      ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                      : "border-violet-200 bg-violet-100/80 text-violet-700"
                  }`}
                >
                  <Sparkles size={14} />
                  S-Bridge University Portal
                </div>
                <h1 className="mt-3 text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Welcome back, {displayName}! 👋
                </h1>
                <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
                  Monitor and improve student placement success across all faculties and departments.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => alert("Exporting student placement report...")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 transition-all"
                >
                  <FileSpreadsheet size={14} />
                  Generate Placement Report
                </button>
                <button
                  onClick={() => alert("Announcement drawer opened.")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    dark
                      ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Send size={14} />
                  Send Announcement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Macro Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Enrolled"
            value={stats.totalStudents || students.length || 0}
            subtitle="Active Students"
            icon={Users}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-500"
          />
          <StatCard
            title="Students Placed"
            value={stats.studentsPlaced || 0}
            subtitle={`${stats.placementRate || 0}% Placement Rate`}
            icon={CheckCircle2}
            iconBg="bg-emerald-500/10"
            iconColor="text-emerald-500"
          />
          <StatCard
            title="Pending Review"
            value={stats.pending || 0}
            subtitle="Awaiting Approval"
            icon={Clock}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-500"
          />
          <StatCard
            title="Unplaced / Rejected"
            value={stats.rejected || 0}
            subtitle="Requires Intervention"
            icon={XCircle}
            iconBg="bg-red-500/10"
            iconColor="text-red-500"
          />
          <StatCard
            title="Top Department"
            value={stats.topDepartment?.name || "Computer Eng."}
            subtitle="82.4% Placement Rate"
            icon={Award}
            iconBg="bg-purple-500/10"
            iconColor="text-purple-500"
          />
          <StatCard
            title="Top College"
            value={stats.topCollege?.name || "Engineering"}
            subtitle="68.4% Placement Rate"
            icon={Briefcase}
            iconBg="bg-indigo-500/10"
            iconColor="text-indigo-500"
          />
        </div>

        {/* Dashboard Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Analytics & Leaderboards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Placement Leaderboard */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Award size={18} className="text-violet-500" />
                  Department Placement Leaderboard
                </h3>
                <span className={`text-xs font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>This Academic Year</span>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, name: "Computer Science", pct: 92.4, count: 240 },
                  { rank: 2, name: "Electrical & Electronic Engineering", pct: 89.1, count: 180 },
                  { rank: 3, name: "Information Technology", pct: 87.3, count: 195 },
                  { rank: 4, name: "Mechanical Engineering", pct: 83.7, count: 160 },
                  { rank: 5, name: "Civil Engineering", pct: 81.2, count: 140 },
                ].map((dept) => (
                  <div
                    key={dept.rank}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      dark ? "bg-slate-800/40 border-slate-700/50" : "bg-slate-50/80 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center text-xs">
                        #{dept.rank}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{dept.name}</p>
                        <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>{dept.count} Students Enrolled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-violet-400">{dept.pct}%</p>
                      <p className="text-[10px] text-slate-500">Placement Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Regional Distribution Heatmap Widget */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <MapPin size={18} className="text-violet-500" />
                  Placement Distribution by Region (Ghana)
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { region: "Greater Accra", pct: "72.4%" },
                  { region: "Ashanti Region", pct: "60.1%" },
                  { region: "Western Region", pct: "58.2%" },
                  { region: "Central Region", pct: "54.6%" },
                  { region: "Northern Region", pct: "41.2%" },
                ].map((r) => (
                  <div
                    key={r.region}
                    className={`p-3 rounded-2xl border text-center ${
                      dark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-100"
                    }`}
                  >
                    <p className={`text-[11px] font-bold ${dark ? "text-slate-300" : "text-slate-700"}`}>{r.region}</p>
                    <p className="mt-1 text-base font-extrabold text-violet-500">{r.pct}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Approvals & Alerts */}
          <div className="space-y-6">
            {/* At-Risk Students Alert Banner */}
            <Card className="p-6 border-red-500/30 bg-gradient-to-br from-red-900/20 via-slate-900/80 to-slate-900/80">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-400">At-Risk Students Alert</h4>
                  <p className="text-xs text-slate-300 font-semibold">42 Students Need Placement Support</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Students nearing final deadline without verified internship applications.
              </p>
            </Card>

            {/* Recruiter Approval Queue */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Building size={16} className="text-violet-500" />
                  Employer Verification Queue
                </h3>
                <span className="text-xs text-slate-500 font-bold">{recruiters.filter((r) => !r.isApproved).length} Pending</span>
              </div>

              {recruiters.filter((r) => !r.isApproved).length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-500">All registered employers are verified!</div>
              ) : (
                <div className="space-y-3">
                  {recruiters
                    .filter((r) => !r.isApproved)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                          dark ? "bg-slate-800/40 border-slate-700/50" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{rec.companyName}</p>
                          <p className="text-[10px] text-slate-400">{rec.user?.email}</p>
                        </div>
                        <button
                          onClick={() => handleApproveRecruiter(rec.id)}
                          className="px-3 py-1 rounded-xl text-[11px] font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </Card>

            {/* AI Predictive Insights Teaser */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Bot size={18} className="text-violet-500" />
                  AI Placement Insights
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  AI Feature • Coming Soon
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>Computer Science placement rate is 15% higher than last semester.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>Students with portfolio links get 49% faster recruiter responses.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
