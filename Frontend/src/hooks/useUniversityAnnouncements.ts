import { useState, useEffect, useCallback } from "react";
import {
  getUniversityAnnouncements,
  createAnnouncement,
} from "../services/universityService";
import type { UniversityAnnouncement } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

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

const CACHE_KEY = "GET:/api/universities/announcements";

/**
 * Custom hook — manages university announcements.
 *
 * Stale-while-revalidate: returns cached announcements instantly while
 * refreshing in background. Only shows a spinner on the very first load.
 *
 * The /api/universities/announcements endpoint does NOT yet exist.
 * When the server returns 404 or 501, isEndpointUnavailable is set to true
 * so the UI can render a "Coming Soon" empty state instead of an error.
 *
 * After a new announcement is created the cache is invalidated so the next
 * page visit fetches the full updated list from the server.
 *
 * Usage:
 *   const { announcements, loading, error, isEndpointUnavailable,
 *           submitting, submitError, submitAnnouncement, refetch } = useUniversityAnnouncements();
 */
export function useUniversityAnnouncements(): UseUniversityAnnouncementsResult {
  const stale = queryCache.get<UniversityAnnouncement[]>(CACHE_KEY);
  const [announcements, setAnnouncements] = useState<UniversityAnnouncement[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [isEndpointUnavailable, setIsEndpointUnavailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
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
        // Invalidate cache so next visit fetches the authoritative server list
        queryCache.invalidate(CACHE_KEY);
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
