import api from "./api";

export interface ReportPayload {
  internshipId: string;
  title: string;
  fileUrl: string;
}

export interface ReportItem {
  id: string;
  studentId: string;
  internshipId: string;
  title: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comment?: string;
  createdAt: string;
}

export const submitReport = async (payload: ReportPayload): Promise<ReportItem> => {
  const res = await api.post("/api/reports", payload);
  return res.data.report;
};

export const getReports = async (): Promise<ReportItem[]> => {
  const res = await api.get("/api/reports");
  return res.data.reports || [];
};

export const updateReportStatus = async (id: string, status: string, comment?: string): Promise<ReportItem> => {
  const res = await api.patch(`/api/reports/${id}/status`, { status, comment });
  return res.data.report;
};
