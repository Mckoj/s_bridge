import type { UserRole } from "../../context/DashboardContext";

export type ActivePortal = "student" | "university" | "recruiter" | "main";

export function getActivePortal(): ActivePortal {
  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const override = params.get("portal");

  if (override === "student" || hostname.startsWith("student.")) return "student";
  if (override === "university" || hostname.startsWith("university.")) return "university";
  if (
    override === "recruiter" ||
    override === "company" ||
    hostname.startsWith("recruiter.") ||
    hostname.startsWith("company.")
  )
    return "recruiter";
  return "main";
}

export function getDefaultRole(portal: ActivePortal): UserRole {
  if (portal === "main") return "student";
  return portal;
}

export const roleConfig = {
  student: {
    label: "Student",
    color: "border-blue-500 text-blue-500 bg-blue-500/5",
    accent: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20 shadow-blue-600/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/10",
    bg: "bg-blue-600/10",
    iconBg: "bg-blue-500",
  },
  university: {
    label: "University",
    color: "border-purple-500 text-purple-500 bg-purple-500/5",
    accent: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500/20 shadow-purple-600/10",
    text: "text-purple-400",
    glow: "shadow-purple-500/10",
    bg: "bg-purple-600/10",
    iconBg: "bg-purple-500",
  },
  recruiter: {
    label: "Recruiter",
    color: "border-emerald-500 text-emerald-500 bg-emerald-500/5",
    accent: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20 shadow-emerald-600/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/10",
    bg: "bg-emerald-600/10",
    iconBg: "bg-emerald-500",
  },
} as const;
