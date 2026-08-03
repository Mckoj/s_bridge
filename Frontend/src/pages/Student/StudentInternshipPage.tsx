import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboard } from "../../context/DashboardContext";
import api from "../../services/api";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export interface ActiveInternship {
  id: string;
  title: string;
  companyName: string;
  companyAddress: string;
  companyLogo?: string;
  startDate: string;
  endDate: string;
  internshipType: string;
  companySupervisor: {
    name: string;
    email: string;
    phone?: string;
    position?: string;
  };
  universitySupervisor: {
    name: string;
    email: string;
    department?: string;
  };
  status: "ACTIVE" | "COMPLETED" | "PENDING_APPROVAL";
}

function useTheme() {
  return useDashboard().theme === "dark";
}

export default function StudentInternshipPage() {
  const dark = useTheme();
  const [internship, setInternship] = useState<ActiveInternship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/students/internship");
        if (res.data) {
          setInternship(res.data);
        }
      } catch {
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
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
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold bg-blue-500/10 border-blue-500/20 text-blue-400">
                <Sparkles size={13} />
                Industrial Attachment
              </div>
              <h1
                className={`mt-2 text-2xl md:text-3xl font-extrabold tracking-tight ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                My Active Internship
              </h1>
              <p
                className={`mt-1 text-xs md:text-sm font-medium ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Overview of your current placement, supervisor assignments, and attachment contract.
              </p>
            </div>

            {internship && (
              <Link
                to="/dashboard/reports"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
              >
                <FileCheck2 size={15} />
                <span>Submit Weekly Report</span>
              </Link>
            )}
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : !internship ? (
          <div
            className={`rounded-[24px] border p-12 text-center flex flex-col items-center justify-center ${
              dark
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Briefcase size={32} />
            </div>
            <h3
              className={`text-lg font-bold ${
                dark ? "text-white" : "text-slate-800"
              }`}
            >
              No Active Attachment Assigned
            </h3>
            <p
              className={`text-xs max-w-md mt-1 mb-6 leading-relaxed ${
                dark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              You do not have an active industrial attachment or verified placement record linked to your account.
              Apply to verified host organizations or request an official university placement authorization.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dashboard/applications"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>View Applications</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Placement Card */}
            <div
              className={`lg:col-span-2 rounded-[24px] border p-6 md:p-8 space-y-6 ${
                dark
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800/60">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                    <Building2 size={15} /> {internship.companyName}
                  </div>
                  <h2
                    className={`text-xl md:text-2xl font-extrabold ${
                      dark ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {internship.title}
                  </h2>
                  <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <MapPin size={14} /> {internship.companyAddress}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  <ShieldCheck size={14} /> Active Placement
                </span>
              </div>

              {/* Placement Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div
                  className={`p-4 rounded-2xl border ${
                    dark
                      ? "bg-slate-950/60 border-slate-800/60"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="text-slate-400 block font-medium mb-1">
                    Duration Period
                  </span>
                  <span className="font-bold flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-400" />
                    {internship.startDate} — {internship.endDate}
                  </span>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    dark
                      ? "bg-slate-950/60 border-slate-800/60"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="text-slate-400 block font-medium mb-1">
                    Work Arrangement
                  </span>
                  <span className="font-bold flex items-center gap-1.5">
                    <Briefcase size={14} className="text-blue-400" />
                    {internship.internshipType}
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Supervisors Card */}
            <div className="space-y-6">
              {/* Company Supervisor */}
              <div
                className={`rounded-[24px] border p-6 space-y-4 ${
                  dark
                    ? "bg-slate-900/60 border-slate-800/80"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <h3
                  className={`text-xs font-extrabold uppercase tracking-wider ${
                    dark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Host Supervisor
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm">
                    {internship.companySupervisor.name.charAt(0)}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        dark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {internship.companySupervisor.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {internship.companySupervisor.position || "Company Supervisor"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800/60">
                  <a
                    href={`mailto:${internship.companySupervisor.email}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    <Mail size={14} className="text-slate-500" />
                    <span className="truncate">{internship.companySupervisor.email}</span>
                  </a>
                  {internship.companySupervisor.phone && (
                    <a
                      href={`tel:${internship.companySupervisor.phone}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      <Phone size={14} className="text-slate-500" />
                      <span>{internship.companySupervisor.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* University Supervisor / Coordinator */}
              <div
                className={`rounded-[24px] border p-6 space-y-4 ${
                  dark
                    ? "bg-slate-900/60 border-slate-800/80"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <h3
                  className={`text-xs font-extrabold uppercase tracking-wider ${
                    dark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  University Liaison
                </h3>
                {internship.universitySupervisor?.name ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm">
                        {internship.universitySupervisor.name.charAt(0)}
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-bold ${
                            dark ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {internship.universitySupervisor.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {internship.universitySupervisor.department || "Academic Liaison"}
                        </p>
                      </div>
                    </div>
                    {internship.universitySupervisor.email ? (
                      <div className="pt-2 border-t border-slate-800/60">
                        <a
                          href={`mailto:${internship.universitySupervisor.email}`}
                          className="flex items-center gap-2 text-xs text-slate-300 hover:text-blue-400 transition-colors"
                          aria-label={`Email coordinator at ${internship.universitySupervisor.email}`}
                        >
                          <Mail size={14} className="text-slate-500" />
                          <span className="truncate">{internship.universitySupervisor.email}</span>
                        </a>
                      </div>
                    ) : (
                      <p className={`text-xs pt-2 border-t border-slate-800/60 ${
                        dark ? "text-slate-500" : "text-slate-400"
                      }`}>
                        Coordinator contact information unavailable.
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`text-xs ${
                    dark ? "text-slate-500" : "text-slate-400"
                  }`}>
                    University coordinator information is not yet available for this placement.
                    Contact your faculty office for assistance.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
