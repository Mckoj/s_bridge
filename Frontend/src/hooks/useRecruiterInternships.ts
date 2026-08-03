import { useState, useEffect, useCallback } from "react";
import {
  getRecruiterInternships,
  createRecruiterInternship,
  updateRecruiterInternship,
  deleteRecruiterInternship,
  type RecruiterInternship,
  type CreateInternshipPayload,
} from "../services/recruiterService";
import type { ClassifiedApiError } from "../utils/apiErrors";
import { queryCache } from "../utils/queryCache";

const CACHE_KEY = "GET:/api/internships";

export interface UseRecruiterInternshipsResult {
  internships: RecruiterInternship[];
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  creating: boolean;
  createError: ClassifiedApiError | null;
  refetch: () => void;
  createPosting: (payload: CreateInternshipPayload) => Promise<RecruiterInternship | undefined>;
  updatePosting: (id: string, payload: Partial<CreateInternshipPayload> & { status?: string }) => Promise<RecruiterInternship | undefined>;
  deletePosting: (id: string) => Promise<boolean>;
}

export function useRecruiterInternships(params?: { search?: string; status?: string }): UseRecruiterInternshipsResult {
  const stale = queryCache.get<RecruiterInternship[]>(CACHE_KEY);
  const [internships, setInternships] = useState<RecruiterInternship[]>(stale ?? []);
  const [loading, setLoading] = useState(!stale);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<ClassifiedApiError | null>(null);

  const fetchInternships = useCallback(async () => {
    if (!queryCache.has(CACHE_KEY)) setLoading(true);
    setError(null);
    try {
      const data = await getRecruiterInternships(params);
      setInternships(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, [params?.search, params?.status]);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const createPosting = useCallback(async (payload: CreateInternshipPayload) => {
    setCreating(true);
    setCreateError(null);
    try {
      const created = await createRecruiterInternship(payload);
      setInternships((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      setCreateError(err as ClassifiedApiError);
      return undefined;
    } finally {
      setCreating(false);
    }
  }, []);

  const updatePosting = useCallback(async (id: string, payload: Partial<CreateInternshipPayload> & { status?: string }) => {
    try {
      const updated = await updateRecruiterInternship(id, payload);
      setInternships((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err: unknown) {
      throw err;
    }
  }, []);

  const deletePosting = useCallback(async (id: string) => {
    try {
      await deleteRecruiterInternship(id);
      setInternships((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }, []);

  return {
    internships,
    loading,
    error,
    isEndpointUnavailable: error?.isEndpointUnavailable ?? false,
    creating,
    createError,
    refetch: fetchInternships,
    createPosting,
    updatePosting,
    deletePosting,
  };
}
