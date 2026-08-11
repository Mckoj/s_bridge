import DashboardLayout from "../../layouts/DashboardLayout";
import { useRecruiterAnalytics } from "../../hooks/useRecruiterAnalytics";
import { PageHeader, LoadingSkeleton, ErrorState, StatCard } from "../../components/recruiter";
import { BarChart2, Users, CheckCircle2, Calendar, Award, Code, Briefcase } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

export default function RecruiterAnalyticsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { data, loading, error, refetch } = useRecruiterAnalytics();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Reports & Analytics"
          title="Recruitment Analytics & Funnel Insights"
          description="Real-time breakdown of application conversion funnels, skill demands, and job listing performance."
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
                title="Total Applications"
                value={data.totalApplications}
                subtitle="All candidate submissions"
                icon={Users}
                color="emerald"
              />
              <StatCard
                title="Conversion Rate"
                value={`${data.conversionRate}%`}
                subtitle="Applied to Accepted ratio"
                icon={Award}
                color="blue"
              />
              <StatCard
                title="Interviews Scheduled"
                value={data.interviewsScheduled}
                subtitle="Candidate interview meetings"
                icon={Calendar}
                color="purple"
              />
              <StatCard
                title="Active Listings"
                value={data.activeListings}
                subtitle={`Out of ${data.totalListings} total postings`}
                icon={Briefcase}
                color="amber"
              />
            </div>

            {/* Application Conversion Funnel */}
            <div
              className={`p-6 rounded-3xl border shadow-xl ${
                dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart2 className="text-emerald-500" size={20} />
                Application Conversion Funnel
              </h2>

              <div className="space-y-4">
                {[
                  { label: "Total Applications", count: data.funnel.applied, color: "bg-emerald-500" },
                  { label: "Under Review", count: data.funnel.pending + data.funnel.underReview, color: "bg-blue-500" },
                  { label: "Interviews Scheduled", count: data.funnel.interviewing, color: "bg-purple-500" },
                  { label: "Offers Accepted", count: data.funnel.accepted, color: "bg-teal-500" },
                  { label: "Rejected / Withdrawn", count: data.funnel.rejected + data.funnel.withdrawn, color: "bg-slate-500" },
                ].map((step, idx) => {
                  const max = Math.max(data.funnel.applied, 1);
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
              {/* Top Required Skills */}
              <div
                className={`p-6 rounded-3xl border shadow-xl ${
                  dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Code className="text-blue-500" size={20} />
                  Top Demanded Candidate Skills
                </h2>
                {data.topSkills.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No skills listed in active job postings yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.topSkills.map((skill, idx) => {
                      const maxCount = Math.max(...data.topSkills.map(s => s.count), 1);
                      const pct = Math.round((skill.count / maxCount) * 100);
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-28 text-xs font-semibold truncate text-emerald-400">{skill.name}</span>
                          <div className={`flex-1 h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-400 w-8 text-right">{skill.count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Job Listings Performance */}
              <div
                className={`p-6 rounded-3xl border shadow-xl ${
                  dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-purple-500" size={20} />
                  Listing Performance Breakdown
                </h2>

                {data.listingsPerformance.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No job listings found.</p>
                ) : (
                  <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto pr-1">
                    {data.listingsPerformance.map((job) => (
                      <div key={job.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{job.title}</p>
                          <p className="text-xs text-slate-400">{job.location} • {job.status}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 block">{job.applicationsCount} applicants</span>
                          <span className="text-xs text-slate-400">{job.acceptedCount} accepted</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

