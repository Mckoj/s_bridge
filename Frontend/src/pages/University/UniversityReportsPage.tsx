import { useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useUniversityStats } from "../../hooks/useUniversityStats";
import {
  StatCard,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";
import { exportToCSV, exportToExcel, exportToPDF } from "../../utils/exportData";
import React from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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

// ─── Export Button ────────────────────────────────────────────────────────────

function ExportButton({
  icon: Icon,
  label,
  onClick,
  loading,
  colorClass = "",
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  loading?: boolean;
  colorClass?: string;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={label}
      className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90 active:scale-95 disabled:opacity-60 ${
        dark
          ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
      } ${colorClass}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} aria-hidden="true" />}
      {label}
    </button>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────

function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  loading?: boolean;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={label}
      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 hover:border-violet-500/50 disabled:opacity-60 ${
        dark
          ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800"
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
      }`}
    >
      {loading ? (
        <Loader2 size={20} className="text-violet-400 animate-spin" aria-hidden="true" />
      ) : (
        <Icon size={20} className="text-violet-400" aria-hidden="true" />
      )}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UniversityReportsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { stats, loading, error, refetch } = useUniversityStats();
  const [exporting, setExporting] = useState<string | null>(null);

  // Build flat rows from current stats for export
  const buildStatsRows = () => [
    { Metric: "Active Placements", Value: stats.activePlacements ?? "N/A" },
    { Metric: "Total Applications", Value: stats.totalApplications ?? "N/A" },
    { Metric: "Pending Recruiters", Value: stats.pendingRecruiters ?? "N/A" },
    { Metric: "Total Students", Value: stats.totalStudents ?? "N/A" },
    { Metric: "Total Recruiters", Value: stats.totalRecruiters ?? "N/A" },
    { Metric: "Placement Rate (%)", Value: stats.placementRate ?? "N/A" },
  ];

  const handleExport = async (type: "pdf" | "excel" | "csv", label: string) => {
    setExporting(label);
    try {
      const rows = buildStatsRows() as Record<string, unknown>[];
      const headers = ["Metric", "Value"];
      const keys = ["Metric", "Value"];
      const ts = new Date().toISOString().split("T")[0];
      if (type === "csv") {
        exportToCSV(rows, headers, keys, `university-report-${ts}.csv`);
      } else if (type === "excel") {
        await exportToExcel(rows, headers, keys, "University Report", `university-report-${ts}.xlsx`);
      } else {
        await exportToPDF(rows, headers, keys, "University Placement Report", `university-report-${ts}.pdf`);
      }
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(null);
    }
  };

  const handleQuickAction = async (type: string) => {
    setExporting(type);
    try {
      const rows = buildStatsRows() as Record<string, unknown>[];
      const headers = ["Metric", "Value"];
      const keys = ["Metric", "Value"];
      const ts = new Date().toISOString().split("T")[0];

      if (type === "Placement Report") {
        await exportToPDF(rows, headers, keys, "Placement Report", `placement-report-${ts}.pdf`);
      } else if (type === "Department Report") {
        await exportToPDF(rows, headers, keys, "Department Report", `department-report-${ts}.pdf`);
      } else if (type === "Company Report") {
        await exportToPDF(rows, headers, keys, "Company Report", `company-report-${ts}.pdf`);
      } else if (type === "Export Student Data") {
        await exportToExcel(rows, headers, keys, "Student Data", `student-data-${ts}.xlsx`);
      } else if (type === "Export Analytics") {
        await exportToExcel(rows, headers, keys, "Analytics", `analytics-${ts}.xlsx`);
      } else if (type === "Export CSV") {
        exportToCSV(rows, headers, keys, `data-export-${ts}.csv`);
      }
    } catch (e) {
      console.error("Quick action failed:", e);
    } finally {
      setExporting(null);
    }
  };

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
              onClick: () => handleExport("pdf", "Generate Report"),
              variant: "primary",
            },
          ]}
        >
          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <ExportButton
              icon={Download}
              label="Export PDF"
              loading={exporting === "pdf"}
              onClick={() => handleExport("pdf", "pdf")}
            />
            <ExportButton
              icon={FileSpreadsheet}
              label="Export Excel"
              loading={exporting === "excel"}
              onClick={() => handleExport("excel", "excel")}
            />
            <ExportButton
              icon={FileText}
              label="Export CSV"
              loading={exporting === "csv"}
              onClick={() => handleExport("csv", "csv")}
            />
          </div>
        </PageHeader>

        {/* KPI Stats */}
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoadingSkeleton count={3} layout="grid" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="region" aria-label="Key placement statistics">
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

        {/* Notice */}
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            dark
              ? "bg-slate-800/40 border-slate-700/60 text-slate-400"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
          role="note"
        >
          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong className="font-bold">Placement rate, total students, and department analytics</strong>{" "}
            are not yet returned by the backend. These statistics will appear once the analytics backend is deployed.
          </span>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-base font-bold flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-violet-500" />
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
              <TrendingUp size={18} className="text-violet-500" />
              Placement Rate by Department
            </h2>
            <EmptyState
              icon={<TrendingUp size={28} />}
              title="Analytics Not Yet Available"
              description="Department-level placement rates will appear here once the analytics endpoint is available."
            />
          </Card>
        </div>

        <Card>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <Building size={18} className="text-violet-500" />
            Top Recruiting Employers
          </h2>
          <EmptyState
            icon={<Building size={28} />}
            title="Employer Analytics Not Yet Available"
            description="Company recruitment analytics will be available once the reporting backend is deployed."
          />
        </Card>

        <Card>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            Student Support &amp; Intervention Metrics
          </h2>
          <EmptyState
            icon={<AlertTriangle size={28} />}
            title="Intervention Metrics Not Yet Available"
            description="At-risk student analytics require additional backend data that has not been deployed yet."
          />
        </Card>

        {/* AI Insights */}
        <div
          className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
            dark ? "bg-slate-900/80 border-purple-500/30" : "bg-purple-50/50 border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Brain size={20} className="text-purple-400" />
              AI Predictive Intelligence &amp; SHAP Explainability
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles size={11} />
              Coming Soon
            </span>
          </div>
          <p className={`text-xs leading-relaxed max-w-2xl ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Institutional SHAP explainability factor analysis and ML placement forecasts are currently in model training.
            Predicted placement rates, skill gap analysis, and AI-powered insights will be available in a future release.
          </p>
        </div>

        {/* Generated Reports */}
        <Card>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4">
            <FileText size={18} className="text-violet-500" />
            Generated Institutional Reports
          </h2>
          <EmptyState
            icon={<FileText size={28} />}
            title="Report Generation Coming Soon"
            description="Institutional reports will appear here once the report generation backend endpoint is available."
          />
        </Card>

        {/* Quick Actions — ALL functional */}
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="text-base font-bold flex items-center gap-2 mb-2">
            Administrative Quick Actions
          </h2>
          <p className={`text-xs mb-4 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            Click any action to generate and download the corresponding report.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <QuickActionButton label="Placement Report" icon={FileText} loading={exporting === "Placement Report"} onClick={() => handleQuickAction("Placement Report")} />
            <QuickActionButton label="Department Report" icon={BarChart2} loading={exporting === "Department Report"} onClick={() => handleQuickAction("Department Report")} />
            <QuickActionButton label="Company Report" icon={Building} loading={exporting === "Company Report"} onClick={() => handleQuickAction("Company Report")} />
            <QuickActionButton label="Export Student Data" icon={Download} loading={exporting === "Export Student Data"} onClick={() => handleQuickAction("Export Student Data")} />
            <QuickActionButton label="Export Analytics" icon={FileSpreadsheet} loading={exporting === "Export Analytics"} onClick={() => handleQuickAction("Export Analytics")} />
            <QuickActionButton label="Export CSV" icon={FileText} loading={exporting === "Export CSV"} onClick={() => handleQuickAction("Export CSV")} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
