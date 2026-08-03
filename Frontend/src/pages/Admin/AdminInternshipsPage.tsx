import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminInternships } from "../../hooks/useAdminInternships";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState } from "../../components/admin";
import { Briefcase, Search, Trash2, MapPin, Users } from "lucide-react";

export default function AdminInternshipsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const { internships, loading, error, deleteInternship, deletingId, refetch } = useAdminInternships();

  const filtered = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.companyName.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Listings Management"
          title="System Opportunities Roster"
          description="Review all active and historical internship listings posted across the platform."
        />

        {/* Search Bar */}
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
          dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-transparent text-xs focus:outline-none ${
              dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {loading && <LoadingSkeleton count={6} layout="grid" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<Briefcase size={32} />}
            title="No Opportunities Found"
            description={search ? "No listings match your search query." : "No internship listings found."}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  dark ? "bg-slate-900/80 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`text-sm font-bold leading-tight ${dark ? "text-white" : "text-slate-800"}`}>
                        {item.title}
                      </h4>
                      <p className={`text-xs mt-0.5 font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                        {item.companyName}
                      </p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      item.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className={`flex items-center gap-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      <MapPin size={12} /> {item.location} • {item.internshipType}
                    </p>
                    <p className={`flex items-center gap-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      <Users size={12} /> {item.applicantCount} Applicants
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between">
                  <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    Posted {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete listing "${item.title}"?`)) {
                        await deleteInternship(item.id);
                      }
                    }}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Listing"
                  >
                    <Trash2 size={16} />
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
