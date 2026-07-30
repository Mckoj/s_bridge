import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useRecruiterApprovals } from "../../hooks/useRecruiterApprovals";
import type { UniversityRecruiter } from "../../services/universityService";
import {
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../../components/university";
import PageHeader from "../../components/university/PageHeader";

// ─────────────────────────────────────────────────────────────────────────────
// Pending Recruiter Card
// ─────────────────────────────────────────────────────────────────────────────

function PendingRecruiterCard({
  rec,
  approving,
  onApprove,
}: {
  rec: UniversityRecruiter;
  approving: boolean;
  onApprove: (id: string) => void;
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <div
      className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between gap-4 ${
        dark
          ? "bg-slate-900/80 border-slate-800/80 text-white"
          : "bg-white border-slate-200/80 text-slate-900"
      }`}
      role="listitem"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center"
          aria-hidden="true"
        >
          <Building size={24} />
        </div>
        <div>
          <h3 className="font-bold text-base">{rec.companyName}</h3>
          <p className="text-xs text-slate-400">{rec.email ?? "—"}</p>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">
            Status: Pending Verification
          </p>
        </div>
      </div>

      <button
        onClick={() => onApprove(rec.id)}
        disabled={approving}
        aria-label={`Approve ${rec.companyName}`}
        aria-busy={approving}
        className={`px-5 py-2.5 rounded-2xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 transition-all ${
          approving ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {approving ? "Approving…" : "Approve"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Verified Employers Table
// ─────────────────────────────────────────────────────────────────────────────

function VerifiedEmployersTable({
  recruiters,
}: {
  recruiters: UniversityRecruiter[];
}) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  if (recruiters.length === 0) {
    return (
      <EmptyState
        icon={<ShieldCheck size={28} />}
        title="No Verified Employers Yet"
        description="Approved employers will appear here after recruiter verifications are completed."
      />
    );
  }

  return (
    <div
      className={`rounded-3xl border overflow-hidden shadow-xl ${
        dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200/80"
      }`}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse text-xs"
          aria-label="Verified employer partners"
        >
          <thead>
            <tr
              className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                dark
                  ? "border-slate-800 bg-slate-950/50 text-slate-400"
                  : "border-slate-100 bg-slate-50 text-slate-500"
              }`}
            >
              <th scope="col" className="py-3.5 px-6">Company Name</th>
              <th scope="col" className="py-3.5 px-6">Email Contact</th>
              <th scope="col" className="py-3.5 px-6">Website</th>
              <th scope="col" className="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 font-medium">
            {recruiters.map((rec) => (
              <tr
                key={rec.id}
                className={dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}
              >
                <td className="py-4 px-6 font-bold">{rec.companyName}</td>
                <td className="py-4 px-6 text-slate-400">{rec.email ?? "—"}</td>
                <td className="py-4 px-6">
                  {rec.companyWebsite ? (
                    <a
                      href={rec.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline"
                      aria-label={`Visit ${rec.companyName} website`}
                    >
                      {rec.companyWebsite}
                    </a>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={12} aria-hidden="true" />
                    Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Approve Error Banner
// ─────────────────────────────────────────────────────────────────────────────

function ApproveErrorBanner({
  error,
  onDismiss,
}: {
  error: import("../../utils/apiErrors").ClassifiedApiError;
  onDismiss: () => void;
}) {
  return (
    <div
      className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center justify-between"
      role="alert"
      aria-live="assertive"
    >
      <span>{error.message}</span>
      <button
        onClick={onDismiss}
        className="ml-4 underline cursor-pointer"
        aria-label="Dismiss error"
      >
        Dismiss
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function UniversityApprovalsPage() {
  const {
    pendingRecruiters,
    approvedRecruiters,
    loading,
    error,
    approving,
    approveError,
    handleApprove,
    refetch,
  } = useRecruiterApprovals();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Approval Center"
          title="Verification & Approval Center"
          description="Review registered employer recruiter accounts and verify company credentials for placement posting."
        />

        {/* Approve action error */}
        {approveError && (
          <ApproveErrorBanner
            error={approveError}
            onDismiss={refetch}
          />
        )}

        {/* Pending Queue */}
        <section aria-labelledby="pending-heading">
          <h2
            id="pending-heading"
            className="text-lg font-bold flex items-center gap-2 mb-4"
          >
            <Clock className="text-amber-500" size={20} aria-hidden="true" />
            Pending Recruiter Verifications
            <span
              className="ml-1 text-sm font-bold text-amber-400"
              aria-live="polite"
              aria-atomic="true"
            >
              ({loading ? "—" : pendingRecruiters.length})
            </span>
          </h2>

          {loading ? (
            <LoadingSkeleton count={3} layout="grid" />
          ) : error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : pendingRecruiters.length === 0 ? (
            <EmptyState
              icon={<Clock size={28} />}
              title="No Pending Verifications"
              description="All registered employer accounts have been verified. New recruiter sign-ups will appear here."
            />
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              role="list"
              aria-label="Recruiters awaiting verification"
            >
              {pendingRecruiters.map((rec) => (
                <PendingRecruiterCard
                  key={rec.id}
                  rec={rec}
                  approving={approving === rec.id}
                  onApprove={handleApprove}
                />
              ))}
            </div>
          )}
        </section>

        {/* Verified Employers */}
        <section aria-labelledby="verified-heading" className="pt-6">
          <h2
            id="verified-heading"
            className="text-lg font-bold flex items-center gap-2 mb-4"
          >
            <ShieldCheck className="text-emerald-500" size={20} aria-hidden="true" />
            Verified Employer Partners
            <span
              className="ml-1 text-sm font-bold text-emerald-400"
              aria-live="polite"
              aria-atomic="true"
            >
              ({loading ? "—" : approvedRecruiters.length})
            </span>
          </h2>

          {loading ? (
            <LoadingSkeleton count={3} layout="list" />
          ) : error ? null : (
            <VerifiedEmployersTable recruiters={approvedRecruiters} />
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
