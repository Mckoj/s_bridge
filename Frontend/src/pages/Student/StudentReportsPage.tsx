import React, { useEffect, useState, lazy, Suspense } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import api from "../../services/api";
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  MessageSquare,
  FileCheck,
  Sparkles,
  Calendar,
  X,
  AlertTriangle,
  BookOpen,
  Eye,
} from "lucide-react";

// Lazy-load the rich text editor (avoids SSR issues)
const RichTextEditor = lazy(() => import("../../components/shared/RichTextEditor"));

export interface StudentReport {
  id: string;
  title: string;
  weekNumber: number;
  content: string;
  fileUrl?: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  supervisorComment?: string;
}

function useTheme() {
  return useDashboard().theme === "dark";
}

// Strip HTML tags for plain text preview
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function StudentReportsPage() {
  const dark = useTheme();
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasActivePlacement, setHasActivePlacement] = useState<boolean | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<StudentReport | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    fetchReports();
    checkActivePlacement();
  }, []);

  const checkActivePlacement = async () => {
    try {
      const res = await api.get("/api/students/internship");
      if (res.data && res.data.id) {
        setHasActivePlacement(true);
      } else {
        setHasActivePlacement(false);
      }
    } catch {
      setHasActivePlacement(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/reports");
      if (res.data?.reports && Array.isArray(res.data.reports)) {
        setReports(res.data.reports);
      } else if (Array.isArray(res.data)) {
        setReports(res.data);
      } else {
        setReports([]);
      }
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasActivePlacement === false) {
      setSubmitError("Cannot submit report: No active accepted internship found for your profile.");
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        title,
        weekNumber: Number(weekNumber),
        content: stripHtml(content),   // store plain text in backend
        fileUrl: fileUrl || undefined,
      };

      const res = await api.post("/api/reports", payload);
      const created = res.data?.report || res.data;
      const newReport: StudentReport = {
        id: created.id || `rep-${Date.now()}`,
        title: created.title || title,
        weekNumber: created.weekNumber || weekNumber,
        content: created.comment || created.content || content,
        fileUrl: created.fileUrl || fileUrl,
        submittedAt: created.createdAt
          ? new Date(created.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: created.status || "PENDING",
      };

      setReports((prev) => [newReport, ...prev]);
      setSuccessMessage("Logbook report submitted successfully!");
      setShowSubmitModal(false);
      setTitle("");
      setContent("");
      setFileUrl("");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: StudentReport["status"]) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 size={13} /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={13} /> Needs Revision
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={13} /> Pending Review
          </span>
        );
    }
  };

  const panelBg = dark
    ? "bg-slate-900/70 border-slate-800/80"
    : "bg-white/90 border-slate-200/80 shadow-sm";
  const cardBg = dark
    ? "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm";
  const inputCls = dark
    ? "bg-slate-950/70 border-slate-700 text-white focus:border-blue-500 placeholder:text-slate-600"
    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 placeholder:text-slate-400";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        {/* Hero Banner */}
        <div className={`relative overflow-hidden rounded-[28px] border p-6 md:p-8 ${panelBg}`}>
          {/* Subtle decorative circle */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-blue-500/10 border-blue-500/20 text-blue-400 mb-3">
                <Sparkles size={13} />
                Logbook &amp; Submissions
              </div>
              <h1
                className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                Logbook Reports
              </h1>
              <p
                className={`mt-1 text-xs md:text-sm font-medium ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Submit weekly attachment reports and track supervisor approvals in real time.
              </p>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all shrink-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Submit New Report</span>
            </button>
          </div>
        </div>

        {/* Active Placement Warning */}
        {hasActivePlacement === false && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-3">
            <AlertTriangle size={20} className="shrink-0 text-amber-400" />
            <div>
              <span className="font-bold block text-sm">No Active Attachment Assigned</span>
              <span>
                Logbook report submissions require an active internship placement. Please apply to
                available roles or get assigned to a verified placement contract first.
              </span>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {successMessage}
            </span>
            <button onClick={() => setSuccessMessage(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Reports List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div
            className={`rounded-[24px] border p-12 text-center flex flex-col items-center justify-center ${panelBg}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FileCheck size={32} />
            </div>
            <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-800"}`}>
              No Logbook Reports Submitted
            </h3>
            <p
              className={`text-xs max-w-sm mt-1 mb-6 leading-relaxed ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              You haven't submitted any weekly activity reports yet. Click below to draft and submit
              your first logbook entry.
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create First Submission</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`rounded-[22px] border p-5 md:p-6 transition-all ${cardBg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
                      <Calendar size={13} /> Week {report.weekNumber} Report
                    </div>
                    <h3
                      className={`text-base font-bold truncate ${
                        dark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {report.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      {report.submittedAt}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>
                </div>

                <p
                  className={`text-xs leading-relaxed line-clamp-3 ${
                    dark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {stripHtml(report.content)}
                </p>

                {report.supervisorComment && (
                  <div
                    className={`mt-4 p-3 rounded-xl border flex items-start gap-3 text-xs ${
                      report.status === "APPROVED"
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/5 border-rose-500/20 text-rose-300"
                    }`}
                  >
                    <MessageSquare size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block text-[10px] uppercase tracking-wider">
                        Supervisor Feedback
                      </span>
                      <p className="mt-0.5">{report.supervisorComment}</p>
                    </div>
                  </div>
                )}

                {/* View full report button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setViewingReport(report)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      dark
                        ? "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <Eye size={13} /> View Full Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SUBMISSION MODAL ── */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className={`w-full max-w-2xl rounded-[28px] border shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden ${
                dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              {/* Modal header */}
              <div
                className={`flex items-center justify-between px-6 py-5 border-b ${
                  dark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <BookOpen size={18} className="text-blue-500" />
                    <h2 className="text-lg font-extrabold">Submit Logbook Report</h2>
                  </div>
                  <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    Document your work activities, learnings, and progress for evaluation.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitError(null);
                  }}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto flex-1 p-6">
                {submitError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                    {submitError}
                  </div>
                )}

                <form id="logbook-form" onSubmit={handleSubmit} className="space-y-5">
                  {/* Title + Week row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label
                        htmlFor="report-title"
                        className={`block text-[11px] font-extrabold uppercase tracking-wider ${
                          dark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Report Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="report-title"
                        type="text"
                        required
                        placeholder="e.g. Database Optimization & API Testing"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${inputCls}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="week-number"
                        className={`block text-[11px] font-extrabold uppercase tracking-wider ${
                          dark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Week No. <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="week-number"
                        type="number"
                        min={1}
                        max={52}
                        required
                        value={weekNumber}
                        onChange={(e) => setWeekNumber(Number(e.target.value))}
                        className={`w-full px-3 py-2.5 text-sm rounded-xl border outline-none text-center font-bold transition-colors ${inputCls}`}
                      />
                    </div>
                  </div>

                  {/* Rich Text Content */}
                  <div className="space-y-1.5">
                    <label
                      className={`block text-[11px] font-extrabold uppercase tracking-wider ${
                        dark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Summary of Activities &amp; Key Learnings <span className="text-rose-500">*</span>
                    </label>
                    <Suspense
                      fallback={
                        <div
                          className={`rounded-xl border h-48 flex items-center justify-center text-xs text-slate-400 ${
                            dark ? "bg-slate-950/70 border-slate-700" : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          Loading editor...
                        </div>
                      }
                    >
                      <RichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Describe tasks completed, tools used, key challenges, solutions encountered, and skills developed this week..."
                        minHeight={200}
                      />
                    </Suspense>
                    <p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                      Use the toolbar to format your report — bold key terms, create lists, highlight sections.
                    </p>
                  </div>

                  {/* Document Link */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="file-url"
                      className={`block text-[11px] font-extrabold uppercase tracking-wider ${
                        dark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Document / Evidence Link{" "}
                      <span className={`normal-case font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="file-url"
                      type="url"
                      placeholder="https://drive.google.com/... or document URL"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${inputCls}`}
                    />
                  </div>
                </form>
              </div>

              {/* Modal footer */}
              <div
                className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${
                  dark ? "border-slate-800 bg-slate-900/80" : "border-slate-100 bg-slate-50/80"
                }`}
              >
                <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  Your report will be reviewed by your supervisor.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmitModal(false);
                      setSubmitError(null);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      dark
                        ? "text-slate-400 hover:text-white hover:bg-slate-800"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="logbook-form"
                    disabled={submitting || !content.trim() || content === "<p></p>"}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Submit Logbook</span>
                        <Send size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VIEW FULL REPORT MODAL ── */}
        {viewingReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className={`w-full max-w-2xl rounded-[28px] border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
                dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div
                className={`flex items-center justify-between px-6 py-5 border-b ${
                  dark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
                    <Calendar size={13} /> Week {viewingReport.weekNumber} Report
                  </div>
                  <h2 className="text-lg font-extrabold">{viewingReport.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(viewingReport.status)}
                  <button
                    onClick={() => setViewingReport(null)}
                    className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-6">
                <div
                  className={`prose prose-sm max-w-none leading-relaxed text-sm ${
                    dark ? "prose-invert text-slate-300" : "text-slate-700"
                  }`}
                  dangerouslySetInnerHTML={{ __html: viewingReport.content }}
                />
                {viewingReport.supervisorComment && (
                  <div
                    className={`mt-6 p-4 rounded-xl border flex items-start gap-3 text-xs ${
                      viewingReport.status === "APPROVED"
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/5 border-rose-500/20 text-rose-300"
                    }`}
                  >
                    <MessageSquare size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block text-[10px] uppercase tracking-wider mb-1">
                        Supervisor Feedback
                      </span>
                      <p>{viewingReport.supervisorComment}</p>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`px-6 py-4 border-t text-xs text-slate-400 flex items-center justify-between ${
                  dark ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <span>Submitted: {viewingReport.submittedAt}</span>
                <button
                  onClick={() => setViewingReport(null)}
                  className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                    dark
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
