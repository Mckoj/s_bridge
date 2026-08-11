import { useState, useEffect, useCallback } from "react";
import { getUniversityAnalytics, type UniversityAnalyticsData } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseUniversityAnalyticsResult {
  data: UniversityAnalyticsData | null;
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

export function useUniversityAnalytics(): UseUniversityAnalyticsResult {
  const [data, setData] = useState<UniversityAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUniversityAnalytics();
      setData(res);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
