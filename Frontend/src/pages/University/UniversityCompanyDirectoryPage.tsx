import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Building,
  Search,
  Sparkles,
  Globe
} from "lucide-react";
import { getAllRecruitersForUniversity } from "../../services/universityService";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityCompanyDirectoryPage() {
  const dark = useTheme();
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const data = await getAllRecruitersForUniversity();
      setRecruiters(data);
    } catch (err) {
      console.error("Error fetching company directory:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = recruiters.filter((r) => {
    const name = (r.companyName || "").toLowerCase();
    return !search || name.includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-violet-500/20"
              : "bg-gradient-to-br from-violet-50/90 via-white to-violet-50/50 border-violet-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    : "border-violet-200 bg-violet-100/80 text-violet-700"
                }`}
              >
                <Sparkles size={14} />
                Employer Partner Directory
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Verified Employers Directory
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Browse company profiles, industry classifications, active internship postings, and verification statuses.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/50">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search partner company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none ${
                  dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 animate-pulse">Loading company directory...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No partner companies registered yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rec) => (
              <div
                key={rec.id}
                className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 ${
                  dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center">
                      <Building size={22} />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        rec.isApproved
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {rec.isApproved ? "Verified Partner" : "Pending Verification"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold">{rec.companyName}</h3>
                  <p className="text-xs text-slate-400 mt-1">{rec.user?.email}</p>

                  <div className="mt-4 space-y-1 text-xs text-slate-400 border-t border-slate-800/40 pt-3">
                    <p className="flex items-center gap-1.5"><Globe size={13} className="text-violet-400" /> {rec.companyWebsite || "https://company.com"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
