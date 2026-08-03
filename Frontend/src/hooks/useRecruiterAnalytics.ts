import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseRecruiterAnalyticsResult {
  data: null;
  loading: false;
  error: ClassifiedApiError;
  isEndpointUnavailable: true;
  refetch: () => void;
}

export function useRecruiterAnalytics(): UseRecruiterAnalyticsResult {
  const error: ClassifiedApiError = {
    code: "NOT_IMPLEMENTED",
    status: 501,
    message: "Recruiter analytics endpoint is not yet implemented on the server.",
    isEndpointUnavailable: true,
  };

  return {
    data: null,
    loading: false,
    error,
    isEndpointUnavailable: true,
    refetch: () => {},
  };
}
