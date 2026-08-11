import api from "./api";
import { classifyApiError } from "../utils/apiErrors";
import { queryCache, TTL } from "../utils/queryCache";

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND DTOs
// Exact shapes returned by backend controllers.
// ─────────────────────────────────────────────────────────────────────────────

export interface BackendRecruiterStats {
  totalListings: number;
  totalApplications: number;
  pendingReviews: number;
  acceptedCandidates: number;
}

export interface BackendCompanyProfile {
  id?: string;
  recruiterId?: string;
  description?: string | null;
  logoUrl?: string | null;
  industry?: string | null;
  size?: string | null;
  address?: string | null;
  website?: string | null;
}

export interface BackendRecruiterProfile {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite?: string | null;
  position?: string | null;
  isApproved: boolean;
  companyProfile?: BackendCompanyProfile | null;
  user?: {
    email?: string;
    isVerified?: boolean;
  } | null;
}

export interface BackendRecruiterInternship {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary?: number | null;
  duration: string;
  status: "OPEN" | "CLOSED" | "EXPIRED";
  targetProgrammes?: string | null;
  createdAt: string;
  updatedAt?: string;
  skills?: Array<{
    id?: string;
    skill?: {
      id?: string;
      name?: string;
    };
  }>;
  recruiter?: {
    id?: string;
    companyName?: string;
    companyWebsite?: string | null;
    companyProfile?: {
      logoUrl?: string | null;
      address?: string | null;
      industry?: string | null;
    } | null;
  };
  _count?: {
    applications?: number;
  };
}

export interface BackendRecruiterApplication {
  id: string;
  studentId: string;
  internshipId: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  coverLetter?: string | null;
  resumeUrl?: string | null;
  matchScore?: number | null;
  createdAt: string;
  updatedAt?: string;
  student?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    studentId?: string | null;
    programme?: string | null;
    gpa?: number | null;
    phone?: string | null;
    cvUrl?: string | null;
    profilePicUrl?: string | null;
    skills?: Array<{
      skill?: {
        name?: string;
      };
    }>;
    user?: {
      email?: string;
    };
  } | null;
  internship?: {
    id: string;
    title: string;
    description?: string;
    location: string;
    internshipType: string;
    salary?: number | null;
    duration?: string;
    recruiter?: {
      companyName?: string;
    };
  } | null;
}

export interface BackendRecruiterInterview {
  id: string;
  applicationId: string;
  companyName?: string;
  position?: string;
  interviewDate?: string;
  interviewTime?: string;
  scheduledAt?: string;
  duration?: string;
  platform?: string;
  meetingLink: string;
  interviewer: string;
  notes?: string | null;
  status?: "UPCOMING" | "COMPLETED";
  application?: BackendRecruiterApplication | null;
}

export interface BackendReport {
  id: string;
  studentId: string;
  internshipId: string;
  title: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comment?: string | null;
  createdAt: string;
  student?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    programme?: string | null;
    studentId?: string | null;
    profilePicUrl?: string | null;
  } | null;
  internship?: {
    id: string;
    title: string;
    recruiter?: {
      companyName?: string;
    } | null;
  } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME TYPE GUARDS
// Safely check shapes returned by API endpoints.
// ─────────────────────────────────────────────────────────────────────────────

export function isBackendRecruiterStats(data: unknown): data is BackendRecruiterStats {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.totalListings === "number" &&
    typeof d.totalApplications === "number" &&
    typeof d.pendingReviews === "number" &&
    typeof d.acceptedCandidates === "number"
  );
}

export function isBackendRecruiterProfile(data: unknown): data is BackendRecruiterProfile {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return typeof d.id === "string" && typeof d.companyName === "string";
}

export function isBackendRecruiterInternshipArray(data: unknown): data is BackendRecruiterInternship[] {
  return Array.isArray(data);
}

export function isBackendRecruiterApplicationArray(data: unknown): data is BackendRecruiterApplication[] {
  return Array.isArray(data);
}

export function isBackendRecruiterInterviewArray(data: unknown): data is BackendRecruiterInterview[] {
  return Array.isArray(data);
}

