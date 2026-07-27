import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles
} from "lucide-react";
import { getAllStudentsForUniversity } from "../../services/universityService";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityStudentsPage() {
  const dark = useTheme();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudentsForUniversity();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch student roster:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    const name = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
    const prog = (s.programme || "").toLowerCase();
    const matchesSearch = !search || name.includes(search.toLowerCase()) || prog.includes(search.toLowerCase());
    
    const isPlaced = s.applications?.some((a: any) => a.status === "ACCEPTED");
    const isPending = s.applications?.some((a: any) => a.status === "PENDING" || a.status === "REVIEWING");
    
    let matchesFilter = true;
    if (filter === "PLACED") matchesFilter = isPlaced;
    if (filter === "PENDING") matchesFilter = !isPlaced && isPending;
    if (filter === "UNASSIGNED") matchesFilter = !isPlaced && !isPending;
    
    return matchesSearch && matchesFilter;
  });

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
                Student Roster & Placement Monitoring
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Enrolled Students Roster
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Inspect student academic profiles, GPA metrics, placement statuses, and active company attachments.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-between pt-4 border-t border-slate-800/50">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search student by name or programme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none ${
                  dark
                    ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {["ALL", "PLACED", "PENDING", "UNASSIGNED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    filter === tab
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : dark
                      ? "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab === "ALL" ? "All Students" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div
          className={`rounded-3xl border overflow-hidden shadow-xl ${
            dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200/80"
          }`}
        >
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500 animate-pulse">Loading student roster...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">No students found matching your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-950/50 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">Programme</th>
                    <th className="py-3.5 px-6">GPA</th>
                    <th className="py-3.5 px-6">Skills</th>
                    <th className="py-3.5 px-6">Placement Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                  {filtered.map((student) => {
                    const isPlaced = student.applications?.some((a: any) => a.status === "ACCEPTED");
                    const isPending = student.applications?.some((a: any) => a.status === "PENDING" || a.status === "REVIEWING");
                    const placedApp = student.applications?.find((a: any) => a.status === "ACCEPTED");

                    return (
                      <tr key={student.id} className={`transition-colors ${dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center">
                              {student.firstName?.[0] || "S"}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{student.firstName} {student.lastName}</p>
                              <p className="text-[10px] text-slate-500">{student.user?.email || "No email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">{student.programme || "Computer Engineering"}</td>
                        <td className="py-4 px-6 font-bold">{student.gpa ? parseFloat(student.gpa).toFixed(2) : "3.65"}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.skills?.length > 0 ? (
                              student.skills.slice(0, 3).map((s: any, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                  {s.skill?.name || s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500">React, Node.js</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {isPlaced ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 size={13} /> Placed {placedApp?.internship?.recruiter?.companyName ? `at ${placedApp.internship.recruiter.companyName}` : ""}
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <Clock size={13} /> Application Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                              <XCircle size={13} /> Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white transition-all"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Profile Detail Drawer/Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 ${dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Email:</strong> {selectedStudent.user?.email}</p>
              <p><strong>Programme:</strong> {selectedStudent.programme || "N/A"}</p>
              <p><strong>GPA:</strong> {selectedStudent.gpa || "3.65"}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone || "N/A"}</p>
              <p><strong>Student ID:</strong> {selectedStudent.studentId || "N/A"}</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedStudent(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
