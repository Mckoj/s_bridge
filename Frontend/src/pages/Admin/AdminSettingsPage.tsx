import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { PageHeader } from "../../components/admin";
import { Settings, Shield, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <PageHeader
          badge="Platform Configuration"
          title="System Settings & Security"
          description="Configure global platform security policies and system preferences."
        />

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Administrator Account</h3>
              <p className="text-xs text-slate-400">{user?.email || "System Administrator"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-rose-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Role Access Control</h4>
                  <p className="text-[11px] text-slate-400">Authenticated System Administrator Account</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                ROLE: ADMIN
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-slate-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Global Feature Flags</h4>
                  <p className="text-[11px] text-slate-400">Platform-wide system configuration settings</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                DEFAULT CONFIG
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
