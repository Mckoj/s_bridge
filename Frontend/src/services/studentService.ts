import api from "./api";

export interface StudentStats {
  totalApplications: number;
  underReview: number;
  accepted: number;
  rejected: number;
  interviews?: number;
}

export interface StudentProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gpa?: number | string;
  programme?: string;
  experience?: string;
  cvUrl?: string;
  profilePicUrl?: string;
  skills?: string[];
}

export const getStudentStats = async (): Promise<StudentStats> => {
  const res = await api.get("/api/students/stats");
  return res.data.stats || res.data;
};

export const getStudentProfile = async (id: string) => {
  const res = await api.get(`/api/students/${id}`);
  return res.data.student;
};

export const updateStudentProfile = async (id: string, data: StudentProfileData) => {
  const res = await api.get(`/api/students/${id}`);
  const existing = res.data.student;
  const payload = {
    ...existing,
    ...data,
  };
  const updateRes = await api.put(`/api/students/${id}`, payload);
  return updateRes.data.student;
};

export const getStudentApplications = async () => {
  const res = await api.get("/api/students/applications");
  return res.data.applications || [];
};

export const getActiveInternship = async () => {
  const res = await api.get("/api/students/internship");
  return res.data.internship;
};

export const uploadCV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/api/students/upload-cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/api/students/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
