import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import {
  LayoutGrid,
  Clock,
  CheckCircle2,
  Sparkles,
  Briefcase,
  MapPin,
  FileCheck2,
  Upload,
  Bot,
  UserCheck,
  Building,
  ArrowRight,
  TrendingUp,
  FileText,
  Bookmark,
} from "lucide-react";
import { useSavedJobs } from "../../hooks/useSavedJobs";

import {
  getStudentStats,
  validateCVFile,
  uploadCV,
} from "../../services/studentService";
import type { StudentStats } from "../../services/studentService";
import { getInternships } from "../../services/internshipService";
import type { InternshipItem } from "../../services/internshipService";
import {
  getApplications,
  applyToInternship,
} from "../../services/applicationService";
import type { ApplicationItem } from "../../services/applicationService";

function useTheme() {
  return useDashboard().theme === "dark";
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const dark = useTheme();
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
        dark
          ? "bg-slate-900/80 border-slate-800/80 text-white"
          : "bg-white/90 border-slate-200/80 text-slate-900"
      } ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
          dark
            ? "from-blue-500/10 via-transparent to-transparent"
            : "from-blue-100/50 via-transparent to-transparent"
        }`}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  const dark = useTheme();
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <p
          className={`text-xs font-semibold mb-1 ${dark ? "text-slate-400" : "text-slate-500"}`}
        >
          {title}
        </p>
        <p className="text-3xl font-extrabold leading-none tabular-nums">
          {value}
        </p>
        <p
          className={`text-[11px] font-medium mt-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}
        >
          {subtitle}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} shadow-sm`}
      >
        <Icon size={22} className={iconColor} />
      </div>
    </Card>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dark = useTheme();
  const { isSaved, toggleSave } = useSavedJobs();
  const rawName = user?.email?.split("@")[0] ?? "Student";

  const displayName = user?.firstName
    ? user.firstName
    : rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const [stats, setStats] = useState<StudentStats>({
    totalApplications: 0,
    underReview: 0,
    accepted: 0,
    submittedReports: 0,
  });
  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Application Modal state
  const [selectedInternship, setSelectedInternship] =
    useState<InternshipItem | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  // CV Upload state
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMsg, setCvMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, internshipsRes, appsRes] = await Promise.allSettled([
        getStudentStats(),
        getInternships(),
        getApplications(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (internshipsRes.status === "fulfilled")
        setInternships(internshipsRes.value);
      if (appsRes.status === "fulfilled") setApplications(appsRes.value);
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;
    setApplying(true);
    setApplySuccess(null);
    try {
      await applyToInternship({
        internshipId: selectedInternship.id,
        coverLetter,
      });
      setApplySuccess("Application submitted successfully!");
      setCoverLetter("");
      setTimeout(() => {
        setSelectedInternship(null);
        setApplySuccess(null);
        fetchData();
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleCvSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Frontend validation: PDF only, max 5 MB
    const validationError = validateCVFile(file);
    if (validationError) {
      setCvMsg(validationError);
      e.target.value = ""; // reset file input
      return;
    }
    setCvUploading(true);
    setCvMsg(null);
    try {
      await uploadCV(file);
      setCvMsg("CV uploaded successfully!");
    } catch (err: any) {
      setCvMsg(
        err.response?.data?.error || "Failed to upload CV. Please try again.",
      );
    } finally {
      setCvUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Top Hero Banner & Greeting */}
        <div
          className={`relative overflow-hidden rounded-[30px] border p-6 lg:p-8 shadow-2xl ${
            dark
              ? "border-blue-500/20 bg-slate-900/80"
              : "border-blue-200/80 bg-gradient-to-br from-blue-50/90 via-white to-blue-50/50"
          }`}
        >
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                    dark
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border-blue-200 bg-blue-100/80 text-blue-700"
                  }`}
                >
                  <Sparkles size={14} />
                  S-Bridge Student Portal
                </div>
                <h1 className={`mt-3 text-3xl lg:text-4xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
                  Welcome back, {displayName}! 👋
                </h1>
                <p
                  className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}
                >
                  You're one step closer to your dream career. Here is your
                  real-time placement overview.
                </p>
              </div>

              {/* Quick Actions Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all">
                  <Upload size={14} />
                  {cvUploading ? "Uploading..." : "Upload CV"}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCvSelect}
                    className="hidden"
                    aria-label="Upload CV — PDF only, max 5 MB"
                  />
                </label>
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    dark
                      ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <UserCheck size={14} />
                  Edit Profile
                </button>
              </div>
            </div>

            {cvMsg && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
                {cvMsg}
              </div>
            )}

            {/* Next Action Banner */}
            <div
              className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                dark
                  ? "bg-slate-800/60 border-slate-700/60"
                  : "bg-white/80 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-500 font-bold">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Your Next Action</p>
                  <p
                    className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {applications.length > 0
                      ? `You have ${applications.length} active applications. Check status updates below.`
                      : "No active applications yet. Explore recommended opportunities below!"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/internship")}
                className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
              >
                Find Opportunities <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Metric Stat Cards Row — backed by real backend data via mapStudentStats() */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Applications"
            value={stats.totalApplications}
            subtitle="Total Submitted"
            icon={LayoutGrid}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-500"
          />
          <StatCard
            title="Under Review"
            value={stats.underReview}
            subtitle="Awaiting Decision"
            icon={Clock}
            iconBg="bg-amber-500/10"
            iconColor="text-amber-500"
          />
          <StatCard
            title="Accepted"
            value={stats.accepted}
            subtitle="Congratulations!"
            icon={CheckCircle2}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-500"
          />
          <StatCard
            title="Reports Submitted"
            value={stats.submittedReports}
            subtitle="Logbook Entries"
            icon={FileCheck2}
            iconBg="bg-blue-500/10"
            iconColor="text-blue-500"
          />
        </div>

        {/* Main Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Opportunities & Applications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Opportunities */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-500" />
                    AI Recommended Opportunities
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      AI Feature • Coming Soon
                    </span>
                  </h3>
                  <p
                    className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Matching roles based on backend skills matrix
                  </p>
                </div>
                <button
                  onClick={() => navigate("/dashboard/internship")}
                  className="text-xs font-semibold text-blue-500 hover:underline"
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                  Loading live backend opportunities...
                </div>
              ) : internships.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed rounded-2xl p-6">
                  No internship listings posted yet by recruiters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {internships.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all hover:border-blue-500/40 flex flex-col justify-between space-y-3 ${
                        dark
                          ? "bg-slate-800/50 border-slate-700/60"
                          : "bg-slate-50/80 border-slate-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                            <Building size={20} />
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            Match Score: Coming Soon
                          </span>
                        </div>
                        <h4 className="mt-3 text-sm font-bold truncate">
                          {item.title}
                        </h4>
                        <p
                          className={`text-xs font-semibold ${dark ? "text-blue-400" : "text-blue-600"}`}
                        >
                          {item.recruiter?.companyName || "Partner Company"}
                        </p>
                        <div
                          className={`mt-2 flex flex-wrap gap-2 text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}
                        >
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {item.location}
                          </span>
                          <span>•</span>
                          <span>{item.internshipType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInternship(item)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm cursor-pointer"
                        >
                          Apply Now
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleSave(item.id)}
                          title={isSaved(item.id) ? "Remove from saved jobs" : "Save job"}
                          className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                            isSaved(item.id)
                              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                              : dark
                              ? "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800"
                              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <Bookmark size={15} className={isSaved(item.id) ? "fill-blue-400 text-blue-400" : ""} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Application Timeline / Active Tracker */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-500" />
                  Your Active Applications Tracker
                </h3>
                <button
                  onClick={() => navigate("/dashboard/applications")}
                  className="text-xs font-semibold text-blue-500 hover:underline"
                >
                  View Full Tracker
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No submitted applications. Select an opportunity above to
                  apply!
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        dark
                          ? "bg-slate-800/40 border-slate-700/50"
                          : "bg-white border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold">
                            {app.internship?.title || "Internship Role"}
                          </p>
                          <p
                            className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {app.internship?.recruiter?.companyName ||
                              "Company"}{" "}
                            • Applied on{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          app.status === "ACCEPTED"
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            : app.status === "REJECTED"
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : app.status === "WITHDRAWN"
                                ? "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: AI Match Breakdown & Coming Soon Features */}
          <div className="space-y-6">
            {/* AI Match Breakdown Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Bot size={18} className="text-blue-500" />
                  AI Match Score Breakdown
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Coming Soon
                </span>
              </div>
              <p
                className={`text-xs mb-4 ${dark ? "text-slate-400" : "text-slate-500"}`}
              >
                Automated matching engine analyzing student profile against
                employer requirements.
              </p>

              <div className="space-y-3">
                {[
                  {
                    label: "Technical Skills Alignment",
                    pct: 85,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Academic Performance (GPA)",
                    pct: 75,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Project Portfolio Relevance",
                    pct: 60,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Experience & Coursework",
                    pct: 50,
                    color: "bg-amber-500",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span>{item.label}</span>
                      <span className="text-slate-400">{item.pct}%</span>
                    </div>
                    <div
                      className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-200"}`}
                    >
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Career Assistant Feature Teaser */}
            <Card className="p-6 border-blue-500/30 bg-gradient-to-br from-blue-900/30 to-slate-900/80">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">AI Career Assistant</h4>
                  <span className="text-[10px] font-bold text-blue-400">
                    Coming Soon in Next Phase
                  </span>
                </div>
              </div>
              <p
                className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}
              >
                Get instant resume optimization tips, mock interview questions,
                and tailored skill progression paths powered by AI.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div
            className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${
              dark
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h3 className="text-lg font-bold">
              Apply to {selectedInternship.title}
            </h3>
            <p
              className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-slate-600"}`}
            >
              Company:{" "}
              {selectedInternship.recruiter?.companyName || "Partner Employer"}
            </p>

            {applySuccess ? (
              <div className="my-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs text-center font-bold">
                {applySuccess}
              </div>
            ) : (
              <form onSubmit={handleApply} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Introduce yourself and explain why you're a great fit for this internship..."
                    className={`w-full p-3 rounded-2xl text-xs border outline-none ${
                      dark
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInternship(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
