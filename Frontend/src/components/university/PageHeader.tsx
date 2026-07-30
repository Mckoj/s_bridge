import React from "react";
import { useDashboard } from "../../context/DashboardContext";
import { Sparkles } from "lucide-react";

interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  /** Tooltip text shown when button is disabled */
  disabledReason?: string;
}

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
  /** Additional content rendered below the header row (e.g. search bar) */
  children?: React.ReactNode;
}

/**
 * Reusable page header banner used across all University portal pages.
 * Eliminates the repeated violet-gradient banner markup duplicated in every page.
 *
 * Usage:
 *   <PageHeader
 *     badge="Student Roster"
 *     title="Enrolled Students"
 *     description="Monitor student placement status."
 *     actions={[{ label: "Export", onClick: handleExport, icon: Download, disabled: true, disabledReason: "Coming soon" }]}
 *   >
 *     <SearchBar ... />
 *   </PageHeader>
 */
export default function PageHeader({
  badge,
  title,
  description,
  actions,
  children,
}: PageHeaderProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
        dark
          ? "bg-slate-900/80 border-violet-500/20"
          : "bg-gradient-to-br from-violet-50/90 via-white to-violet-50/50 border-violet-200/80"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          {badge && (
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                dark
                  ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                  : "border-violet-200 bg-violet-100/80 text-violet-700"
              }`}
            >
              <Sparkles size={14} aria-hidden="true" />
              {badge}
            </div>
          )}
          <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
            {title}
          </h1>
          {description && (
            <p
              className={`mt-1 text-xs lg:text-sm font-medium max-w-3xl leading-relaxed ${
                dark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions.map((action) => {
              const Icon = action.icon;
              const isPrimary =
                action.variant === "primary" || !action.variant;

              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  title={action.disabled ? action.disabledReason : undefined}
                  aria-label={action.label}
                  aria-disabled={action.disabled}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    action.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  } ${
                    isPrimary
                      ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
                      : dark
                      ? "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {Icon && <Icon size={14} aria-hidden="true" />}
                  {action.label}
                  {action.disabled && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-500/20 text-slate-400">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-6 pt-4 border-t border-slate-800/30">{children}</div>
      )}
    </div>
  );
}
