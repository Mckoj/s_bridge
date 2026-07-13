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

  // Student specific state
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "t1", title: "Upload Weekly Report", dueDate: "Due in 2 days", completed: false },
    { id: "t2", title: "Submit Logbook", dueDate: "Due in 5 days", completed: false },
    { id: "t3", title: "Evaluation Form", dueDate: "Due in 10 days", completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const [studentMessages] = useState<MessageItem[]>([
    {
      id: "m1",
      sender: "ABC Corp HR",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      content: "Your application status update",
      time: "2h ago",
    },
    {
      id: "m2",
      sender: "University Coordinator",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      content: "Regarding your internship agreement",
      time: "1d ago",
    },
    {
      id: "m3",
      sender: "Tech Solutions Ltd.",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      content: "Interview Invitation for Frontend Role",
      time: "2d ago",
    },
  ]);

  // University specific state
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: "a1",
      studentName: "John Doe",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      type: "Report Submission - Week 4",
      submittedTime: "2 hours ago",
      status: "Pending",
    },
    {
      id: "a2",
      studentName: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      type: "Internship Request: InnovateX",
      submittedTime: "5 hours ago",
      status: "Pending",
    },
    {
      id: "a3",
      studentName: "Mike Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      type: "Company Agreement Approval",
      submittedTime: "1 day ago",
      status: "Pending",
    },
  ]);

  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: "ac1", user: "John Doe", action: "submitted a report", time: "2 hours ago", type: "report" },
    { id: "ac2", user: "Sarah Wilson", action: "completed internship", time: "5 hours ago", type: "completion" },
    { id: "ac3", user: "Mike Brown", action: "application approved", time: "1 day ago", type: "approval" },
    { id: "ac4", user: "Emily Davis", action: "report approved", time: "2 days ago", type: "approval" },
  ]);

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

  // Company specific state
  const [applicants, setApplicants] = useState<ApplicantItem[]>([
    {
      id: "ap1",
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      role: "Frontend Developer Intern",
      appliedTime: "2h ago",
      status: "New",
    },
    {
      id: "ap2",
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "UI/UX Design Intern",
      appliedTime: "5h ago",
      status: "Under Review",
    },
    {
      id: "ap3",
      name: "Mike Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "Backend Developer Intern",
      appliedTime: "1d ago",
      status: "Shortlisted",
    },
    {
      id: "ap4",
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      role: "Data Analyst Intern",
      appliedTime: "2d ago",
      status: "New",
    },
  ]);

  const [interns] = useState<InternItem[]>([
    {
      id: "in1",
      name: "David Lee",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      role: "Software Engineering",
      performance: "Good",
    },
    {
      id: "in2",
      name: "Jessica Taylor",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "UI/UX Design",
      performance: "Excellent",
    },
    {
      id: "in3",
      name: "Daniel Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "Data Science",
      performance: "Good",
    },
    {
      id: "in4",
      name: "Sophia Martin",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      role: "QA Engineering",
      performance: "Excellent",
    },
  ]);

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

  // General Notification System state
  const [notifications, setNotifications] = useState([
    { id: "n1", text: "New report submission pending review", time: "10 mins ago", read: false },
    { id: "n2", text: "Interview scheduled with John Doe", time: "1 hour ago", read: false },
    { id: "n3", text: "System maintenance scheduled for tonight at 12 AM", time: "4 hours ago", read: true },
  ]);

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
