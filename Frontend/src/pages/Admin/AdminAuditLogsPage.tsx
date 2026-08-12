import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  PageHeader,
  AuditSummaryCard,
  AuditFilters,
  AuditEventTable,
  AuditEventDetailDialog,
  ErrorState,
} from "../../components/admin";
import { useAdminAuditLogs } from "../../hooks/useAdminAuditLogs";
import { type AdminAuditEvent } from "../../services/adminService";
import {
  Shield,
  Activity,
  Lock,
  Key,
  AlertOctagon,
  Download,
  RotateCcw,
} from "lucide-react";

export default function AdminAuditLogsPage() {
  const {
    auditLogs,
    loading,
    error,
    isEndpointUnavailable,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch,
  } = useAdminAuditLogs();

  const [selectedEvent, setSelectedEvent] = useState<AdminAuditEvent | null>(null);

  // Compute metrics only if real data is returned by backend
  const hasRealData = !isEndpointUnavailable && auditLogs.length > 0;
  const totalEvents = hasRealData ? auditLogs.length : undefined;
  const adminActions = hasRealData
    ? auditLogs.filter((e) => e.category === "ADMINISTRATIVE").length
    : undefined;
  const securityEvents = hasRealData
    ? auditLogs.filter((e) => e.category === "SECURITY" || e.category === "AUTHENTICATION").length
    : undefined;
  const permissionChanges = hasRealData
    ? auditLogs.filter((e) => e.category === "PERMISSION" || e.category === "AUTHORIZATION").length
    : undefined;
  const failedAttempts = hasRealData
    ? auditLogs.filter((e) => e.status === "FAILED").length
    : undefined;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <PageHeader
          badge="Security & Compliance"
          title="System Audit Trail"
          description="Track administrative actions, user permission changes, and system access security events."
          actions={[
            {
              label: "Refresh",
              onClick: refetch,
              icon: RotateCcw,
              variant: "secondary",
            },
            {
              label: "Export",
              icon: Download,
              variant: "secondary",
              disabled: true,
              tooltip: "Export capability unavailable (Requires backend audit export endpoint)",
            },
          ]}
        />

        {/* Audit Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <AuditSummaryCard
            title="Total Events"
            value={totalEvents}
            icon={Shield}
            iconBg="bg-rose-500/10"
            iconColor="text-rose-500"
            unavailable={!hasRealData}
            subtitle="Recorded security events"
          />
          <AuditSummaryCard
            title="Admin Actions"
            value={adminActions}
            icon={Activity}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-500"
            unavailable={!hasRealData}
            subtitle="Platform configuration edits"
          />
          <AuditSummaryCard
            title="Security Events"
            value={securityEvents}
            icon={Lock}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-500"
            unavailable={!hasRealData}
            subtitle="Authentication & logins"
          />
          <AuditSummaryCard
            title="Permission Changes"
            value={permissionChanges}
            icon={Key}
            iconBg="bg-purple-500/10"
            iconColor="text-purple-500"
            unavailable={!hasRealData}
            subtitle="Role & access level updates"
          />
          <AuditSummaryCard
            title="Failed Attempts"
            value={failedAttempts}
            icon={AlertOctagon}
            iconBg="bg-red-500/10"
            iconColor="text-red-500"
            unavailable={!hasRealData}
            subtitle="Unauthorized access alerts"
          />
        </div>

        {/* Search & Filters */}
        <AuditFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onRefresh={refetch}
          disabled={isEndpointUnavailable}
        />

        {/* Main Content Area */}
        {error && !isEndpointUnavailable ? (
          <ErrorState
            error={error}
            onRetry={refetch}
          />
        ) : (
          <AuditEventTable
            events={auditLogs}
            loading={loading}
            isEndpointUnavailable={isEndpointUnavailable}
            onSelectEvent={setSelectedEvent}
            onRetry={refetch}
          />
        )}

        {/* Detail Modal */}
        <AuditEventDetailDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </div>
    </DashboardLayout>
  );
}
