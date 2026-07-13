import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useLocation } from "react-router-dom";
import { Hammer } from "lucide-react";

/** Generic placeholder rendered for any unimplemented dashboard sub-page */
export default function DashboardSubPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const location = useLocation();

  // "/dashboard/find-opportunities" → "Find Opportunities"
  const rawSegment = location.pathname.split("/").filter(Boolean).pop() ?? "";
  const pageName = rawSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase()) || "Page";

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5
          ${dark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-100"}`}>
          <Hammer size={26} className="text-blue-400" />
        </div>
        <h2 className={`text-xl font-extrabold mb-2 ${dark ? "text-white" : "text-slate-800"}`}>
          {pageName}
        </h2>
        <p className={`text-sm max-w-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
          This page is under construction and will be available soon. Check back later!
        </p>
      </div>
    </DashboardLayout>
  );
}
