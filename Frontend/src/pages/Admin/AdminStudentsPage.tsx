import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminStudents } from "../../hooks/useAdminStudents";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState } from "../../components/admin";
import { Users, Search, Trash2, Mail, GraduationCap } from "lucide-react";

export default function AdminStudentsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const { students, loading, error, deleteStudent, deletingId, refetch } = useAdminStudents();

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.programme && s.programme.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="User Management"
          title="Student Accounts Directory"
          description="View and manage all registered student users across universities."
        />

        {/* Search Bar */}
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
          dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by student name, email, or program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-transparent text-xs focus:outline-none ${
              dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {loading && <LoadingSkeleton count={6} layout="grid" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<Users size={32} />}
            title="No Students Found"
            description={search ? "No student accounts match your search query." : "No student user accounts found in the database."}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((student) => (
              <div
                key={student.id}
                className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  dark ? "bg-slate-900/80 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {student.name[0]}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold leading-tight ${dark ? "text-white" : "text-slate-800"}`}>
                          {student.name}
                        </h4>
                        <p className={`text-xs flex items-center gap-1 mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          <Mail size={12} /> {student.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1 text-xs">
                    {student.programme && (
                      <p className={`flex items-center gap-1.5 ${dark ? "text-slate-300" : "text-slate-600"}`}>
                        <GraduationCap size={14} className="text-slate-400" />
                        <span>{student.programme}</span>
                      </p>
                    )}
                    {typeof student.gpa === "number" && (
                      <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        GPA: <span className="font-semibold">{student.gpa}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between">
                  <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    Joined {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={async () => {
                      if (confirm(`Are you sure you want to delete ${student.name}'s account?`)) {
                        await deleteStudent(student.id);
                      }
                    }}
                    disabled={deletingId === student.id}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Student"
                  >
                    <Trash2 size={16} />
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
