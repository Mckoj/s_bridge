import { useState, useEffect, useCallback } from "react";
import { getUniversityStats } from "../services/universityService";
import type { UniversityStats } from "../services/universityService";
import { DEFAULT_UNIVERSITY_STATS } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

interface UseUniversityStatsResult {
  stats: UniversityStats;
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

const CACHE_KEY = "GET:/api/universities/stats";

/**
 * Custom hook — fetches aggregated university statistics.
 *
 * Stale-while-revalidate: returns cached data instantly (no spinner) while
 * silently refreshing in background. Only shows a spinner on the very first load.
 *
 * Backend returns: { activePlacements, totalApplications, pendingRecruiters }
 * Fields NOT returned (placementRate, totalStudents) are typed as undefined.
 * The UI must render "—" or "Not Available" for these — never fabricate values.
 *
 * Usage:
 *   const { stats, loading, error, refetch } = useUniversityStats();
 */
export function useUniversityStats(): UseUniversityStatsResult {
  const stale = queryCache.get<UniversityStats>(CACHE_KEY);
  const [stats, setStats] = useState<UniversityStats>(stale ?? DEFAULT_UNIVERSITY_STATS);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getUniversityStats();
      setStats(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refetch: fetch };
}
