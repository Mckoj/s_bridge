import React from "react";
import { Navigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: "student" | "university" | "recruiter";
}

export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const { role } = useDashboard();

  // Resolve current active portal context based on hostname or query overrides
  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const override = params.get("portal");
  
  let activePortal: "student" | "university" | "recruiter" | "main" = "main";
  if (override === "student" || hostname.startsWith("student.")) activePortal = "student";
  else if (override === "university" || hostname.startsWith("university.")) activePortal = "university";
  else if (override === "recruiter" || override === "company" || hostname.startsWith("recruiter.") || hostname.startsWith("company.")) activePortal = "recruiter";

  // Perform authorization check
  if (role !== allowedRole) {
    if (activePortal !== "main") {
      // User is attempting to access a subdomain portal with a different authenticated role.
      // Redirect their browser host to their appropriate portal (simulated or real subdomains).
      const port = window.location.port ? `:${window.location.port}` : "";
      
      let redirectHost = "";
      if (hostname.includes("localhost")) {
        // e.g. student.localhost:5173 -> recruiter.localhost:5173
        const baseDomain = hostname.split(".").slice(-1)[0]; // "localhost"
        redirectHost = `${role}.${baseDomain}${port}`;
      } else if (hostname.includes("sbridge.com")) {
        redirectHost = `${role}.sbridge.com`;
      } else {
        // Fallback for query param simulation
        window.location.href = `${window.location.protocol}//${window.location.host}${window.location.pathname}?portal=${role}`;
        return null;
      }

      window.location.href = `${window.location.protocol}//${redirectHost}/login`;
      return null;
    } else {
      // Main site: redirect to their dashboard path
      return <Navigate to={`/${role}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
}
