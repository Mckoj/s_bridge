import { useDashboard } from "../../context/DashboardContext";
import { Search, Filter, RotateCcw, X } from "lucide-react";

export const AUDIT_CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "ADMINISTRATIVE", label: "Administrative" },
  { value: "SECURITY", label: "Security" },
  { value: "AUTHENTICATION", label: "Authentication" },
  { value: "AUTHORIZATION", label: "Authorization" },
  { value: "PERMISSION", label: "Permission" },
  { value: "USER_MANAGEMENT", label: "User Management" },
  { value: "RECRUITER_MANAGEMENT", label: "Recruiter Management" },
  { value: "UNIVERSITY_MANAGEMENT", label: "University Management" },
  { value: "INTERNSHIP_MANAGEMENT", label: "Internship Management" },
  { value: "APPLICATION_MANAGEMENT", label: "Application Management" },
  { value: "REPORT_MANAGEMENT", label: "Report Management" },
  { value: "SYSTEM", label: "System" },
];

interface AuditFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onRefresh: () => void;
  disabled?: boolean;
}

export default function AuditFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onRefresh,
  disabled = false,
}: AuditFiltersProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const cardBg = dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-xs";
  const inputBg = dark
    ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-rose-500"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-500";
  const labelColor = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`rounded-3xl border p-4 sm:p-5 space-y-4 ${cardBg}`}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={disabled}
            placeholder={disabled ? "Search disabled (backend endpoint required)" : "Search by actor, action, or target resource..."}
            className={`w-full pl-10 pr-9 py-2.5 rounded-2xl border text-xs outline-none transition-colors ${inputBg} ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
          {searchQuery && !disabled && (
            <button
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Select & Date Range Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <select
              aria-label="Filter by event category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={disabled}
              className={`w-full appearance-none px-3.5 py-2.5 pr-8 rounded-2xl border text-xs font-medium outline-none cursor-pointer transition-colors ${inputBg} ${
                disabled ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {AUDIT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className={dark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>
                  {cat.label}
                </option>
              ))}
            </select>
            <Filter size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-slate-500" : "text-slate-400"}`} />
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                aria-label="Start date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                disabled={disabled}
                className={`px-3 py-2 rounded-2xl border text-xs outline-none transition-colors ${inputBg} ${
                  disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <span className={`text-xs font-semibold ${labelColor}`}>to</span>
            <div className="relative">
              <input
                type="date"
                aria-label="End date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                disabled={disabled}
                className={`px-3 py-2 rounded-2xl border text-xs outline-none transition-colors ${inputBg} ${
                  disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            aria-label="Refresh audit logs"
            title="Refresh audit logs"
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
              dark
                ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
            }`}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
