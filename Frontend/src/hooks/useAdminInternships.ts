import { useState, useEffect, useCallback } from "react";
import { getAdminInternships, deleteAdminInternship, type AdminInternship } from "../services/adminService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminInternshipsResult {
  internships: AdminInternship[];
  loading: boolean;
  error: ClassifiedApiError | null;
  deletingId: string | null;
  deleteInternship: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useAdminInternships(): UseAdminInternshipsResult {
  const [internships, setInternships] = useState<AdminInternship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminInternships();
      setInternships(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteInternship = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAdminInternship(id);
      setInternships((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  return {
    internships,
    loading,
    error,
    deletingId,
    deleteInternship: handleDeleteInternship,
    refetch: fetchInternships,
  };
}
