import { useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
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
  FileText,
  FileSpreadsheet,
  File,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  exportAuditLogsToCSV,
  exportAuditLogsToExcel,
  exportAuditLogsToPDF,
} from "../../utils/auditExport";

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
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "excel" | "csv" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleExport = async (type: "pdf" | "excel" | "csv") => {
    if (auditLogs.length === 0) return;
    setExporting(type);
    setExportOpen(false);
    try {
      const ts = new Date().toISOString().split("T")[0];
      if (type === "csv") {
        exportAuditLogsToCSV(auditLogs, `audit-logs-${ts}.csv`);
      } else if (type === "excel") {
        await exportAuditLogsToExcel(auditLogs, `audit-logs-${ts}.xlsx`);
      } else {
        await exportAuditLogsToPDF(auditLogs, `audit-logs-${ts}.pdf`);
      }
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(null);
    }
  };

  const canExport = !isEndpointUnavailable && auditLogs.length > 0 && !loading;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Title block */}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-2">
              <Shield size={12} /> Security & Compliance
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              System Audit Trail
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track administrative actions, user permission changes, and system access security events.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={refetch}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            {/* Export Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setExportOpen((v) => !v)}
                disabled={!canExport}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer
                  ${canExport
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {exporting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                Export
                <ChevronDown size={12} className={`transition-transform ${exportOpen ? "rotate-180" : ""}`} />
              </button>

              {exportOpen && canExport && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setExportOpen(false)}
                  />
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 z-50 w-48 rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-700 shadow-2xl shadow-black/20 overflow-hidden animate-fade-in">
                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => handleExport("pdf")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <File size={15} className="text-rose-500 shrink-0" />
                        <span>Download PDF</span>
                      </button>
                      <button
                        onClick={() => handleExport("excel")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet size={15} className="text-emerald-500 shrink-0" />
                        <span>Download Excel</span>
                      </button>
                      <button
                        onClick={() => handleExport("csv")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        <FileText size={15} className="text-blue-500 shrink-0" />
                        <span>Download CSV</span>
                      </button>
                    </div>
                    <div className="px-4 py-2 border-t dark:border-slate-700">
                      <p className="text-[10px] text-slate-400">
                        {auditLogs.length} event{auditLogs.length !== 1 ? "s" : ""} will be exported
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

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
