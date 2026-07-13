import { useDashboard } from "../../context/DashboardContext";
import StudentDashboard from "../Student/StudentDashboard";
import UniversityDashboard from "../University/UniversityDashboard";
import CompanyDashboard from "../Recruiter/CompanyDashboard";

/**
 * Renders the correct dashboard based on the user's role stored in DashboardContext.
 * Used by the main portal so ALL roles share the single /dashboard route.
 */
export default function RoleBasedDashboard() {
  const { role } = useDashboard();

  if (role === "university") return <UniversityDashboard />;
  if (role === "recruiter")  return <CompanyDashboard />;
  return <StudentDashboard />;
}
