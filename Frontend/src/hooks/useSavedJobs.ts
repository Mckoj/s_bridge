import { useState, useEffect, useCallback } from "react";
import { getSavedJobs, saveJob, unsaveJob } from "../services/savedJobsService";
import type { SavedJob } from "../services/savedJobsService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache, TTL } from "../utils/queryCache";

interface UseSavedJobsResult {
  savedJobs: SavedJob[];
  loading: boolean;
  error: ClassifiedApiError | null;
  savingId: string | null;
  removingId: string | null;
  refetch: () => void;
  isSaved: (internshipId: string) => boolean;
  handleSave: (internshipId: string) => Promise<void>;
  handleRemove: (id: string) => Promise<void>;
  toggleSave: (internshipId: string) => Promise<boolean>;
}

const CACHE_KEY = "GET:/api/students/saved-jobs";

export function useSavedJobs(): UseSavedJobsResult {
  const stale = queryCache.get<SavedJob[]>(CACHE_KEY);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getSavedJobs();
      setSavedJobs(data);
      queryCache.set(CACHE_KEY, data, TTL.MEDIUM);
    } catch (err: any) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const isSaved = useCallback(
    (internshipId: string) => {
      return savedJobs.some((j) => j.internshipId === internshipId || j.id === internshipId);
    },
    [savedJobs]
  );

  const handleSave = useCallback(async (internshipId: string) => {
    setSavingId(internshipId);
    try {
      const created = await saveJob(internshipId);
      setSavedJobs((prev) => [created, ...prev]);
      queryCache.invalidate(CACHE_KEY);
    } catch (err: any) {
      console.warn("[useSavedJobs] Failed to save job:", err?.message);
    } finally {
      setSavingId(null);
    }
  }, []);

  const handleRemove = useCallback(async (id: string) => {
    setRemovingId(id);
    try {
      await unsaveJob(id);
      setSavedJobs((prev) => prev.filter((j) => j.id !== id && j.internshipId !== id));
      queryCache.invalidate(CACHE_KEY);
    } catch (err: any) {
      console.warn("[useSavedJobs] Failed to remove saved job:", err?.message);
    } finally {
      setRemovingId(null);
    }
  }, []);

  const toggleSave = useCallback(
    async (internshipId: string): Promise<boolean> => {
      const existing = savedJobs.find((j) => j.internshipId === internshipId || j.id === internshipId);
      if (existing) {
        await handleRemove(existing.id || internshipId);
        return false;
      } else {
        await handleSave(internshipId);
        return true;
      }
    },
    [savedJobs, handleRemove, handleSave]
  );

  return {
    savedJobs,
    loading,
    error,
    savingId,
    removingId,
    refetch: fetch,
    isSaved,
    handleSave,
    handleRemove,
    toggleSave,
  };
}

