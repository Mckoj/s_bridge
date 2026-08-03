import { useDashboard } from "../../context/DashboardContext";
import type { RecruiterCandidate } from "../../services/recruiterService";
import { FileText, Sparkles } from "lucide-react";

interface CandidateCardProps {
  candidate: RecruiterCandidate;
  onScheduleInterview?: (candidate: RecruiterCandidate) => void;
}

export default function CandidateCard({
  candidate,
  onScheduleInterview,
}: CandidateCardProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const statusStyles: Record<string, string> = {
    PENDING: dark ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200",
    REVIEWING: dark ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-50 text-purple-700 border-purple-200",
    ACCEPTED: dark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: dark ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200",
    WITHDRAWN: dark ? "bg-slate-500/10 text-slate-400 border-slate-500/20" : "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg flex flex-col justify-between ${
        dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0 shadow-sm">
              {candidate.profilePicUrl ? (
                <img src={candidate.profilePicUrl} alt={candidate.name} className="w-full h-full object-cover" />
              ) : (
                candidate.name[0]
              )}
            </div>
            <div>
              <h4 className={`text-sm font-bold leading-tight ${dark ? "text-white" : "text-slate-800"}`}>
                {candidate.name}
              </h4>
              <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                Applied for <span className="font-semibold">{candidate.appliedRole}</span>
              </p>
            </div>
          </div>

          {/* Render match score ONLY if provided by backend */}
          {typeof candidate.matchScore === "number" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Sparkles size={11} />
              {candidate.matchScore}% Match
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {candidate.programme && (
            <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>
              🎓 <span className="font-medium">{candidate.programme}</span>
            </p>
          )}

          {typeof candidate.gpa === "number" && (
            <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>
              📊 GPA: <span className="font-semibold">{candidate.gpa}</span>
            </p>
          )}

          {candidate.skills && candidate.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {candidate.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between gap-2">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${statusStyles[candidate.status] || ""}`}>
          {candidate.status}
        </span>

        <div className="flex items-center gap-2">
          {candidate.cvUrl && (
            <a
              href={candidate.cvUrl}
              target="_blank"
              rel="noreferrer"
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                dark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
              title="View CV / Resume"
            >
              <FileText size={14} />
            </a>
          )}

          {onScheduleInterview && (
            <button
              onClick={() => onScheduleInterview(candidate)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm cursor-pointer"
            >
              Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
