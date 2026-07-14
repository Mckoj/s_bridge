import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "university" | "recruiter";

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface MessageItem {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  time: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "report" | "completion" | "approval";
}

export interface ApprovalItem {
  id: string;
  studentName: string;
  avatar: string;
  type: string;
  submittedTime: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface ApplicantItem {
  id: string;
  name: string;
  avatar: string;
  role: string;
  appliedTime: string;
  status: "New" | "Under Review" | "Shortlisted" | "Rejected" | "Offered";
}

export interface InternItem {
  id: string;
  name: string;
  avatar: string;
  role: string;
  performance: "Good" | "Excellent" | "Average";
}

interface DashboardContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Student Dashboard State
  tasks: TaskItem[];
  toggleTask: (id: string) => void;
  studentMessages: MessageItem[];

  // University Dashboard State
  approvals: ApprovalItem[];
  handleApproval: (id: string, action: "Approved" | "Rejected") => void;
  activities: ActivityItem[];

  // Company Dashboard State
  applicants: ApplicantItem[];
  handleApplicant: (id: string, action: "Under Review" | "Shortlisted" | "Rejected" | "Offered") => void;
  interns: InternItem[];

  // General Notifications
  notifications: { id: string; text: string; time: string; read: boolean }[];
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const getActivePortalRole = (): UserRole => {
  const hostname = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const override = params.get("portal");

  if (override === "student" || hostname.startsWith("student.")) return "student";
  if (override === "university" || hostname.startsWith("university.")) return "university";
  if (override === "recruiter" || override === "company" || hostname.startsWith("recruiter.") || hostname.startsWith("company.")) return "recruiter";

  return (localStorage.getItem("dashboard_role") as UserRole) || "student";
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark"
      : "light";
  });

  const [role, setRoleState] = useState<UserRole>(() => getActivePortalRole());

  const [searchQuery, setSearchQuery] = useState("");

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("dashboard_role", newRole);
  };

  // Sync theme with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ── Student state ───────────────────────────────────────────────────────────
  // TODO: fetch tasks from GET /api/student/tasks
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // TODO: fetch messages from GET /api/student/messages
  const [studentMessages] = useState<MessageItem[]>([]);

  // ── University state ────────────────────────────────────────────────────────
  // TODO: fetch approvals from GET /api/university/approvals
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);

  // TODO: fetch activities from GET /api/university/activities
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const handleApproval = (id: string, action: "Approved" | "Rejected") => {
    const item = approvals.find((a) => a.id === id);
    if (!item) return;

    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));

    // Add to activity stream
    const newAct: ActivityItem = {
      id: `ac-${Date.now()}`,
      user: item.studentName,
      action: action === "Approved" ? "submitted report approved" : "submitted report rejected",
      time: "Just now",
      type: "approval",
    };
    setActivities((prev) => [newAct, ...prev]);

    // Send generic notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        text: `You have ${action.toLowerCase()} the approval for ${item.studentName}.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);
  };

  // ── Company state ───────────────────────────────────────────────────────────
  // TODO: fetch applicants from GET /api/company/applicants
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);

  // TODO: fetch interns from GET /api/company/interns
  const [interns] = useState<InternItem[]>([]);

  const handleApplicant = (id: string, action: "Under Review" | "Shortlisted" | "Rejected" | "Offered") => {
    const applicant = applicants.find((a) => a.id === id);
    if (!applicant) return;

    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        text: `Applicant ${applicant.name} status updated to ${action}.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);
  };

  // ── Notifications ───────────────────────────────────────────────────────────
  // TODO: fetch notifications from GET /api/notifications
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean }[]>([]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <DashboardContext.Provider
      value={{
        theme,
        toggleTheme,
        role,
        setRole,
        searchQuery,
        setSearchQuery,
        tasks,
        toggleTask,
        studentMessages,
        approvals,
        handleApproval,
        activities,
        applicants,
        handleApplicant,
        interns,
        notifications,
        markAllNotificationsRead,
        clearNotifications,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
