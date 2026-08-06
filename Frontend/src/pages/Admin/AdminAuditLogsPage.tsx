import DashboardLayout from "../../layouts/DashboardLayout";
import { PageHeader, EmptyState } from "../../components/admin";
import { Shield } from "lucide-react";

export default function AdminAuditLogsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Security & Compliance"
          title="System Audit Trail"
          description="Track administrative actions, user permissions changes, and system access security events."
        />

        <EmptyState
          icon={<Shield size={32} />}
          title="Audit Logging Service Under Construction"
          description="The system audit logging backend endpoint is currently under active development (HTTP 501 / NOT_IMPLEMENTED). No simulated security audit records are fabricated."
        />
      </div>
    </DashboardLayout>
  );
}
