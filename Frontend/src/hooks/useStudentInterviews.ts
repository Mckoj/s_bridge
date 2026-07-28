import { useState, useEffect, useCallback } from "react";
import { getStudentInterviews } from "../services/interviewService";
import type { InterviewItem } from "../services/interviewService";
import type { ClassifiedApiError } from "../utils/apiErrors";

interface UseStudentInterviewsResult {
  interviews: InterviewItem[];
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

/**
 * Custom hook — fetches student interviews from the backend.
 *
 * Usage:
 *   const { interviews, loading, error, refetch } = useStudentInterviews();
 *
 * NOTE: The /api/students/interviews endpoint is planned for Phase 3.
 * Until then, this hook returns an empty interviews array gracefully
 * (interviewService handles 404 → returns []).
 */
export function useStudentInterviews(): UseStudentInterviewsResult {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentInterviews();
      setInterviews(data);
    } catch (err: any) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { interviews, loading, error, refetch: fetch };
}
