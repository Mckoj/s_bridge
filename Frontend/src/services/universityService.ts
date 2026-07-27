import api from "./api";

export interface UniversityStats {
  totalStudents: number;
  studentsPlaced: number;
  placementRate: number;
  pending: number;
  rejected: number;
  topDepartment?: { name: string; placementRate: number };
  topCollege?: { name: string; placementRate: number };
}

export const getUniversityStats = async (): Promise<UniversityStats> => {
  const res = await api.get("/api/universities/stats");
  return res.data.stats || res.data;
};

export const approveRecruiter = async (recruiterId: string) => {
  const res = await api.patch(`/api/universities/recruiters/${recruiterId}/approve`);
  return res.data;
};

export const getAllStudentsForUniversity = async () => {
  const res = await api.get("/api/students");
  return res.data.students || [];
};

export const getAllRecruitersForUniversity = async () => {
  const res = await api.get("/api/recruiters");
  return res.data.recruiters || [];
};
