import { useState, useEffect, useCallback } from "react";
import { getUniversityStats } from "../services/universityService";
import type { UniversityStats } from "../services/universityService";
import { DEFAULT_UNIVERSITY_STATS } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";

interface UseUniversityStatsResult {
  stats: UniversityStats;
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

/**
 * Custom hook — fetches aggregated university statistics.
 *
 * Backend returns: { activePlacements, totalApplications, pendingRecruiters }
 * Fields NOT returned (placementRate, totalStudents) are typed as undefined.
 * The UI must render "—" or "Not Available" for these — never fabricate values.
 *
 * Usage:
 *   const { stats, loading, error, refetch } = useUniversityStats();
 */
export function useUniversityStats(): UseUniversityStatsResult {
  const [stats, setStats] = useState<UniversityStats>(DEFAULT_UNIVERSITY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
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
