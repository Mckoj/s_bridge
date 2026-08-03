import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useRecruiterInterviews } from "../../hooks/useRecruiterInterviews";
import { useRecruiterApplications } from "../../hooks/useRecruiterApplications";
import {
  PageHeader,
  UpcomingInterviews,
  ScheduleInterviewModal,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/recruiter";
import { Calendar, Plus } from "lucide-react";

export default function RecruiterInterviewsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [modalOpen, setModalOpen] = useState(false);

  const { interviews, loading, error, createInterview, refetch } = useRecruiterInterviews();
  const { applications } = useRecruiterApplications();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Interview Management"
          title="Scheduled Candidate Interviews"
          description="View, organize, and schedule technical and HR interview rounds with candidate applicants."
          actions={[
            {
              label: "Schedule New Interview",
              icon: Plus,
              variant: "primary",
              onClick: () => setModalOpen(true),
            },
          ]}
        />

        {loading && <LoadingSkeleton count={3} layout="list" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && interviews.length === 0 && (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No Scheduled Interviews"
            description="You have no upcoming candidate interviews scheduled."
            action={{
              label: "Schedule Interview",
              onClick: () => setModalOpen(true),
            }}
          />
        )}

        {!loading && !error && interviews.length > 0 && (
          <div className={`rounded-3xl border p-6 shadow-xl ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className={`text-base font-extrabold mb-4 ${dark ? "text-white" : "text-slate-800"}`}>
              All Scheduled Meetings ({interviews.length})
            </h3>
            <UpcomingInterviews interviews={interviews} />
          </div>
        )}

        <ScheduleInterviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          applications={applications}
          onSubmit={async (payload) => {
            await createInterview(payload);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
