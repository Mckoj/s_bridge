import type { AdminAuditEvent } from "../services/adminService";

// ─────────────────────────────────────────────────────────
// CSV Export
// ─────────────────────────────────────────────────────────
export function exportAuditLogsToCSV(events: AdminAuditEvent[], filename = "audit-logs.csv") {
  const headers = [
    "Timestamp",
    "Actor",
    "Actor Role",
    "Action",
    "Category",
    "Target",
    "Status",
    "IP Address",
    "Details",
  ];

  const escape = (val: unknown): string => {
    if (val == null) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
  };

  const rows = events.map((e) => [
    escape(new Date(e.timestamp).toISOString()),
    escape(e.actorName),
    escape(e.actorRole),
    escape(e.action),
    escape(e.category),
    escape(e.target),
    escape(e.status),
    escape(e.ipAddress),
    escape(e.details),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csv, filename, "text/csv;charset=utf-8;");
}

// ─────────────────────────────────────────────────────────
// Excel Export (XLSX)
// ─────────────────────────────────────────────────────────
export async function exportAuditLogsToExcel(events: AdminAuditEvent[], filename = "audit-logs.xlsx") {
  const XLSX = await import("xlsx");

  const wsData = [
    [
      "Timestamp",
      "Actor",
      "Actor Role",
      "Action",
      "Category",
      "Target",
      "Status",
      "IP Address",
      "Details",
    ],
    ...events.map((e) => [
      new Date(e.timestamp).toISOString(),
      e.actorName ?? "",
      e.actorRole ?? "",
      e.action ?? "",
      e.category ?? "",
      e.target ?? "",
      e.status ?? "",
      e.ipAddress ?? "",
      e.details ?? "",
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = [
    { wch: 24 },
    { wch: 24 },
    { wch: 14 },
    { wch: 28 },
    { wch: 22 },
    { wch: 20 },
    { wch: 12 },
    { wch: 18 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Audit Logs");
  XLSX.writeFile(wb, filename);
}

// ─────────────────────────────────────────────────────────
// PDF Export (jsPDF)
// ─────────────────────────────────────────────────────────
export async function exportAuditLogsToPDF(events: AdminAuditEvent[], filename = "audit-logs.pdf") {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("S-Bridge System Audit Trail", 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Generated: ${new Date().toLocaleString()}   |   Total Events: ${events.length}`,
    14,
    27
  );

  // Separator line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(14, 30, doc.internal.pageSize.width - 14, 30);

  autoTable(doc, {
    startY: 35,
    head: [["Timestamp", "Actor", "Action", "Category", "Target", "Status", "IP Address"]],
    body: events.map((e) => [
      new Date(e.timestamp).toLocaleString(),
      e.actorName ?? "—",
      e.action ?? "—",
      e.category ?? "—",
      e.target ?? "—",
      e.status ?? "—",
      e.ipAddress ?? "—",
    ]),
    styles: {
      fontSize: 7.5,
      cellPadding: 3,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 36 },
      2: { cellWidth: 50 },
      3: { cellWidth: 36 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
      6: { cellWidth: 32 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 5) {
        const status = String(data.cell.text[0] ?? "").toUpperCase();
        if (status === "FAILED") {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = "bold";
        } else if (status === "SUCCESS") {
          data.cell.styles.textColor = [16, 185, 129];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}  |  S-Bridge Admin Portal`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 8,
      { align: "center" }
    );
  }

  doc.save(filename);
}

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
