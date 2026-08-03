import { useState, useEffect, useCallback } from "react";
import {
  getAdminStudents,
  getAdminRecruiters,
  getAdminInternships,
  getAdminApplications,
  type AdminStats,
} from "../services/adminService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminStatsResult {
  stats: AdminStats | null;
  loading: boolean;
  error: ClassifiedApiError | null;
  refetch: () => void;
}

export function useAdminStats(): UseAdminStatsResult {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [students, recruiters, internships, applications] = await Promise.all([
        getAdminStudents(),
        getAdminRecruiters(),
        getAdminInternships(),
        getAdminApplications(),
      ]);

      const pendingRecruiterApprovals = recruiters.filter((r) => !r.isApproved).length;

      setStats({
        totalStudents: students.length,
        totalRecruiters: recruiters.length,
        pendingApprovals: pendingRecruiterApprovals,
        totalInternships: internships.length,
        totalApplications: applications.length,
      });
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
