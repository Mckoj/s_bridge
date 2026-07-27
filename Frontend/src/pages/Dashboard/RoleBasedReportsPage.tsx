import { useAuth } from "../../context/AuthContext";
import StudentReportsPage from "../Student/StudentReportsPage";
import UniversityReportsPage from "../University/UniversityReportsPage";

export default function RoleBasedReportsPage() {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();

  if (role === "UNIVERSITY") {
    return <UniversityReportsPage />;
  }

  return <StudentReportsPage />;
}
