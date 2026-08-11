import api from "./api";
import { classifyApiError } from "../utils/apiErrors";

// ─────────────────────────────────────────────
// SavedJob Model
// Matches the expected backend shape for when
// GET /api/students/saved-jobs is implemented (Phase 2).
// ─────────────────────────────────────────────
export interface SavedJob {
  id: string;
  internshipId: string;
  title: string;
  companyName: string;
  location: string;
  internshipType: string;
  duration?: string;
  salary?: string;
  savedAt: string;
}

// ─────────────────────────────────────────────
// IMPORTANT: GET /api/students/saved-jobs does NOT yet exist
// in the backend (no SavedJob model in Prisma schema as of this audit).
// This service is isolated here so that once Phase 2 is deployed,
// only this file needs updating — not the UI components.
//
// Error handling:
//   404 / 501 → isEndpointUnavailable = true → UI shows "Feature unavailable"
//   403       → re-thrown as FORBIDDEN       → UI shows "No permission"
//   500+      → re-thrown as SERVER_ERROR     → UI shows "Server error" + retry
//   NETWORK   → re-thrown as NETWORK_ERROR   → UI shows "Connection failed" + retry
// ─────────────────────────────────────────────
export const getSavedJobs = async (): Promise<SavedJob[]> => {
  try {
    const res = await api.get("/api/students/saved-jobs");
    return res.data.savedJobs ?? res.data ?? [];
  } catch (err) {
    const classified = classifyApiError(err);
    if (classified.isEndpointUnavailable) {
      return [];
    }
    throw classified;
  }
};

export const saveJob = async (internshipId: string): Promise<SavedJob> => {
  try {
    const res = await api.post("/api/students/saved-jobs", { internshipId });
    return res.data.savedJob;
  } catch (err) {
    const classified = classifyApiError(err);
    throw classified;
  }
};

export const unsaveJob = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/students/saved-jobs/${id}`);
  } catch (err) {
    const classified = classifyApiError(err);
    // Silently no-op only for "not yet deployed" cases
    if (classified.isEndpointUnavailable) {
      return;
    }
    throw classified;
  }
};

