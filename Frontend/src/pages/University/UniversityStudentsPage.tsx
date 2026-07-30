import { useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  X,
} from "lucide-react";
import { useUniversityStudents } from "../../hooks/useUniversityStudents";
import type { UniversityStudent } from "../../services/universityService";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatGpa(gpa: string | number | null): string {
  if (gpa === null || gpa === undefined) return "Not Set";
  const parsed = parseFloat(String(gpa));
  if (isNaN(parsed)) return "Not Set";
  return parsed.toFixed(2);
}


function getStudentInitial(student: UniversityStudent): string {
  return student.firstName?.[0]?.toUpperCase() ?? "?";
}

function getStudentDisplayName(student: UniversityStudent): string {
  const parts = [student.firstName, student.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Unknown Student";
}

// ─────────────────────────────────────────────────────────────────────────────
// Placement Status Badge
// ─────────────────────────────────────────────────────────────────────────────

function PlacementBadge({
  status,
  placedAt,
}: {
  status: UniversityStudent["placementStatus"];
  placedAt: string | null;
}) {
  if (status === "PLACED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 size={13} aria-hidden="true" />
        {placedAt ? `Placed at ${placedAt}` : "Placed"}
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Clock size={13} aria-hidden="true" />
        Application Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
      <XCircle size={13} aria-hidden="true" />
      Unassigned
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Detail Modal
// ─────────────────────────────────────────────────────────────────────────────

function StudentModal({
  student,
  onClose,
}: {
  student: UniversityStudent;
  onClose: () => void;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
    >
      <div
        className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl space-y-4 ${
          dark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2
            id="student-modal-title"
            className="text-lg font-bold"
          >
            {getStudentDisplayName(student)}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close student profile"
            className={`p-2 rounded-xl transition-all ${
              dark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <dl className="space-y-2 text-xs">
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-500">Email</dt>
            <dd>{student.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-500">Programme</dt>
            <dd>{student.programme ?? "Not Set"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-500">GPA</dt>
            <dd>{formatGpa(student.gpa)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-500">Phone</dt>
            <dd>{student.phone ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-500">Student ID</dt>
            <dd>{student.studentId ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-500">Placement Status</dt>
            <dd>
              <PlacementBadge
                status={student.placementStatus}
                placedAt={student.placedAt}
              />
            </dd>
          </div>
          <div className="flex justify-between items-start">
            <dt className="font-semibold text-slate-500">Skills</dt>
            <dd className="text-right max-w-[60%]">
              {student.skills.length > 0
                ? student.skills.join(", ")
                : "No Skills Added"}
            </dd>
          </div>
        </dl>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter tabs config
// ─────────────────────────────────────────────────────────────────────────────

type FilterTab = "ALL" | "PLACED" | "PENDING" | "UNASSIGNED";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "ALL", label: "All Students" },
  { key: "PLACED", label: "Placed" },
  { key: "PENDING", label: "Pending" },
  { key: "UNASSIGNED", label: "Unassigned" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function UniversityStudentsPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const { students, loading, error, refetch } = useUniversityStudents();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const [selectedStudent, setSelectedStudent] =
    useState<UniversityStudent | null>(null);

  // Memoized filter to avoid recomputing on every render
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const name = getStudentDisplayName(s).toLowerCase();
      const prog = (s.programme ?? "").toLowerCase();
      const matchesSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        prog.includes(search.toLowerCase());

      let matchesFilter = true;
      if (filter === "PLACED") matchesFilter = s.placementStatus === "PLACED";
      else if (filter === "PENDING")
        matchesFilter = s.placementStatus === "PENDING";
      else if (filter === "UNASSIGNED")
        matchesFilter = s.placementStatus === "UNASSIGNED";

      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Student Roster & Placement Monitoring"
          title="Enrolled Students Roster"
          description="Inspect student academic profiles, placement statuses, and active company attachments."
        >
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                id="student-search"
                placeholder="Search by name or programme…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search students by name or programme"
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none ${
                  dark
                    ? "bg-slate-950/60 border-slate-800 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
            </div>

            <div
              className="flex items-center gap-2 overflow-x-auto w-full md:w-auto"
              role="tablist"
              aria-label="Filter students by placement status"
            >
              {FILTER_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={filter === key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    filter === key
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                      : dark
                      ? "bg-slate-800/60 text-slate-400 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </PageHeader>

        {/* Student Table */}
        <div
          className={`rounded-3xl border overflow-hidden shadow-xl ${
            dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200/80"
          }`}
        >
          {loading ? (
            <div className="p-6">
              <LoadingSkeleton count={5} layout="list" />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorState error={error} onRetry={refetch} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<Users size={28} />}
                title={
                  search || filter !== "ALL"
                    ? "No Students Match Your Filter"
                    : "No Students Enrolled"
                }
                description={
                  search || filter !== "ALL"
                    ? "Try adjusting your search or filter criteria."
                    : "No students have been enrolled in this university yet."
                }
                action={
                  (search || filter !== "ALL")
                    ? {
                        label: "Clear Filters",
                        onClick: () => {
                          setSearch("");
                          setFilter("ALL");
                        },
                      }
                    : undefined
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-left border-collapse"
                aria-label="Student roster"
              >
                <thead>
                  <tr
                    className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                      dark
                        ? "border-slate-800 bg-slate-950/50 text-slate-400"
                        : "border-slate-100 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <th scope="col" className="py-3.5 px-6">Student Name</th>
                    <th scope="col" className="py-3.5 px-6">Programme</th>
                    <th scope="col" className="py-3.5 px-6">GPA</th>
                    <th scope="col" className="py-3.5 px-6">Skills</th>
                    <th scope="col" className="py-3.5 px-6">Placement Status</th>
                    <th scope="col" className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                  {filtered.map((student) => (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-400 font-extrabold flex items-center justify-center shrink-0"
                            aria-hidden="true"
                          >
                            {getStudentInitial(student)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">
                              {getStudentDisplayName(student)}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {student.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {student.programme ?? (
                          <span className="text-slate-500 italic">Not Set</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold">
                        {formatGpa(student.gpa)}
                      </td>
                      <td className="py-4 px-6">
                        {student.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">
                            No Skills Added
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <PlacementBadge
                          status={student.placementStatus}
                          placedAt={student.placedAt}
                        />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          aria-label={`View profile of ${getStudentDisplayName(student)}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white transition-all cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </DashboardLayout>
  );
}
