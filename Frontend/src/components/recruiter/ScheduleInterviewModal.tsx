import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import type { ScheduleInterviewPayload, RecruiterApplication } from "../../services/recruiterService";
import { X, Calendar, Video } from "lucide-react";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: RecruiterApplication[];
  selectedApplication?: RecruiterApplication | null;
  onSubmit: (payload: ScheduleInterviewPayload) => Promise<void>;
  loading?: boolean;
}

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  applications,
  selectedApplication,
  onSubmit,
  loading,
}: ScheduleInterviewModalProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [applicationId, setApplicationId] = useState(selectedApplication?.id || "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("30 Mins");
  const [platform, setPlatform] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    if (selectedApplication) {
      setApplicationId(selectedApplication.id);
    } else if (applications.length > 0 && !applicationId) {
      setApplicationId(applications[0].id);
    }
  }, [selectedApplication, applications]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const targetAppId = selectedApplication?.id || applicationId;
    if (!targetAppId || !scheduledAt || !meetingLink.trim() || !interviewer.trim()) {
      setErrorMsg("Please fill in candidate application, date/time, meeting link, and interviewer name.");
      return;
    }

    try {
      await onSubmit({
        applicationId: targetAppId,
        scheduledAt,
        duration,
        platform,
        meetingLink,
        interviewer,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to schedule interview.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
          dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-emerald-500" />
            <h3 className="text-lg font-extrabold">Schedule Candidate Interview</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1">Select Candidate & Application *</label>
            <select
              value={selectedApplication?.id || applicationId}
              disabled={!!selectedApplication}
              onChange={(e) => setApplicationId(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.studentName} — {app.jobTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30 Mins, 45 Mins"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Zoom">Zoom</option>
                <option value="In Person">In Person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Interviewer Name *</label>
              <input
                type="text"
                required
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="e.g. Sarah Jenkins (Tech Lead)"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                  dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Meeting Link *</label>
            <input
              type="url"
              required
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xyz-abc-def"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Notes / Instructions</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Prepare system architecture presentation..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                dark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Video size={14} />
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
