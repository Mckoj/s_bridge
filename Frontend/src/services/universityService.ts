import api from "./api";
import { classifyApiError } from "../utils/apiErrors";

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND DTOs
// These interfaces exactly match what the backend currently returns.
// DO NOT change field names here — they must mirror the backend response.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shape returned by GET /api/universities/stats
 * Backend currently returns: activePlacements, totalApplications, pendingRecruiters
 */
export interface BackendUniversityStats {
  activePlacements: number;
  totalApplications: number;
  pendingRecruiters: number;
  placementRate?: number;
  totalStudents?: number;
}

/**
 * Shape of a single recruiter record returned by GET /api/recruiters
 */
export interface BackendRecruiter {
  id: string;
  companyName: string;
  companyWebsite?: string | null;
  isApproved: boolean;
  user?: {
    email?: string;
    id?: string;
  } | null;
}

/**
 * Shape of a single student record returned by GET /api/students
 */
export interface BackendStudent {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  programme?: string | null;
  gpa?: string | number | null;
  phone?: string | null;
  studentId?: string | null;
  skills?: Array<{ skill?: { name?: string } } | string> | null;
  applications?: Array<{
    id: string;
    status: string;
    internship?: {
      title?: string;
      recruiter?: { companyName?: string };
    } | null;
  }> | null;
  user?: {
    email?: string;
    id?: string;
  } | null;
}

/**
 * Shape of a single announcement returned by GET /api/universities/announcements
 * (Future endpoint — not yet deployed.)
 */
export interface BackendAnnouncement {
  id: string;
  title: string;
  content: string;
  targetGroup?: string | null;
  priority?: string | null;
  status?: string | null;
  publishedAt?: string | null;
  expiresAt?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME TYPE GUARDS
// Validate backend responses at runtime.
// Returns false when the payload shape is unexpected, preventing UI crashes.
// ─────────────────────────────────────────────────────────────────────────────

export function isBackendUniversityStats(
  data: unknown
): data is BackendUniversityStats {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.activePlacements === "number" &&
    typeof d.totalApplications === "number" &&
    typeof d.pendingRecruiters === "number"
  );
}

export function isBackendRecruiterArray(
  data: unknown
): data is BackendRecruiter[] {
  return Array.isArray(data);
}

export function isBackendStudentArray(
  data: unknown
): data is BackendStudent[] {
  return Array.isArray(data);
}

export function isBackendAnnouncementArray(
  data: unknown
): data is BackendAnnouncement[] {
  return Array.isArray(data);
}

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEND MODELS
// Normalized field names used by UI components.
// Never expose raw BackendDTOs to React pages.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalized university statistics for the UI.
 * Fields returned from the backend map to stats; missing fields remain undefined.
 */
export interface UniversityStats {
  /** Mapped from activePlacements */
  activePlacements: number;
  /** Mapped from totalApplications */
  totalApplications: number;
  /** Mapped from pendingRecruiters */
  pendingRecruiters: number;
  /**
   * Placement percentage returned by backend (e.g. "85.5%" or 85.5).
   */
  placementRate?: number | string;
  /**
   * Total students count returned by backend.
   */
  totalStudents?: number;
}

/** Normalized recruiter record for the UI */
export interface UniversityRecruiter {
  id: string;
  companyName: string;
  companyWebsite: string | null;
  isApproved: boolean;
  email: string | null;
}

/** Normalized student record for the UI */
export interface UniversityStudent {
  id: string;
  firstName: string | null;
  lastName: string | null;
  programme: string | null;
  /** Raw GPA value — may be string or number from backend */
  gpa: string | number | null;
  phone: string | null;
  studentId: string | null;
  skills: string[];
  email: string | null;
  placementStatus: "PLACED" | "PENDING" | "UNASSIGNED";
  /** Company name if placed */
  placedAt: string | null;
}

