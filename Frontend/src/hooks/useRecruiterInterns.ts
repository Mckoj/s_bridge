import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getRecruiterReports,
  updateReportStatus,
  type RecruiterReport,
} from "../services/recruiterService";
import { useRecruiterApplications } from "./useRecruiterApplications";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

const CACHE_KEY = "GET:/api/reports";

export interface UseRecruiterInternsResult {
  reports: RecruiterReport[];
  acceptedInterns: Array<{
    studentId: string;
    studentName: string;
    programme?: string;
    jobTitle: string;
    appliedAt: string;
    profilePicUrl?: string;
  }>;
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  updatingReportId: string | null;
  refetch: () => void;
  updateStatus: (id: string, status: "PENDING" | "APPROVED" | "REJECTED", comment?: string) => Promise<boolean>;
}

export function useRecruiterInterns(): UseRecruiterInternsResult {
  const stale = queryCache.get<RecruiterReport[]>(CACHE_KEY);
  const [reports, setReports] = useState<RecruiterReport[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

  const { applications } = useRecruiterApplications();

  const fetchReports = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getRecruiterReports();
      setReports(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const acceptedInterns = useMemo(() => {
    return applications
      .filter((app) => app.status === "ACCEPTED")
      .map((app) => ({
        studentId: app.studentId,
        studentName: app.studentName,
        programme: app.programme,
        jobTitle: app.jobTitle,
        appliedAt: app.appliedAt,
        profilePicUrl: app.profilePicUrl,
      }));
  }, [applications]);

  const updateStatus = useCallback(
    async (id: string, status: "PENDING" | "APPROVED" | "REJECTED", comment?: string) => {
      setUpdatingReportId(id);
      try {
        const updated = await updateReportStatus(id, status, comment);
        setReports((prev) => prev.map((rep) => (rep.id === id ? updated : rep)));
        return true;
      } catch (err: unknown) {
        throw err;
      } finally {
        setUpdatingReportId(null);
      }
    },
    []
  );

  return {
    reports,
    acceptedInterns,
    loading,
    error,
    isEndpointUnavailable: error?.isEndpointUnavailable ?? false,
    updatingReportId,
    refetch: fetchReports,
    updateStatus,
  };
}
