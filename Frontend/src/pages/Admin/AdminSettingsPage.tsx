import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";
import { PageHeader } from "../../components/admin";
import { Settings, Shield, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { theme } = useDashboard();
  const dark = theme === "dark";

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Platform Configuration"
          title="System Settings & Security"
          description="Configure global platform security policies and system preferences."
        />

        <div
          className={`rounded-3xl border p-6 space-y-6 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          {/* Admin Account Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center"
              aria-hidden="true"
            >
              <Shield size={24} />
            </div>
            <div>
              <h3
                className={`text-base font-extrabold ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                Administrator Account
              </h3>
              <p
                className={`text-xs ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {user?.email || "System Administrator"}
              </p>
            </div>
          </div>

          {/* Settings Rows */}
          <div
            className={`pt-4 border-t space-y-4 ${
              dark ? "border-slate-800" : "border-slate-100"
            }`}
          >
            {/* Role Access Control */}
            <div
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                dark
                  ? "bg-slate-800/40 border-slate-700/80"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-rose-400" aria-hidden="true" />
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      dark ? "text-white" : "text-slate-800"
                    }`}
                  >
                    Role Access Control
                  </h4>
                  <p
                    className={`text-[11px] ${
                      dark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Authenticated System Administrator Account
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                ROLE: ADMIN
              </span>
            </div>

            {/* Global Feature Flags */}
            <div
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                dark
                  ? "bg-slate-800/40 border-slate-700/80"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings
                  size={18}
                  className={dark ? "text-slate-400" : "text-slate-500"}
                  aria-hidden="true"
                />
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      dark ? "text-white" : "text-slate-800"
                    }`}
                  >
                    Global Feature Flags
                  </h4>
                  <p
                    className={`text-[11px] ${
                      dark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Platform-wide system configuration settings
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                  dark
                    ? "bg-slate-800 text-slate-400 border-slate-700"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                DEFAULT CONFIG
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
