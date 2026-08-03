import { useState, useEffect, useCallback } from "react";
import { getAdminStudents, deleteAdminStudent, type AdminStudent } from "../services/adminService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminStudentsResult {
  students: AdminStudent[];
  loading: boolean;
  error: ClassifiedApiError | null;
  deletingId: string | null;
  deleteStudent: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useAdminStudents(): UseAdminStudentsResult {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminStudents();
      setStudents(data);
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteStudent = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAdminStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    deletingId,
    deleteStudent: handleDeleteStudent,
    refetch: fetchStudents,
  };
}
