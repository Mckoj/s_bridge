import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { Briefcase, Users, UserCheck, Award, ChevronRight } from "lucide-react";

function useTheme() { return useDashboard().theme === "dark"; }

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const dark = useTheme();
  return (
    <div className={`rounded-2xl transition-transform duration-200 transform hover:-translate-y-1 hover:shadow-2xl
      ${dark
        ? "bg-gradient-to-br from-[#071024]/60 to-[#07122a]/40 border border-transparent ring-1 ring-white/6"
        : "backdrop-blur-sm bg-white/60 border border-transparent ring-1 ring-black/6"
      } ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, action }: { title: string; action?: string }) {
  const dark = useTheme();
  return (
    <div className="flex items-center justify-between mb-4">
      <p className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>{title}</p>
      {action && (
        <button className="flex items-center gap-1 text-[10px] text-blue-500 font-semibold hover:underline">
          {action} <ChevronRight size={10} />
        </button>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, iconBg, iconColor }:
  { title: string; value: string | number; subtitle: string; icon: React.ElementType; iconBg: string; iconColor: string }) {
  const dark = useTheme();
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <p className={`text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>{title}</p>
        <p className={`text-3xl font-extrabold leading-none tabular-nums ${dark ? "text-white" : "text-slate-800"}`}>{value}</p>
        <p className={`text-[11px] font-medium mt-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-[11px] font-semibold text-green-400`}>+6.1%</span>
          <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>MoM</span>
        </div>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} drop-shadow-sm`}>
        <Icon size={24} className={iconColor} />
      </div>
    </Card>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
interface Segment { label: string; value: number; pct: string; color: string; dot: string }

const APP_SEGMENTS: Segment[] = [
  { label: "New",          value: 45, pct: "29%", color: "#10b981", dot: "bg-emerald-500" },
  { label: "Under Review", value: 47, pct: "30%", color: "#f97316", dot: "bg-orange-400"  },
  { label: "Shortlisted",  value: 28, pct: "18%", color: "#3b82f6", dot: "bg-blue-500"    },
  { label: "Rejected",     value: 14, pct: "9%",  color: "#ef4444", dot: "bg-red-500"     },
];

function DonutChart({ segments, total, centerValue, centerLabel }: {
  segments: Segment[]; total: number; centerValue: string | number; centerLabel: string;
}) {
  const dark = useTheme();
  const r = 42, cx = 54, cy = 54;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={108} height={108} viewBox="0 0 108 108" className="shrink-0 mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark ? "#1e293b" : "#f1f5f9"} strokeWidth={14} />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const startOff = -(offset / circ) * circ;
        offset += dash;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={14}
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={startOff}
          transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />;
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize={16} fontWeight="800" fill={dark ? "#f8fafc" : "#1e293b"}>{centerValue}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize={8.5} fill="#94a3b8" fontWeight="600">{centerLabel}</text>
    </svg>
  );
}

function ApplicantRow({ name, role, time, idx }: { name: string; role: string; time: string; idx: number }) {
  const dark = useTheme();
  const colors = ["bg-blue-500","bg-purple-500","bg-emerald-500","bg-amber-500"];
  return (
    <div className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${dark ? "border-slate-800" : "border-slate-50"}`}>
      <div className={`w-8 h-8 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold leading-none ${dark ? "text-white" : "text-slate-800"}`}>{name}</p>
        <p className={`text-[10px] mt-0.5 truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{role}</p>
      </div>
      <span className={`text-[9px] shrink-0 ${dark ? "text-slate-600" : "text-slate-400"}`}>{time}</span>
    </div>
  );
}

type PerfLevel = "Good" | "Excellent" | "Average";

function InternRow({ name, dept, performance, idx }: { name: string; dept: string; performance: PerfLevel; idx: number }) {
  const dark = useTheme();
  const colors = ["bg-blue-500","bg-emerald-500","bg-purple-500","bg-orange-400"];
  const badge: Record<PerfLevel, string> = {
    Good:      "bg-blue-50 text-blue-600 border-blue-100",
    Excellent: "bg-green-50 text-green-600 border-green-100",
    Average:   "bg-amber-50 text-amber-600 border-amber-100",
  };
  const badgeDark: Record<PerfLevel, string> = {
    Good:      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Excellent: "bg-green-500/10 text-green-400 border-green-500/20",
    Average:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <div className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${dark ? "border-slate-800" : "border-slate-50"}`}>
      <div className={`w-8 h-8 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold leading-none ${dark ? "text-white" : "text-slate-800"}`}>{name}</p>
        <p className={`text-[10px] mt-0.5 truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{dept}</p>
      </div>
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${dark ? badgeDark[performance] : badge[performance]}`}>
        {performance}
      </span>
    </div>
  );
}

