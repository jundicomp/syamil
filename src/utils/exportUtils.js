import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function cellText(col, row) {
  const val = row[col.key];
  if (col.type === 'currency') return `Rp${fmt(val)}`;
  return val === undefined || val === null ? '' : String(val);
}

function sanitizeFileName(title) {
  return title.replace(/\s+/g, '_').replace(/[\\/*?:[\]]/g, '');
}

function buildHeaderLines({ companyName, reportName, rangeLabel, searchLabel }) {
  const lines = [companyName, reportName];
  if (rangeLabel) lines.push(rangeLabel);
  if (searchLabel) lines.push(searchLabel);
  return lines;
}

function buildTotalRow(columns, summaryKeys, summary) {
  if (!summary) return null;
  return columns.map((col, i) => {
    if (summaryKeys.includes(col.key)) return `Rp${fmt(summary[col.key])}`;
    return i === 0 ? 'TOTAL' : '';
  });
}

function autoColWidths(columns, rows) {
  const noWidth = { wch: Math.max(String(rows.length).length + 2, 5) };
  const dataWidths = columns.map(col => {
    const headerLen = col.label.length;
    const maxDataLen = rows.reduce((max, r) => Math.max(max, cellText(col, r).length), 0);
    return { wch: Math.min(Math.max(headerLen, maxDataLen) + 3, 45) };
  });
  return [noWidth, ...dataWidths];
}

const THIN_BORDER = { style: 'thin', color: { rgb: 'CCCCCC' } };
const BORDER_ALL = { top: THIN_BORDER, bottom: THIN_BORDER, left: THIN_BORDER, right: THIN_BORDER };

/**
 * Export ke Excel (.xlsx) — header: Nama Usaha / Nama Laporan / Rentang Tanggal / (filter cari),
 * kolom No otomatis, header tabel hitam-putih tebal + border tipis, lebar kolom otomatis + wrap,
 * baris TOTAL di bawah kalau summaryKeys diisi.
 */
export function exportToExcel({ companyName, reportName, rangeLabel, searchLabel, columns, rows, summaryKeys, summary }) {
  const headerLines = buildHeaderLines({ companyName, reportName, rangeLabel, searchLabel });
  const headerRow = ['No', ...columns.map(c => c.label)];
  const dataRows = rows.map((r, i) => [i + 1, ...columns.map(c => cellText(c, r))]);
  const totalRow = buildTotalRow(columns, summaryKeys || [], summary);
  const tableHeaderRowIndex = headerLines.length + 1; // +1 karena ada 1 baris kosong pemisah

  const sheetData = [
    ...headerLines.map(l => [l]),
    [],
    headerRow,
    ...dataRows,
    ...(totalRow ? [['', ...totalRow]] : []),
  ];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const numCols = Math.max(columns.length + 1, 1);

  const titleRef = XLSX.utils.encode_cell({ r: 0, c: 0 });
  if (ws[titleRef]) ws[titleRef].s = { font: { bold: true, sz: 14 } };
  const reportNameRef = XLSX.utils.encode_cell({ r: 1, c: 0 });
  if (ws[reportNameRef]) ws[reportNameRef].s = { font: { bold: true, sz: 12 } };
  for (let r = 2; r < headerLines.length; r++) {
    const ref = XLSX.utils.encode_cell({ r, c: 0 });
    if (ws[ref]) ws[ref].s = { font: { italic: true, sz: 10, color: { rgb: '666666' } } };
  }

  for (let c = 0; c < numCols; c++) {
    const ref = XLSX.utils.encode_cell({ r: tableHeaderRowIndex, c });
    if (!ws[ref]) continue;
    ws[ref].s = {
      fill: { fgColor: { rgb: '000000' } },
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: BORDER_ALL,
    };
  }

  const range = XLSX.utils.decode_range(ws['!ref']);
  const lastDataRow = tableHeaderRowIndex + dataRows.length;
  for (let r = tableHeaderRowIndex + 1; r <= range.e.r; r++) {
    for (let c = 0; c <= range.e.c; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) continue;
      const isTotalRow = totalRow && r > lastDataRow;
      ws[ref].s = {
        alignment: { wrapText: true, vertical: 'top', horizontal: c === 0 ? 'center' : undefined },
        border: BORDER_ALL,
        font: isTotalRow ? { bold: true } : undefined,
        fill: isTotalRow ? { fgColor: { rgb: 'F2F2F2' } } : undefined,
      };
    }
  }

  ws['!cols'] = autoColWidths(columns, rows);
  headerLines.forEach((_, r) => { ws['!merges'] = ws['!merges'] || []; });
  ws['!merges'] = headerLines.map((_, r) => ({ s: { r, c: 0 }, e: { r, c: numCols - 1 } }));

  const wb = XLSX.utils.book_new();
  const sheetName = sanitizeFileName(reportName).substring(0, 31) || 'Sheet1';
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${sanitizeFileName(reportName)}.xlsx`);
}

/**
 * Export ke PDF sungguhan — header Nama Usaha / Nama Laporan / Rentang / (filter cari),
 * kolom No otomatis, header tabel hitam-putih tebal + border grid, baris TOTAL kalau ada.
 */
export function exportToPDF({ companyName, reportName, rangeLabel, searchLabel, columns, rows, summaryKeys, summary }) {
  const orientation = columns.length > 5 ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation, unit: 'mm' });

  let y = 15;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(companyName, 14, y);
  y += 6;
  doc.setFontSize(11);
  doc.text(reportName, 14, y);
  y += 5;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(110);
  if (rangeLabel) { doc.text(rangeLabel, 14, y); y += 4.5; }
  if (searchLabel) { doc.text(searchLabel, 14, y); y += 4.5; }
  const startY = y + 3;

  const head = [['No', ...columns.map(c => c.label)]];
  const body = rows.map((r, i) => [i + 1, ...columns.map(c => cellText(c, r))]);
  const totalRow = buildTotalRow(columns, summaryKeys || [], summary);
  if (totalRow) body.push(['', ...totalRow]);

  const columnStyles = { 0: { halign: 'center', cellWidth: 10 } };
  columns.forEach((c, i) => { if (c.align === 'r') columnStyles[i + 1] = { halign: 'right' }; });

  autoTable(doc, {
    head, body, startY,
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
    styles: { overflow: 'linebreak', fontSize: 9, cellPadding: 3, lineWidth: 0.1, lineColor: [200, 200, 200] },
    columnStyles,
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (totalRow && data.row.index === body.length - 1 && data.section === 'body') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [242, 242, 242];
      }
    },
  });

  doc.save(`${sanitizeFileName(reportName)}.pdf`);
}
