import { useDashboard } from "../../context/DashboardContext";
import { type AdminAuditEvent } from "../../services/adminService";
import LoadingSkeleton from "../student/LoadingSkeleton";
import { ShieldAlert, Info, Eye } from "lucide-react";

interface AuditEventTableProps {
  events: AdminAuditEvent[];
  loading: boolean;
  isEndpointUnavailable: boolean;
  onSelectEvent: (event: AdminAuditEvent) => void;
  onRetry?: () => void;
}

export default function AuditEventTable({
  events,
  loading,
  isEndpointUnavailable,
  onSelectEvent,
}: AuditEventTableProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const containerBg = dark
    ? "bg-slate-900/80 border-slate-800"
    : "bg-white border-slate-200 shadow-xs";
  const headerBg = dark ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500";
  const rowHover = dark ? "hover:bg-slate-800/50 border-slate-800/80" : "hover:bg-slate-50 border-slate-100";

  if (loading) {
    return (
      <div className={`rounded-3xl border p-6 space-y-4 ${containerBg}`}>
        <LoadingSkeleton count={5} layout="list" />
      </div>
    );
  }

  // Case B — Backend audit endpoint unavailable state
  if (isEndpointUnavailable) {
    return (
      <div className={`rounded-3xl border p-8 md:p-12 text-center space-y-6 transition-all ${containerBg}`}>
        <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shadow-lg">
          <ShieldAlert size={32} />
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Info size={14} /> Coming Soon / Backend Required
          </span>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
            System Audit Trail Unavailable
          </h2>
          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Administrative activity and security audit records are not currently exposed by the backend. This feature will become available when audit logging is implemented.
          </p>
        </div>

        <div className={`max-w-lg mx-auto p-4 rounded-2xl border text-left text-xs space-y-2 ${
          dark ? "bg-slate-950/70 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <p className="font-bold uppercase tracking-wider text-[10px] text-rose-500">Backend Roadmap Requirement</p>
          <p className="font-mono text-[11px] leading-relaxed">
            Required Endpoint: <span className="font-bold text-rose-400">GET /api/admin/audit-logs</span><br />
            Required Models: <span className="font-bold text-rose-400">AuditLog (actor, action, category, target, ipAddress, timestamp)</span>
          </p>
        </div>
      </div>
    );
  }

  // Real backend empty state
  if (events.length === 0) {
    return (
      <div className={`rounded-3xl border p-8 text-center space-y-3 ${containerBg}`}>
        <p className={`text-base font-bold ${dark ? "text-white" : "text-slate-800"}`}>
          No audit events found
        </p>
        <p className={`text-xs max-w-md mx-auto ${dark ? "text-slate-400" : "text-slate-500"}`}>
          There are currently no administrative or security events matching your selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border overflow-hidden ${containerBg}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b font-extrabold uppercase tracking-wider text-[10px] ${headerBg}`}>
              <th className="py-3.5 px-4 sm:px-6">Date & Time</th>
              <th className="py-3.5 px-4">Actor</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Target</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">IP Address</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {events.map((event) => (
              <tr key={event.id} className={`transition-colors ${rowHover}`}>
                <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                  <span className={`font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                    {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </td>
                <td className="py-4 px-4 font-semibold whitespace-nowrap">
                  {event.actorName}
                </td>
                <td className="py-4 px-4 font-bold max-w-xs truncate">
                  {event.action}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {event.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {event.target || "Not Available"}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {event.status ? (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      event.status === "SUCCESS"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}>
                      {event.status}
                    </span>
                  ) : (
                    <span className="text-slate-400">Not Available</span>
                  )}
                </td>
                <td className="py-4 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                  {event.ipAddress || "Not Available"}
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => onSelectEvent(event)}
                    aria-label={`View details for event ${event.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
