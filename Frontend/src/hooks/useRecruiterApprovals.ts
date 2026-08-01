import { useState, useEffect, useCallback } from "react";
import {
  getAllRecruitersForUniversity,
  approveRecruiter,
} from "../services/universityService";
import type { UniversityRecruiter } from "../services/universityService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

interface UseRecruiterApprovalsResult {
  recruiters: UniversityRecruiter[];
  pendingRecruiters: UniversityRecruiter[];
  approvedRecruiters: UniversityRecruiter[];
  loading: boolean;
  error: ClassifiedApiError | null;
  approving: string | null;
  approveError: ClassifiedApiError | null;
  handleApprove: (id: string) => Promise<void>;
  refetch: () => void;
}

const CACHE_KEY = "GET:/api/recruiters";

/**
 * Custom hook — manages the recruiter approval queue.
 *
 * Stale-while-revalidate: returns cached recruiter list instantly (no spinner)
 * while silently refreshing in background. Only shows a spinner on the very
 * first load when no cache entry exists.
 *
 * After approving a recruiter the cache is invalidated so the next navigation
 * to this page reflects the updated state.
 *
 * Provides pre-filtered pendingRecruiters and approvedRecruiters lists so
 * page components are purely presentational.
 *
 * Usage:
 *   const { pendingRecruiters, approvedRecruiters, loading, error,
 *           handleApprove, approving, approveError, refetch } = useRecruiterApprovals();
 */
export function useRecruiterApprovals(): UseRecruiterApprovalsResult {
  const stale = queryCache.get<UniversityRecruiter[]>(CACHE_KEY);
  const [recruiters, setRecruiters] = useState<UniversityRecruiter[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [approveError, setApproveError] = useState<ClassifiedApiError | null>(null);

  const fetch = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getAllRecruitersForUniversity();
      setRecruiters(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleApprove = useCallback(
    async (id: string) => {
      setApproving(id);
      setApproveError(null);
      try {
        await approveRecruiter(id);
        // Optimistically update local state
        setRecruiters((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
        );
        // Invalidate so the next page visit fetches fresh data
        queryCache.invalidate(CACHE_KEY);
      } catch (err: unknown) {
        setApproveError(err as ClassifiedApiError);
      } finally {
        setApproving(null);
      }
    },
    []
  );

  const pendingRecruiters = recruiters.filter((r) => !r.isApproved);
  const approvedRecruiters = recruiters.filter((r) => r.isApproved);

  return {
    recruiters,
    pendingRecruiters,
    approvedRecruiters,
    loading,
    error,
    approving,
    approveError,
    handleApprove,
    refetch: fetch,
  };
}
