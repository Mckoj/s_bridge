import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Bell,
  Send,
  CheckCircle2,
  Calendar,
  Tag,
} from "lucide-react";
import { useUniversityAnnouncements } from "../../hooks/useUniversityAnnouncements";
import type { UniversityAnnouncement } from "../../services/universityService";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";

// ─────────────────────────────────────────────────────────────────────────────
// Announcement Card
// ─────────────────────────────────────────────────────────────────────────────

function AnnouncementCard({ item }: { item: UniversityAnnouncement }) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const displayDate = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <article
      className={`p-6 rounded-3xl border shadow-xl space-y-2 ${
        dark
          ? "bg-slate-900/80 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
      aria-label={`Announcement: ${item.title}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        {item.targetGroup && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30">
            <Tag size={10} aria-hidden="true" />
            {item.targetGroup}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-semibold ml-auto">
          <Calendar size={12} aria-hidden="true" />
          {displayDate}
        </span>
      </div>
      <h3 className="font-bold text-base">{item.title}</h3>
      <p
        className={`text-xs leading-relaxed ${
          dark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {item.content}
      </p>
      {item.status && (
        <div>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
              item.status === "PUBLISHED"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
            }`}
          >
            {item.status}
          </span>
        </div>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Announcement Form
// ─────────────────────────────────────────────────────────────────────────────

const RECIPIENT_OPTIONS = [
  { value: "ALL_STUDENTS", label: "All Enrolled Students" },
  { value: "ALL_EMPLOYERS", label: "All Verified Employers" },
  { value: "ALL", label: "All Students & Employers" },
] as const;

function CreateAnnouncementForm({
  onSubmit,
  submitting,
  submitError,
  isEndpointUnavailable,
}: {
  onSubmit: (payload: {
    title: string;
    content: string;
    targetGroup: string;
  }) => Promise<boolean>;
  submitting: boolean;
  submitError: import("../../utils/apiErrors").ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetGroup, setTargetGroup] = useState("ALL_STUDENTS");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const ok = await onSubmit({ title: title.trim(), content: content.trim(), targetGroup });
    if (ok) {
      setTitle("");
      setContent("");
      setSuccessMsg("Announcement published successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const inputClass = `w-full p-3 rounded-xl border outline-none text-xs font-medium ${
    dark
      ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500"
      : "bg-slate-50 border-slate-200 text-slate-800"
  }`;

  return (
    <div
      className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
        dark
          ? "bg-slate-900/80 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <h2 className="text-base font-bold flex items-center gap-2">
        <Send size={18} className="text-violet-500" aria-hidden="true" />
        Create Announcement
      </h2>

      {/* Endpoint unavailable notice */}
      {isEndpointUnavailable && (
        <div
          className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold"
          role="status"
          aria-live="polite"
        >
          The Announcement API is not yet available on this server. Submissions
          will not be saved permanently. This feature is coming soon.
        </div>
      )}

      {/* Submit error */}
      {submitError && !submitError.isEndpointUnavailable && (
        <div
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold"
          role="alert"
          aria-live="assertive"
        >
          {submitError.message}
        </div>
      )}

      {/* Success */}
      {successMsg && (
        <div
          className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={14} aria-hidden="true" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
        <div>
          <label htmlFor="ann-recipients" className="block font-bold mb-1">
            Target Recipients
          </label>
          <select
            id="ann-recipients"
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
            className={inputClass}
          >
            {RECIPIENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ann-title" className="block font-bold mb-1">
            Announcement Title <span aria-hidden="true">*</span>
          </label>
          <input
            id="ann-title"
            type="text"
            placeholder="e.g. Logbook Submission Deadline Reminder"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            aria-required="true"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="ann-content" className="block font-bold mb-1">
            Message Content <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="ann-content"
            rows={4}
            placeholder="Type full broadcast details…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={2000}
            aria-required="true"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
          aria-busy={submitting}
          className={`w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-500/20 transition-all text-xs ${
            submitting || !title.trim() || !content.trim()
              ? "opacity-60 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {submitting ? "Publishing…" : "Publish Broadcast"}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function UniversityAnnouncementsPage() {
  const {
    announcements,
    loading,
    error,
    isEndpointUnavailable,
    submitting,
    submitError,
    submitAnnouncement,
    refetch,
  } = useUniversityAnnouncements();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Institutional Broadcast Hub"
          title="University Announcements & Broadcasts"
          description="Broadcast orientation updates, policy changes, attachment deadlines, and career fair notices to students and partner companies."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Create Form */}
          <CreateAnnouncementForm
            onSubmit={submitAnnouncement}
            submitting={submitting}
            submitError={submitError}
            isEndpointUnavailable={isEndpointUnavailable}
          />

          {/* Right: Published History */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Bell size={18} className="text-violet-500" aria-hidden="true" />
              Published Announcements
            </h2>

            {loading ? (
              <LoadingSkeleton count={3} layout="list" />
            ) : error ? (
              <ErrorState error={error} onRetry={refetch} />
            ) : isEndpointUnavailable ? (
              <EmptyState
                icon={<Bell size={28} />}
                title="Announcements Coming Soon"
                description="The Announcement API has not been deployed yet. Published announcements will appear here once the backend endpoint is available."
              />
            ) : announcements.length === 0 ? (
              <EmptyState
                icon={<Bell size={28} />}
                title="No Announcements Yet"
                description="Published announcements will appear here. Use the form on the left to create your first broadcast."
              />
            ) : (
              <div
                className="space-y-4"
                role="feed"
                aria-label="Published announcements"
                aria-busy={loading}
              >
                {announcements.map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