export function isBackendReportArray(data: unknown): data is BackendReport[] {
  return Array.isArray(data);
}

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZED FRONTEND MODELS
// Metrics missing from backend return undefined, never fabricated numbers.
// ─────────────────────────────────────────────────────────────────────────────

export interface RecruiterStats {
  totalListings: number;
  totalApplications: number;
  pendingReviews: number;
  acceptedCandidates: number;
  activePostings?: number;
  activeInterns?: number;
  completedInterns?: number;
}

export interface RecruiterProfile {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite?: string;
  position?: string;
  isApproved: boolean;
  description?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  address?: string;
  email?: string;
}

export interface RecruiterInternship {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary?: number;
  duration: string;
  status: "OPEN" | "CLOSED" | "EXPIRED";
  targetProgrammes: string[];
  skills: string[];
  applicantCount: number;
  companyName: string;
  logoUrl?: string;
  createdAt: string;
}

export interface RecruiterApplication {
  id: string;
  studentId: string;
  internshipId: string;
  studentName: string;
  studentEmail?: string;
  programme?: string;
  gpa?: number;
  studentSkills: string[];
  cvUrl?: string;
  profilePicUrl?: string;
  jobTitle: string;
  jobLocation: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  coverLetter?: string;
  resumeUrl?: string;
  matchScore?: number;
  appliedAt: string;
}

export interface RecruiterInterview {
  id: string;
  applicationId: string;
  companyName: string;
  position: string;
  scheduledAt: string;
  duration: string;
  platform: string;
  meetingLink: string;
  interviewer: string;
  notes?: string;
  status: "UPCOMING" | "COMPLETED";
}

export interface RecruiterCandidate {
  id: string;
  applicationId: string;
  name: string;
  email?: string;
  programme?: string;
  gpa?: number;
  skills: string[];
  appliedRole: string;
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  matchScore?: number;
  appliedAt: string;
  profilePicUrl?: string;
  cvUrl?: string;
}

export interface RecruiterIntern {
  id: string;
  studentId: string;
  name: string;
  programme?: string;
  internshipTitle: string;
  appliedAt: string;
  profilePicUrl?: string;
}

export interface RecruiterReport {
  id: string;
  studentId: string;
  internshipId: string;
  studentName: string;
  programme?: string;
  internshipTitle: string;
  title: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comment?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPPERS
// Map backend DTOs to frontend models safely.
// ─────────────────────────────────────────────────────────────────────────────

export function mapBackendRecruiterStats(dto: BackendRecruiterStats): RecruiterStats {
  return {
    totalListings: dto.totalListings,
    totalApplications: dto.totalApplications,
    pendingReviews: dto.pendingReviews,
    acceptedCandidates: dto.acceptedCandidates,
  };
}

export function mapBackendRecruiterProfile(dto: BackendRecruiterProfile): RecruiterProfile {
  return {
    id: dto.id,
    userId: dto.userId,
    companyName: dto.companyName,
    companyWebsite: dto.companyWebsite ?? undefined,
    position: dto.position ?? undefined,
    isApproved: dto.isApproved,
    description: dto.companyProfile?.description ?? undefined,
    logoUrl: dto.companyProfile?.logoUrl ?? undefined,
    industry: dto.companyProfile?.industry ?? undefined,
    size: dto.companyProfile?.size ?? undefined,
    address: dto.companyProfile?.address ?? undefined,
    email: dto.user?.email ?? undefined,
  };
}

export function mapBackendRecruiterInternship(dto: BackendRecruiterInternship): RecruiterInternship {
  const extractedSkills = dto.skills
    ?.map((s) => s.skill?.name)
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0) ?? [];

  const rawProgrammes = dto.targetProgrammes ?? "";
  const targetProgrammes = rawProgrammes
    ? rawProgrammes.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  return {
    id: dto.id,
    recruiterId: dto.recruiterId,
    title: dto.title,
    description: dto.description,
    location: dto.location,
    internshipType: dto.internshipType,
    salary: dto.salary ?? undefined,
    duration: dto.duration,
    status: dto.status || "OPEN",
    targetProgrammes,
    skills: extractedSkills,
    applicantCount: dto._count?.applications ?? 0,
    companyName: dto.recruiter?.companyName || "Company",
    logoUrl: dto.recruiter?.companyProfile?.logoUrl ?? undefined,
    createdAt: dto.createdAt,
  };
}

