import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import api from "../../services/api";
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  ChevronRight,
  X,
  Sparkles,
  Briefcase,
  Send,
  Plus,
} from "lucide-react";

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  location: string;
  internshipType: string;
  appliedDate: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  coverLetter?: string;
  matchScore?: number;
}

export interface InternshipItem {
  id: string;
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary?: number;
  duration: string;
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
}

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentApplicationsPage() {
  const dark = useTheme();
  const { searchQuery, setSearchQuery } = useDashboard();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState(searchQuery);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Explore Internships Feed Modal state
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [openInternships, setOpenInternships] = useState<InternshipItem[]>([]);
  const [fetchingInternships, setFetchingInternships] = useState(false);
  const [exploreSearch, setExploreSearch] = useState("");

  // Application Submission Modal state
  const [applyTarget, setApplyTarget] = useState<InternshipItem | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/students/applications");
      if (res.data && Array.isArray(res.data)) {
        setApplications(res.data);
      }
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExploreModal = async () => {
    setShowExploreModal(true);
    setFetchingInternships(true);
    try {
      const res = await api.get("/api/internships");
      if (res.data?.internships && Array.isArray(res.data.internships)) {
        setOpenInternships(res.data.internships);
      }
    } catch {
      setOpenInternships([]);
    } finally {
      setFetchingInternships(false);
    }
  };

  const handleOpenApply = (internship: InternshipItem) => {
    setApplyTarget(internship);
    setCoverLetter("");
    setApplySuccess(null);
    setApplyError(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyTarget) return;

    setSubmittingApply(true);
    setApplyError(null);
    setApplySuccess(null);

    try {
      await api.post("/api/applications", {
        internshipId: applyTarget.id,
        coverLetter: coverLetter,
      });

      setApplySuccess("Application submitted successfully!");
      await fetchApplications();

      setTimeout(() => {
        setApplyTarget(null);
        setShowExploreModal(false);
      }, 1200);
    } catch (err: any) {
      setApplyError(err.response?.data?.error || "Failed to submit application. Try again.");
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setSearchQuery(val);
  };

  const effectiveSearch = (search || searchQuery).toLowerCase();

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filter === "ALL" || app.status === filter;
    const matchesSearch =
      !effectiveSearch ||
      app.internshipTitle.toLowerCase().includes(effectiveSearch) ||
      app.companyName.toLowerCase().includes(effectiveSearch) ||
      app.location.toLowerCase().includes(effectiveSearch);
    return matchesFilter && matchesSearch;
  });

  const filteredOpenInternships = openInternships.filter((item) => {
    if (!exploreSearch.trim()) return true;
    const q = exploreSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.recruiter.companyName.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.skills.some((s) => s.skill.name.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={13} /> Accepted
          </span>
        );
      case "REVIEWING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={13} /> Under Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={13} /> Declined
          </span>
        );
      case "WITHDRAWN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <AlertCircle size={13} /> Withdrawn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock size={13} /> Submitted
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 md:p-8 ${
            dark
              ? "bg-slate-900/70 border-slate-800/80"
              : "bg-white/80 border-slate-200/80 shadow-xs"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-blue-500/10 border-blue-500/20 text-blue-400">
                <Sparkles size={13} />
                Application Tracker
              </div>
              <h1
                className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                My Applications
              </h1>
              <p
                className={`mt-1 text-xs md:text-sm font-medium ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Track status updates and interview invitations for your internship submissions.
              </p>
            </div>

            <button
              onClick={handleOpenExploreModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-center"
            >
              <Briefcase size={15} />
              <span>Explore Opportunities</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-between pt-4 border-t border-slate-800/50">
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search by company or role..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                  dark
                    ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {["ALL", "PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    filter === status
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : dark
                      ? "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status === "ALL" ? "All Applications" : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div
            className={`rounded-[24px] border p-12 text-center flex flex-col items-center justify-center ${
              dark
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FileText size={32} />
            </div>
            <h3
              className={`text-lg font-bold ${
                dark ? "text-white" : "text-slate-800"
              }`}
            >
              No applications found
            </h3>
            <p
              className={`text-xs max-w-sm mt-1 mb-6 ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {effectiveSearch || filter !== "ALL"
                ? "No applications match your current search or status filter."
                : "You haven't submitted any internship applications yet. Explore available roles to apply."}
            </p>
            <button
              onClick={handleOpenExploreModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Explore Available Internships</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-5 rounded-[22px] border transition-all cursor-pointer hover:-translate-y-1 ${
                  dark
                    ? "bg-slate-900/60 border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900"
                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3
                      className={`text-sm font-bold leading-tight ${
                        dark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {app.internshipTitle}
                    </h3>
                    <p className="text-xs font-semibold text-blue-400 mt-1">
                      {app.companyName}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div
                  className={`flex flex-wrap items-center gap-4 text-[11px] pt-3 border-t ${
                    dark
                      ? "border-slate-800/80 text-slate-400"
                      : "border-slate-100 text-slate-500"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-500" />
                    {app.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-500" />
                    Applied: {app.appliedDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className={`w-full max-w-lg rounded-[28px] border p-6 shadow-2xl relative ${
                dark
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                <Building2 size={14} /> {selectedApp.companyName}
              </div>
              <h2 className="text-xl font-extrabold">{selectedApp.internshipTitle}</h2>
              <div className="mt-2 mb-4">{getStatusBadge(selectedApp.status)}</div>

              <div className="space-y-3 py-4 border-y border-slate-800/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold">{selectedApp.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-semibold">{selectedApp.internshipType || "Full-time"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Applied:</span>
                  <span className="font-semibold">{selectedApp.appliedDate}</span>
                </div>
                {selectedApp.matchScore !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Skill Match Score:</span>
                    <span className="font-bold text-emerald-400">{selectedApp.matchScore}%</span>
                  </div>
                )}
              </div>

              {selectedApp.coverLetter && (
                <div className="mt-4 space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Cover Letter Submission
                  </label>
                  <p className={`p-3 rounded-xl text-xs leading-relaxed ${dark ? "bg-slate-950/60 text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Explore Open Internships Feed Modal ──────────────────────────────── */}
        {showExploreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div
              className={`w-full max-w-4xl max-h-[85vh] rounded-[28px] border flex flex-col shadow-2xl relative overflow-hidden ${
                dark
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {/* Modal Top Bar */}
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between shrink-0">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1">
                    <Sparkles size={12} />
                    Live Opportunities Feed
                  </div>
                  <h2 className="text-xl font-extrabold">Explore Available Internships</h2>
                </div>
                <button
                  onClick={() => setShowExploreModal(false)}
                  className="p-2 rounded-full hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Filter Bar inside Feed */}
              <div className="px-6 py-3 border-b border-slate-800/50 bg-slate-950/30 shrink-0">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search roles, companies, locations, or skills..."
                    value={exploreSearch}
                    onChange={(e) => setExploreSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                      dark
                        ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Feed Content List */}
              <div className="p-6 overflow-y-auto space-y-4 grow">
                {fetchingInternships ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-xs text-slate-400 font-medium">Loading internship opportunities...</p>
                  </div>
                ) : filteredOpenInternships.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No active internship postings found matching your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredOpenInternships.map((item) => (
                      <div
                        key={item.id}
                        className={`p-5 rounded-[22px] border transition-all flex flex-col justify-between ${
                          dark
                            ? "bg-slate-950/60 border-slate-800/90 hover:border-blue-500/40"
                            : "bg-slate-50/80 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="text-sm font-bold text-blue-400 leading-tight">
                                {item.title}
                              </h3>
                              <p className={`text-xs font-semibold mt-0.5 ${dark ? "text-white" : "text-slate-800"}`}>
                                {item.recruiter?.companyName}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                              {item.internshipType}
                            </span>
                          </div>

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
                          onClick={() => handleOpenApply(item)}
                          className="w-full mt-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Quick Apply</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Quick Apply Modal ───────────────────────────────────────────────── */}
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

              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                <Building2 size={14} /> {applyTarget.recruiter?.companyName}
              </div>
              <h2 className="text-lg font-extrabold">{applyTarget.title}</h2>
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
                        ? "bg-slate-950 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500"
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
                    disabled={submittingApply}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    {submittingApply ? (
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
