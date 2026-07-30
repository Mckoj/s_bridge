import { useState, useEffect, useCallback } from "react";
import {
  getUniversityAnnouncements,
  createAnnouncement,
} from "../services/universityService";
import type { UniversityAnnouncement } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";

interface UseUniversityAnnouncementsResult {
  announcements: UniversityAnnouncement[];
  loading: boolean;
  error: ClassifiedApiError | null;
  /** True when the backend endpoint returns 404 or 501 — feature not yet deployed */
  isEndpointUnavailable: boolean;
  submitting: boolean;
  submitError: ClassifiedApiError | null;
  submitAnnouncement: (payload: {
    title: string;
    content: string;
    targetGroup: string;
  }) => Promise<boolean>;
  refetch: () => void;
}

/**
 * Custom hook — manages university announcements.
 *
 * The /api/universities/announcements endpoint does NOT yet exist.
 * When the server returns 404 or 501, isEndpointUnavailable is set to true
 * so the UI can render a "Coming Soon" empty state instead of an error.
 *
 * Usage:
 *   const { announcements, loading, error, isEndpointUnavailable,
 *           submitting, submitError, submitAnnouncement, refetch } = useUniversityAnnouncements();
 */
export function useUniversityAnnouncements(): UseUniversityAnnouncementsResult {
  const [announcements, setAnnouncements] = useState<UniversityAnnouncement[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [isEndpointUnavailable, setIsEndpointUnavailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsEndpointUnavailable(false);
    try {
      const data = await getUniversityAnnouncements();
      setAnnouncements(data);
    } catch (err: unknown) {
      const classified = err as ClassifiedApiError;
      if (classified.isEndpointUnavailable) {
        setIsEndpointUnavailable(true);
      } else {
        setError(classified);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  /**
   * Submit a new announcement.
   * Returns true on success, false on failure.
   * Sets submitError if the request fails.
   */
  const submitAnnouncement = useCallback(
    async (payload: {
      title: string;
      content: string;
      targetGroup: string;
    }): Promise<boolean> => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const created = await createAnnouncement(payload);
        setAnnouncements((prev) => [created, ...prev]);
        return true;
      } catch (err: unknown) {
        const classified = err as ClassifiedApiError;
        setSubmitError(classified);
        if (classified.isEndpointUnavailable) {
          setIsEndpointUnavailable(true);
        }
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return {
    announcements,
    loading,
    error,
    isEndpointUnavailable,
    submitting,
    submitError,
    submitAnnouncement,
    refetch: fetch,
  };
}