function LineChart({ color }: { color: string }) {
  const dark = useTheme();
  const points = "10,75 55,60 100,65 145,40 190,55 235,25 280,35";
  const id = "lc-company";
  return (
    <div>
      <svg viewBox="0 0 290 100" className="w-full h-28">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25,50,75].map(y => <line key={y} x1="5" y1={y} x2="285" y2={y} stroke={dark ? "#1e293b" : "#f1f5f9"} strokeWidth="1" />)}
        <polygon points={`10,75 55,60 100,65 145,40 190,55 235,25 280,35 280,100 10,100`} fill={`url(#${id})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.split(" ").map((p, i) => {
          const [x, y] = p.split(",");
          return <circle key={i} cx={x} cy={y} r="3.5" fill={dark ? "#0f172a" : "white"} stroke={color} strokeWidth="2" />;
        })}
      </svg>
      <div className="flex justify-between px-1 -mt-1">
        {["Week 1","Week 2","Week 3","Week 4"].map(l => (
          <span key={l} className={`text-[9px] font-medium ${dark ? "text-slate-600" : "text-slate-400"}`}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const { user } = useAuth();
  const dark = useTheme();
  const raw  = user?.email?.split("@")[0] ?? "Alex";
  const name = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5">
        <div>
          <h1 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>Welcome back, {name}! 👋</h1>
          <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Overview of your internship programs and candidates.</p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Active Postings"   value={8}   subtitle="Total Jobs"        icon={Briefcase} iconBg="bg-green-50"  iconColor="text-green-500" />
          <StatCard title="Total Applicants"  value={156} subtitle="This Month"        icon={Users}     iconBg="bg-blue-50"   iconColor="text-blue-500" />
          <StatCard title="Active Interns"    value={24}  subtitle="Currently Working" icon={UserCheck} iconBg="bg-orange-50" iconColor="text-orange-500" />
          <StatCard title="Completed Interns" value={36}  subtitle="This Year"         icon={Award}     iconBg="bg-green-50"  iconColor="text-green-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Applications donut */}
          <Card className="p-5">
            <CardHeader title="Applications Overview" action="View All" />
            <div className="flex flex-col items-center gap-4">
              <DonutChart segments={APP_SEGMENTS} total={156} centerValue={156} centerLabel="Total" />
              <div className="w-full space-y-1.5">
                {APP_SEGMENTS.map(s => (
                  <div key={s.label} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${s.dot} shrink-0`} />
                      <span className={`font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{s.label}</span>
                    </div>
                    <span className={`font-semibold tabular-nums ${dark ? "text-slate-400" : "text-slate-500"}`}>{s.value} ({s.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Applicants */}
          <Card className="p-5">
            <CardHeader title="Recent Applicants" />
            <ApplicantRow idx={0} name="John Doe"    role="Frontend Developer Intern" time="5h ago" />
            <ApplicantRow idx={1} name="Sarah Wilson" role="UI/UX Design Intern"       time="1d ago" />
            <ApplicantRow idx={2} name="Mike Brown"  role="Backend Developer Intern"  time="1d ago" />
            <ApplicantRow idx={3} name="Emily Davis" role="Data Analyst Intern"       time="2d ago" />
          </Card>

          {/* My Interns */}
          <Card className="p-5">
            <CardHeader title="My Interns" action="View All" />
            <InternRow idx={0} name="David Lee"      dept="Software Engineering" performance="Good"      />
            <InternRow idx={1} name="Jessica Taylor" dept="UI/UX Design"         performance="Excellent" />
            <InternRow idx={2} name="Daniel Kim"     dept="Data Science"         performance="Good"      />
            <InternRow idx={3} name="Sophia Martin"  dept="QA Engineering"       performance="Excellent" />
          </Card>

          {/* Performance chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>Performance Overview</p>
              <select className={`text-[10px] border rounded-md px-1.5 py-0.5 outline-none font-medium
                ${dark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className={`flex flex-col justify-between text-[8px] font-medium pb-5 shrink-0 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                <span>60</span><span>40</span><span>20</span><span>0</span>
              </div>
              <div className="flex-1"><LineChart color="#10b981" /></div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
