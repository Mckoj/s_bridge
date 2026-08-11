import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { Building, MapPin, Sparkles, Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import EmptyState from "../../components/student/EmptyState";
import LoadingSkeleton from "../../components/student/LoadingSkeleton";
import ErrorState from "../../components/student/ErrorState";
import { useNavigate } from "react-router-dom";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentSavedJobsPage() {
  const dark = useTheme();
  const navigate = useNavigate();

  // ─── Custom hook — all fetch/remove/loading/error logic encapsulated ───
  const { savedJobs, loading, error, removingId, handleRemove, refetch } = useSavedJobs();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-blue-500/20"
              : "bg-gradient-to-br from-blue-50/90 via-white to-blue-50/50 border-blue-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : "border-blue-200 bg-blue-100/80 text-blue-700"
                }`}
              >
                <Sparkles size={14} />
                Bookmarked Listings
              </div>
              <h1 className={`mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                Saved &amp; Bookmarked Opportunities
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Access internship listings you have saved for later review and application.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton count={3} layout="grid" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : savedJobs.length === 0 ? (
          <EmptyState
            icon={<Bookmark size={32} />}
            title="No Saved Jobs Yet"
            description="You have not bookmarked any internship listings. Browse the marketplace and save opportunities you are interested in to find them here."
            action={{
              label: "Browse Opportunities",
              onClick: () => navigate("/dashboard/explore"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 ${
                  dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center" aria-hidden="true">
                      <Building size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{item.title}</h3>
                      <p className="text-xs font-semibold text-blue-400">{item.companyName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                    aria-label={`Remove ${item.title} from saved jobs`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center flex-wrap gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={13} aria-hidden="true" /> {item.location}</span>
                  {item.internshipType && <><span aria-hidden="true">•</span><span>{item.internshipType}</span></>}
                  {item.duration && <><span aria-hidden="true">•</span><span>{item.duration}</span></>}
                  {item.salary && <><span aria-hidden="true">•</span><span>{item.salary}</span></>}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => navigate(`/dashboard/internship/${item.internshipId}`)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    aria-label={`View details for ${item.title}`}
                  >
                    View Details <ExternalLink size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
