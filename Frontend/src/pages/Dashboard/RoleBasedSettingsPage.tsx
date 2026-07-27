import { useAuth } from "../../context/AuthContext";
import StudentSettingsPage from "../Student/StudentSettingsPage";
import UniversitySettingsPage from "../University/UniversitySettingsPage";

export default function RoleBasedSettingsPage() {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();

  if (role === "UNIVERSITY") {
    return <UniversitySettingsPage />;
  }

  return <StudentSettingsPage />;
}
