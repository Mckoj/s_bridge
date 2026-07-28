import React from "react";
import { useDashboard } from "../../context/DashboardContext";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <div
      className={`w-full rounded-3xl border p-12 flex flex-col items-center justify-center text-center gap-4 ${
        dark
          ? "bg-slate-900/40 border-slate-800/80"
          : "bg-white border-slate-200"
      }`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
          dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
        }`}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="max-w-xs">
        <h3
          className={`text-base font-bold mb-1 ${
            dark ? "text-white" : "text-slate-800"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-xs leading-relaxed ${
            dark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {action && (
            <button
              onClick={action.onClick}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                dark
                  ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
