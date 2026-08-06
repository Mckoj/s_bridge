import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  Lock,
  Sun,
  Moon,
  Bell,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentSettingsPage() {
  const dark = useTheme();
  const { theme, toggleTheme } = useDashboard();
  const { logout, user } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  // Preference states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reportReminders, setReportReminders] = useState(true);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordErr(null);

    if (newPassword !== confirmPassword) {
      setPasswordErr("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErr("Password must be at least 6 characters long.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordErr(
        err.response?.data?.message || "Failed to update password. Verify your current password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

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
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-slate-500/10 border-slate-500/20 text-slate-400">
            <Sparkles size={13} />
            Preferences & Security
          </div>
          <h1
            className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
              dark ? "text-white" : "text-slate-800"
            }`}
          >
            Account Settings
          </h1>
          <p
            className={`mt-1 text-xs md:text-sm font-medium ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Customize your interface appearance, security controls, and notification channels.
          </p>
        </div>

        {/* Display Preference Card */}
        <div
          className={`rounded-[24px] border p-6 space-y-4 ${
            dark
              ? "bg-slate-900/60 border-slate-800/80"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <h2
            className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${
              dark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />} Visual Theme
          </h2>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p
                className={`text-xs font-bold ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                Interface Mode
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Toggle between dark and light themes for optimal viewing.
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                dark
                  ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
              }`}
            >
              {theme === "dark" ? (
                <>
                  <Sun size={15} /> Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon size={15} /> Switch to Dark Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Password Security Card */}
        <div
          className={`rounded-[24px] border p-6 space-y-4 ${
            dark
              ? "bg-slate-900/60 border-slate-800/80"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <h2
            className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${
              dark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <Shield size={16} /> Security & Password
          </h2>

          {passwordMsg && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={15} /> {passwordMsg}
            </div>
          )}
          {passwordErr && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={15} /> {passwordErr}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                  dark
                    ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                    dark
                      ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none ${
                    dark
                      ? "bg-slate-950/70 border-slate-800 text-white focus:border-blue-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              {savingPassword ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={14} /> Update Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Notifications Preference Card */}
        <div
          className={`rounded-[24px] border p-6 space-y-4 ${
            dark
              ? "bg-slate-900/60 border-slate-800/80"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <h2
            className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${
              dark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <Bell size={16} /> Notification Channels
          </h2>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                  Application Status Emails
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Receive instant email notifications when an application status changes.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
              <div>
                <p className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                  Logbook Submission Reminders
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Weekly email prompts to submit your logbook reports on time.
                </p>
              </div>
              <input
                type="checkbox"
                checked={reportReminders}
                onChange={(e) => setReportReminders(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div
          className={`rounded-[24px] border p-6 flex items-center justify-between ${
            dark
              ? "bg-rose-950/20 border-rose-500/20"
              : "bg-rose-50/50 border-rose-200 shadow-xs"
          }`}
        >
          <div>
            <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">
              Account Session
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Signed in as <span className="font-semibold text-white">{user?.email}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
