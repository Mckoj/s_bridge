import api from "./api";

export interface ApplyPayload {
  internshipId: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface ApplicationItem {
  id: string;
  studentId: string;
  internshipId: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  coverLetter?: string;
  resumeUrl?: string;
  matchScore: number;
  createdAt: string;
  internship?: {
    id: string;
    title: string;
    location: string;
    internshipType: string;
    recruiter?: {
      companyName: string;
      companyWebsite?: string;
    };
  };
}

export const applyToInternship = async (payload: ApplyPayload): Promise<ApplicationItem> => {
  const res = await api.post("/api/applications", payload);
  return res.data.application;
};

export const getApplications = async (): Promise<ApplicationItem[]> => {
  const res = await api.get("/api/applications");
  return res.data.applications || [];
};

export const getApplicationById = async (id: string): Promise<ApplicationItem> => {
  const res = await api.get(`/api/applications/${id}`);
  return res.data.application;
};

export const withdrawApplication = async (id: string): Promise<ApplicationItem> => {
  const res = await api.patch(`/api/applications/${id}/status`, { status: "WITHDRAWN" });
  return res.data.application;
};

export const updateApplicationStatus = async (id: string, status: string): Promise<ApplicationItem> => {
  const res = await api.patch(`/api/applications/${id}/status`, { status });
  return res.data.application;
};
