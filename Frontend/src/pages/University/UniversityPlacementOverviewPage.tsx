import DashboardLayout from "../../layouts/DashboardLayout";
import { TrendingUp, BarChart2, CheckCircle2, FileText, GraduationCap } from "lucide-react";
import { useUniversityAnalytics } from "../../hooks/useUniversityAnalytics";
import {
  StatCard,
  LoadingSkeleton,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";
import { useDashboard } from "../../context/DashboardContext";

export default function UniversityPlacementOverviewPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { data, loading, error, refetch } = useUniversityAnalytics();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="University Command Center"
          title="Placement Funnel & Master Overview"
          description="Real-time tracking of student placement progress, department performance, and logbook compliance."
        />

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading || !data ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <LoadingSkeleton count={4} layout="grid" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Active Placements"
                value={data.placementFunnel.placedStudents}
                subtitle="Currently placed students"
                icon={TrendingUp}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-500"
              />
              <StatCard
                title="Placement Rate"
                value={`${data.placementFunnel.placementRate}%`}
                subtitle="Placed / Enrolled ratio"
                icon={GraduationCap}
                iconBg="bg-purple-500/10"
                iconColor="text-purple-500"
              />
              <StatCard
                title="Applied Students"
                value={data.placementFunnel.appliedStudents}
                subtitle={`Out of ${data.placementFunnel.totalStudents} total students`}
                icon={BarChart2}
                iconBg="bg-blue-500/10"
                iconColor="text-blue-500"
              />
              <StatCard
                title="Logbook Compliance"
                value={`${data.reportCompliance.complianceRate}%`}
                subtitle={`${data.reportCompliance.approvedReports} approved reports`}
                icon={FileText}
                iconBg="bg-amber-500/10"
                iconColor="text-amber-500"
              />
            </div>

            {/* Placement Funnel Progress */}
            <div
              className={`p-6 rounded-3xl border shadow-xl ${
                dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={20} />
                University Master Placement Funnel
              </h2>

              <div className="space-y-4">
                {[
                  { label: "Total Enrolled Students", count: data.placementFunnel.totalStudents, color: "bg-purple-500" },
                  { label: "Submitted Applications", count: data.placementFunnel.appliedStudents, color: "bg-blue-500" },
                  { label: "Interviewing Candidates", count: data.placementFunnel.interviewingStudents, color: "bg-amber-500" },
                  { label: "Successfully Placed", count: data.placementFunnel.placedStudents, color: "bg-emerald-500" },
                ].map((step, idx) => {
                  const max = Math.max(data.placementFunnel.totalStudents, 1);
                  const pct = Math.round((step.count / max) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={dark ? "text-slate-300" : "text-slate-700"}>{step.label}</span>
                        <span className="text-emerald-500 font-bold">{step.count} ({pct}%)</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                        <div
                          className={`h-full ${step.color} transition-all duration-500 rounded-full`}
                          style={{ width: `${Math.max(pct, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department / Programme Breakdown */}
              <div
                className={`p-6 rounded-3xl border shadow-xl ${
                  dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart2 className="text-violet-500" size={20} />
                  Academic Programme Breakdown
                </h2>

                {data.programmeBreakdown.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No programme data available.</p>
                ) : (
                  <div className="space-y-4">
                    {data.programmeBreakdown.map((prog, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className={dark ? "text-slate-200" : "text-slate-800"}>{prog.programme}</span>
                          <span className="text-purple-400 font-bold">
                            {prog.placedStudents}/{prog.totalStudents} placed ({prog.placementRate}%)
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(prog.placementRate, 3)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Logbook Progress Compliance */}
              <div
                className={`p-6 rounded-3xl border shadow-xl ${
                  dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  Student Weekly Logbook Compliance
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <p className="text-xs text-slate-400">Approved Reports</p>
                    <p className="text-2xl font-bold text-emerald-500">{data.reportCompliance.approvedReports}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <p className="text-xs text-slate-400">Pending Reviews</p>
                    <p className="text-2xl font-bold text-amber-500">{data.reportCompliance.pendingReports}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Overall Compliance Rate</span>
                    <span className="text-emerald-500 font-bold">{data.reportCompliance.complianceRate}%</span>
                  </div>
                  <div className={`w-full h-3 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(data.reportCompliance.complianceRate, 3)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