export function mapBackendRecruiterApplication(dto: BackendRecruiterApplication): RecruiterApplication {
  const student = dto.student;
  const firstName = student?.firstName ?? "";
  const lastName = student?.lastName ?? "";
  const studentName = [firstName, lastName].filter(Boolean).join(" ") || "Applicant";

  const studentSkills = student?.skills
    ?.map((s) => s.skill?.name)
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0) ?? [];

  return {
    id: dto.id,
    studentId: dto.studentId,
    internshipId: dto.internshipId,
    studentName,
    studentEmail: student?.user?.email ?? undefined,
    programme: student?.programme ?? undefined,
    gpa: typeof student?.gpa === "number" ? student.gpa : undefined,
    studentSkills,
    cvUrl: student?.cvUrl ?? dto.resumeUrl ?? undefined,
    profilePicUrl: student?.profilePicUrl ?? undefined,
    jobTitle: dto.internship?.title || "Internship Position",
    jobLocation: dto.internship?.location || "Remote",
    status: dto.status,
    coverLetter: dto.coverLetter ?? undefined,
    resumeUrl: dto.resumeUrl ?? undefined,
    matchScore: typeof dto.matchScore === "number" ? Math.round(dto.matchScore) : undefined,
    appliedAt: dto.createdAt,
  };
}

export function mapBackendRecruiterInterview(dto: BackendRecruiterInterview): RecruiterInterview {
  const scheduledAtValue = dto.scheduledAt || (dto.interviewDate && dto.interviewTime ? `${dto.interviewDate}T${dto.interviewTime}` : undefined);
  const scheduledDate = scheduledAtValue ? new Date(scheduledAtValue) : new Date();
  const dateStr = scheduledDate.toISOString().split("T")[0];
  const timeStr = scheduledDate.toTimeString().substring(0, 5);

  const isUpcoming = scheduledDate > new Date();

  return {
    id: dto.id,
    applicationId: dto.applicationId,
    companyName: dto.companyName || dto.application?.internship?.recruiter?.companyName || "Company",
    position: dto.position || dto.application?.internship?.title || "Internship",
    scheduledAt: scheduledAtValue || `${dateStr}T${timeStr}`,
    duration: dto.duration || "30 Mins",
    platform: dto.platform || "Google Meet",
    meetingLink: dto.meetingLink,
    interviewer: dto.interviewer,
    notes: dto.notes ?? undefined,
    status: dto.status || (isUpcoming ? "UPCOMING" : "COMPLETED"),
  };
}

