import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  ClipboardList,
  Sparkles,
  Download
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityDepartmentsPage() {
  const dark = useTheme();

  const departments = [
    {
      id: "dept-1",
      name: "Computer Science",
      totalStudents: 260,
      placed: 240,
      pending: 15,
      rejected: 5,
      placementRate: "92.4%",
      avgCgpa: "3.68",
      topCompanies: "MTN, Hubtel, Google Africa",
      topSkills: "React, Node.js, Python",
      aiPrediction: "Projected 95% placement by term end",
    },
    {
      id: "dept-2",
      name: "Electrical & Electronic Engineering",
      totalStudents: 202,
      placed: 180,
      pending: 18,
      rejected: 4,
      placementRate: "89.1%",
      avgCgpa: "3.55",
      topCompanies: "ECG, Vodafone, Huawei",
      topSkills: "Embedded Systems, MATLAB, C++",
      aiPrediction: "High demand in energy sector",
    },
    {
      id: "dept-3",
      name: "Information Technology",
      totalStudents: 223,
      placed: 195,
      pending: 20,
      rejected: 8,
      placementRate: "87.3%",
      avgCgpa: "3.48",
      topCompanies: "GCB Bank, Telecel, Amalitech",
      topSkills: "Cybersecurity, SQL, Networking",
      aiPrediction: "Requires 10 more cyber slots",
    },
  ];

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
                Departmental Management & Analytics
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Academic Departments Overview
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Department placement rates, average CGPA, top employer relationships, and AI demand predictions.
              </p>
            </div>

            <button
              onClick={() => alert("Downloading Department Performance Summary...")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-500/20"
            >
              <Download size={15} /> Export Department Reports
            </button>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4 ${
                dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center">
                    <ClipboardList size={20} />
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {dept.placementRate} Placed
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">{dept.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Total Students: {dept.totalStudents} | Placed: {dept.placed}</p>

                <div className="mt-4 space-y-2 text-xs border-t border-slate-800/40 pt-3">
                  <p><strong>Average CGPA:</strong> {dept.avgCgpa}</p>
                  <p><strong>Top Hiring Employers:</strong> {dept.topCompanies}</p>
                  <p><strong>Demanded Skills:</strong> {dept.topSkills}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[10px] uppercase text-violet-400">AI Placement Forecast</span>
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    AI Feature • Coming Soon
                  </span>
                </div>
                {dept.aiPrediction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
