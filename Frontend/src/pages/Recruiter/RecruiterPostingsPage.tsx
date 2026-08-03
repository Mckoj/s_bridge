import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useRecruiterInternships } from "../../hooks/useRecruiterInternships";
import {
  PageHeader,
  PostOpportunityModal,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/recruiter";
import { Plus, Search, MapPin, Briefcase, Trash2, Calendar, Users } from "lucide-react";

export default function RecruiterPostingsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    internships,
    loading,
    error,
    createPosting,
    deletePosting,
    creating,
    refetch,
  } = useRecruiterInternships({ search });

  const filtered = internships.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.internshipType.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Internship Postings"
          title="Manage Job Listings"
          description="Create, view, and manage your company's active and archived internship opportunities."
          actions={[
            {
              label: "Create New Listing",
              icon: Plus,
              variant: "primary",
              onClick: () => setModalOpen(true),
            },
          ]}
        >
          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 border max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search postings by title, location, or type..."
              className="bg-transparent text-xs outline-none w-full text-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>
        </PageHeader>

        {loading && <LoadingSkeleton count={3} layout="grid" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No Internship Postings Found"
            description="Create your first internship listing to start receiving applications from top university candidates."
            action={{
              label: "Create Opportunity",
              onClick: () => setModalOpen(true),
            }}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl ${
                  dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {item.internshipType}
                    </span>

                    <button
                      onClick={() => deletePosting(item.id)}
                      className={`p-1.5 rounded-lg border text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer ${
                        dark ? "border-slate-800" : "border-slate-100"
                      }`}
                      title="Delete Posting"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className={`text-base font-extrabold leading-snug mb-1 ${dark ? "text-white" : "text-slate-800"}`}>
                    {item.title}
                  </h3>

                  <div className="space-y-1.5 my-3 text-xs">
                    <p className={`flex items-center gap-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                      <MapPin size={14} className="text-emerald-500" />
                      {item.location}
                    </p>
                    <p className={`flex items-center gap-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                      <Calendar size={14} className="text-blue-500" />
                      Duration: {item.duration}
                    </p>
                    {typeof item.salary === "number" && (
                      <p className={`flex items-center gap-1.5 font-bold ${dark ? "text-emerald-400" : "text-emerald-700"}`}>
                        💰 Stipend: {item.salary} / month
                      </p>
                    )}
                  </div>

                  <p className={`text-xs line-clamp-3 mb-4 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {item.description}
                  </p>

                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${dark ? "text-slate-300" : "text-slate-700"}`}>
                    <Users size={14} className="text-emerald-500" />
                    {item.applicantCount} Applicants
                  </span>

                  <span className={`text-[10px] font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    Posted {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <PostOpportunityModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={async (payload) => {
            await createPosting(payload);
          }}
          loading={creating}
        />
      </div>
    </DashboardLayout>
  );
}
