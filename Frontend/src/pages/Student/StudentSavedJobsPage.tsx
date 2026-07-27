import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Building,
  MapPin,
  Sparkles,
  ExternalLink,
  Trash2
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentSavedJobsPage() {
  const dark = useTheme();
  const [activeTab, setActiveTab] = useState<"SAVED" | "RECENT" | "RECOMMENDED" | "EXPIRED">("SAVED");

  const [savedJobs, setSavedJobs] = useState([
    {
      id: "job-1",
      title: "Software Engineering Intern",
      company: "MTN Ghana",
      location: "Kumasi, Ghana",
      type: "Hybrid",
      duration: "6 Months",
      salary: "GH₵ 1,800 / month",
    },
    {
      id: "job-2",
      title: "Frontend Developer Intern",
      company: "Hubtel Ghana",
      location: "Accra, Ghana",
      type: "Remote",
      duration: "3 Months",
      salary: "GH₵ 1,500 / month",
    },
  ]);

  const handleRemove = (id: string) => {
    setSavedJobs(savedJobs.filter((j) => j.id !== id));
  };

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
                Bookmarked Listings
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Saved & Bookmarked Opportunities
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Access saved internship listings, recently viewed roles, and expired bookmarks.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {(["SAVED", "RECENT", "RECOMMENDED", "EXPIRED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : dark
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        {savedJobs.length === 0 ? (
          <div className={`p-12 rounded-3xl border text-center text-xs text-slate-500 ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            No saved jobs in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((item) => (
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
                      <h3 className="font-bold text-base">{item.title}</h3>
                      <p className="text-xs font-semibold text-blue-400">{item.company}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={13} /> {item.location} ({item.type})</span>
                  <span>•</span>
                  <span>{item.salary}</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-1">
                    Apply Now <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
