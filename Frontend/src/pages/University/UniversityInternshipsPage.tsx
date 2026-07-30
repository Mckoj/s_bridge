import { useState, useMemo, useCallback, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Search,
  Building,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import { getInternships } from "../../services/internshipService";
import type { InternshipItem } from "../../services/internshipService";
import { classifyApiError } from "../../utils/apiErrors";
import type { ClassifiedApiError } from "../../utils/apiErrors";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";

export default function UniversityInternshipsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [search, setSearch] = useState("");

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInternships();
      setInternships(data);
    } catch (err) {
      setError(classifyApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const filtered = useMemo(() => {
    if (!search) return internships;
    const q = search.toLowerCase();
    return internships.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.recruiter?.companyName ?? "").toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }, [internships, search]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Employer Listings Directory"
          title="Active Internship Postings"
          description="Browse internship positions posted by verified employer recruiters for student placement."
        >
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              id="internship-search"
              placeholder="Search by role, company, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search internship postings"
              className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none ${
                dark
                  ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
              }`}
            />
          </div>
        </PageHeader>

        {/* Listings */}
        {loading ? (
          <LoadingSkeleton count={6} layout="grid" />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchInternships} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title={
              search ? "No Matching Internship Postings" : "No Internship Postings"
            }
            description={
              search
                ? "Try adjusting your search term."
                : "No active internship postings are available at this time. Check back once employers begin posting."
            }
            action={
              search
                ? { label: "Clear Search", onClick: () => setSearch("") }
                : undefined
            }
          />
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Internship postings"
          >
            {filtered.map((item) => (
              <article
                key={item.id}
                role="listitem"
                className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 ${
                  dark
                    ? "bg-slate-900/80 border-slate-800/80 text-white"
                    : "bg-white border-slate-200/80 text-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <Building size={22} />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        item.status === "OPEN" || !item.status
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-500/15 text-slate-400 border-slate-500/30"
                      }`}
                      aria-label={`Status: ${item.status ?? "Open"}`}
                    >
                      {item.status ?? "OPEN"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-base font-bold">{item.title}</h2>
                  <p className="text-xs font-semibold text-violet-400 mt-0.5">
                    {item.recruiter?.companyName ?? "Partner Employer"}
                  </p>
                  <p
                    className={`text-xs mt-3 line-clamp-2 ${
                      dark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={14}
                        className="text-violet-400"
                        aria-hidden="true"
                      />
                      <span>
                        {item.location}{" "}
                        {item.internshipType
                          ? `(${item.internshipType})`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={14}
                        className="text-violet-400"
                        aria-hidden="true"
                      />
                      <span>
                        Duration: {item.duration ?? "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`pt-2 border-t flex justify-between items-center ${
                    dark ? "border-slate-800/40" : "border-slate-100"
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-500">
                    {item.targetProgrammes
                      ? `Target: ${item.targetProgrammes}`
                      : "Open to all programmes"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
