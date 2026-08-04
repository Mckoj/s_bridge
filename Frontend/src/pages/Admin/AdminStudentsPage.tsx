import { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAdminStudents } from "../../hooks/useAdminStudents";
import { PageHeader, LoadingSkeleton, EmptyState, ErrorState, ConfirmDialog } from "../../components/admin";
import { Users, Search, Trash2, Mail, GraduationCap } from "lucide-react";

export default function AdminStudentsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { students, loading, error, deleteStudent, deletingId, refetch } = useAdminStudents();

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query) || (s.programme || "").toLowerCase().includes(query));
  }, [students, search]);

  const pendingStudent = students.find((s) => s.id === pendingDeleteId);

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    await deleteStudent(pendingDeleteId);
    setPendingDeleteId(null);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        <PageHeader badge="User Management" title="Student Accounts Directory" description="Review learners across the platform and remove accounts if required." />

        <div className={`flex items-center gap-3 rounded-2xl border p-4 ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
          <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input type="text" placeholder="Search by student name, email, or programme…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search students" className={`w-full bg-transparent text-xs focus:outline-none ${dark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`} />
        </div>

        {loading && <LoadingSkeleton count={6} layout="list" />}
        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && <EmptyState icon={<Users size={32} />} title="No Students Found" description={search ? "No student accounts match your search query." : "No student user accounts found in the database."} />}

        {!loading && !error && filtered.length > 0 && (
          <div className={`overflow-hidden rounded-3xl border shadow-sm ${dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" aria-label="Students table">
                <thead>
                  <tr className={`border-b text-[11px] font-extrabold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-800/40 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                    <th scope="col" className="p-4">Student</th>
                    <th scope="col" className="p-4">Email</th>
                    <th scope="col" className="p-4">Programme</th>
                    <th scope="col" className="p-4">Joined</th>
                    <th scope="col" className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${dark ? "divide-slate-800/40" : "divide-slate-100"}`}>
                  {filtered.map((student) => (
                    <tr key={student.id} className={`transition-colors ${dark ? "hover:bg-slate-800/40" : "hover:bg-slate-50"}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">{student.name[0]}</div>
                          <div>
                            <p className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{student.name}</p>
                            {student.studentId && <p className={`mt-0.5 text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>ID {student.studentId}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-slate-400" />
                          <span className={dark ? "text-slate-300" : "text-slate-600"}>{student.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap size={14} className="text-slate-400" />
                          <span className={dark ? "text-slate-400" : "text-slate-500"}>{student.programme || "—"}</span>
                        </div>
                      </td>
                      <td className={`p-4 ${dark ? "text-slate-400" : "text-slate-500"}`}>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => setPendingDeleteId(student.id)} disabled={deletingId === student.id} aria-label={`Delete ${student.name}'s account`} className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog open={pendingDeleteId !== null} title="Delete Student Account" description={pendingStudent ? `Are you sure you want to permanently delete ${pendingStudent.name}'s account? This action cannot be undone.` : "Are you sure you want to delete this student account? This action cannot be undone."} confirmLabel="Delete Account" cancelLabel="Cancel" loading={deletingId === pendingDeleteId} variant="danger" onConfirm={handleConfirmDelete} onCancel={() => setPendingDeleteId(null)} />
    </DashboardLayout>
  );
}
