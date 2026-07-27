import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Search,
  Send,
  Sparkles
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityMessagesPage() {
  const dark = useTheme();
  const [activeThread, setActiveThread] = useState(0);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "Kwame Asare (Student)", role: "Student", text: "Hello Dr., my industrial supervisor has approved my logbook report for Week 4.", time: "10:30 AM", isMe: false },
    { id: 2, sender: "MTN Ghana HR", role: "Recruiter", text: "Good morning, we have opened 5 new Software Engineering Intern slots for KNUST students.", time: "11:15 AM", isMe: false },
  ]);

  const threads = [
    { id: 0, name: "Kwame Asare", role: "Student", unread: 1, avatar: "KA" },
    { id: 1, name: "MTN Ghana HR", role: "Employer Recruiter", unread: 2, avatar: "MTN" },
    { id: 2, name: "Career Services Support", role: "University Office", unread: 0, avatar: "CS" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "You (Placement Office)", role: "University", text: inputText, time: "Just now", isMe: true }
    ]);
    setInputText("");
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
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    : "border-violet-200 bg-violet-100/80 text-violet-700"
                }`}
              >
                <Sparkles size={14} />
                Communication Hub
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                University Messages Center
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Communicate directly with registered students, employer supervisors, and placement coordinators.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Interface Container */}
        <div
          className={`rounded-3xl border overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-3 h-[580px] ${
            dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200/80"
          }`}
        >
          {/* Threads Sidebar */}
          <div className={`border-r p-4 space-y-4 ${dark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/60"}`}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
                  dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
                }`}
              />
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[460px]">
              {threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveThread(t.id)}
                  className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-all ${
                    activeThread === t.id
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : dark
                      ? "hover:bg-slate-800/60 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center ${activeThread === t.id ? "bg-white/20 text-white" : "bg-violet-500/20 text-violet-400"}`}>
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{t.name}</p>
                    <p className={`text-[10px] truncate ${activeThread === t.id ? "text-violet-200" : "text-slate-400"}`}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Conversation Feed */}
          <div className="md:col-span-2 flex flex-col justify-between p-6">
            <div className="pb-4 border-b border-slate-800/40 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">{threads[activeThread]?.name}</h3>
                <p className="text-[11px] text-violet-400 font-semibold">{threads[activeThread]?.role}</p>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs ${
                      m.isMe
                        ? "bg-violet-600 text-white rounded-br-none shadow-md"
                        : dark
                        ? "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60"
                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                    }`}
                  >
                    <p className="font-bold text-[10px] mb-1 opacity-80">{m.sender}</p>
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="pt-3 border-t border-slate-800/40 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to supervisor or student..."
                className={`flex-1 px-4 py-2.5 text-xs rounded-xl border outline-none ${
                  dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                }`}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-lg shadow-violet-500/20 flex items-center gap-1"
              >
                <Send size={14} /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
