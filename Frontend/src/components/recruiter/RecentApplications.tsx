import { useDashboard } from "../../context/DashboardContext";
import type { RecruiterApplication } from "../../services/recruiterService";
import { FileText, Sparkles } from "lucide-react";

interface RecentApplicationsProps {
  applications: RecruiterApplication[];
  onStatusChange: (id: string, status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED") => void;
  updatingId?: string | null;
}

export default function RecentApplications({
  applications,
  onStatusChange,
  updatingId,
}: RecentApplicationsProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  if (applications.length === 0) {
    return (
      <div className={`p-8 text-center rounded-2xl border ${dark ? "border-slate-800 bg-slate-900/40 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
        <p className="text-xs font-semibold">No applications submitted yet.</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border ${dark ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b ${dark ? "border-slate-800 bg-slate-800/40 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"}`}>
              <th className="py-3 px-4 font-bold">Candidate</th>
              <th className="py-3 px-4 font-bold">Applied Position</th>
              <th className="py-3 px-4 font-bold">Match Score</th>
              <th className="py-3 px-4 font-bold">Applied Date</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${dark ? "divide-slate-800/60" : "divide-slate-100"}`}>
            {applications.map((app) => {
              const isUpdating = updatingId === app.id;
              const formattedDate = new Date(app.appliedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <tr key={app.id} className={`transition-colors ${dark ? "hover:bg-slate-800/30" : "hover:bg-slate-50/50"}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                        {app.profilePicUrl ? (
                          <img src={app.profilePicUrl} alt={app.studentName} className="w-full h-full object-cover" />
                        ) : (
                          app.studentName[0]
                        )}
                      </div>
                      <div>
                        <p className={`font-bold leading-none ${dark ? "text-white" : "text-slate-800"}`}>
                          {app.studentName}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                          {app.programme || app.studentEmail || "Student"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <p className={`font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
                      {app.jobTitle}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    {typeof app.matchScore === "number" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px]">
                        <Sparkles size={10} />
                        {app.matchScore}%
                      </span>
                    ) : (
                      <span className={`text-[10px] ${dark ? "text-slate-600" : "text-slate-400"}`}>—</span>
                    )}
                  </td>

                  <td className={`py-3 px-4 font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {formattedDate}
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      disabled={isUpdating || app.status === "WITHDRAWN"}
                      onChange={(e) => onStatusChange(app.id, e.target.value as any)}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer transition-all ${
                        dark
                          ? "bg-slate-800 border-slate-700 text-slate-200"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWING">Under Review</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {app.resumeUrl || app.cvUrl ? (
                      <a
                        href={app.resumeUrl || app.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold hover:underline ${
                          dark ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      >
                        <FileText size={12} /> CV
                      </a>
                    ) : (
                      <span className={`text-[10px] ${dark ? "text-slate-600" : "text-slate-400"}`}>No CV</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
