import { useState, useEffect, useCallback } from "react";
import { getAdminReports, updateAdminReportStatus, type AdminReport } from "../services/adminService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminReportsResult {
  reports: AdminReport[];
  loading: boolean;
  error: ClassifiedApiError | null;
  updatingId: string | null;
  updateStatus: (id: string, status: "PENDING" | "APPROVED" | "REJECTED", comment?: string) => Promise<void>;
  refetch: () => void;
}

export function useAdminReports(): UseAdminReportsResult {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminReports();
      setReports(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = async (id: string, status: "PENDING" | "APPROVED" | "REJECTED", comment?: string) => {
    setUpdatingId(id);
    try {
      const updated = await updateAdminReportStatus(id, status, comment);
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err: unknown) {
      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    updatingId,
    updateStatus: handleUpdateStatus,
    refetch: fetchReports,
  };
}
