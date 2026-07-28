import api from "./api";
import { classifyApiError } from "../utils/apiErrors";

// ─────────────────────────────────────────────
// Backend DTO — exactly what /api/students/stats returns
// DO NOT change these field names; they match the backend response.
// ─────────────────────────────────────────────
export interface BackendStudentStats {
  totalApplications: number;
  pendingReviews: number;
  acceptedOffers: number;
  submittedReports: number;
}

// ─────────────────────────────────────────────
// Runtime Type Guard — validates backend response at runtime.
// Protects the UI if the backend accidentally changes its payload.
// ─────────────────────────────────────────────
export function isBackendStudentStats(data: unknown): data is BackendStudentStats {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.totalApplications === "number" &&
    typeof d.pendingReviews === "number" &&
    typeof d.acceptedOffers === "number" &&
    typeof d.submittedReports === "number"
  );
}

// ─────────────────────────────────────────────
// Frontend Model — normalized names for use in UI components
// ─────────────────────────────────────────────
export interface StudentStats {
  totalApplications: number;
  underReview: number;      // mapped from pendingReviews
  accepted: number;         // mapped from acceptedOffers
  submittedReports: number; // mapped from submittedReports
}

// ─────────────────────────────────────────────
// Mapper — transforms backend DTO → frontend model
// All field-name translations live here. Never in React components.
// ─────────────────────────────────────────────
export function mapStudentStats(raw: BackendStudentStats): StudentStats {
  return {
    totalApplications: raw.totalApplications ?? 0,
    underReview: raw.pendingReviews ?? 0,
    accepted: raw.acceptedOffers ?? 0,
    submittedReports: raw.submittedReports ?? 0,
  };
}

// ─────────────────────────────────────────────
// Student Profile
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// File Validation Helpers
// Backend accepts: CV = PDF only, Avatar = PNG/JPG/JPEG/WEBP, max 5 MB
// ─────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function validateCVFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "Only PDF files are accepted for CV uploads.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size must not exceed ${MAX_FILE_SIZE_MB} MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)} MB.`;
  }
  return null; // valid
}

export function validateAvatarFile(file: File): string | null {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Only PNG, JPG, JPEG, or WEBP images are accepted for avatar uploads.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size must not exceed ${MAX_FILE_SIZE_MB} MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)} MB.`;
  }
  return null;
}

// ─────────────────────────────────────────────
// API Calls
// ─────────────────────────────────────────────
export const getStudentStats = async (): Promise<StudentStats> => {
  try {
    const res = await api.get("/api/students/stats");
    const raw: unknown = res.data.stats ?? res.data;

    if (!isBackendStudentStats(raw)) {
      console.error("[studentService] Unexpected stats payload shape:", raw);
      // Return safe zero-state instead of crashing
      return { totalApplications: 0, underReview: 0, accepted: 0, submittedReports: 0 };
    }

    return mapStudentStats(raw);
  } catch (err) {
    throw classifyApiError(err);
  }
};

export const getStudentProfile = async (id: string) => {
  const res = await api.get(`/api/students/${id}`);
  return res.data.student;
};

export const updateStudentProfile = async (id: string, data: StudentProfileData) => {
  const res = await api.get(`/api/students/${id}`);
  const existing = res.data.student;
  const payload = { ...existing, ...data };
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
