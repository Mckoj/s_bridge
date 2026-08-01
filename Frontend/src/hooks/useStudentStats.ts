import { useState, useEffect, useCallback } from "react";
import { getStudentStats } from "../services/studentService";
import type { StudentStats } from "../services/studentService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

interface UseStudentStatsResult {
  stats: StudentStats;
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

const DEFAULT_STATS: StudentStats = {
  totalApplications: 0,
  underReview: 0,
  accepted: 0,
  submittedReports: 0,
};

const CACHE_KEY = "GET:/api/students/stats";

/**
 * Custom hook — fetches student dashboard statistics from the backend.
 *
 * Stale-while-revalidate: returns cached data instantly (no spinner) while
 * silently refreshing in the background. Only shows a spinner on the very
 * first load when no cache entry exists.
 *
 * Usage:
 *   const { stats, loading, error, refetch } = useStudentStats();
 *
 * The backend returns: { totalApplications, pendingReviews, acceptedOffers, submittedReports }
 * The hook maps this to: { totalApplications, underReview, accepted, submittedReports }
 * via studentService.mapStudentStats().
 */
export function useStudentStats(): UseStudentStatsResult {
  const stale = queryCache.get<{ stats: StudentStats }>(CACHE_KEY);
  const [stats, setStats] = useState<StudentStats>(stale?.stats ?? DEFAULT_STATS);
  const [loading, setLoading] = useState(!stale); // no spinner if we have stale data
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    // Only show a blocking spinner when there is no stale data to display
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getStudentStats();
      setStats(data);
    } catch (err: any) {
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
