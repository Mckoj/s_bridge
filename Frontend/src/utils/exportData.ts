/**
 * Generic data exporter — works with any array of flat objects.
 * Used across all 4 portals for PDF, Excel, and CSV downloads.
 */

// ─── CSV ──────────────────────────────────────────────────────
export function exportToCSV(
  rows: Record<string, unknown>[],
  headers: string[],
  keys: string[],
  filename = "export.csv"
) {
  const escape = (val: unknown): string => {
    if (val == null) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
  };

  const body = rows.map((r) => keys.map((k) => escape(r[k])).join(","));
  const csv = [headers.join(","), ...body].join("\n");
  downloadBlob(csv, filename, "text/csv;charset=utf-8;");
}

// ─── Excel ────────────────────────────────────────────────────
export async function exportToExcel(
  rows: Record<string, unknown>[],
  headers: string[],
  keys: string[],
  sheetName = "Data",
  filename = "export.xlsx"
) {
  const XLSX = await import("xlsx");
  const wsData = [headers, ...rows.map((r) => keys.map((k) => r[k] ?? ""))];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = headers.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

// ─── PDF ─────────────────────────────────────────────────────
export async function exportToPDF(
  rows: Record<string, unknown>[],
  headers: string[],
  keys: string[],
  title: string,
  filename = "export.pdf"
) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: headers.length > 5 ? "landscape" : "portrait", unit: "mm", format: "a4" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(title, 14, 18);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}   |   Records: ${rows.length}`, 14, 25);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(14, 28, doc.internal.pageSize.width - 14, 28);

  autoTable(doc, {
    startY: 33,
    head: [headers],
    body: rows.map((r) => keys.map((k) => String(r[k] ?? "—"))),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}  |  S-Bridge`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 8,
      { align: "center" }
    );
  }

  doc.save(filename);
}

// ─── Helpers ──────────────────────────────────────────────────
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
