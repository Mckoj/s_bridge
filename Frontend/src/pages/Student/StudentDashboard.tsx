import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { LayoutGrid, Clock, CheckCircle2, XCircle, ChevronRight, Check, Calendar } from "lucide-react";

// ── Theme-aware helpers ───────────────────────────────────────────────────────
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

function Heading({ children }: { children: React.ReactNode }) {
  const dark = useTheme();
  return <p className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>{children}</p>;
}

function Muted({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const dark = useTheme();
  return <p className={`${dark ? "text-slate-500" : "text-slate-400"} ${className}`}>{children}</p>;
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
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-[11px] font-semibold text-green-400`}>+2.8%</span>
          <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>since last week</span>
        </div>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} drop-shadow-sm`}>
        <Icon size={24} className={iconColor} />
      </div>
    </Card>
  );
}

// ── Application stepper ───────────────────────────────────────────────────────
const STEPS = [
  { label: "Applied",      date: "May 19", done: true },
  { label: "Under Review", date: "May 12", done: true },
  { label: "Interview",    date: "May 19", done: false },
  { label: "Offered",      date: "May 20", done: false },
];

function ApplicationStepper() {
  const dark = useTheme();
  return (
    <div className="flex items-start w-full pt-2 pb-1">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.label}>
          {i > 0 && (
            <div className={`flex-1 h-0.5 mt-4 mx-1 ${STEPS[i - 1].done ? "bg-blue-400" : (dark ? "bg-slate-700" : "bg-slate-200")}`} />
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
  const dark = useTheme();
  const raw  = user?.email?.split("@")[0] ?? "Student";
  const displayName = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Welcome */}
        <div>
          <h1 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
            Welcome back, {displayName}! 👋
          </h1>
          <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Here's what's happening with your internship journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Applications"  value={5} subtitle="Total Applied"    icon={LayoutGrid}  iconBg="bg-blue-50"   iconColor="text-blue-500" />
          <StatCard title="Under Review"  value={2} subtitle="In Progress"      icon={Clock}       iconBg="bg-orange-50" iconColor="text-orange-500" />
          <StatCard title="Accepted"      value={1} subtitle="Congratulations!" icon={CheckCircle2} iconBg="bg-green-50"  iconColor="text-green-500" />
          <StatCard title="Rejected"      value={2} subtitle="Keep Trying"      icon={XCircle}     iconBg="bg-red-50"    iconColor="text-red-500" />
        </div>

        {/* Four panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Application Status */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Heading>Application Status</Heading>
              <button className="text-[10px] text-blue-500 font-semibold hover:underline whitespace-nowrap">
                View All Applications
              </button>
            </div>
            <ApplicationStepper />
          </Card>

          {/* Upcoming Tasks */}
          <Card className="p-5">
            <Heading>Upcoming Tasks</Heading>
            <div className="mt-3 space-y-0">
              <TaskRow title="Upload Weekly Report" due="Due in 2 days" />
              <TaskRow title="Submit Logbook"       due="Due in 5 days" />
              <TaskRow title="Evaluation Form"      due="Due in 10 days" />
            </div>
          </Card>

          {/* Messages */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Heading>Messages</Heading>
              <button className="text-[10px] text-blue-500 font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-0">
              <MessageRow idx={0} name="ABC Corp HR"            preview="Your application status update"  time="2h ago" />
              <MessageRow idx={1} name="University Coordinator" preview="Regarding your internship..."     time="1d ago" />
              <MessageRow idx={2} name="Tech Solutions Ltd."    preview="Interview invitation"             time="2d ago" />
            </div>
          </Card>

          {/* Calendar */}
          <Card className="p-5">
            <div className={`flex items-center gap-2 mb-4`}>
              <Calendar size={15} className="text-blue-500" />
              <Heading>Calendar</Heading>
            </div>
            <MiniCalendar />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
