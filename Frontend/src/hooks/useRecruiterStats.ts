import { useState, useEffect, useCallback } from "react";
import { getRecruiterStats, type RecruiterStats } from "../services/recruiterService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

const CACHE_KEY = "GET:/api/recruiters/stats";

export interface UseRecruiterStatsResult {
  stats: RecruiterStats | null;
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  refetch: () => void;
}

export function useRecruiterStats(): UseRecruiterStatsResult {
  const stale = queryCache.get<RecruiterStats>(CACHE_KEY);
  const [stats, setStats] = useState<RecruiterStats | null>(stale ?? null);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetchStats = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getRecruiterStats();
      setStats(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    isEndpointUnavailable: error?.isEndpointUnavailable ?? false,
    refetch: fetchStats,
  };
}
