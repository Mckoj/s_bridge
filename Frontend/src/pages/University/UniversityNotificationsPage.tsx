import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import {
  Bell,
  Sparkles,
  Trash2
} from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications
} from "../../services/notificationService";
import type { NotificationItem } from "../../services/notificationService";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversityNotificationsPage() {
  const dark = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      fetchNotifs();
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifs();
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleClear = async () => {
    try {
      await clearNotifications();
      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-violet-500/20"
              : "bg-gradient-to-br from-violet-50/90 via-white to-violet-50/50 border-violet-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    : "border-violet-200 bg-violet-100/80 text-violet-700"
                }`}
              >
                <Sparkles size={14} />
                Notifications Hub
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                University Notifications
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Real-time updates regarding student submissions, employer verification requests, and system alerts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                className="px-3.5 py-2 rounded-xl border text-xs font-bold text-violet-400 border-violet-500/30 hover:bg-violet-500/10"
              >
                Mark All Read
              </button>
              <button
                onClick={handleClear}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white flex items-center gap-1"
              >
                <Trash2 size={13} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Feed */}
        <div
          className={`rounded-3xl border p-6 shadow-xl space-y-4 ${
            dark ? "bg-slate-900/80 border-slate-800/80" : "bg-white border-slate-200/80"
          }`}
        >
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 animate-pulse">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No unread notifications at this time.</div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                    !n.isRead
                      ? dark
                        ? "bg-violet-950/30 border-violet-500/30"
                        : "bg-violet-50/80 border-violet-200"
                      : dark
                      ? "bg-slate-950/40 border-slate-800/60"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 font-bold flex items-center justify-center shrink-0">
                      <Bell size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{n.title}</h4>
                      <p className={`text-xs mt-0.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>{n.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{new Date(n.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-xs font-bold text-violet-400 hover:underline shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
