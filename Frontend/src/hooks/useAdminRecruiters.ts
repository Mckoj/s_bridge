import { useState, useEffect, useCallback } from "react";
import { getAdminRecruiters, approveAdminRecruiter, type AdminRecruiter } from "../services/adminService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminRecruitersResult {
  recruiters: AdminRecruiter[];
  loading: boolean;
  error: ClassifiedApiError | null;
  approvingId: string | null;
  approveRecruiter: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useAdminRecruiters(): UseAdminRecruitersResult {
  const [recruiters, setRecruiters] = useState<AdminRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminRecruiters();
      setRecruiters(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveRecruiter = async (id: string) => {
    setApprovingId(id);
    try {
      await approveAdminRecruiter(id);
      setRecruiters((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
      );
    } catch (err: unknown) {
      throw err;
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  return {
    recruiters,
    loading,
    error,
    approvingId,
    approveRecruiter: handleApproveRecruiter,
    refetch: fetchRecruiters,
  };
}
