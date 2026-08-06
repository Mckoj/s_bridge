import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useRecruiterCandidates } from "../../hooks/useRecruiterCandidates";
import { useRecruiterInterviews } from "../../hooks/useRecruiterInterviews";
import {
  PageHeader,
  CandidateCard,
  ScheduleInterviewModal,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/recruiter";
import { Users, Search } from "lucide-react";
import type { RecruiterCandidate } from "../../services/recruiterService";

export default function RecruiterCandidatesPage() {
  const { theme } = useDashboard();
  const dark = theme === "dark";
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<RecruiterCandidate | null>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);

  const { candidates, loading, error, refetch } = useRecruiterCandidates();
  const { createInterview } = useRecruiterInterviews();

  const filtered = candidates.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.appliedRole.toLowerCase().includes(q) ||
      (c.programme && c.programme.toLowerCase().includes(q)) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleSchedule = (candidate: RecruiterCandidate) => {
    setSelectedCandidate(candidate);
    setInterviewModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Candidate Roster"
          title="Applicant Talent Pool"
          description="Explore student candidates who have applied to your company's internship postings."
        >
          <div className={`flex max-w-md items-center gap-2 rounded-xl border px-3 py-2 ${dark ? "border-slate-800 bg-slate-950/70" : "border-slate-200 bg-slate-50"} focus-within:border-emerald-500`}>
            <Search size={16} className={`shrink-0 ${dark ? "text-slate-400" : "text-slate-500"}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate by name, skills, role, or programme..."
              className={`w-full bg-transparent text-xs outline-none ${dark ? "text-white placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"}`}
            />
          </div>
        </PageHeader>

        {loading && <LoadingSkeleton count={4} layout="grid" />}

        {error && !loading && <ErrorState error={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={<Users size={28} />}
            title="No Candidates Found"
            description="No student candidates match your search filter or no applications have been submitted yet."
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((candidate) => (
              <CandidateCard
                key={candidate.applicationId}
                candidate={candidate}
                onScheduleInterview={handleSchedule}
              />
            ))}
          </div>
        )}

        <ScheduleInterviewModal
          isOpen={interviewModalOpen}
          onClose={() => {
            setInterviewModalOpen(false);
            setSelectedCandidate(null);
          }}
          applications={[]}
          selectedApplication={
            selectedCandidate
              ? {
                  id: selectedCandidate.applicationId,
                  studentId: selectedCandidate.id,
                  internshipId: "",
                  studentName: selectedCandidate.name,
                  jobTitle: selectedCandidate.appliedRole,
                  jobLocation: "",
                  status: selectedCandidate.status,
                  studentSkills: selectedCandidate.skills,
                  appliedAt: selectedCandidate.appliedAt,
                }
              : null
          }
          onSubmit={async (payload) => {
            await createInterview(payload);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
