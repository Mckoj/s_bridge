import { useState, useEffect, useCallback } from "react";
import {
  getAdminAuditLogs,
  type AdminAuditEvent,
  type AdminAuditFilterParams,
} from "../services/adminService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminAuditLogsResult {
  auditLogs: AdminAuditEvent[];
  loading: boolean;
  error: ClassifiedApiError | null;
  isEndpointUnavailable: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  refetch: () => void;
}

export function useAdminAuditLogs(): UseAdminAuditLogsResult {
  const [auditLogs, setAuditLogs] = useState<AdminAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);
  const [isEndpointUnavailable, setIsEndpointUnavailable] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsEndpointUnavailable(false);
    try {
      const params: AdminAuditFilterParams = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedCategory !== "ALL") params.category = selectedCategory;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await getAdminAuditLogs(params);
      setAuditLogs(data);
    } catch (err: unknown) {
      const classified = err as ClassifiedApiError;
      if (classified?.isEndpointUnavailable || classified?.code === "NOT_FOUND" || classified?.status === 501 || classified?.status === 404) {
        setIsEndpointUnavailable(true);
      } else {
        setError(classified);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    auditLogs,
    loading,
    error,
    isEndpointUnavailable,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch: fetchLogs,
  };
}
