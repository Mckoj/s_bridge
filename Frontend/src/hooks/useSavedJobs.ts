import { useState, useEffect, useCallback } from "react";
import { getSavedJobs, unsaveJob } from "../services/savedJobsService";
import type { SavedJob } from "../services/savedJobsService";
import type { ClassifiedApiError } from "../utils/apiErrors";

interface UseSavedJobsResult {
  savedJobs: SavedJob[];
  loading: boolean;
  error: ClassifiedApiError | null;
  removingId: string | null;
  refetch: () => void;
  handleRemove: (id: string) => Promise<void>;
}

/**
 * Custom hook — fetches and manages saved jobs from the backend.
 *
 * Usage:
 *   const { savedJobs, loading, error, removingId, handleRemove, refetch } = useSavedJobs();
 *
 * NOTE: The /api/students/saved-jobs endpoint is planned for Phase 2.
 * Until then, this hook returns an empty savedJobs array gracefully.
 */
export function useSavedJobs(): UseSavedJobsResult {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
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
    } catch (err: any) {
      // Silently fail on remove (endpoint may not exist yet)
      console.warn("[useSavedJobs] Failed to remove saved job:", err?.message);
    } finally {
      setRemovingId(null);
    }
  }, []);

  return { savedJobs, loading, error, removingId, refetch: fetch, handleRemove };
}
