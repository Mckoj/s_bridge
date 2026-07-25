import React, { useEffect, useState } from "react";
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
} from "lucide-react";

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

export default function StudentReportsPage() {
  const dark = useTheme();
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/students/reports");
      if (res.data && Array.isArray(res.data)) {
        setReports(res.data);
      }
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        title,
        weekNumber: Number(weekNumber),
        content,
        fileUrl: fileUrl || undefined,
      };

      const res = await api.post("/api/students/reports", payload);
      const newReport: StudentReport = res.data || {
        id: `rep-${Date.now()}`,
        title,
        weekNumber,
        content,
        fileUrl,
        submittedAt: new Date().toISOString().split("T")[0],
        status: "PENDING",
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
        err.response?.data?.message || "Failed to submit report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: StudentReport["status"]) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
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
                Logbook & Submissions
              </div>
              <h1
                className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Submit New Report</span>
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {successMessage}
            </span>
            <button onClick={() => setSuccessMessage(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div
            className={`rounded-[24px] border p-12 text-center flex flex-col items-center justify-center ${
              dark
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FileCheck size={32} />
            </div>
            <h3
              className={`text-lg font-bold ${
                dark ? "text-white" : "text-slate-800"
              }`}
            >
              No Logbook Reports Submitted
            </h3>
            <p
              className={`text-xs max-w-sm mt-1 mb-6 leading-relaxed ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              You haven't submitted any weekly activity reports yet. Click below to draft and submit your first logbook entry.
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
                className={`rounded-[22px] border p-5 md:p-6 transition-all ${
                  dark
                    ? "bg-slate-900/60 border-slate-800/80"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
                      <Calendar size={13} /> Week {report.weekNumber} Report
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        dark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {report.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Submitted: {report.submittedAt}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>
                </div>

                <p
                  className={`text-xs leading-relaxed mt-2 ${
                    dark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {report.content}
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
              </div>
            ))}
          </div>
        )}

        {/* Submission Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
              className={`w-full max-w-lg rounded-[28px] border p-6 shadow-2xl relative ${
                dark
                  ? "bg-slate-900 border-slate-800 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>

              <h2 className="text-xl font-extrabold mb-1">Submit Logbook Report</h2>
              <p className="text-xs text-slate-400 mb-6">
                Document your work activities, learnings, and progress for evaluation.
              </p>

              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Report Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Database Optimization Task"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                        dark
                          ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Week No.
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      required
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(Number(e.target.value))}
                      className={`w-full px-3 py-2.5 text-xs rounded-xl border outline-none text-center font-bold ${
                        dark
                          ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Summary of Activities & Key Learnings
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe tasks completed, tools used, key challenges, and solutions..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full p-3.5 text-xs rounded-xl border outline-none resize-none leading-relaxed ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Document / Evidence Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or document URL"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                      dark
                        ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
