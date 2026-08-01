import { useState, useEffect, useCallback } from "react";
import { getSavedJobs, unsaveJob } from "../services/savedJobsService";
import type { SavedJob } from "../services/savedJobsService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

interface UseSavedJobsResult {
  savedJobs: SavedJob[];
  loading: boolean;
  error: ClassifiedApiError | null;
  removingId: string | null;
  refetch: () => void;
  handleRemove: (id: string) => Promise<void>;
}

const CACHE_KEY = "GET:/api/students/saved-jobs";

/**
 * Custom hook — fetches and manages saved jobs from the backend.
 *
 * Stale-while-revalidate: returns cached saved jobs instantly while
 * refreshing in background. Only shows a spinner on the very first load.
 *
 * After removing a saved job, the cache is invalidated so the next
 * page visit fetches the updated list.
 *
 * Usage:
 *   const { savedJobs, loading, error, removingId, handleRemove, refetch } = useSavedJobs();
 *
 * NOTE: The /api/students/saved-jobs endpoint is planned for Phase 2.
 * Until then, this hook returns an empty savedJobs array gracefully.
 */
export function useSavedJobs(): UseSavedJobsResult {
  const stale = queryCache.get<SavedJob[]>(CACHE_KEY);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getSavedJobs();
      setSavedJobs(data);
    } catch (err: any) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleRemove = useCallback(async (id: string) => {
    setRemovingId(id);
    try {
      await unsaveJob(id);
      setSavedJobs((prev) => prev.filter((j) => j.id !== id));
      // Invalidate so next visit fetches updated list
      queryCache.invalidate(CACHE_KEY);
    } catch (err: any) {
      // Silently fail on remove (endpoint may not exist yet)
      console.warn("[useSavedJobs] Failed to remove saved job:", err?.message);
    } finally {
      setRemovingId(null);
    }
  }, []);

  return { savedJobs, loading, error, removingId, refetch: fetch, handleRemove };
}
