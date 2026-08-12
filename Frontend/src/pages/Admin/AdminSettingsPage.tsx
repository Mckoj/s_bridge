import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { PageHeader, LoadingSkeleton, ErrorState } from "../../components/admin";
import { Settings, Shield, Save, CheckCircle2, UserPlus, UserCheck, FileText, AlertTriangle } from "lucide-react";
import { getAdminSettings, updateAdminSettings, type SystemSettingsMap } from "../../services/adminService";
import type { ClassifiedApiError } from "../../utils/apiErrors";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const dark = theme === "dark";

  const [settings, setSettings] = useState<SystemSettingsMap>({
    registrationOpen: "true",
    autoApproveRecruiters: "false",
    requireCvUpload: "true",
    maxApplicationsPerStudent: "5",
    emailNotifications: "true",
    systemMaintenance: "false"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof SystemSettingsMap) => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true"
    }));
  };

  const handleChange = (key: keyof SystemSettingsMap, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const updated = await updateAdminSettings(settings);
      setSettings(updated);
      setSuccessMsg("Platform settings saved and persisted to database!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err as ClassifiedApiError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Platform Configuration"
          title="System Settings & Security"
          description="Configure live global platform security policies, system preferences, and feature flags."
        />

        {loading ? (
          <LoadingSkeleton count={3} layout="grid" />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchSettings} />
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {successMsg && (
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Admin Account Header */}
            <div
              className={`rounded-3xl border p-6 shadow-xl ${
                dark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${dark ? "text-white" : "text-slate-800"}`}>
                      Administrator Controls
                    </h3>
                    <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      Logged in as {user?.email || "System Administrator"}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  <span>Save Configuration</span>
                </button>
              </div>

              {/* Settings Controls */}
              <div className={`mt-6 pt-6 border-t space-y-4 ${dark ? "border-slate-800" : "border-slate-100"}`}>
                {/* Registration Open Toggle */}
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${dark ? "bg-slate-800/40 border-slate-700/80" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <UserPlus size={18} className="text-blue-400" />
                    <div>
                      <h4 className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        Public Portal Registrations
                      </h4>
                      <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        Allow new students and recruiters to register accounts
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("registrationOpen")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.registrationOpen === "true" ? "bg-blue-600" : dark ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.registrationOpen === "true" ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>

                {/* Auto Approve Recruiters */}
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${dark ? "bg-slate-800/40 border-slate-700/80" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <UserCheck size={18} className="text-amber-400" />
                    <div>
                      <h4 className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        Automatic Recruiter Approval
                      </h4>
                      <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        Automatically verify new employer accounts upon signup
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("autoApproveRecruiters")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.autoApproveRecruiters === "true" ? "bg-amber-600" : dark ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoApproveRecruiters === "true" ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>

                {/* Mandatory CV Upload */}
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${dark ? "bg-slate-800/40 border-slate-700/80" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-emerald-400" />
                    <div>
                      <h4 className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        Mandatory CV Upload
                      </h4>
                      <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        Require students to upload a CV before submitting applications
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("requireCvUpload")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.requireCvUpload === "true" ? "bg-emerald-600" : dark ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.requireCvUpload === "true" ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>

                {/* Max Applications per Student */}
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${dark ? "bg-slate-800/40 border-slate-700/80" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <Settings size={18} className="text-purple-400" />
                    <div>
                      <h4 className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        Application Limit Per Student
                      </h4>
                      <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        Maximum active applications allowed per student account
                      </p>
                    </div>
                  </div>
                  <select
                    value={settings.maxApplicationsPerStudent}
                    onChange={(e) => handleChange("maxApplicationsPerStudent", e.target.value)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border outline-none cursor-pointer ${
                      dark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"
                    }`}
                  >
                    <option value="3">3 Applications</option>
                    <option value="5">5 Applications</option>
                    <option value="10">10 Applications</option>
                    <option value="999">Unlimited</option>
                  </select>
                </div>

                {/* Maintenance Mode */}
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${dark ? "bg-slate-800/40 border-slate-700/80" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className="text-rose-400" />
                    <div>
                      <h4 className={`text-xs font-bold ${dark ? "text-white" : "text-slate-800"}`}>
                        System Maintenance Mode
                      </h4>
                      <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        Restrict student and recruiter access for maintenance updates
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("systemMaintenance")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settings.systemMaintenance === "true" ? "bg-rose-600" : dark ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.systemMaintenance === "true" ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
