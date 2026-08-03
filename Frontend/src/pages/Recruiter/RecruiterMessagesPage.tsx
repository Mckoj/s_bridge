import DashboardLayout from "../../layouts/DashboardLayout";
import { PageHeader, EmptyState } from "../../components/recruiter";
import { MessageSquare } from "lucide-react";

export default function RecruiterMessagesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Communications"
          title="Direct Recruiter Messaging"
          description="Communicate directly with student applicants and university placement coordinators."
        />

        <div className={`rounded-3xl border p-6 shadow-xl ${"bg-white border-emerald-200/80"}`}>
          <EmptyState
            icon={<MessageSquare size={32} className="text-emerald-500" />}
            title="Direct Messaging Coming Soon"
            description="Real-time candidate messaging and university coordinator chat will become available in an upcoming backend release."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
