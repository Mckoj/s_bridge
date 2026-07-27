import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Bell,
  Send,
  Sparkles,
  CheckCircle2
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityAnnouncementsPage() {
  const dark = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipients, setRecipients] = useState("ALL_STUDENTS");
  const [sentMsg, setSentMsg] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState([
    {
      id: "ann-1",
      title: "Industrial Attachment Logbook Submission Deadline",
      content: "All Level 300 engineering students must submit their Week 6 progress logbook by May 31st.",
      recipients: "All Engineering Students",
      date: "May 20, 2026",
    },
    {
      id: "ann-2",
      title: "Upcoming KNUST Annual Career Fair 2026",
      content: "Registration is open for over 45 partner companies attending the 2026 Career Fair.",
      recipients: "All Students & Employers",
      date: "May 18, 2026",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnn = {
      id: `ann-${Date.now()}`,
      title,
      content,
      recipients: recipients === "ALL_STUDENTS" ? "All Students" : recipients,
      date: "Just now",
    };

    setAnnouncements([newAnn, ...announcements]);
    setTitle("");
    setContent("");
    setSentMsg("Broadcast announcement published successfully!");
    setTimeout(() => setSentMsg(null), 3000);
  };

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
                Institutional Broadcast Hub
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                University Announcements & Broadcasts
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Broadcast orientation updates, policy changes, attachment deadlines, and career fair notices to students and partner companies.
              </p>
            </div>
          </div>
        </div>

        {sentMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} /> {sentMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Announcement Form */}
          <div
            className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              dark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <h3 className="text-base font-bold flex items-center gap-2">
              <Send size={18} className="text-violet-500" />
              Create Announcement
            </h3>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Target Recipients</label>
                <select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none font-medium ${
                    dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="ALL_STUDENTS">All Enrolled Students</option>
                  <option value="COMPUTER_SCIENCE">Computer Science Dept Only</option>
                  <option value="ENGINEERING">College of Engineering Only</option>
                  <option value="ALL_EMPLOYERS">All Verified Employers</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Announcement Title</label>
                <input
                  type="text"
                  placeholder="e.g. Logbook Submission Deadline Reminder"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={`w-full p-3 rounded-xl border outline-none ${
                    dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Message Content</label>
                <textarea
                  rows={4}
                  placeholder="Type full broadcast details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className={`w-full p-3 rounded-xl border outline-none ${
                    dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-500/20"
              >
                Publish Broadcast
              </button>
            </form>
          </div>

          {/* Published Announcements History */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Bell size={18} className="text-violet-500" />
              Published Announcements History
            </h3>

            <div className="space-y-4">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-3xl border shadow-xl space-y-2 ${
                    dark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30">
                      Target: {item.recipients}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-base">{item.title}</h4>
                  <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
