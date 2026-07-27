import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  BarChart2,
  TrendingUp,
  Users,
  Building,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  FileSpreadsheet,
  Search,
  Star,
  Award,
  Brain,
  FileText,
  Trash2,
  Eye,
  Mail,
  Zap,
  Bot
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityReportsPage() {
  const dark = useTheme();

  // Filter States
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [semester, setSemester] = useState("Semester 2");
  const [collegeFilter, setCollegeFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [companySearch, setCompanySearch] = useState("");

  // Sample Companies Data
  const companiesData = [
    { name: "MTN Ghana", recruited: 120, acceptanceRate: "94%", rating: "4.8" },
    { name: "Stanbic Bank Ghana", recruited: 65, acceptanceRate: "91%", rating: "4.7" },
    { name: "Vodafone Ghana (Telecel)", recruited: 81, acceptanceRate: "89%", rating: "4.6" },
    { name: "Hubtel Ghana", recruited: 54, acceptanceRate: "96%", rating: "4.9" },
    { name: "GCB Bank PLC", recruited: 48, acceptanceRate: "87%", rating: "4.5" },
    { name: "Amalitech Ghana", recruited: 42, acceptanceRate: "92%", rating: "4.8" },
  ];

  // Sample Recent Reports
  const [reportsList, setReportsList] = useState([
    { id: "1", name: "Semester 2 Master Placement Report", author: "Dr. K. Mensah (Director)", date: "May 24, 2026", status: "Published" },
    { id: "2", name: "Company Performance & Satisfaction Audit", author: "Career Office", date: "May 20, 2026", status: "Published" },
    { id: "3", name: "Engineering Department Accreditation Audit", author: "Prof. E. Osei", date: "May 15, 2026", status: "Archived" },
    { id: "4", name: "Graduate Employment & Skill Gap Forecast", author: "AI Intelligence Engine", date: "May 10, 2026", status: "Published" },
  ]);

  const filteredCompanies = companiesData.filter((c) =>
    !companySearch || c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const handleDeleteReport = (id: string) => {
    setReportsList(reportsList.filter((r) => r.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Hero Section */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-violet-500/20"
              : "bg-gradient-to-br from-violet-50/90 via-white to-violet-50/50 border-violet-200/80"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    : "border-violet-200 bg-violet-100/80 text-violet-700"
                }`}
              >
                <Sparkles size={14} />
                Executive Institutional Dashboard
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Reports & Analytics
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium max-w-3xl leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Monitor placement performance, analyze internship trends, generate institutional reports, and gain AI-powered insights into student placements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => alert("Generating Comprehensive Placement Report...")}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={14} /> Generate Report
              </button>
              <button
                onClick={() => alert("Exporting Executive Summary (PDF)...")}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  dark ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Download size={14} /> Export PDF
              </button>
              <button
                onClick={() => alert("Exporting Analytics Spreadsheet (Excel)...")}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  dark ? "border-slate-800 bg-slate-900 text-emerald-400 hover:bg-slate-800" : "border-slate-200 bg-white text-emerald-600 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet size={14} /> Export Excel
              </button>
            </div>
          </div>

          {/* Interactive Filters Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/40 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className={`w-full p-2 text-xs rounded-xl border outline-none font-semibold ${
                  dark ? "bg-slate-950/70 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="2025/2026">2025/2026</option>
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className={`w-full p-2 text-xs rounded-xl border outline-none font-semibold ${
                  dark ? "bg-slate-950/70 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Summer Attachment">Summer Attachment</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">College</label>
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className={`w-full p-2 text-xs rounded-xl border outline-none font-semibold ${
                  dark ? "bg-slate-950/70 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="ALL">All Colleges</option>
                <option value="Engineering">College of Engineering</option>
                <option value="Science">College of Science</option>
                <option value="Business">College of Business</option>
                <option value="Humanities">Humanities & Social Sci</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className={`w-full p-2 text-xs rounded-xl border outline-none font-semibold ${
                  dark ? "bg-slate-950/70 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="ALL">All Departments</option>
                <option value="CS">Computer Science</option>
                <option value="EE">Electrical Engineering</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Placement Status</label>
              <select
                className={`w-full p-2 text-xs rounded-xl border outline-none font-semibold ${
                  dark ? "bg-slate-950/70 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="ALL">All Statuses</option>
                <option value="PLACED">Placed</option>
                <option value="PENDING">Pending Approval</option>
                <option value="AT_RISK">At Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Region</label>
              <select
                className={`w-full p-2 text-xs rounded-xl border outline-none font-semibold ${
                  dark ? "bg-slate-950/70 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value="ALL">All Regions (Ghana)</option>
                <option value="ACCRA">Greater Accra</option>
                <option value="ASHANTI">Ashanti Region</option>
                <option value="WESTERN">Western Region</option>
              </select>
            </div>
          </div>
        </div>

        {/* Six KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-400 font-bold flex items-center justify-center">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +12%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold">12,458</p>
              <p className="text-xs font-bold text-slate-400">Total Eligible</p>
              <p className="text-[10px] text-slate-500 mt-1">Enrolled students</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 font-bold flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +4.2%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-emerald-400">62.9%</p>
              <p className="text-xs font-bold text-slate-400">Placement Rate</p>
              <p className="text-[10px] text-slate-500 mt-1">7,842 students placed</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/15 text-violet-400 font-bold flex items-center justify-center">
                <Building size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                +22 New
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold">184</p>
              <p className="text-xs font-bold text-slate-400">Active Partners</p>
              <p className="text-[10px] text-slate-500 mt-1">Verified employers</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-400 font-bold flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                -15%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-red-400">346</p>
              <p className="text-xs font-bold text-slate-400">Students At Risk</p>
              <p className="text-[10px] text-slate-500 mt-1">Unplaced past deadline</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between ${dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 font-bold flex items-center justify-center">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                -3 Days
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold">21 Days</p>
              <p className="text-xs font-bold text-slate-400">Avg Placement Time</p>
              <p className="text-[10px] text-slate-500 mt-1">Application to offer</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border shadow-xl flex flex-col justify-between relative overflow-hidden ${dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 font-bold flex items-center justify-center">
                <Bot size={20} />
              </div>
              <span className="text-[9px] font-extrabold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                Coming Soon
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-purple-400">78%</p>
              <p className="text-xs font-bold text-slate-400">AI Forecast</p>
              <p className="text-[10px] text-slate-500 mt-1">XGBoost prediction</p>
            </div>
          </div>
        </div>

        {/* Placement Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Placement Trend Progress */}
          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <BarChart2 size={18} className="text-violet-500" /> Placement Trend (Jan - Dec)
              </h3>
              <span className="text-xs font-semibold text-violet-400">+18% YoY Growth</span>
            </div>

            <div className="space-y-3 text-xs pt-2">
              {[
                { month: "Jan - Feb", count: 420, pct: "35%" },
                { month: "Mar - Apr", count: 1840, pct: "65%" },
                { month: "May - Jun (Peak)", count: 3200, pct: "92%" },
                { month: "Jul - Aug", count: 1560, pct: "70%" },
                { month: "Sep - Oct", count: 610, pct: "45%" },
                { month: "Nov - Dec", count: 212, pct: "25%" },
              ].map((m) => (
                <div key={m.month} className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-medium">
                    <span>{m.month}</span>
                    <span className="font-bold text-slate-300">{m.count} Placements</span>
                  </div>
                  <div className="w-full bg-slate-800/40 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-500 h-2 rounded-full" style={{ width: m.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Placement Horizontal Bar Chart */}
          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Award size={18} className="text-violet-500" /> Placement Rate by Department
            </h3>

            <div className="space-y-3 text-xs pt-2">
              {[
                { name: "Computer Science", pct: 92, color: "bg-emerald-500" },
                { name: "Electrical Engineering", pct: 89, color: "bg-blue-500" },
                { name: "Mechanical Engineering", pct: 85, color: "bg-indigo-500" },
                { name: "Civil Engineering", pct: 81, color: "bg-purple-500" },
                { name: "Business Administration", pct: 78, color: "bg-amber-500" },
                { name: "Economics", pct: 74, color: "bg-slate-500" },
              ].map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="font-bold">{d.name}</span>
                    <span className="font-extrabold text-violet-400">{d.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800/40 rounded-full h-2 overflow-hidden">
                    <div className={`${d.color} h-2 rounded-full`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Analytics Table */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Building size={18} className="text-violet-500" /> Top Recruiting Employers & Acceptance Rates
            </h3>

            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search employer..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border outline-none ${
                  dark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-950/50 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                  <th className="py-3.5 px-6">Company Name</th>
                  <th className="py-3.5 px-6">Students Recruited</th>
                  <th className="py-3.5 px-6">Offer Acceptance Rate</th>
                  <th className="py-3.5 px-6">Avg Student Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-medium">
                {filteredCompanies.map((c) => (
                  <tr key={c.name} className={dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}>
                    <td className="py-4 px-6 font-bold">{c.name}</td>
                    <td className="py-4 px-6 font-semibold">{c.recruited} Students</td>
                    <td className="py-4 px-6 text-emerald-400 font-bold">{c.acceptanceRate}</td>
                    <td className="py-4 px-6 text-amber-400 font-bold flex items-center gap-1">
                      <Star size={13} fill="currentColor" /> {c.rating} / 5.0
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Risk Analytics Cards */}
        <div className="space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={18} /> Student Support & Intervention Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block">Students without CVs</span>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">412</p>
            </div>
            <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block">No Applications Yet</span>
              <p className="text-2xl font-extrabold text-red-400 mt-1">218</p>
            </div>
            <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block">Rejected &gt; 3 Times</span>
              <p className="text-2xl font-extrabold text-red-400 mt-1">89</p>
            </div>
            <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block">Awaiting Approval</span>
              <p className="text-2xl font-extrabold text-blue-400 mt-1">54</p>
            </div>
            <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block">Without Supervisors</span>
              <p className="text-2xl font-extrabold text-purple-400 mt-1">115</p>
            </div>
            <div className={`p-4 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="text-xs font-bold text-slate-400 block">Inactive Accounts</span>
              <p className="text-2xl font-extrabold text-slate-400 mt-1">43</p>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-6 relative overflow-hidden ${dark ? "bg-slate-900/80 border-purple-500/30" : "bg-purple-50/50 border-purple-200"}`}>
          {/* Glassmorphic Blur Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-md text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20 animate-pulse">
              <Sparkles size={28} />
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 tracking-wider">
              AI FEATURE • COMING SOON
            </span>
            <h4 className="text-lg font-extrabold text-white mt-2">AI Placement Intelligence & SHAP Model</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed font-medium">
              Institutional SHAP explainability factor analysis and ML placement forecasts are currently in model training.
            </p>
          </div>

          <div className="filter blur-xs opacity-40 pointer-events-none select-none">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-purple-400">
                <Brain size={20} /> AI Predictive Intelligence & SHAP Explainability
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Coming Soon
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs mt-4">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <span className="font-bold text-purple-400 block">Predicted Placement Rate</span>
                <p className="text-3xl font-extrabold text-emerald-400">76%</p>
                <p className="text-slate-400">Expected overall placement before semester end date.</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <span className="font-bold text-purple-400 block">High Demand Industry Skills</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Python", "React", "Node.js", "SQL", "AWS", "Power BI", "Machine Learning"].map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <span className="font-bold text-purple-400 block">Skill Gap Analysis</span>
                <div className="flex flex-wrap gap-1">
                  {["Docker", "Cloud Computing", "Git", "Cybersecurity"].map((sg) => (
                    <span key={sg} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      {sg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <span className="font-bold text-purple-400 block">Explainable AI (SHAP) Factors</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span>Technical Skills</span><span className="font-bold text-purple-400">42%</span></div>
                  <div className="flex justify-between"><span>Portfolio Projects</span><span className="font-bold text-purple-400">25%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`}>
          <h3 className="text-base font-bold flex items-center gap-2">
            <FileText size={18} className="text-violet-500" /> Generated Institutional Reports
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-950/50 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                  <th className="py-3.5 px-6">Report Name</th>
                  <th className="py-3.5 px-6">Generated By</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-medium">
                {reportsList.map((r) => (
                  <tr key={r.id} className={dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}>
                    <td className="py-4 px-6 font-bold">{r.name}</td>
                    <td className="py-4 px-6 text-slate-400">{r.author}</td>
                    <td className="py-4 px-6 text-slate-400">{r.date}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button onClick={() => alert(`Previewing ${r.name}...`)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => alert(`Downloading ${r.name}...`)} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                        <Download size={14} />
                      </button>
                      <button onClick={() => handleDeleteReport(r.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Zap className="text-amber-400" size={18} /> Administrative Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Placement Report", icon: FileText },
              { label: "Department Report", icon: BarChart2 },
              { label: "Company Report", icon: Building },
              { label: "Export Student Data", icon: Download },
              { label: "Export Analytics", icon: FileSpreadsheet },
              { label: "Email Report", icon: Mail },
            ].map((qa) => (
              <button
                key={qa.label}
                onClick={() => alert(`Triggered action: ${qa.label}`)}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  dark ? "bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-300" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <qa.icon size={20} className="text-violet-400" />
                <span className="text-xs font-bold">{qa.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
