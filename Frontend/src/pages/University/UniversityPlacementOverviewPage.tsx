import DashboardLayout from "../../layouts/DashboardLayout";
import { TrendingUp, BarChart2 } from "lucide-react";
import { useUniversityStats } from "../../hooks/useUniversityStats";
import {
  StatCard,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";
import { useDashboard } from "../../context/DashboardContext";

export default function UniversityPlacementOverviewPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { stats, loading, error, refetch } = useUniversityStats();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="University Command Center"
          title="Placement Funnel & Master Overview"
          description="Real-time tracking of student placement progress. Detailed funnel analytics will be available once the analytics backend is deployed."
        />

        {/* Available stats from backend */}
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
            aria-label="Placement overview statistics"
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
              subtitle="Submitted applications"
              icon={BarChart2}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
            {/* Placement rate is not yet returned by backend */}
            <StatCard
              title="Placement Rate"
              value={stats.placementRate}
              subtitle="Not yet available from backend"
              icon={TrendingUp}
              iconBg="bg-purple-500/10"
              iconColor="text-purple-500"
            />
          </div>
        )}

        {/* Placement Funnel — requires future backend endpoint */}
        <div
          className={`p-6 rounded-3xl border shadow-xl ${
            dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}
          role="region"
          aria-label="Placement funnel"
        >
          <h2 className="font-bold text-base mb-6">
            University Master Placement Funnel
          </h2>
          <EmptyState
            icon={<TrendingUp size={28} />}
            title="Placement Funnel Analytics Coming Soon"
            description="Detailed stage-by-stage funnel data (eligible → applied → interviewed → offered → placed) requires a dedicated analytics backend endpoint that has not been deployed yet. No placeholder values are displayed."
          />
        </div>

        {/* Department breakdown — future feature */}
        <div
          className={`p-6 rounded-3xl border shadow-xl ${
            dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <h2 className="font-bold text-base mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-violet-500" aria-hidden="true" />
            Department Breakdown
          </h2>
          <EmptyState
            icon={<BarChart2 size={28} />}
            title="Department Analytics Coming Soon"
            description="Per-department placement breakdown will be available once the reporting backend is deployed."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
