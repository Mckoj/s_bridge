import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/sbridge-logo.png";
import {
  LayoutDashboard, Bell, Search, LogOut, Menu, X,
  FileText, Briefcase, BarChart2, MessageSquare, Settings,
  User, Users, CheckSquare, Sun, Moon,
  PlusSquare, ClipboardList,
} from "lucide-react";

const roleNav = {
  student: [
    { label: "Dashboard",        icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Applications",  icon: FileText,         path: "/dashboard/applications" },
    { label: "My Internship",    icon: Briefcase,        path: "/dashboard/internship" },
    { label: "Reports",          icon: BarChart2,        path: "/dashboard/reports" },
    { label: "Messages",         icon: MessageSquare,    path: "/dashboard/messages" },
    { label: "Notifications",    icon: Bell,             path: "/dashboard/notifications" },
    { label: "Profile",          icon: User,             path: "/dashboard/profile" },
    { label: "Settings",         icon: Settings,         path: "/dashboard/settings" },
  ],
  university: [
    { label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard" },
    { label: "Students",            icon: Users,           path: "/dashboard/students" },
    { label: "Internships",         icon: Briefcase,       path: "/dashboard/internships" },
    { label: "Approvals",           icon: CheckSquare,     path: "/dashboard/approvals" },
    { label: "Reports & Analytics", icon: BarChart2,       path: "/dashboard/reports" },
    { label: "Messages",            icon: MessageSquare,   path: "/dashboard/messages" },
    { label: "Notifications",       icon: Bell,            path: "/dashboard/notifications" },
    { label: "Settings",            icon: Settings,        path: "/dashboard/settings" },
  ],
  recruiter: [
    { label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard" },
    { label: "Internship Postings", icon: PlusSquare,      path: "/dashboard/postings" },
    { label: "Applications",        icon: FileText,        path: "/dashboard/applications" },
    { label: "My Interns",          icon: Users,           path: "/dashboard/interns" },
    { label: "Evaluations",         icon: ClipboardList,   path: "/dashboard/evaluations" },
    { label: "Messages",            icon: MessageSquare,   path: "/dashboard/messages" },
    { label: "Analytics",           icon: BarChart2,       path: "/dashboard/analytics" },
    { label: "Settings",            icon: Settings,        path: "/dashboard/settings" },
  ],
};

const roleAccent = {
  student:    { activeBg: "bg-blue-500",    avatarBg: "bg-blue-500",    roleLabel: "Student"         },
  university: { activeBg: "bg-purple-600",  avatarBg: "bg-purple-600",  roleLabel: "University Admin" },
  recruiter:  { activeBg: "bg-emerald-600", avatarBg: "bg-emerald-600", roleLabel: "Company Admin"    },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, theme, toggleTheme, notifications, markAllNotificationsRead } = useDashboard();
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [search,      setSearch]      = useState("");

  const accent   = roleAccent[role as keyof typeof roleAccent] ?? roleAccent.student;
  const navItems = roleNav[role as keyof typeof roleNav]       ?? roleNav.student;
  const unread   = notifications.filter(n => !n.read).length;

  const raw         = user?.email?.split("@")[0] ?? "User";
  const displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
  const initial     = displayName[0] ?? "U";

  const isDark = theme === "dark";

  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  // ── Sidebar ─────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-56 flex flex-col shadow-sm
      border-r transition-colors duration-200
      ${isDark
        ? "bg-[#0f172a] border-slate-800"
        : "bg-white border-slate-200"
      }
      transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-16 px-5 border-b shrink-0 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
        <img src={logo} alt="SBridge" className="h-8 w-auto select-none" />
        <span className={`font-extrabold text-base tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
          SBridge
        </span>
        <button className={`ml-auto lg:hidden ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`} onClick={() => setSidebarOpen(false)}>
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const Icon   = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-150 text-left
                ${active
                  ? `${accent.activeBg} text-white shadow-sm`
                  : isDark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }
              `}
            >
              <Icon size={16} className="shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className={`px-3 pb-5 pt-2 border-t shrink-0 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${isDark ? "bg-[#020817]" : "bg-slate-50"}`}>
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col lg:pl-56 min-w-0">

        {/* ── Topbar ─────────────────────────────────────────────── */}
        <header className={`
          sticky top-0 z-20 h-16 flex items-center px-5 gap-3 shrink-0
          border-b transition-colors duration-200
          ${isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200"}
        `}>
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="flex-1" />

          {/* Search */}
          <div className={`hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 w-52 border transition-colors duration-200
            ${isDark
              ? "bg-slate-800 border-slate-700 focus-within:border-slate-500"
              : "bg-slate-100 border-transparent focus-within:border-slate-300 focus-within:bg-white"
            }`}>
            <Search size={13} className={`shrink-0 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search anything..."
              className={`bg-transparent text-sm outline-none w-full ${isDark ? "text-slate-300 placeholder-slate-500" : "text-slate-700 placeholder-slate-400"}`}
            />
          </div>

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`p-2 rounded-lg transition-all duration-200
              ${isDark
                ? "text-amber-400 hover:bg-slate-800 hover:text-amber-300"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={`relative p-2 rounded-lg transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0f172a]" />
              )}
            </button>

            {notifOpen && (
              <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-xl border z-50 overflow-hidden
                ${isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200"}`}>
                <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}>
                  <span className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Notifications</span>
                  <button onClick={markAllNotificationsRead} className="text-xs text-blue-500 font-semibold hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className={`text-center text-xs py-8 ${isDark ? "text-slate-500" : "text-slate-400"}`}>No notifications yet</p>
                  ) : notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b text-xs transition-colors
                      ${isDark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-50 hover:bg-slate-50"}
                      ${!n.read ? (isDark ? "bg-blue-500/10" : "bg-blue-50") : ""}`}>
                      <p className={`font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>{n.text}</p>
                      <p className={`mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <button className={`p-2 rounded-lg transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}>
            <MessageSquare size={18} />
          </button>

          {/* User */}
          <div className={`flex items-center gap-2.5 ml-1 pl-3 border-l ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <div className={`w-8 h-8 rounded-full ${accent.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
              {initial}
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-bold leading-none ${isDark ? "text-white" : "text-slate-800"}`}>{displayName}</p>
              <p className={`text-[10px] mt-0.5 leading-none ${isDark ? "text-slate-500" : "text-slate-400"}`}>{accent.roleLabel}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