/** Normalized announcement record for the UI */
export interface UniversityAnnouncement {
  id: string;
  title: string;
  content: string;
  targetGroup: string | null;
  priority: string | null;
  status: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPPER FUNCTIONS
// All field-name translations live here.
// React components must never transform raw backend data.
// ─────────────────────────────────────────────────────────────────────────────

export function mapUniversityStats(
  raw: BackendUniversityStats
): UniversityStats {
  return {
    activePlacements: raw.activePlacements ?? 0,
    totalApplications: raw.totalApplications ?? 0,
    pendingRecruiters: raw.pendingRecruiters ?? 0,
    placementRate: raw.placementRate !== undefined ? `${raw.placementRate}%` : undefined,
    totalStudents: raw.totalStudents,
  };
}

export function mapRecruiter(raw: BackendRecruiter): UniversityRecruiter {
  return {
    id: raw.id,
    companyName: raw.companyName ?? "Unknown Company",
    companyWebsite: raw.companyWebsite ?? null,
    isApproved: raw.isApproved ?? false,
    email: raw.user?.email ?? null,
  };
}

/**
 * Derives placement status from a student's applications array.
 * Logic lives in the mapper — never in a React component.
 */
function deriveStudentPlacementStatus(
  applications: BackendStudent["applications"]
): "PLACED" | "PENDING" | "UNASSIGNED" {
  if (!applications || applications.length === 0) return "UNASSIGNED";
  const isPlaced = applications.some((a) => a.status === "ACCEPTED");
  if (isPlaced) return "PLACED";
  const isPending = applications.some(
    (a) => a.status === "PENDING" || a.status === "REVIEWING"
  );
  return isPending ? "PENDING" : "UNASSIGNED";
}

function deriveSkillNames(
  skills: BackendStudent["skills"]
): string[] {
  if (!skills || skills.length === 0) return [];
  return skills.map((s) => {
    if (typeof s === "string") return s;
    return s?.skill?.name ?? "";
  }).filter(Boolean);
}

function derivePlacedAt(
  applications: BackendStudent["applications"]
): string | null {
  if (!applications) return null;
  const placed = applications.find((a) => a.status === "ACCEPTED");
  return placed?.internship?.recruiter?.companyName ?? null;
}

export function mapStudent(raw: BackendStudent): UniversityStudent {
  return {
    id: raw.id,
    firstName: raw.firstName ?? null,
    lastName: raw.lastName ?? null,
    programme: raw.programme ?? null,
    gpa: raw.gpa ?? null,
    phone: raw.phone ?? null,
    studentId: raw.studentId ?? null,
    skills: deriveSkillNames(raw.skills),
    email: raw.user?.email ?? null,
    placementStatus: deriveStudentPlacementStatus(raw.applications),
    placedAt: derivePlacedAt(raw.applications),
  };
}

export function mapAnnouncement(
  raw: BackendAnnouncement
): UniversityAnnouncement {
  return {
    id: raw.id,
    title: raw.title ?? "",
    content: raw.content ?? "",
    targetGroup: raw.targetGroup ?? null,
    priority: raw.priority ?? null,
    status: raw.status ?? null,
    publishedAt: raw.publishedAt ?? null,
    expiresAt: raw.expiresAt ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SAFE VALUES
// Used as safe fallback when backend returns unexpected payload.
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_UNIVERSITY_STATS: UniversityStats = {
  activePlacements: 0,
  totalApplications: 0,
  pendingRecruiters: 0,
  placementRate: undefined,
  totalStudents: undefined,
};

// ─────────────────────────────────────────────────────────────────────────────
// API FUNCTIONS
// All wrapped in try/catch with classifyApiError.
// Pages never call api.get() directly.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch aggregated university statistics.
 * Endpoint: GET /api/universities/stats
 */
export const getUniversityStats = async (): Promise<UniversityStats> => {
  try {
    const res = await api.get("/api/universities/stats");
    const raw: unknown = res.data.stats ?? res.data;

    if (!isBackendUniversityStats(raw)) {
      console.warn(
        "[universityService] Unexpected stats payload shape — using safe defaults:",
        raw
      );
      return DEFAULT_UNIVERSITY_STATS;
    }

    return mapUniversityStats(raw);
  } catch (err) {
    throw classifyApiError(err);
  }
};

/**
 * Fetch all recruiter accounts visible to this university.
 * Endpoint: GET /api/recruiters
 */
export const getAllRecruitersForUniversity = async (): Promise<
  UniversityRecruiter[]
> => {
  try {
    const res = await api.get("/api/recruiters");
    const raw: unknown = res.data.recruiters ?? res.data;

    if (!isBackendRecruiterArray(raw)) {
      console.warn(
        "[universityService] Unexpected recruiters payload shape:",
        raw
      );
      return [];
    }

    return raw.map(mapRecruiter);
  } catch (err) {
    throw classifyApiError(err);
  }
};

/**
 * Fetch all students visible to this university.
 * Endpoint: GET /api/students
 */
export const getAllStudentsForUniversity = async (): Promise<
  UniversityStudent[]
> => {
  try {
    const res = await api.get("/api/students");
    const raw: unknown = res.data.students ?? res.data;

    if (!isBackendStudentArray(raw)) {
      console.warn(
        "[universityService] Unexpected students payload shape:",
        raw
      );
      return [];
    }

    return raw.map(mapStudent);
  } catch (err) {
    throw classifyApiError(err);
  }
};

/**
 * Approve a recruiter by ID.
 * Endpoint: PATCH /api/universities/recruiters/:id/approve
 */
export const approveRecruiter = async (recruiterId: string): Promise<void> => {
  try {
    await api.patch(`/api/universities/recruiters/${recruiterId}/approve`);
  } catch (err) {
    throw classifyApiError(err);
  }
};

/**
 * Fetch announcements for this university.
 * Endpoint: GET /api/universities/announcements
 *
 * NOTE: This endpoint does not yet exist. The hook handles 404/501 gracefully
 * and surfaces isEndpointUnavailable = true to the UI.
 */
export const getUniversityAnnouncements = async (): Promise<
  UniversityAnnouncement[]
> => {
  try {
    const res = await api.get("/api/universities/announcements");
    const raw: unknown = res.data.announcements ?? res.data;

    if (!isBackendAnnouncementArray(raw)) {
      console.warn(
        "[universityService] Unexpected announcements payload shape:",
        raw
      );
      return [];
    }

    return raw.map(mapAnnouncement);
  } catch (err) {
    throw classifyApiError(err);
  }
};

/**
 * Publish a new announcement.
 * Endpoint: POST /api/universities/announcements
 *
 * NOTE: This endpoint does not yet exist. Callers should handle
 * ClassifiedApiError with isEndpointUnavailable = true.
 */
export const createAnnouncement = async (payload: {
  title: string;
  content: string;
  targetGroup: string;
}): Promise<UniversityAnnouncement> => {
  try {
    const res = await api.post("/api/universities/announcements", payload);
    return mapAnnouncement(res.data.announcement ?? res.data);
  } catch (err) {
    throw classifyApiError(err);
  }
};

export interface UniversityAnalyticsData {
  placementFunnel: {
    totalStudents: number;
    appliedStudents: number;
    interviewingStudents: number;
    placedStudents: number;
    placementRate: number;
  };
  programmeBreakdown: Array<{
    programme: string;
    totalStudents: number;
    placedStudents: number;
    placementRate: number;
  }>;
  reportCompliance: {
    totalReports: number;
    pendingReports: number;
    approvedReports: number;
    rejectedReports: number;
    complianceRate: number;
  };
}

/**
 * Fetch University Analytics
 * Endpoint: GET /api/universities/analytics
 */
export const getUniversityAnalytics = async (): Promise<UniversityAnalyticsData> => {
  try {
    const res = await api.get("/api/universities/analytics");
    const analytics = res.data?.analytics;
    if (!analytics) {
      throw classifyApiError({ response: { status: 500, data: { error: "Invalid analytics response" } } });
    }
    return analytics;
  } catch (err) {
    throw classifyApiError(err);
  }
};

