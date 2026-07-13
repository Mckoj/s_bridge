import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { Users, Briefcase, Clock, CheckCircle2, ChevronRight } from "lucide-react";

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
          <span className={`text-[11px] font-semibold text-green-400`}>+4.2%</span>
          <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>vs. last period</span>
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

const APPROVAL_SEGMENTS: Segment[] = [
  { label: "Pending",  value: 24, pct: "40%", color: "#f97316", dot: "bg-orange-400" },
  { label: "Approved", value: 30, pct: "50%", color: "#3b82f6", dot: "bg-blue-500"   },
  { label: "Rejected", value:  6, pct: "10%", color: "#ef4444", dot: "bg-red-500"    },
];

function DonutChart({ segments, total, centerValue, centerLabel }: {
  segments: Segment[]; total: number; centerValue: string | number; centerLabel: string;
}) {
  const dark = useTheme();
  const r = 42, cx = 54, cy = 54;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={108} height={108} viewBox="0 0 108 108" className="shrink-0">
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

function ActivityItem({ text, time }: { text: string; time: string }) {
  const dark = useTheme();
  return (
    <div className={`flex items-start gap-2.5 py-2.5 border-b last:border-0 ${dark ? "border-slate-800" : "border-slate-50"}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium leading-snug ${dark ? "text-slate-300" : "text-slate-700"}`}>{text}</p>
        <p className={`text-[10px] mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{time}</p>
      </div>
    </div>
  );
}

function CompanyRow({ name, students, idx }: { name: string; students: number; idx: number }) {
  const dark = useTheme();
  const colors = ["bg-blue-500","bg-purple-500","bg-emerald-500","bg-amber-500"];
  return (
    <div className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${dark ? "border-slate-800" : "border-slate-50"}`}>
      <div className={`w-8 h-8 rounded-lg ${colors[idx % colors.length]} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold truncate ${dark ? "text-white" : "text-slate-800"}`}>{name}</p>
        <p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{students} Students</p>
      </div>
    </div>
  );
}

function LineChart({ color }: { color: string }) {
  const dark = useTheme();
  const points = "10,80 55,58 100,68 145,38 190,50 235,22 280,32";
  const id = `lg-uni`;
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
        <polygon points={`10,80 55,58 100,68 145,38 190,50 235,22 280,32 280,100 10,100`} fill={`url(#${id})`} />
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

export default function UniversityDashboard() {
  const { user } = useAuth();
  const dark = useTheme();
  const raw  = user?.email?.split("@")[0] ?? "Admin";
  const name = "Dr. " + raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5">
        <div>
          <h1 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>Welcome back, {name}! 👋</h1>
          <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Overview of internship activities and student progress.</p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Students"     value={320} subtitle="Active Students"  icon={Users}       iconBg="bg-blue-50"   iconColor="text-blue-500" />
          <StatCard title="Active Internships" value={185} subtitle="Ongoing"          icon={Briefcase}   iconBg="bg-blue-50"   iconColor="text-blue-500" />
          <StatCard title="Pending Approvals"  value={24}  subtitle="Requires Action"  icon={Clock}       iconBg="bg-orange-50" iconColor="text-orange-500" />
          <StatCard title="Completed"          value={142} subtitle="This Semester"    icon={CheckCircle2} iconBg="bg-green-50"  iconColor="text-green-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <Card className="p-5">
            <CardHeader title="Internship Approvals" action="View All" />
            <div className="flex gap-4 items-center">
              <DonutChart segments={APPROVAL_SEGMENTS} total={60} centerValue={24} centerLabel="Pending" />
              <div className="space-y-2 flex-1 min-w-0">
                {APPROVAL_SEGMENTS.map(s => (
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

          <Card className="p-5">
            <CardHeader title="Recent Activity" />
            <ActivityItem text="John Doe submitted a report"       time="2 hours ago" />
            <ActivityItem text="Sarah Wilson completed internship"  time="5 hours ago" />
            <ActivityItem text="Mike Brown application approved"    time="1 day ago" />
            <ActivityItem text="Emily Davis report approved"        time="1 day ago" />
          </Card>

          <Card className="p-5">
            <CardHeader title="Top Companies" action="View All" />
            <CompanyRow idx={0} name="Tech Solutions Ltd." students={18} />
            <CompanyRow idx={1} name="InnovateX"           students={15} />
            <CompanyRow idx={2} name="Global Soft Inc."    students={12} />
            <CompanyRow idx={3} name="Future Labs"         students={9} />
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>Analytics Overview</p>
              <select className={`text-[10px] border rounded-md px-1.5 py-0.5 outline-none font-medium
                ${dark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div className={`flex flex-col justify-between text-[8px] font-medium pb-5 shrink-0 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                <span>200</span><span>100</span><span>50</span><span>0</span>
              </div>
              <div className="flex-1"><LineChart color="#7c3aed" /></div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
