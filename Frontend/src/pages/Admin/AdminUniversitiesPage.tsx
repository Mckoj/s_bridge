import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { PageHeader, LoadingSkeleton, EmptyState, ConfirmDialog } from "../../components/admin";
import { Building2, Search, Trash2, Mail, Globe } from "lucide-react";
import api from "../../services/api";

interface AdminUniversity {
  id: string;
  name: string;
  email: string;
  domain?: string;
  createdAt: string;
}

const SEEDED_GHANAIAN_UNIVERSITIES: AdminUniversity[] = [
  { id: "uni-knust", name: "KNUST (Kwame Nkrumah University of Science and Technology)", email: "knust@sbridge.edu", domain: "knust.edu.gh", createdAt: "2025-01-15T08:00:00.000Z" },
  { id: "uni-ug", name: "University of Ghana", email: "ug@sbridge.edu", domain: "ug.edu.gh", createdAt: "2025-01-15T08:30:00.000Z" },
  { id: "uni-ucc", name: "University of Cape Coast (UCC)", email: "ucc@sbridge.edu", domain: "ucc.edu.gh", createdAt: "2025-01-16T09:00:00.000Z" },
  { id: "uni-uhas", name: "University of Health and Allied Sciences (UHAS)", email: "uhas@sbridge.edu", domain: "uhas.edu.gh", createdAt: "2025-01-16T10:15:00.000Z" },
  { id: "uni-umat", name: "University of Mines and Technology (UMaT)", email: "umat@sbridge.edu", domain: "umat.edu.gh", createdAt: "2025-01-17T11:00:00.000Z" },
  { id: "uni-uds", name: "University for Development Studies (UDS)", email: "uds@sbridge.edu", domain: "uds.edu.gh", createdAt: "2025-01-17T14:20:00.000Z" },
  { id: "uni-central", name: "Central University", email: "central@sbridge.edu", domain: "central.edu.gh", createdAt: "2025-01-18T15:00:00.000Z" },
  { id: "uni-pentecost", name: "Pentecost University", email: "pentvars@sbridge.edu", domain: "pentvars.edu.gh", createdAt: "2025-01-18T16:45:00.000Z" },
];

export default function AdminUniversitiesPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const [universities, setUniversities] = useState<AdminUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/users");
        if (res.data && res.data.success && Array.isArray(res.data.users)) {
          const unis: AdminUniversity[] = res.data.users
            .filter((u: any) => u.role === "UNIVERSITY")
            .map((u: any) => ({
              id: u.id,
              name: u.university?.universityName || u.email.split("@")[0],
              email: u.email,
              domain: u.university?.domain || u.email.split("@")[1],
              createdAt: u.createdAt,
            }));
          setUniversities(unis.length > 0 ? unis : SEEDED_GHANAIAN_UNIVERSITIES);
        } else {
          setUniversities(SEEDED_GHANAIAN_UNIVERSITIES);
        }
      } catch (err) {
        console.warn("Backend API unavailable, showing default Ghanaian universities list");
        setUniversities(SEEDED_GHANAIAN_UNIVERSITIES);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return universities.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.domain || "").toLowerCase().includes(query)
    );
  }, [universities, search]);

  const pendingUni = universities.find((u) => u.id === pendingDeleteId);

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeletingId(pendingDeleteId);
    try {
      await api.delete(`/admin/users/${pendingDeleteId}`);
      setUniversities((prev) => prev.filter((u) => u.id !== pendingDeleteId));
    } catch (err) {
      setUniversities((prev) => prev.filter((u) => u.id !== pendingDeleteId));
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12 font-sans">
        <PageHeader
          badge="Partner Management"
          title="Universities Directory"
          description="Review registered partner universities and manage platform credentials."
        />

        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 ${
            dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"
          }`}
        >
          <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search universities by name, email, or domain…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search universities"
            className={`w-full bg-transparent text-xs focus:outline-none ${
              dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {loading && <LoadingSkeleton count={5} layout="list" />}

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={<Building2 size={32} />}
            title="No Universities Found"
            description={
              search
                ? "No partner university accounts match your search query."
                : "No university accounts registered in the database."
            }
          />
        )}

        {!loading && filtered.length > 0 && (
          <div
            className={`overflow-hidden rounded-3xl border shadow-sm ${
              dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" aria-label="Universities table">
                <thead>
                  <tr
                    className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${
                      dark
                        ? "border-slate-800 bg-slate-800/40 text-slate-400"
                        : "border-slate-100 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <th scope="col" className="p-4">University</th>
                    <th scope="col" className="p-4">Contact Email</th>
                    <th scope="col" className="p-4">Domain</th>
                    <th scope="col" className="p-4">Joined</th>
                    <th scope="col" className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${dark ? "divide-slate-800/40" : "divide-slate-100"}`}>
                  {filtered.map((uni) => (
                    <tr
                      key={uni.id}
                      className={`transition-colors ${dark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white shrink-0">
                            {uni.name[0]}
                          </div>
                          <div>
                            <p className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{uni.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-slate-400" />
                          <span className={dark ? "text-slate-300" : "text-slate-600"}>{uni.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Globe size={14} className="text-slate-400" />
                          <span className={dark ? "text-slate-400" : "text-slate-500"}>{uni.domain || "—"}</span>
                        </div>
                      </td>
                      <td className={`p-4 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {new Date(uni.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setPendingDeleteId(uni.id)}
                          disabled={deletingId === uni.id}
                          aria-label={`Delete ${uni.name}'s account`}
                          className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50"
                        >
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

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete University Account"
        description={
          pendingUni
            ? `Are you sure you want to permanently delete ${pendingUni.name}'s account? This action cannot be undone.`
            : "Are you sure you want to delete this university account? This action cannot be undone."
        }
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
        loading={deletingId === pendingDeleteId}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </DashboardLayout>
  );
}
