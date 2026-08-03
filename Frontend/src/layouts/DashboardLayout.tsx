import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/sbridge-logo.png";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BarChart2,
  MessageSquare,
  Bell,
  User,
  Settings,
  Users,
  CheckSquare,
  Search,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  PlusSquare,
  ClipboardList,
  BookOpen,
  Building,
  Shield,
} from "lucide-react";

const roleNav = {
  student: [
    { label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard" },
    { label: "Applications",        icon: FileText,        path: "/dashboard/applications" },
    { label: "My Internship",       icon: BookOpen,        path: "/dashboard/internship" },
    { label: "Explore Jobs",        icon: Briefcase,       path: "/dashboard/explore" },
    { label: "Interviews",          icon: CheckSquare,     path: "/dashboard/interviews" },
    { label: "Placement History",   icon: BarChart2,       path: "/dashboard/placement-history" },
    { label: "Logbook Reports",     icon: ClipboardList,   path: "/dashboard/reports" },
    { label: "AI Assistant",        icon: Sparkles,        path: "/dashboard/ai-assistant" },
    { label: "Messages",            icon: MessageSquare,   path: "/dashboard/messages" },
    { label: "Notifications",       icon: Bell,            path: "/dashboard/notifications" },
    { label: "Saved Jobs",          icon: ClipboardList,   path: "/dashboard/saved-jobs" },
    { label: "Resume Analyzer",     icon: FileText,        path: "/dashboard/resume-analyzer" },
    { label: "Profile",             icon: User,            path: "/dashboard/profile" },
    { label: "Settings",            icon: Settings,        path: "/dashboard/settings" },
  ],
  university: [
    { label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard" },
    { label: "Students",            icon: Users,           path: "/dashboard/students" },
    { label: "Departments",         icon: ClipboardList,   path: "/dashboard/departments" },
    { label: "Colleges",            icon: Briefcase,       path: "/dashboard/colleges" },
    { label: "Placement Overview",  icon: CheckSquare,     path: "/dashboard/placement-overview" },
    { label: "Reports & Analytics", icon: BarChart2,       path: "/dashboard/reports" },
    { label: "Announcements",       icon: Bell,            path: "/dashboard/announcements" },
    { label: "Company Directory",   icon: Users,           path: "/dashboard/company-directory" },
    { label: "Settings",            icon: Settings,        path: "/dashboard/settings" },
  ],
  recruiter: [
    { label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard" },
    { label: "Post Opportunities",  icon: PlusSquare,      path: "/dashboard/postings" },
    { label: "Manage Applications", icon: FileText,        path: "/dashboard/applications" },
    { label: "Candidates",          icon: Users,           path: "/dashboard/candidates" },
    { label: "Interviews",          icon: CheckSquare,     path: "/dashboard/interviews" },
    { label: "Placed Interns",      icon: ClipboardList,   path: "/dashboard/interns" },
    { label: "Reports & Analytics", icon: BarChart2,       path: "/dashboard/analytics" },
    { label: "Messages",            icon: MessageSquare,   path: "/dashboard/messages" },
    { label: "Settings",            icon: Settings,        path: "/dashboard/settings" },
  ],
  admin: [
    { label: "Dashboard",           icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Students",            icon: Users,           path: "/admin/dashboard/students" },
    { label: "Recruiters",          icon: Building,        path: "/admin/dashboard/recruiters" },
    { label: "Opportunities",       icon: Briefcase,       path: "/admin/dashboard/internships" },
    { label: "Applications",        icon: FileText,        path: "/admin/dashboard/applications" },
    { label: "Logbook Reports",     icon: ClipboardList,   path: "/admin/dashboard/reports" },
    { label: "Audit Logs",          icon: Shield,          path: "/admin/dashboard/audit-logs" },
    { label: "Settings",            icon: Settings,        path: "/admin/dashboard/settings" },
  ],
};

const roleAccent = {
  student:    { activeBg: "bg-blue-500",    avatarBg: "bg-blue-500",    roleLabel: "Student"         },
  university: { activeBg: "bg-purple-600",  avatarBg: "bg-purple-600",  roleLabel: "University Admin" },
  recruiter:  { activeBg: "bg-emerald-600", avatarBg: "bg-emerald-600", roleLabel: "Company Admin"    },
  admin:      { activeBg: "bg-rose-600",    avatarBg: "bg-rose-600",    roleLabel: "System Admin"     },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {
    role,
    theme,
    toggleTheme,
    notifications,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
  } = useDashboard();
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const accent   = roleAccent[role as keyof typeof roleAccent] ?? roleAccent.student;
  const navItems = roleNav[role as keyof typeof roleNav]       ?? roleNav.student;
  const unread   = notifications.filter(n => !n.read).length;

  const nameFromUser = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const raw          = user?.email?.split("@")[0] ?? "User";
  const fallbackName = raw.charAt(0).toUpperCase() + raw.slice(1);
  const displayName  = nameFromUser || fallbackName;
  const initial      = displayName[0] ?? "U";

  const isDark = theme === "dark";

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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

          {/* Search Bar */}
          <div className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 w-64 border transition-all duration-200
            ${isDark
              ? "bg-slate-800/80 border-slate-700 focus-within:border-blue-500"
              : "bg-slate-100 border-slate-200 focus-within:border-blue-500 focus-within:bg-white"
            }`}>
            <Search size={14} className={`shrink-0 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search applications, reports, messages..."
              className={`bg-transparent text-xs outline-none w-full ${isDark ? "text-white placeholder-slate-400" : "text-slate-800 placeholder-slate-400"}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer shrink-0"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer
              ${isDark
                ? "text-amber-400 hover:bg-slate-800 hover:text-amber-300"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              className={`relative p-2 rounded-lg transition-colors cursor-pointer ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
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
                  <button onClick={markAllNotificationsRead} className="text-xs text-blue-500 font-semibold hover:underline cursor-pointer">
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

          {/* Messages link */}
          <button
            onClick={() => navigate("/dashboard/messages")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <MessageSquare size={18} />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className={`flex items-center gap-2.5 ml-1 pl-3 py-1 px-2 rounded-xl border-l transition-all cursor-pointer ${
                isDark
                  ? "border-slate-700 hover:bg-slate-800/80"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className={`w-8 h-8 rounded-full overflow-hidden ${accent.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                {user?.profilePicUrl ? (
                  <img src={user.profilePicUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-sm font-bold leading-none ${isDark ? "text-white" : "text-slate-800"}`}>{displayName}</p>
                <p className={`text-[10px] mt-0.5 leading-none ${isDark ? "text-slate-500" : "text-slate-400"}`}>{accent.roleLabel}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Profile Dropdown Popover */}
            {profileOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl border z-50 overflow-hidden animate-fade-in ${
                  isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                {/* Header User Card */}
                <div className={`p-4 border-b ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full overflow-hidden ${accent.avatarBg} flex items-center justify-center text-white font-extrabold text-base shadow-sm shrink-0`}>
                      {user?.profilePicUrl ? (
                        <img src={user.profilePicUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-slate-800"}`}>{displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${accent.activeBg} text-white`}>
                        {accent.roleLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="p-2 space-y-1 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/dashboard/profile");
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                      isDark ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <User size={15} className="text-blue-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/dashboard/settings");
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                      isDark ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Settings size={15} className="text-purple-400" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleTheme();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                      isDark ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-500" />}
                      <span>Theme</span>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400">{theme}</span>
                  </button>
                </div>

                {/* Sign Out Footer */}
                <div className={`p-2 border-t ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
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
