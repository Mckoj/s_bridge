import api from "./api";
import { classifyApiError } from "../utils/apiErrors";
import { queryCache, TTL } from "../utils/queryCache";

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND DTOs
// Raw payloads returned by backend controllers.
// ─────────────────────────────────────────────────────────────────────────────

export interface BackendAdminStudent {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  studentId?: string | null;
  programme?: string | null;
  gpa?: number | null;
  phone?: string | null;
  cvUrl?: string | null;
  profilePicUrl?: string | null;
  createdAt: string;
  user?: {
    email?: string;
    isVerified?: boolean;
  } | null;
}

export interface BackendAdminRecruiter {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite?: string | null;
  position?: string | null;
  isApproved: boolean;
  companyProfile?: {
    logoUrl?: string | null;
    industry?: string | null;
    address?: string | null;
  } | null;
  user?: {
    email?: string;
    isVerified?: boolean;
  } | null;
  createdAt: string;
}

export interface BackendAdminInternship {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary?: number | null;
  duration: string;
  status: "OPEN" | "CLOSED" | "EXPIRED";
  createdAt: string;
  recruiter?: {
    companyName?: string;
  } | null;
  _count?: {
    applications?: number;
  };
}

export interface BackendAdminApplication {
  id: string;
  studentId: string;
  internshipId: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  matchScore?: number | null;
  createdAt: string;
  student?: {
    firstName?: string | null;
    lastName?: string | null;
    programme?: string | null;
    user?: {
      email?: string;
    };
  } | null;
  internship?: {
    title?: string;
    recruiter?: {
      companyName?: string;
    };
  } | null;
}

export interface BackendAdminReport {
  id: string;
  studentId: string;
  internshipId: string;
  title: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comment?: string | null;
  createdAt: string;
  student?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  internship?: {
    title?: string;
  } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME TYPE GUARDS
// ─────────────────────────────────────────────────────────────────────────────

export function isBackendAdminStudentArray(data: unknown): data is BackendAdminStudent[] {
  return Array.isArray(data);
}

export function isBackendAdminRecruiterArray(data: unknown): data is BackendAdminRecruiter[] {
  return Array.isArray(data);
}

export function isBackendAdminInternshipArray(data: unknown): data is BackendAdminInternship[] {
  return Array.isArray(data);
}

export function isBackendAdminApplicationArray(data: unknown): data is BackendAdminApplication[] {
  return Array.isArray(data);
}

export function isBackendAdminReportArray(data: unknown): data is BackendAdminReport[] {
  return Array.isArray(data);
}

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZED FRONTEND MODELS
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalStudents: number;
  totalRecruiters: number;
  pendingApprovals: number;
  totalInternships: number;
  totalApplications: number;
}

export interface AdminStudent {
  id: string;
  userId: string;
  name: string;
  email: string;
  studentId?: string;
  programme?: string;
  gpa?: number;
  profilePicUrl?: string;
  createdAt: string;
}

export interface AdminRecruiter {
  id: string;
  userId: string;
  companyName: string;
  email: string;
  position?: string;
  isApproved: boolean;
  logoUrl?: string;
  industry?: string;
  createdAt: string;
}

export interface AdminInternship {
  id: string;
  title: string;
  companyName: string;
  location: string;
  internshipType: string;
  status: "OPEN" | "CLOSED" | "EXPIRED";
  applicantCount: number;
  createdAt: string;
}

export interface AdminApplication {
  id: string;
  studentName: string;
  studentEmail?: string;
  programme?: string;
  jobTitle: string;
  companyName: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  matchScore?: number;
  appliedAt: string;
}

