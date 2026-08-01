import { useState, useEffect, useCallback } from "react";
import { getAllStudentsForUniversity } from "../services/universityService";
import type { UniversityStudent } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

interface UseUniversityStudentsResult {
  students: UniversityStudent[];
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

const CACHE_KEY = "GET:/api/students";

/**
 * Custom hook — fetches the university student roster.
 *
 * Stale-while-revalidate: returns cached student list instantly (no spinner)
 * while silently refreshing in background. Only shows a spinner on the very
 * first load when no cache entry exists.
 *
 * Students are fetched from GET /api/students and mapped through the
 * universityService mapper. All field transformations happen in the service
 * layer — this hook only manages loading/error state.
 *
 * Usage:
 *   const { students, loading, error, refetch } = useUniversityStudents();
 */
export function useUniversityStudents(): UseUniversityStudentsResult {
  const stale = queryCache.get<UniversityStudent[]>(CACHE_KEY);
  const [students, setStudents] = useState<UniversityStudent[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getAllStudentsForUniversity();
      setStudents(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { students, loading, error, refetch: fetch };
}
