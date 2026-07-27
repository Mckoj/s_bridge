import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Video,
  Building,
  Sparkles,
  Bot
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentInterviewsPage() {
  const dark = useTheme();
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "HISTORY">("UPCOMING");

  const upcomingInterviews = [
    {
      id: "int-1",
      companyName: "MTN Ghana",
      position: "Software Engineering Intern",
      date: "May 22, 2026",
      time: "10:00 AM - 10:45 AM",
      platform: "Google Meet",
      interviewer: "Kwame Nkrumah (Tech Lead)",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      notes: "System design & Data structure fundamentals review.",
    },
    {
      id: "int-2",
      companyName: "GCB Bank PLC",
      position: "Data Analyst Intern",
      date: "May 24, 2026",
      time: "02:00 PM - 02:30 PM",
      platform: "Microsoft Teams",
      interviewer: "Abena Mensah (HR Manager)",
      meetingLink: "https://teams.microsoft.com/l/meetup",
      notes: "Behavioral and SQL query assessment.",
    },
  ];

  const pastInterviews = [
    {
      id: "past-1",
      companyName: "Hubtel Ghana",
      position: "Frontend Developer Intern",
      date: "April 15, 2026",
      result: "Offer Extended",
      rating: "4.8 / 5.0",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-blue-500/20"
              : "bg-gradient-to-br from-blue-50/90 via-white to-blue-50/50 border-blue-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-blue-200 bg-blue-100/80 text-blue-700"
                }`}
              >
                <Sparkles size={14} />
                Interview Management
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                My Scheduled Interviews
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Track upcoming technical and HR interview invitations, meeting links, and interviewer notes.
              </p>
            </div>

            {/* Tab Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("UPCOMING")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "UPCOMING"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : dark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Upcoming ({upcomingInterviews.length})
              </button>
              <button
                onClick={() => setActiveTab("HISTORY")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "HISTORY"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : dark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Past History ({pastInterviews.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === "UPCOMING" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Interviews Feed */}
            <div className="lg:col-span-2 space-y-4">
              {upcomingInterviews.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 ${
                    dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 font-extrabold flex items-center justify-center">
                        <Building size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{item.position}</h3>
                        <p className="text-xs font-semibold text-blue-400">{item.companyName}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-400 py-2 border-y border-slate-800/40">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500">Date & Time</span>
                      <span className="font-semibold text-slate-300">{item.date} • {item.time}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500">Platform</span>
                      <span className="font-semibold text-slate-300">{item.platform}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500">Interviewer</span>
                      <span className="font-semibold text-slate-300">{item.interviewer}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-slate-400 italic">"{item.notes}"</p>
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                      <Video size={14} /> Join Meeting
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Mock Interview Practice Card */}
            <div className="space-y-6">
              <div className={`relative overflow-hidden p-6 rounded-3xl border shadow-xl ${dark ? "bg-slate-900/80 border-purple-500/30" : "bg-white border-purple-200"}`}>
                {/* Glassmorphic Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-md text-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-2 animate-pulse">
                    <Sparkles size={22} />
                  </div>
                  <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/40">
                    AI FEATURE • COMING SOON
                  </span>
                  <p className="text-xs font-extrabold text-white mt-2">AI Voice & Technical Simulator</p>
                  <p className="text-[11px] text-slate-300 mt-1 max-w-xs leading-relaxed font-medium">
                    Automated technical question generator and AI voice evaluator currently in development.
                  </p>
                </div>

                <div className="filter blur-xs opacity-50 pointer-events-none select-none">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">AI Interview Simulator</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Practice questions tailored to your upcoming MTN Ghana and GCB Bank interviews with AI voice analysis.
                  </p>
                  <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-500 border border-slate-700">
                    Start Mock Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200/80"}`}>
            <div className="p-6">
              <h3 className="font-bold text-base mb-4">Interview Attendance History</h3>
              {pastInterviews.map((past) => (
                <div key={past.id} className="p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-sm">{past.position}</p>
                    <p className="text-blue-400 font-semibold">{past.companyName}</p>
                    <p className="text-slate-500 mt-1">{past.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {past.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
