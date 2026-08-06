import { useState, useEffect, useCallback } from "react";
import {
  getAdminUniversityStats,
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
  /** True when the primary stats endpoint was unavailable (404/501) */
  isEndpointUnavailable: boolean;
  refetch: () => void;
}

/**
 * useAdminStats — fetches admin dashboard statistics.
 *
 * Strategy:
 *   1. Try GET /api/universities/stats first (accessible to ADMIN).
 *      This is more efficient — one round-trip instead of four —
 *      and returns richer data (activePlacements, placementRate).
 *   2. If that endpoint fails, fall back to deriving counts from
 *      four parallel sub-resource calls.
 */
export function useAdminStats(): UseAdminStatsResult {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [isEndpointUnavailable, setIsEndpointUnavailable] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsEndpointUnavailable(false);

    // ── Strategy 1: single aggregated endpoint ──────────────────────────
    try {
      const uniStats = await getAdminUniversityStats();
      setStats({
        totalStudents: uniStats.totalStudents,
        totalRecruiters: uniStats.totalRecruiters,
        pendingApprovals: uniStats.pendingRecruiters,
        totalInternships: uniStats.totalInternships,
        totalApplications: uniStats.totalApplications,
        activePlacements: uniStats.activePlacements,
        placementRate: uniStats.placementRate,
      });
      setLoading(false);
      return;
    } catch {
      // Endpoint unavailable or error — fall through to sub-resource derivation
    }

    // ── Strategy 2: derive from four sub-resource calls ─────────────────
    try {
      const [students, recruiters, internships, applications] = await Promise.all([
        getAdminStudents(),
        getAdminRecruiters(),
        getAdminInternships(),
        getAdminApplications(),
      ]);

      const pendingApprovals = recruiters.filter((r) => !r.isApproved).length;

      setStats({
        totalStudents: students.length,
        totalRecruiters: recruiters.length,
        pendingApprovals,
        totalInternships: internships.length,
        totalApplications: applications.length,
        // activePlacements and placementRate unavailable in this path
      });
      setIsEndpointUnavailable(true);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, isEndpointUnavailable, refetch: fetchStats };
}
