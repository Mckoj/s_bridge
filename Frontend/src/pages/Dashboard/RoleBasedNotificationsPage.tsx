import { useAuth } from "../../context/AuthContext";
import StudentNotificationsPage from "../Student/StudentNotificationsPage";
import UniversityNotificationsPage from "../University/UniversityNotificationsPage";

export default function RoleBasedNotificationsPage() {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();

  if (role === "UNIVERSITY") {
    return <UniversityNotificationsPage />;
  }

  return <StudentNotificationsPage />;
}
