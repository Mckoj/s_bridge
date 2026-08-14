import { useEffect, useState } from "react";
import api from "../services/api";

export interface PlatformStats {
  activePlacements: number;
  verifiedEmployers: number;
  successRate: number;
  totalApplications: number;
}

interface UsePlatformStatsResult {
  stats: PlatformStats | null;
  loading: boolean;
  error: boolean;
}

export function usePlatformStats(): UsePlatformStatsResult {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const res = await api.get<PlatformStats>("/api/admin/stats");
        if (!cancelled) {
          setStats(res.data);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
