import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { LayoutGrid, Clock, CheckCircle2, XCircle, ChevronRight, Check, Calendar, Sparkles } from "lucide-react";

// ── Theme-aware helpers ───────────────────────────────────────────────────────
function useTheme() { return useDashboard().theme === "dark"; }

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const dark = useTheme();
  return (
    <div className={`relative overflow-hidden rounded-3xl border shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-25px_rgba(59,130,246,0.28)]
      ${dark
        ? "bg-slate-900/70 border-slate-800/80"
        : "bg-white/80 border-slate-200/80"
      } ${className}`}>
      <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${dark ? "from-blue-500/10 via-slate-900/40 to-transparent" : "from-blue-100/70 via-white/50 to-transparent"}`} />
      <div className="relative">{children}</div>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  const dark = useTheme();
  return <p className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>{children}</p>;
}

function Muted({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const dark = useTheme();
  return <p className={`${dark ? "text-slate-500" : "text-slate-400"} ${className}`}>{children}</p>;
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ label }: { label: string }) {
  const dark = useTheme();
  return (
    <p className={`text-[11px] text-center py-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>
      {label}
    </p>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, icon: Icon, iconBg, iconColor }:
  { title: string; value: string | number; subtitle: string; icon: React.ElementType; iconBg: string; iconColor: string }) {
  const dark = useTheme();
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <Muted className="text-xs font-semibold mb-1">{title}</Muted>
        <p className={`text-3xl font-extrabold leading-none tabular-nums ${dark ? "text-white" : "text-slate-800"}`}>{value}</p>
        <Muted className="text-[11px] font-medium mt-1.5">{subtitle}</Muted>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} drop-shadow-sm`}>
        <Icon size={24} className={iconColor} />
      </div>
    </Card>
  );
}

// ── Application stepper ───────────────────────────────────────────────────────
interface Step { label: string; date: string; done: boolean }

function ApplicationStepper({ steps }: { steps: Step[] }) {
  const dark = useTheme();
  if (steps.length === 0) return <EmptyState label="No active application" />;
  return (
    <div className="flex items-start w-full pt-2 pb-1">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          {i > 0 && (
            <div className={`flex-1 h-0.5 mt-4 mx-1 ${steps[i - 1].done ? "bg-blue-400" : (dark ? "bg-slate-700" : "bg-slate-200")}`} />
          )}
          <div className="flex flex-col items-center shrink-0">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
              ${step.done ? "bg-blue-500 border-blue-500" : (dark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300")}`}>
              {step.done
                ? <Check size={13} className="text-white" />
                : <div className={`w-2 h-2 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />}
            </div>
            <p className={`text-[9px] font-semibold mt-2 text-center leading-tight ${dark ? "text-slate-400" : "text-slate-600"}`}>{step.label}</p>
            <p className={`text-[8px] mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{step.date}</p>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Task row ──────────────────────────────────────────────────────────────────
function TaskRow({ title, due }: { title: string; due: string }) {
  const dark = useTheme();
  return (
    <div className={`flex items-center gap-3 py-2.5 border-b last:border-0 px-1 rounded-lg group transition-colors
      ${dark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-50 hover:bg-slate-50/50"}`}>
      <div className="w-1.5 h-8 rounded-full bg-blue-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-snug ${dark ? "text-slate-300" : "text-slate-700"}`}>{title}</p>
        <p className={`text-[10px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{due}</p>
      </div>
      <ChevronRight size={14} className={`shrink-0 ${dark ? "text-slate-600" : "text-slate-300"}`} />
    </div>
  );
}

// ── Message row ───────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500"];

function MessageRow({ name, preview, time, idx }: { name: string; preview: string; time: string; idx: number }) {
  const dark = useTheme();
  return (
    <div className={`flex items-start gap-3 py-2.5 border-b last:border-0 px-1 rounded-lg transition-colors
      ${dark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-50 hover:bg-slate-50/50"}`}>
      <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold leading-none ${dark ? "text-white" : "text-slate-800"}`}>{name}</p>
        <p className={`text-[10px] mt-1 truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{preview}</p>
      </div>
      <span className={`text-[9px] shrink-0 mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{time}</span>
    </div>
  );
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────
const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function MiniCalendar() {
  const dark     = useTheme();
  const today    = new Date();
  const year     = today.getFullYear();
  const month    = today.getMonth();
  const todayDate = today.getDate();

  const rawFirst = new Date(year, month, 1).getDay();
  const offset   = rawFirst === 0 ? 6 : rawFirst - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold ${dark ? "text-slate-300" : "text-slate-700"}`}>{MONTH_NAMES[month]} {year}</span>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(d => (
          <div key={d} className={`text-center text-[9px] font-bold py-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center h-6">
            {day !== null && (
              <span className={`text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full transition-colors
                ${day === todayDate
                  ? "bg-blue-500 text-white font-bold"
                  : dark ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"
                }`}>
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth();
  const { tasks, studentMessages } = useDashboard();
  const dark  = useTheme();
  const raw   = user?.email?.split("@")[0] ?? "Student";
  const displayName = raw.charAt(0).toUpperCase() + raw.slice(1);

  // TODO: derive these counts from backend data (GET /api/student/applications/stats)
  const totalApplications = 0;
  const underReview = 0;
  const accepted = 0;
  const rejected = 0;

  // TODO: fetch application steps from GET /api/student/applications/latest
  const applicationSteps: { label: string; date: string; done: boolean }[] = [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className={`relative overflow-hidden rounded-[30px] border p-6 shadow-[0_24px_80px_-32px_rgba(37,99,235,0.35)] ${dark ? "border-blue-500/15 bg-slate-900/70" : "border-blue-200/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(239,246,255,0.95)_100%)]"}`}>
          <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_26%)] ${dark ? "opacity-80" : "opacity-100"}`} />
          <div className="relative space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${dark ? "border-blue-500/20 bg-blue-500/10 text-blue-300" : "border-blue-200 bg-blue-50/80 text-blue-700"}`}>
                  <Sparkles size={13} />
                  Student experience
                </div>
                <h1 className={`mt-3 text-2xl font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
                  Welcome back, {displayName}! 👋
                </h1>
                <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Here's what's happening with your internship journey.
                </p>
              </div>
            </div>

        {/* Stats — values come from backend */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Applications"  value={totalApplications} subtitle="Total Applied"    icon={LayoutGrid}  iconBg="bg-blue-50"   iconColor="text-blue-500" />
          <StatCard title="Under Review"  value={underReview}       subtitle="In Progress"      icon={Clock}       iconBg="bg-orange-50" iconColor="text-orange-500" />
          <StatCard title="Accepted"      value={accepted}          subtitle="Congratulations!" icon={CheckCircle2} iconBg="bg-green-50"  iconColor="text-green-500" />
          <StatCard title="Rejected"      value={rejected}          subtitle="Keep Trying"      icon={XCircle}     iconBg="bg-red-50"    iconColor="text-red-500" />
        </div>

        {/* Four panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Application Status */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Heading>Application Status</Heading>
              <button className={`text-[10px] font-semibold hover:underline whitespace-nowrap ${dark ? "text-blue-300" : "text-blue-600"}`}>
                View All Applications
              </button>
            </div>
            <ApplicationStepper steps={applicationSteps} />
          </Card>

          {/* Upcoming Tasks */}
          <Card className="p-5">
            <Heading>Upcoming Tasks</Heading>
            <div className="mt-3 space-y-0">
              {tasks.length === 0
                ? <EmptyState label="No upcoming tasks" />
                : tasks.map(t => <TaskRow key={t.id} title={t.title} due={t.dueDate} />)
              }
            </div>
          </Card>

          {/* Messages */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Heading>Messages</Heading>
              <button className={`text-[10px] font-semibold hover:underline ${dark ? "text-blue-300" : "text-blue-600"}`}>View All</button>
            </div>
            <div className="space-y-0">
              {studentMessages.length === 0
                ? <EmptyState label="No messages yet" />
                : studentMessages.map((m, idx) => (
                    <MessageRow key={m.id} idx={idx} name={m.sender} preview={m.content} time={m.time} />
                  ))
              }
            </div>
          </Card>

          {/* Calendar */}
          <Card className="p-5">
            <div className={`flex items-center gap-2 mb-4`}>
              <Calendar size={15} className={dark ? "text-blue-300" : "text-blue-600"} />
              <Heading>Calendar</Heading>
            </div>
            <MiniCalendar />
          </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