export interface AdminReport {
  id: string;
  studentName: string;
  internshipTitle: string;
  title: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comment?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPPERS
// ─────────────────────────────────────────────────────────────────────────────

export function mapBackendAdminStudent(dto: BackendAdminStudent): AdminStudent {
  const name = [dto.firstName, dto.lastName].filter(Boolean).join(" ") || "Student User";
  return {
    id: dto.id,
    userId: dto.userId,
    name,
    email: dto.user?.email || "N/A",
    studentId: dto.studentId ?? undefined,
    programme: dto.programme ?? undefined,
    gpa: typeof dto.gpa === "number" ? dto.gpa : undefined,
    profilePicUrl: dto.profilePicUrl ?? undefined,
    createdAt: dto.createdAt,
  };
}

export function mapBackendAdminRecruiter(dto: BackendAdminRecruiter): AdminRecruiter {
  return {
    id: dto.id,
    userId: dto.userId,
    companyName: dto.companyName,
    email: dto.user?.email || "N/A",
    position: dto.position ?? undefined,
    isApproved: dto.isApproved,
    logoUrl: dto.companyProfile?.logoUrl ?? undefined,
    industry: dto.companyProfile?.industry ?? undefined,
    createdAt: dto.createdAt,
  };
}

export function mapBackendAdminInternship(dto: BackendAdminInternship): AdminInternship {
  return {
    id: dto.id,
    title: dto.title,
    companyName: dto.recruiter?.companyName || "Company",
    location: dto.location,
    internshipType: dto.internshipType,
    status: dto.status,
    applicantCount: dto._count?.applications ?? 0,
    createdAt: dto.createdAt,
  };
}

export function mapBackendAdminApplication(dto: BackendAdminApplication): AdminApplication {
  const studentName = [dto.student?.firstName, dto.student?.lastName].filter(Boolean).join(" ") || "Applicant";
  return {
    id: dto.id,
    studentName,
    studentEmail: dto.student?.user?.email ?? undefined,
    programme: dto.student?.programme ?? undefined,
    jobTitle: dto.internship?.title || "Position",
    companyName: dto.internship?.recruiter?.companyName || "Company",
    status: dto.status,
    matchScore: typeof dto.matchScore === "number" ? Math.round(dto.matchScore) : undefined,
    appliedAt: dto.createdAt,
  };
}

export function mapBackendAdminReport(dto: BackendAdminReport): AdminReport {
  const studentName = [dto.student?.firstName, dto.student?.lastName].filter(Boolean).join(" ") || "Student";
  return {
    id: dto.id,
    studentName,
    internshipTitle: dto.internship?.title || "Internship",
    title: dto.title,
    fileUrl: dto.fileUrl,
    status: dto.status,
    comment: dto.comment ?? undefined,
    createdAt: dto.createdAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

const STUDENTS_CACHE_KEY = "GET:/api/students";
const RECRUITERS_CACHE_KEY = "GET:/api/recruiters";
const INTERNSHIPS_CACHE_KEY = "GET:/api/internships";
const APPLICATIONS_CACHE_KEY = "GET:/api/applications";
const REPORTS_CACHE_KEY = "GET:/api/reports";

/** Fetch all Students for Admin */
export async function getAdminStudents(): Promise<AdminStudent[]> {
  try {
    const res = await api.get("/api/students");
    const raw = res.data?.students;
    if (!isBackendAdminStudentArray(raw)) return [];
    const mapped = raw.map(mapBackendAdminStudent);
    queryCache.set(STUDENTS_CACHE_KEY, mapped, TTL.LONG);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Delete Student Account (Admin only) */
export async function deleteAdminStudent(id: string): Promise<void> {
  try {
    await api.delete(`/api/students/${id}`);
    queryCache.invalidate(STUDENTS_CACHE_KEY);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch all Recruiters for Admin */
export async function getAdminRecruiters(): Promise<AdminRecruiter[]> {
  try {
    const res = await api.get("/api/recruiters");
    const raw = res.data?.recruiters;
    if (!isBackendAdminRecruiterArray(raw)) return [];
    const mapped = raw.map(mapBackendAdminRecruiter);
    queryCache.set(RECRUITERS_CACHE_KEY, mapped, TTL.LONG);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Approve Recruiter (Admin or University) */
export async function approveAdminRecruiter(id: string): Promise<void> {
  try {
    await api.patch(`/api/university/recruiters/${id}/approve`);
    queryCache.invalidate(RECRUITERS_CACHE_KEY);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch all Internships for Admin */
export async function getAdminInternships(): Promise<AdminInternship[]> {
  try {
    const res = await api.get("/api/internships");
    const raw = res.data?.internships;
    if (!isBackendAdminInternshipArray(raw)) return [];
    const mapped = raw.map(mapBackendAdminInternship);
    queryCache.set(INTERNSHIPS_CACHE_KEY, mapped, TTL.MEDIUM);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Delete Internship Listing (Admin) */
export async function deleteAdminInternship(id: string): Promise<void> {
  try {
    await api.delete(`/api/internships/${id}`);
    queryCache.invalidate(INTERNSHIPS_CACHE_KEY);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch all Applications for Admin */
export async function getAdminApplications(): Promise<AdminApplication[]> {
  try {
    const res = await api.get("/api/applications");
    const raw = res.data?.applications;
    if (!isBackendAdminApplicationArray(raw)) return [];
    const mapped = raw.map(mapBackendAdminApplication);
    queryCache.set(APPLICATIONS_CACHE_KEY, mapped, TTL.SHORT);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch all Reports for Admin */
export async function getAdminReports(): Promise<AdminReport[]> {
  try {
    const res = await api.get("/api/reports");
    const raw = res.data?.reports;
    if (!isBackendAdminReportArray(raw)) return [];
    const mapped = raw.map(mapBackendAdminReport);
    queryCache.set(REPORTS_CACHE_KEY, mapped, TTL.LONG);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Update Report Status */
export async function updateAdminReportStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  comment?: string
): Promise<AdminReport> {
  try {
    const res = await api.patch(`/api/reports/${id}/status`, { status, comment });
    const raw = res.data?.report;
    if (!raw) {
      throw classifyApiError({ response: { status: 500, data: { error: "Failed to update report status" } } });
    }
    queryCache.invalidate(REPORTS_CACHE_KEY);
    return mapBackendAdminReport(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}
