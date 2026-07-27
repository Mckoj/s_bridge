import { useAuth } from "../../context/AuthContext";
import StudentMessagesPage from "../Student/StudentMessagesPage";
import UniversityMessagesPage from "../University/UniversityMessagesPage";

export default function RoleBasedMessagesPage() {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();

  if (role === "UNIVERSITY") {
    return <UniversityMessagesPage />;
  }

  return <StudentMessagesPage />;
}
