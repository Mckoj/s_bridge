import { useState, useEffect, useCallback } from "react";
import {
  getRecruiterInterviews,
  scheduleInterview,
  type RecruiterInterview,
  type ScheduleInterviewPayload,
} from "../services/recruiterService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

const CACHE_KEY = "GET:/api/applications/interviews";

export interface UseRecruiterInterviewsResult {
  interviews: RecruiterInterview[];
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  scheduling: boolean;
  scheduleError: ClassifiedApiError | null;
  refetch: () => void;
  createInterview: (payload: ScheduleInterviewPayload) => Promise<RecruiterInterview | undefined>;
}

export function useRecruiterInterviews(): UseRecruiterInterviewsResult {
  const stale = queryCache.get<RecruiterInterview[]>(CACHE_KEY);
  const [interviews, setInterviews] = useState<RecruiterInterview[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<ClassifiedApiError | null>(null);

  const fetchInterviews = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getRecruiterInterviews();
      setInterviews(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const createInterview = useCallback(async (payload: ScheduleInterviewPayload) => {
    setScheduling(true);
    setScheduleError(null);
    try {
      const created = await scheduleInterview(payload);
      setInterviews((prev) => [...prev, created]);
      return created;
    } catch (err: unknown) {
      setScheduleError(err as ClassifiedApiError);
      return undefined;
    } finally {
      setScheduling(false);
    }
  }, []);

  return {
    interviews,
    loading,
    error,
    isEndpointUnavailable: error?.isEndpointUnavailable ?? false,
    scheduling,
    scheduleError,
    refetch: fetchInterviews,
    createInterview,
  };
}
