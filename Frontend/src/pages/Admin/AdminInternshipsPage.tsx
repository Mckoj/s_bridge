import { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminInternships } from "../../hooks/useAdminInternships";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState, ConfirmDialog, StatusBadge } from "../../components/admin";
import { Briefcase, Search, Trash2, MapPin, Users } from "lucide-react";

export default function AdminInternshipsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { internships, loading, error, deleteInternship, deletingId, refetch } = useAdminInternships();

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return internships.filter((i) => i.title.toLowerCase().includes(query) || i.companyName.toLowerCase().includes(query) || i.location.toLowerCase().includes(query));
  }, [internships, search]);

  const pendingInternship = internships.find((i) => i.id === pendingDeleteId);

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    await deleteInternship(pendingDeleteId);
    setPendingDeleteId(null);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        <PageHeader badge="Listings Management" title="System Opportunities Roster" description="Monitor internship postings and remove any listings that should not remain live." />

        <div className={`flex items-center gap-3 rounded-2xl border p-4 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
          <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input type="text" placeholder="Search by job title, company, or location…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search internship listings" className={`w-full bg-transparent text-xs focus:outline-none ${dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`} />
        </div>

        {loading && <LoadingSkeleton count={6} layout="list" />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && <EmptyState icon={<Briefcase size={32} />} title="No Opportunities Found" description={search ? "No listings match your search query." : "No internship listings found."} />}

        {!loading && !error && filtered.length > 0 && (
          <div className={`overflow-hidden rounded-3xl border shadow-sm ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" aria-label="Internship listings table">
                <thead>
                  <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-800/40 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                    <th scope="col" className="p-4">Title</th>
                    <th scope="col" className="p-4">Company</th>
                    <th scope="col" className="p-4">Location</th>
                    <th scope="col" className="p-4">Status</th>
                    <th scope="col" className="p-4">Applicants</th>
                    <th scope="col" className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${dark ? "divide-slate-800/40" : "divide-slate-100"}`}>
                  {filtered.map((item) => (
                    <tr key={item.id} className={`transition-colors ${dark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-500"><Briefcase size={14} /></div>
                          <div>
                            <p className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{item.title}</p>
                            <p className={`mt-0.5 text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>{item.internshipType}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`p-4 ${dark ? "text-slate-300" : "text-slate-600"}`}>{item.companyName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          <span className={dark ? "text-slate-400" : "text-slate-500"}>{item.location}</span>
                        </div>
                      </td>
                      <td className="p-4"><StatusBadge status={item.status} /></td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-slate-400" />
                          <span className={dark ? "text-slate-400" : "text-slate-500"}>{item.applicantCount}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setPendingDeleteId(item.id)} disabled={deletingId === item.id} aria-label={`Delete listing "${item.title}"`} className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog open={pendingDeleteId !== null} title="Delete Internship Listing" description={pendingInternship ? `Are you sure you want to permanently delete the listing "${pendingInternship.title}"? This action cannot be undone.` : "Are you sure you want to delete this internship listing? This action cannot be undone."} confirmLabel="Delete Listing" cancelLabel="Cancel" loading={deletingId === pendingDeleteId} variant="danger" onConfirm={handleConfirmDelete} onCancel={() => setPendingDeleteId(null)} />
    </DashboardLayout>
  );
}
