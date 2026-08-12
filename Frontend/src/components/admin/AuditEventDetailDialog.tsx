import { useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { type AdminAuditEvent } from "../../services/adminService";
import { X, Shield, Clock, User, Server, Globe, FileText, CheckCircle2, AlertTriangle } from "lucide-react";

interface AuditEventDetailDialogProps {
  event: AdminAuditEvent | null;
  onClose: () => void;
}

export default function AuditEventDetailDialog({
  event,
  onClose,
}: AuditEventDetailDialogProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (event) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [event, onClose]);

  if (!event) return null;

  const cardBg = dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-2xl";
  const fieldBg = dark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-event-modal-title"
        className={`w-full max-w-2xl rounded-3xl border p-6 md:p-8 space-y-6 relative overflow-hidden transition-all max-h-[90vh] flex flex-col ${cardBg}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Shield size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {event.category}
              </span>
              <h2 id="audit-event-modal-title" className="text-xl font-bold tracking-tight mt-1">
                {event.action}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${fieldBg}`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Clock size={14} /> Date & Time
              </div>
              <p className="text-sm font-bold">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${fieldBg}`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <User size={14} /> Actor / Administrator
              </div>
              <p className="text-sm font-bold">{event.actorName}</p>
              {event.actorRole && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Role: {event.actorRole}</p>
              )}
            </div>

            {event.target && (
              <div className={`p-4 rounded-2xl border ${fieldBg}`}>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Server size={14} /> Target Resource
                </div>
                <p className="text-sm font-bold">{event.target}</p>
              </div>
            )}

            {event.status && (
              <div className={`p-4 rounded-2xl border ${fieldBg}`}>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  {event.status === "SUCCESS" ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <AlertTriangle size={14} className="text-rose-500" />
                  )}
                  Execution Status
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  event.status === "SUCCESS"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                }`}>
                  {event.status}
                </span>
              </div>
            )}

            {event.ipAddress && (
              <div className={`p-4 rounded-2xl border ${fieldBg}`}>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Globe size={14} /> IP Address
                </div>
                <p className="text-sm font-mono font-bold">{event.ipAddress}</p>
              </div>
            )}

            <div className={`p-4 rounded-2xl border ${fieldBg}`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <FileText size={14} /> Event ID
              </div>
              <p className="text-xs font-mono font-semibold break-all">{event.id}</p>
            </div>
          </div>

          {/* Details */}
          {event.details && (
            <div className={`p-4 rounded-2xl border ${fieldBg} space-y-1`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description / Details</h3>
              <p className="text-xs leading-relaxed font-medium">{event.details}</p>
            </div>
          )}

          {/* User Agent */}
          {event.userAgent && (
            <div className={`p-4 rounded-2xl border ${fieldBg} space-y-1`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">User Agent</h3>
              <p className="text-xs font-mono break-all text-slate-500 dark:text-slate-400">{event.userAgent}</p>
            </div>
          )}

          {/* Metadata JSON */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div className={`p-4 rounded-2xl border ${fieldBg} space-y-2`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Metadata</h3>
              <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            Close Detail View
          </button>
        </div>
      </div>
    </div>
  );
}
