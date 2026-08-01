import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import api from "../../services/api";
import { queryCache } from "../../utils/queryCache";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  Briefcase,
  Plus,
  ArrowLeft,
  Building2,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Filter,
} from "lucide-react";

interface InternshipItem {
  id: string;
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary?: number;
  duration: string;
  matchScore?: number;
  recruiter: {
    companyName: string;
    companyWebsite?: string;
    companyProfile?: {
      logoUrl?: string;
      address?: string;
      industry?: string;
    };
  };
  skills: { skill: { name: string } }[];
  _count?: { applications: number };
}

function useTheme() {
  return useDashboard().theme === "dark";
}

function getMatchColor(score: number) {
  if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  if (score >= 25) return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  return "text-slate-400 bg-slate-500/10 border-slate-500/20";
}

function getMatchLabel(score: number) {
  if (score >= 80) return "Excellent Match";
  if (score >= 50) return "Good Match";
  if (score >= 25) return "Partial Match";
  return "Low Match";
}

export default function ExploreOpportunitiesPage() {
  const dark = useTheme();
  const navigate = useNavigate();
  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "matchScore">("matchScore");

  // Apply modal state
  const [applyTarget, setApplyTarget] = useState<InternshipItem | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const INTERNSHIPS_CACHE_KEY = "GET:/api/internships";

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    // Show stale data instantly — only block with spinner on true first load
    const stale = queryCache.get<{ internships: InternshipItem[] }>(INTERNSHIPS_CACHE_KEY);
    if (stale?.internships) {
      setInternships(stale.internships);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const res = await api.get("/api/internships");
      if (res.data?.internships && Array.isArray(res.data.internships)) {
        setInternships(res.data.internships);
      }
    } catch {
      if (!stale) setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyTarget) return;
    setSubmitting(true);
    setApplyError(null);
    setApplySuccess(null);
    try {
      await api.post("/api/applications", {
        internshipId: applyTarget.id,
        coverLetter,
      });
      // Invalidate stats cache so the dashboard reflects the new application
      queryCache.invalidate("GET:/api/students/stats");
      queryCache.invalidate("GET:/api/students/applications");
      setApplySuccess("Application submitted successfully!");
      setTimeout(() => {
        setApplyTarget(null);
        setCoverLetter("");
        setApplySuccess(null);
      }, 1500);
    } catch (err: any) {
      setApplyError(err.response?.data?.error || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filters
  const filtered = internships
    .filter((item) => {
      if (typeFilter !== "ALL" && item.internshipType !== typeFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.recruiter.companyName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.skills.some((s) => s.skill.name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "matchScore") return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      return 0; // default order from API (newest first)
    });

  const internshipTypes = [...new Set(internships.map((i) => i.internshipType))];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 md:p-8 ${
            dark
              ? "bg-slate-900/70 border-slate-800/80"
              : "bg-white/80 border-slate-200/80 shadow-xs"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-purple-500/10 border-purple-500/20 text-purple-400">
                <Sparkles size={13} />
                Opportunities Feed
              </div>
              <h1
                className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                Explore Internships
              </h1>
              <p
                className={`mt-1 text-xs md:text-sm font-medium ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Discover available placements matched to your skill profile. Higher match scores mean better alignment with your abilities.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard/applications")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer self-start sm:self-center"
            >
              <ArrowLeft size={15} />
              <span>My Applications</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-between pt-4 border-t border-slate-800/50">
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search roles, companies, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                  dark
                    ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="flex items-center gap-1 mr-1 text-slate-500">
                <Filter size={13} />
              </div>
              {["ALL", ...internshipTypes].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    typeFilter === type
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : dark
                      ? "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type === "ALL" ? "All Types" : type}
                </button>
              ))}
              <span className="mx-1 text-slate-700">|</span>
              <button
                onClick={() => setSortBy(sortBy === "matchScore" ? "recent" : "matchScore")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                  sortBy === "matchScore"
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                    : dark
                    ? "bg-slate-800/60 text-slate-400 hover:text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <TrendingUp size={12} />
                {sortBy === "matchScore" ? "By Match" : "Recent"}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className={`rounded-[24px] border p-12 text-center flex flex-col items-center justify-center ${
              dark
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Briefcase size={32} />
            </div>
            <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-800"}`}>
              No opportunities found
            </h3>
            <p className={`text-xs max-w-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              No internship listings match your current filters. Try broadening your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-[22px] border transition-all flex flex-col justify-between hover:-translate-y-1 ${
                  dark
                    ? "bg-slate-900/60 border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900"
                    : "bg-white border-slate-200 hover:border-purple-300 hover:shadow-md"
                }`}
              >
                <div>
                  {/* Match Score Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-purple-400 leading-tight truncate">
                        {item.title}
                      </h3>
                      <p className={`text-xs font-semibold mt-0.5 ${dark ? "text-white" : "text-slate-800"}`}>
                        {item.recruiter?.companyName}
                      </p>
                    </div>
                    {item.matchScore !== undefined && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border whitespace-nowrap shrink-0 ${getMatchColor(
                          item.matchScore
                        )}`}
                      >
                        <TrendingUp size={10} />
                        {item.matchScore}%
                      </span>
                    )}
                  </div>

                  {/* Match Label */}
                  {item.matchScore !== undefined && item.matchScore > 0 && (
                    <p className={`text-[10px] font-semibold mb-2 ${
                      item.matchScore >= 80 ? "text-emerald-400" :
                      item.matchScore >= 50 ? "text-amber-400" :
                      "text-orange-400"
                    }`}>
                      {getMatchLabel(item.matchScore)}
                    </p>
                  )}

                  <p className={`text-xs line-clamp-2 my-2 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 my-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {item.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} /> {item.internshipType}
                    </span>
                  </div>

                  {/* Skill Tags */}
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setApplyTarget(item);
                    setCoverLetter("");
                    setApplySuccess(null);
                    setApplyError(null);
                  }}
                  className="w-full mt-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Quick Apply</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Apply Modal */}
        {applyTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div
              className={`w-full max-w-md rounded-[28px] border p-6 shadow-2xl relative ${
                dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <button
                onClick={() => setApplyTarget(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">
                <Building2 size={14} /> {applyTarget.recruiter?.companyName}
              </div>
              <h2 className="text-lg font-extrabold">{applyTarget.title}</h2>

              {applyTarget.matchScore !== undefined && (
                <div className="mt-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getMatchColor(applyTarget.matchScore)}`}>
                    <TrendingUp size={12} />
                    {applyTarget.matchScore}% Match — {getMatchLabel(applyTarget.matchScore)}
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-400 mt-1 mb-4">
                Submit your application details to {applyTarget.recruiter?.companyName}.
              </p>

              {applySuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={16} />
                  <span>{applySuccess}</span>
                </div>
              )}

              {applyError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-semibold">
                  <AlertCircle size={16} />
                  <span>{applyError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Cover Letter / Statement of Interest
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe why you are a great fit for this internship..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className={`w-full p-3 text-xs rounded-xl border outline-none transition-all ${
                      dark
                        ? "bg-slate-950 border-slate-800 text-white focus:border-purple-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500"
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyTarget(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
