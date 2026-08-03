import React from "react";
import { useDashboard } from "../../context/DashboardContext";

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  subtitle?: string;
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const displayValue = value === undefined || value === null ? "—" : value;

  return (
    <div
      className={`rounded-3xl border p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
        dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {title}
          </p>
          <p className={`text-3xl font-black mt-2 tabular-nums ${dark ? "text-white" : "text-slate-900"}`}>
            {displayValue}
          </p>
        </div>
        <div
          className={`p-3 rounded-2xl shrink-0 ${
            iconBg || (dark ? "bg-rose-500/10" : "bg-rose-50")
          }`}
        >
          <Icon size={22} className={iconColor || "text-rose-500"} />
        </div>
      </div>

      {subtitle && (
        <p className={`text-[11px] mt-4 pt-3 border-t font-medium ${
          dark ? "text-slate-400 border-slate-800" : "text-slate-500 border-slate-100"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
