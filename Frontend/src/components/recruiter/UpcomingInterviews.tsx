import { useDashboard } from "../../context/DashboardContext";
import type { RecruiterInterview } from "../../services/recruiterService";
import { Calendar, Video } from "lucide-react";

interface UpcomingInterviewsProps {
  interviews: RecruiterInterview[];
}

export default function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  const { theme } = useDashboard();
  const dark = theme === "dark";

  if (interviews.length === 0) {
    return (
      <div className={`p-6 text-center rounded-2xl border ${dark ? "border-slate-800 bg-slate-900/40 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
        <Calendar size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs font-semibold">No interviews scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.slice(0, 5).map((item) => {
        const dateObj = new Date(item.scheduledAt);
        const formattedDate = dateObj.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        const formattedTime = dateObj.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
              dark ? "bg-slate-900/70 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                dark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}>
                <span className="text-[10px] font-extrabold uppercase leading-none">{formattedDate}</span>
                <span className="text-[10px] font-medium leading-none mt-0.5">{formattedTime}</span>
              </div>

              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${dark ? "text-white" : "text-slate-800"}`}>
                  {item.position}
                </p>
                <p className={`text-[11px] truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  {item.companyName} • {item.platform}
                </p>
                <p className={`text-[11px] truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Interviewer: <span className="font-medium">{item.interviewer}</span>
                </p>
              </div>
            </div>

            {item.meetingLink && (
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm transition-all cursor-pointer"
                title={`Join ${item.platform} meeting`}
              >
                <Video size={14} />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
