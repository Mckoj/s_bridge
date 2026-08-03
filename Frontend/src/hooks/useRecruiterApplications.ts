import { useState, useEffect, useCallback } from "react";
import {
  getRecruiterApplications,
  updateApplicationStatus,
  type RecruiterApplication,
} from "../services/recruiterService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

const CACHE_KEY = "GET:/api/applications";

export interface UseRecruiterApplicationsResult {
  applications: RecruiterApplication[];
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  updatingId: string | null;
  updateError: ClassifiedApiError | null;
  refetch: () => void;
  updateStatus: (id: string, status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED") => Promise<boolean>;
}

export function useRecruiterApplications(params?: { sortBy?: string }): UseRecruiterApplicationsResult {
  const stale = queryCache.get<RecruiterApplication[]>(CACHE_KEY);
  const [applications, setApplications] = useState<RecruiterApplication[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<ClassifiedApiError | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getRecruiterApplications(params);
      setApplications(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, [params?.sortBy]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = useCallback(
    async (id: string, status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED") => {
      setUpdatingId(id);
      setUpdateError(null);
      try {
        const updated = await updateApplicationStatus(id, status);
        setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
        return true;
      } catch (err: unknown) {
        setUpdateError(err as ClassifiedApiError);
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  return {
    applications,
    loading,
    error,
    isEndpointUnavailable: error?.isEndpointUnavailable ?? false,
    updatingId,
    updateError,
    refetch: fetchApplications,
    updateStatus,
  };
}
