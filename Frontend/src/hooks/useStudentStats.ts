import { useState, useEffect, useCallback } from "react";
import { getStudentStats } from "../services/studentService";
import type { StudentStats } from "../services/studentService";
import type { ClassifiedApiError } from "../utils/apiErrors";

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

/**
 * Custom hook — fetches student dashboard statistics from the backend.
 *
 * Usage:
 *   const { stats, loading, error, refetch } = useStudentStats();
 *
 * The backend returns: { totalApplications, pendingReviews, acceptedOffers, submittedReports }
 * The hook maps this to: { totalApplications, underReview, accepted, submittedReports }
 * via studentService.mapStudentStats().
 */
export function useStudentStats(): UseStudentStatsResult {
  const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
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
