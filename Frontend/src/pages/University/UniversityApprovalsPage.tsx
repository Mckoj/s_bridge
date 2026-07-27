import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import {
  getAllRecruitersForUniversity,
  approveRecruiter
} from "../../services/universityService";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityApprovalsPage() {
  const dark = useTheme();
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await getAllRecruitersForUniversity();
      setRecruiters(data);
    } catch (err) {
      console.error("Error fetching approval queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    setMsg(null);
    try {
      await approveRecruiter(id);
      setMsg(`Employer "${name}" has been approved!`);
      fetchQueue();
    } catch (err) {
      alert("Failed to approve recruiter.");
    }
  };

  const pendingRecruiters = recruiters.filter((r) => !r.isApproved);
  const approvedRecruiters = recruiters.filter((r) => r.isApproved);

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
                Approval Center
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                Verification & Approval Center
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Review registered employer recruiter accounts and verify company credentials for placement posting.
              </p>
            </div>
          </div>
        </div>

        {msg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} /> {msg}
          </div>
        )}

        {/* Approval Queue Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="text-amber-500" size={20} />
            Pending Recruiter Verifications ({pendingRecruiters.length})
          </h2>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 animate-pulse">Loading queue...</div>
          ) : pendingRecruiters.length === 0 ? (
            <div
              className={`p-8 rounded-3xl border text-center text-xs text-slate-500 ${
                dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              No pending employer verification requests.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRecruiters.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between gap-4 ${
                    dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 font-extrabold flex items-center justify-center">
                      <Building size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{rec.companyName}</h4>
                      <p className="text-xs text-slate-400">{rec.user?.email}</p>
                      <p className="text-[11px] text-amber-400 font-semibold mt-1">Status: Pending Verification</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApprove(rec.id, rec.companyName)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verified Employers Section */}
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} />
            Verified Employer Partners ({approvedRecruiters.length})
          </h2>

          <div
            className={`rounded-3xl border overflow-hidden shadow-xl ${
              dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200/80"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${dark ? "border-slate-800 bg-slate-950/50 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
                    <th className="py-3.5 px-6">Company Name</th>
                    <th className="py-3.5 px-6">Email Contact</th>
                    <th className="py-3.5 px-6">Website</th>
                    <th className="py-3.5 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-medium">
                  {approvedRecruiters.map((rec) => (
                    <tr key={rec.id} className={dark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}>
                      <td className="py-4 px-6 font-bold">{rec.companyName}</td>
                      <td className="py-4 px-6 text-slate-400">{rec.user?.email}</td>
                      <td className="py-4 px-6 text-violet-400">{rec.companyWebsite || "N/A"}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
