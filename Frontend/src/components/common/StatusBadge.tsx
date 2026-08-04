import { useDashboard } from "../../context/DashboardContext";

type StatusValue =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACCEPTED"
  | "REVIEWING"
  | "WITHDRAWN"
  | "OPEN"
  | "CLOSED"
  | "EXPIRED"
  | "PUBLISHED"
  | string;

interface StatusBadgeProps {
  status: StatusValue;
  /** Optional size override — defaults to "sm" */
  size?: "xs" | "sm";
}

function getStatusStyle(status: StatusValue, _dark: boolean): string {
  switch (status) {
    case "APPROVED":
    case "ACCEPTED":
    case "OPEN":
    case "PUBLISHED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "REJECTED":
    case "CLOSED":
    case "EXPIRED":
    case "WITHDRAWN":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    case "REVIEWING":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

/**
 * StatusBadge — unified status pill shared across all portals.
 *
 * Replaces duplicated inline badge class strings in:
 *   - AdminApplicationsPage
 *   - AdminReportsPage
 *   - AdminInternshipsPage
 *   - Any future page with status indicators
 */
export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const styleClass = getStatusStyle(status, dark);
  const sizeClass = size === "xs" ? "text-[10px] px-2 py-0.5" : "text-[10px] px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full border tracking-wide ${sizeClass} ${styleClass}`}
    >
      {status}
    </span>
  );
}
