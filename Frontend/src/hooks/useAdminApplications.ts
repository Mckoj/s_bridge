import { useState, useEffect, useCallback } from "react";
import { getAdminApplications, type AdminApplication } from "../services/adminService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminApplicationsResult {
  applications: AdminApplication[];
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

export function useAdminApplications(): UseAdminApplicationsResult {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminApplications();
      setApplications(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
}
