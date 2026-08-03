import React from "react";
import { useDashboard } from "../../context/DashboardContext";

interface StatCardProps {
  title: string;
  /** Pass undefined to render "—" instead of a fake number */
  value: string | number | undefined;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  className = "",
}: StatCardProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const displayValue = value === undefined || value === null ? "—" : String(value);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
        dark
          ? "bg-slate-900/80 border-slate-800/80 text-white"
          : "bg-white/90 border-slate-200/80 text-slate-900"
      } ${className}`}
      role="status"
      aria-label={`${title}: ${displayValue}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
          dark
            ? "from-emerald-500/10 via-transparent to-transparent"
            : "from-emerald-100/50 via-transparent to-transparent"
        }`}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold mb-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {title}
          </p>
          <p
            className={`text-3xl font-extrabold leading-none tabular-nums ${
              value === undefined ? (dark ? "text-slate-600" : "text-slate-300") : ""
            }`}
          >
            {displayValue}
          </p>
          <p className={`text-[11px] font-medium mt-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {subtitle}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} shadow-sm`}
          aria-hidden="true"
        >
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