export function mapBackendReport(dto: BackendReport): RecruiterReport {
  const studentName = [dto.student?.firstName, dto.student?.lastName].filter(Boolean).join(" ") || "Student";
  return {
    id: dto.id,
    studentId: dto.studentId,
    internshipId: dto.internshipId,
    studentName,
    programme: dto.student?.programme ?? undefined,
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

const STATS_CACHE_KEY = "GET:/api/recruiters/stats";
const INTERNSHIPS_CACHE_KEY = "GET:/api/internships";
const APPLICATIONS_CACHE_KEY = "GET:/api/applications";
const INTERVIEWS_CACHE_KEY = "GET:/api/applications/interviews";
const REPORTS_CACHE_KEY = "GET:/api/reports";

/** Fetch Recruiter Dashboard Statistics */
export async function getRecruiterStats(): Promise<RecruiterStats> {
  try {
    const res = await api.get("/api/recruiters/stats");
    const raw = res.data?.stats;
    if (!isBackendRecruiterStats(raw)) {
      console.warn("Invalid payload shape from /api/recruiters/stats", res.data);
      return { totalListings: 0, totalApplications: 0, pendingReviews: 0, acceptedCandidates: 0 };
    }
    const mapped = mapBackendRecruiterStats(raw);
    queryCache.set(STATS_CACHE_KEY, mapped, TTL.SHORT);
    return mapped;
  } catch (err: unknown) {
    const classified = classifyApiError(err);
    throw classified;
  }
}

/** Fetch Recruiter Profile */
export async function getRecruiterProfile(id: string): Promise<RecruiterProfile> {
  try {
    const res = await api.get(`/api/recruiters/${id}`);
    const raw = res.data?.recruiter;
    if (!isBackendRecruiterProfile(raw)) {
      throw classifyApiError({ response: { status: 404, data: { error: "Recruiter profile invalid" } } });
    }
    return mapBackendRecruiterProfile(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch the authenticated recruiter's own profile (no ID needed) */
export async function getCurrentRecruiterProfile(): Promise<RecruiterProfile> {
  try {
    const res = await api.get("/api/recruiters/me");
    const raw = res.data?.recruiter;
    if (!isBackendRecruiterProfile(raw)) {
      throw classifyApiError({ response: { status: 404, data: { error: "Recruiter profile invalid" } } });
    }
    return mapBackendRecruiterProfile(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Update Recruiter & Company Profile */
export async function updateRecruiterProfile(
  id: string,
  payload: {
    companyName?: string;
    companyWebsite?: string;
    position?: string;
    description?: string;
    logoUrl?: string;
    industry?: string;
    size?: string;
    address?: string;
    website?: string;
  }
): Promise<RecruiterProfile> {
  try {
    const res = await api.put(`/api/recruiters/${id}`, payload);
    const raw = res.data?.recruiter;
    if (!isBackendRecruiterProfile(raw)) {
      throw classifyApiError({ response: { status: 500, data: { error: "Failed to update recruiter" } } });
    }
    return mapBackendRecruiterProfile(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Upload Company Logo */
export async function uploadCompanyLogo(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/recruiters/upload-logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.logoUrl || "";
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch Recruiter Internship Postings */
export async function getRecruiterInternships(params?: {
  search?: string;
  location?: string;
  internshipType?: string;
  status?: string;
}): Promise<RecruiterInternship[]> {
  try {
    const res = await api.get("/api/internships", { params });
    const rawList = res.data?.internships;
    if (!isBackendRecruiterInternshipArray(rawList)) {
      console.warn("Invalid payload shape from /api/internships", res.data);
      return [];
    }
    const mapped = rawList.map(mapBackendRecruiterInternship);
    queryCache.set(INTERNSHIPS_CACHE_KEY, mapped, TTL.MEDIUM);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

export interface CreateInternshipPayload {
  title: string;
  description: string;
  location: string;
  internshipType: string;
  salary?: number | string;
  duration: string;
  targetProgrammes?: string | string[];
  skills?: string[];
}

/** Create Internship Listing */
export async function createRecruiterInternship(payload: CreateInternshipPayload): Promise<RecruiterInternship> {
  try {
    const res = await api.post("/api/internships", payload);
    const raw = res.data?.internship;
    if (!raw) {
      throw classifyApiError({ response: { status: 500, data: { error: "Failed to create internship" } } });
    }
    queryCache.invalidate(INTERNSHIPS_CACHE_KEY);
    queryCache.invalidate(STATS_CACHE_KEY);
    return mapBackendRecruiterInternship(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Update Internship Listing */
export async function updateRecruiterInternship(
  id: string,
  payload: Partial<CreateInternshipPayload> & { status?: string }
): Promise<RecruiterInternship> {
  try {
    const res = await api.put(`/api/internships/${id}`, payload);
    const raw = res.data?.internship;
    if (!raw) {
      throw classifyApiError({ response: { status: 500, data: { error: "Failed to update internship" } } });
    }
    queryCache.invalidate(INTERNSHIPS_CACHE_KEY);
    return mapBackendRecruiterInternship(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Delete Internship Listing */
export async function deleteRecruiterInternship(id: string): Promise<void> {
  try {
    await api.delete(`/api/internships/${id}`);
    queryCache.invalidate(INTERNSHIPS_CACHE_KEY);
    queryCache.invalidate(STATS_CACHE_KEY);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch Applications for Recruiter's listings */
export async function getRecruiterApplications(params?: { sortBy?: string }): Promise<RecruiterApplication[]> {
  try {
    const res = await api.get("/api/applications", { params });
    const rawList = res.data?.applications;
    if (!isBackendRecruiterApplicationArray(rawList)) {
      console.warn("Invalid payload shape from /api/applications", res.data);
      return [];
    }
    const mapped = rawList.map(mapBackendRecruiterApplication);
    queryCache.set(APPLICATIONS_CACHE_KEY, mapped, TTL.SHORT);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Update Application Status */
export async function updateApplicationStatus(
  id: string,
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"
): Promise<RecruiterApplication> {
  try {
    const res = await api.patch(`/api/applications/${id}/status`, { status });
    const raw = res.data?.application;
    if (!raw) {
      throw classifyApiError({ response: { status: 500, data: { error: "Failed to update status" } } });
    }
    queryCache.invalidate(APPLICATIONS_CACHE_KEY);
    queryCache.invalidate(STATS_CACHE_KEY);
    return mapBackendRecruiterApplication(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch Scheduled Interviews */
export async function getRecruiterInterviews(): Promise<RecruiterInterview[]> {
  try {
    const res = await api.get("/api/applications/interviews");
    const rawList = res.data?.interviews;
    if (!isBackendRecruiterInterviewArray(rawList)) {
      console.warn("Invalid payload shape from /api/applications/interviews", res.data);
      return [];
    }
    const mapped = rawList.map(mapBackendRecruiterInterview);
    queryCache.set(INTERVIEWS_CACHE_KEY, mapped, TTL.SHORT);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

export interface ScheduleInterviewPayload {
  applicationId: string;
  scheduledAt: string;
  duration?: string;
  platform?: string;
  meetingLink: string;
  interviewer: string;
  notes?: string;
}

/** Schedule Interview */
export async function scheduleInterview(payload: ScheduleInterviewPayload): Promise<RecruiterInterview> {
  try {
    const res = await api.post("/api/applications/interviews", payload);
    const raw = res.data?.interview;
    if (!raw) {
      throw classifyApiError({ response: { status: 500, data: { error: "Failed to schedule interview" } } });
    }
    queryCache.invalidate(INTERVIEWS_CACHE_KEY);
    return mapBackendRecruiterInterview(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Fetch Logbook Reports */
export async function getRecruiterReports(): Promise<RecruiterReport[]> {
  try {
    const res = await api.get("/api/reports");
    const rawList = res.data?.reports;
    if (!isBackendReportArray(rawList)) {
      console.warn("Invalid payload shape from /api/reports", res.data);
      return [];
    }
    const mapped = rawList.map(mapBackendReport);
    queryCache.set(REPORTS_CACHE_KEY, mapped, TTL.LONG);
    return mapped;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/** Update Report Status */
export async function updateReportStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
  comment?: string
): Promise<RecruiterReport> {
  try {
    const res = await api.patch(`/api/reports/${id}/status`, { status, comment });
    const raw = res.data?.report;
    if (!raw) {
      throw classifyApiError({ response: { status: 500, data: { error: "Failed to update report status" } } });
    }
    queryCache.invalidate(REPORTS_CACHE_KEY);
    return mapBackendReport(raw);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

export interface RecruiterAnalyticsData {
  totalListings: number;
  activeListings: number;
  totalApplications: number;
  interviewsScheduled: number;
  conversionRate: number;
  funnel: {
    applied: number;
    pending: number;
    underReview: number;
    interviewing: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  };
  topSkills: Array<{ name: string; count: number }>;
  listingsPerformance: Array<{
    id: string;
    title: string;
    status: string;
    location: string;
    applicationsCount: number;
    acceptedCount: number;
  }>;
}

const ANALYTICS_CACHE_KEY = "recruiter_analytics";

/** Fetch Recruiter Analytics */
export async function getRecruiterAnalytics(): Promise<RecruiterAnalyticsData> {
  const cached = queryCache.get<RecruiterAnalyticsData>(ANALYTICS_CACHE_KEY);
  if (cached) return cached;

  try {
    const res = await api.get("/api/recruiters/analytics");
    const analytics = res.data?.analytics;
    if (!analytics) {
      throw classifyApiError({ response: { status: 500, data: { error: "Invalid analytics payload shape" } } });
    }
    queryCache.set(ANALYTICS_CACHE_KEY, analytics, TTL.SHORT);
    return analytics;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

