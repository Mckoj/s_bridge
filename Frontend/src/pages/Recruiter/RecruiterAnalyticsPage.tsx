import DashboardLayout from "../../layouts/DashboardLayout";
import { useRecruiterAnalytics } from "../../hooks/useRecruiterAnalytics";
import { PageHeader, EmptyState } from "../../components/recruiter";
import { BarChart2 } from "lucide-react";

export default function RecruiterAnalyticsPage() {
  const { error } = useRecruiterAnalytics();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Reports & Analytics"
          title="Recruitment Analytics & Insights"
          description="Detailed breakdown of application conversion funnels, university performance, and candidate demographics."
        />

        <EmptyState
          icon={<BarChart2 size={32} className="text-emerald-500" />}
          title="Analytics Feature Coming Soon"
          description={error.message || "Detailed recruitment analytics and department breakdowns will become available when the analytics backend endpoint is deployed."}
        />
      </div>
    </DashboardLayout>
  );
}
