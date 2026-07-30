import { useState, useEffect, useCallback } from "react";
import { getAllStudentsForUniversity } from "../services/universityService";
import type { UniversityStudent } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";

interface UseUniversityStudentsResult {
  students: UniversityStudent[];
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

/**
 * Custom hook — fetches the university student roster.
 *
 * Students are fetched from GET /api/students and mapped through the
 * universityService mapper. All field transformations happen in the service
 * layer — this hook only manages loading/error state.
 *
 * Usage:
 *   const { students, loading, error, refetch } = useUniversityStudents();
 */
export function useUniversityStudents(): UseUniversityStudentsResult {
  const [students, setStudents] = useState<UniversityStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
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
