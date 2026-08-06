import React from "react";
import { useDashboard } from "../../context/DashboardContext";
import { Shield } from "lucide-react";

export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  icon?: React.ElementType;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  tooltip?: string;
}

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
}

export default function PageHeader({
  badge = "System Administration",
  title,
  description,
  actions = [],
}: PageHeaderProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-all shadow-xl ${
        dark
          ? "bg-slate-900/90 border-slate-800"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white border-slate-800"
      }`}
    >
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Shield size={14} className="text-rose-400" />
            {badge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions.map((action, idx) => {
              const ActionIcon = action.icon;
              const isPrimary = action.variant === "primary";
              const isDanger = action.variant === "danger";

              const buttonClass = action.disabled
                ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                : isPrimary
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40 shadow-lg cursor-pointer"
                : isDanger
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/40 shadow-lg cursor-pointer"
                : "bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 cursor-pointer";

              return (
                <div key={idx} className="relative group">
                  <button
                    onClick={action.disabled ? undefined : action.onClick}
                    disabled={action.disabled}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold inline-flex items-center gap-2 border transition-all duration-200 ${buttonClass}`}
                  >
                    {ActionIcon && <ActionIcon size={16} />}
                    {action.label}
                  </button>
                  {action.disabled && action.tooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-bold bg-slate-950 text-slate-200 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800 pointer-events-none shadow-xl z-20">
                      {action.tooltip}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
