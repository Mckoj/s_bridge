import api from "./api";
import { classifyApiError } from "../utils/apiErrors";

// ─────────────────────────────────────────────
// Interview Model
// Matches the expected backend shape for when
// GET /api/students/interviews is implemented (Phase 3).
// ─────────────────────────────────────────────
export interface InterviewItem {
  id: string;
  companyName: string;
  position: string;
  interviewDate: string;
  interviewTime: string;
  interviewer: string;
  platform: string;
  meetingLink?: string;
  notes?: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
}

// ─────────────────────────────────────────────
// IMPORTANT: GET /api/students/interviews does NOT yet exist
// in the backend (no Interview model in Prisma schema as of this audit).
// This service is isolated here so that once Phase 3 is deployed,
// only this file needs updating — not the UI components.
//
// Error handling:
//   404 / 501 → isEndpointUnavailable = true → UI shows "Feature unavailable"
//   403       → re-thrown as FORBIDDEN       → UI shows "No permission"
//   500+      → re-thrown as SERVER_ERROR     → UI shows "Server error" + retry
//   NETWORK   → re-thrown as NETWORK_ERROR   → UI shows "Connection failed" + retry
// ─────────────────────────────────────────────
export const getStudentInterviews = async (): Promise<InterviewItem[]> => {
  try {
    const res = await api.get("/api/students/interviews");
    return res.data.interviews ?? res.data ?? [];
  } catch (err) {
    const classified = classifyApiError(err);
    // Silently return empty array only for "not yet deployed" cases
    if (classified.isEndpointUnavailable) {
      return [];
    }
    // All other errors (403, 500, network) bubble up to the UI
    throw classified;
  }
};
