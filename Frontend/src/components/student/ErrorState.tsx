import { AlertTriangle, RefreshCw, WifiOff, ShieldX, Lock } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import type { ApiErrorCode, ClassifiedApiError } from "../../utils/apiErrors";
import { getErrorTitle } from "../../utils/apiErrors";

interface ErrorStateProps {
  /** A ClassifiedApiError object (preferred) or a plain string message */
  error?: ClassifiedApiError | string;
  onRetry?: () => void;
}

function getIcon(code?: ApiErrorCode) {
  switch (code) {
    case "NETWORK_ERROR":  return WifiOff;
    case "FORBIDDEN":      return ShieldX;
    case "UNAUTHORIZED":   return Lock;
    default:               return AlertTriangle;
  }
}

function getIconColor(code?: ApiErrorCode, dark?: boolean): string {
  switch (code) {
    case "NETWORK_ERROR": return dark ? "text-amber-400" : "text-amber-600";
    case "FORBIDDEN":     return dark ? "text-orange-400" : "text-orange-600";
    case "UNAUTHORIZED":  return dark ? "text-yellow-400" : "text-yellow-600";
    default:              return "text-red-400";
  }
}

function getBgColor(code?: ApiErrorCode, dark?: boolean): string {
  switch (code) {
    case "NETWORK_ERROR": return dark ? "bg-amber-950/20 border-amber-900/40" : "bg-amber-50/80 border-amber-200";
    case "FORBIDDEN":     return dark ? "bg-orange-950/20 border-orange-900/40" : "bg-orange-50/80 border-orange-200";
    case "UNAUTHORIZED":  return dark ? "bg-yellow-950/20 border-yellow-900/40" : "bg-yellow-50/80 border-yellow-200";
    default:              return dark ? "bg-red-950/20 border-red-900/40" : "bg-red-50/80 border-red-200";
  }
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  // Accept either a ClassifiedApiError or a plain string
  const classified = typeof error === "object" ? error as ClassifiedApiError : undefined;
  const code = classified?.code;

  const title = classified ? getErrorTitle(code!) : "Something Went Wrong";
  const message = classified
    ? classified.message
    : (error as string | undefined) ?? "An unexpected error occurred. Please try again.";

  const Icon = getIcon(code);
  const iconColor = getIconColor(code, dark);
  const bgColor = getBgColor(code, dark);

  // Don't show retry for permanent states like 403/401
  const showRetry = onRetry && code !== "FORBIDDEN" && code !== "UNAUTHORIZED";

  return (
    <div
      className={`w-full rounded-3xl border p-12 flex flex-col items-center justify-center text-center gap-4 ${bgColor}`}
      role="alert"
      aria-live="polite"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
        dark ? "bg-slate-800" : "bg-white/80"
      }`}>
        <Icon size={28} className={iconColor} aria-hidden="true" />
      </div>

      <div className="max-w-xs">
        <h3
          className={`text-sm font-bold mb-1 ${
            dark ? "text-slate-100" : "text-slate-800"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-xs leading-relaxed ${
            dark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {message}
        </p>
        {classified?.status && (
          <p className={`text-[10px] font-mono mt-2 ${dark ? "text-slate-600" : "text-slate-400"}`}>
            HTTP {classified.status}
          </p>
        )}
      </div>

      {showRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-all cursor-pointer"
          aria-label="Retry loading data"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Try Again
        </button>
      )}
    </div>
  );
}
