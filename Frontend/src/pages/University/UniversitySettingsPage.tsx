import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import {
  Building,
  Save,
  CheckCircle2,
  Sparkles,
  Shield
} from "lucide-react";

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function UniversitySettingsPage() {
  const dark = useTheme();
  const { user } = useAuth();

  const [universityName, setUniversityName] = useState("Kwame Nkrumah University of Science and Technology");
  const [domain, setDomain] = useState("knust.edu.gh");
  const [contactEmail, setContactEmail] = useState(user?.email || "placement@knust.edu.gh");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden rounded-[28px] border p-6 lg:p-8 shadow-xl ${
            dark
              ? "bg-slate-900/80 border-violet-500/20"
              : "bg-gradient-to-br from-violet-50/90 via-white to-violet-50/50 border-violet-200/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                  dark
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    : "border-violet-200 bg-violet-100/80 text-violet-700"
                }`}
              >
                <Sparkles size={14} />
                Portal Settings
              </div>
              <h1 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
                University Settings
              </h1>
              <p className={`mt-1 text-xs lg:text-sm font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Configure institution profile, domain integration, email notification parameters, and security policies.
              </p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} /> Institutional settings saved successfully!
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Institutional Information */}
          <div
            className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
            }`}
          >
            <h3 className="text-base font-bold flex items-center gap-2">
              <Building size={18} className="text-violet-500" />
              Institution Profile & Domain
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">University Name</label>
                <input
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs border outline-none ${
                    dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Official Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs border outline-none ${
                    dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Placement Office Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={`w-full p-3 rounded-xl text-xs border outline-none ${
                    dark ? "bg-slate-950/60 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Placement Deadlines & Policy Settings */}
          <div
            className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              dark ? "bg-slate-900/80 border-slate-800/80 text-white" : "bg-white border-slate-200/80 text-slate-900"
            }`}
          >
            <h3 className="text-base font-bold flex items-center gap-2">
              <Shield size={18} className="text-violet-500" />
              Placement Policies & Automated Deadlines
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-800/40">
                <span>Require Industrial Supervisor Approval for Logbook Submissions</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-violet-600" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-800/40">
                <span>Automatically Flag Unplaced Students 30 Days Before Term End</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-violet-600" />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-500/20 flex items-center gap-2"
            >
              <Save size={15} /> Save University Settings
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
