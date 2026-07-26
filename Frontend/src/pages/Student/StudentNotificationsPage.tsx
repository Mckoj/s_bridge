import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Bell,
  CheckCheck,
  Trash2,
  Sparkles,
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentNotificationsPage() {
  const dark = useTheme();
  const { notifications, markAllNotificationsRead, clearNotifications } = useDashboard();
  const [filter, setFilter] = useState<string>("ALL");

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !item.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 md:p-8 ${
            dark
              ? "bg-slate-900/70 border-slate-800/80"
              : "bg-white/80 border-slate-200/80 shadow-xs"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-purple-500/10 border-purple-500/20 text-purple-400">
                <Sparkles size={13} />
                Activity Alerts
              </div>
              <h1
                className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                Notifications
              </h1>
              <p
                className={`mt-1 text-xs md:text-sm font-medium ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Stay updated on application responses, logbook reviews, and platform announcements.
              </p>
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={markAllNotificationsRead}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 text-purple-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <CheckCheck size={14} />
                  <span>Mark All Read</span>
                </button>
                <button
                  onClick={clearNotifications}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Bar */}
          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-800/50">
            {["ALL", "UNREAD"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filter === f
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : dark
                    ? "bg-slate-800/60 text-slate-400 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "ALL" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div
            className={`rounded-[24px] border p-12 text-center flex flex-col items-center justify-center ${
              dark
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Bell size={32} />
            </div>
            <h3
              className={`text-lg font-bold ${
                dark ? "text-white" : "text-slate-800"
              }`}
            >
              No Notifications
            </h3>
            <p
              className={`text-xs max-w-sm mt-1 mb-2 leading-relaxed ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              You're all caught up! New application updates and supervisor reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-[20px] border transition-all flex items-start gap-4 ${
                  !notif.read
                    ? dark
                      ? "bg-purple-950/20 border-purple-500/30"
                      : "bg-purple-50/50 border-purple-200"
                    : dark
                    ? "bg-slate-900/60 border-slate-800/80"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    !notif.read
                      ? "bg-purple-500 text-white"
                      : dark
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Bell size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold leading-relaxed ${
                      dark ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {notif.text}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                    {notif.time}
                  </span>
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
