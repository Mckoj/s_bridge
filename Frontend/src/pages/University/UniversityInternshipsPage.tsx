import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Search,
  Building,
  MapPin,
  Sparkles,
  Calendar
} from "lucide-react";
import { getInternships } from "../../services/internshipService";
import type { InternshipItem } from "../../services/internshipService";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityInternshipsPage() {
  const dark = useTheme();
  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const data = await getInternships();
      setInternships(data);
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = internships.filter((item) => {
    const title = item.title.toLowerCase();
    const company = (item.recruiter?.companyName || "").toLowerCase();
    const location = item.location.toLowerCase();
    return !search || title.includes(search.toLowerCase()) || company.includes(search.toLowerCase()) || location.includes(search.toLowerCase());
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
                Employer Listings Directory
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Active Internship Postings
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Browse internship positions posted by verified employer recruiters for student placement.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/50">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by role title, company, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none ${
                  dark
                    ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 animate-pulse">Loading active postings...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No internship listings found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 ${
                  dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center">
                      <Building size={22} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {item.status || "OPEN"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                  <p className="text-xs font-semibold text-violet-400 mt-0.5">{item.recruiter?.companyName || "Partner Employer"}</p>
                  <p className={`text-xs mt-3 line-clamp-2 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-violet-400" />
                      <span>{item.location} ({item.internshipType})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-violet-400" />
                      <span>Duration: {item.duration || "3 Months"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/40 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-500">Target: {item.targetProgrammes || "All Engineering"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
