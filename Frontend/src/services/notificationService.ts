import api from "./api";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "APPLICATION" | "MATCH" | "REPORT" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const res = await api.get("/api/notifications");
  return res.data.notifications || [];
};

export const markAsRead = async (id: string): Promise<NotificationItem> => {
  const res = await api.patch(`/api/notifications/${id}/read`);
  return res.data.notification;
};

export const markAllAsRead = async () => {
  const res = await api.patch("/api/notifications/read-all");
  return res.data;
};

export const clearNotifications = async () => {
  const res = await api.delete("/api/notifications");
  return res.data;
};
