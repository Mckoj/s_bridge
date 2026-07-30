import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  BarChart2,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  Download,
  FileSpreadsheet,
  FileText,
  Brain,
  Building,
  AlertTriangle,
} from "lucide-react";
import { useUniversityStats } from "../../hooks/useUniversityStats";
import {
  StatCard,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";

// ─────────────────────────────────────────────────────────────────────────────
// Card wrapper
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
      className={`p-6 rounded-3xl border shadow-xl ${
        dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Disabled export button with "Coming Soon" badge
// ─────────────────────────────────────────────────────────────────────────────

function DisabledExportButton({
  icon: Icon,
  label,
  colorClass = "",
}: {
  icon: React.ElementType;
  label: string;
  colorClass?: string;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <button
      disabled
      aria-disabled="true"
      title={`${label} — Coming soon`}
      className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 opacity-50 cursor-not-allowed ${
        dark
          ? "border-slate-800 bg-slate-900 text-slate-400"
          : "border-slate-200 bg-white text-slate-500"
      } ${colorClass}`}
    >
      <Icon size={14} aria-hidden="true" />
      {label}
      <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-500/20 text-slate-500">
        Soon
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Disabled quick-action button
// ─────────────────────────────────────────────────────────────────────────────

function QuickActionButton({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  return (
    <button
      disabled
      aria-disabled="true"
      title={`${label} — Coming soon`}
      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed ${
        dark
          ? "bg-slate-900/80 border-slate-800 text-slate-400"
          : "bg-white border-slate-200 text-slate-500"
      }`}
    >
      <Icon size={20} className="text-violet-400" aria-hidden="true" />
      <span className="text-xs font-bold">{label}</span>
      <span className="text-[9px] font-extrabold text-slate-500 bg-slate-500/10 px-1.5 py-0.5 rounded">
        Soon
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

export default function UniversityReportsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { stats, loading, error, refetch } = useUniversityStats();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <PageHeader
          badge="Executive Institutional Dashboard"
          title="Reports & Analytics"
          description="Monitor placement performance, analyze internship trends, and generate institutional reports."
          actions={[
            {
              label: "Generate Report",
              icon: FileText,
              onClick: () => {},
              variant: "primary",
              disabled: true,
              disabledReason: "Report generation requires a future backend endpoint.",
            },
          ]}
        >
          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <DisabledExportButton icon={Download} label="Export PDF" />
            <DisabledExportButton icon={FileSpreadsheet} label="Export Excel" />
            <DisabledExportButton icon={FileText} label="Export CSV" />
          </div>
        </PageHeader>

        {/* KPI Stats — only backend-provided values */}
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoadingSkeleton count={3} layout="grid" />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            role="region"
            aria-label="Key placement statistics"
          >
            <StatCard
              title="Active Placements"
              value={stats.activePlacements}
              subtitle="Currently placed students"
              icon={TrendingUp}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-500"
            />
            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              subtitle="All submitted applications"
              icon={Users}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
            <StatCard
              title="Pending Recruiters"
              value={stats.pendingRecruiters}
              subtitle="Awaiting verification"
              icon={Clock}
              iconBg="bg-amber-500/10"
              iconColor="text-amber-500"
            />
          </div>
        )}

        {/* Not-yet-available stats notice */}
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            dark
              ? "bg-slate-800/40 border-slate-700/60 text-slate-400"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
          role="note"
          aria-label="Statistics availability notice"
        >
          <AlertTriangle
            size={16}
            className="text-amber-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>
            <strong className="font-bold">Placement rate, total students, and department analytics</strong>{" "}
            are not yet returned by the backend. These statistics will appear once the
            analytics backend is deployed. No values are fabricated.
          </span>
        </div>

        {/* Analytics Charts — Coming Soon */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-base font-bold flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-violet-500" aria-hidden="true" />
              Placement Trend (Monthly)
            </h2>
            <EmptyState
              icon={<BarChart2 size={28} />}
              title="Analytics Not Yet Available"
              description="Monthly placement trend data will be available once the analytics backend is deployed."
            />
          </Card>

          <Card>
            <h2 className="text-base font-bold flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-violet-500" aria-hidden="true" />
              Placement Rate by Department
            </h2>
            <EmptyState
              icon={<TrendingUp size={28} />}
              title="Analytics Not Yet Available"
              description="Department-level placement rates will appear here once the analytics endpoint is available."
            />
          </Card>
        </div>

        {/* Company Analytics — Coming Soon */}
        <Card>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <Building size={18} className="text-violet-500" aria-hidden="true" />
            Top Recruiting Employers
          </h2>
          <EmptyState
            icon={<Building size={28} />}
            title="Employer Analytics Not Yet Available"
            description="Company recruitment analytics will be available once the reporting backend is deployed."
          />
        </Card>

        {/* Student Risk Analytics — Coming Soon */}
        <Card>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <AlertTriangle
              size={18}
              className="text-amber-500"
              aria-hidden="true"
            />
            Student Support & Intervention Metrics
          </h2>
          <EmptyState
            icon={<AlertTriangle size={28} />}
            title="Intervention Metrics Not Yet Available"
            description="At-risk student analytics require additional backend data that has not been deployed yet."
          />
        </Card>

        {/* AI Insights — Clearly labeled Coming Soon */}
        <div
          className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
            dark
              ? "bg-slate-900/80 border-purple-500/30"
              : "bg-purple-50/50 border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Brain size={20} className="text-purple-400" aria-hidden="true" />
              AI Predictive Intelligence & SHAP Explainability
            </h2>
            <span
              className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1"
              aria-label="Coming soon feature"
            >
              <Sparkles size={11} aria-hidden="true" />
              Coming Soon
            </span>
          </div>
          <p
            className={`text-xs leading-relaxed max-w-2xl ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Institutional SHAP explainability factor analysis and ML placement
            forecasts are currently in model training. Predicted placement rates,
            skill gap analysis, and AI-powered insights will be available in a
            future release.
          </p>
        </div>

        {/* Generated Reports — Coming Soon */}
        <Card>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <FileText size={18} className="text-violet-500" aria-hidden="true" />
            Generated Institutional Reports
          </h2>
          <EmptyState
            icon={<FileText size={28} />}
            title="Report Generation Coming Soon"
            description="Institutional reports will appear here once the report generation backend endpoint is available."
          />
        </Card>

        {/* Quick Actions — All disabled until backend available */}
        <section aria-labelledby="quick-actions-heading">
          <h2
            id="quick-actions-heading"
            className="text-base font-bold flex items-center gap-2 mb-4"
          >
            Administrative Quick Actions
          </h2>
          <p className={`text-xs mb-4 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            These actions will be enabled once the corresponding backend endpoints are deployed.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <QuickActionButton label="Placement Report" icon={FileText} />
            <QuickActionButton label="Department Report" icon={BarChart2} />
            <QuickActionButton label="Company Report" icon={Building} />
            <QuickActionButton label="Export Student Data" icon={Download} />
            <QuickActionButton label="Export Analytics" icon={FileSpreadsheet} />
            <QuickActionButton label="Export CSV" icon={FileText} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
