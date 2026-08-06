import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const getPortalRole = () => {
  const hostname = window.location.hostname;
  const portal = new URLSearchParams(window.location.search).get("portal");

  if (portal === "student" || hostname.startsWith("student.")) return "student";
  if (portal === "university" || hostname.startsWith("university.")) return "university";
  if (
    portal === "recruiter" ||
    portal === "company" ||
    hostname.startsWith("recruiter.") ||
    hostname.startsWith("company.")
  ) {
    return "recruiter";
  }
  if (portal === "admin" || portal === "administrator" || portal === "superadmin") {
    return "admin";
  }

  return null;
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();
  const portalRole = getPortalRole();
  const permittedRoles = allowedRoles ?? (portalRole ? [portalRole] : undefined);

  if (permittedRoles && (!role || !permittedRoles.includes(role))) {
    // A role mismatch on a portal host must leave that portal; otherwise the
    // same guarded /dashboard route would immediately redirect in a loop.
    if (portalRole && role) {
      return <Navigate to={`/?portal=${role}`} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
