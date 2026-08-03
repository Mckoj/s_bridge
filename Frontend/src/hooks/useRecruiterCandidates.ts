import { useMemo } from "react";
import { useRecruiterApplications } from "./useRecruiterApplications";
import type { RecruiterCandidate } from "../services/recruiterService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseRecruiterCandidatesResult {
  candidates: RecruiterCandidate[];
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  refetch: () => void;
}

export function useRecruiterCandidates(): UseRecruiterCandidatesResult {
  const { applications, loading, error, isEndpointUnavailable, refetch } = useRecruiterApplications();

  const candidates: RecruiterCandidate[] = useMemo(() => {
    return applications.map((app) => ({
      id: app.studentId,
      applicationId: app.id,
      name: app.studentName,
      email: app.studentEmail,
      programme: app.programme,
      gpa: app.gpa,
      skills: app.studentSkills,
      appliedRole: app.jobTitle,
      status: app.status,
      matchScore: app.matchScore,
      appliedAt: app.appliedAt,
      profilePicUrl: app.profilePicUrl,
      cvUrl: app.cvUrl,
    }));
  }, [applications]);

  return {
    candidates,
    loading,
    error,
    isEndpointUnavailable,
    refetch,
  };
}
