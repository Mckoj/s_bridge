import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  type NotificationItem,
} from "../services/notificationService";
import { classifyApiError } from "../utils/apiErrors";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseAdminNotificationsResult {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: ClassifiedApiError | null;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clear: () => Promise<void>;
  refetch: () => void;
}

/**
 * useAdminNotifications — wraps GET /api/notifications for the Admin portal.
 *
 * The backend endpoint is authenticated and role-agnostic, so Admin users
 * receive notifications addressed to their userId (same as all other roles).
 *
 * Returns: notifications, unreadCount, loading, error, and mutation helpers.
 */
export function useAdminNotifications(): UseAdminNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err: unknown) {
      setError(classifyApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: unknown) {
      throw classifyApiError(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: unknown) {
      throw classifyApiError(err);
    }
  };

  const handleClear = async () => {
    try {
      await clearNotifications();
      setNotifications([]);
    } catch (err: unknown) {
      throw classifyApiError(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    clear: handleClear,
    refetch: fetchNotifications,
  };
}
