import api from "./api";

export interface InternshipQuery {
  search?: string;
  location?: string;
  type?: string;
  domain?: string;
}

export interface InternshipItem {
  id: string;
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary?: number;
  duration: string;
  status: string;
  targetProgrammes?: string;
  createdAt: string;
  recruiter?: {
    companyName: string;
    companyWebsite?: string;
    companyProfile?: {
      logoUrl?: string;
      industry?: string;
    };
  };
  skills?: Array<{
    skill: {
      name: string;
    };
  }>;
}

export const getInternships = async (params?: InternshipQuery): Promise<InternshipItem[]> => {
  const res = await api.get("/api/internships", { params });
  return res.data.internships || res.data || [];
};

export const getInternshipById = async (id: string): Promise<InternshipItem> => {
  const res = await api.get(`/api/internships/${id}`);
  return res.data.internship || res.data;
};

export const createInternship = async (data: Partial<InternshipItem>) => {
  const res = await api.post("/api/internships", data);
  return res.data.internship;
};
