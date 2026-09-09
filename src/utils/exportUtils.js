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

function autoColWidths(columns, rows) {
  return columns.map(col => {
    const headerLen = col.label.length;
    const maxDataLen = rows.reduce((max, r) => Math.max(max, cellText(col, r).length), 0);
    return { wch: Math.min(Math.max(headerLen, maxDataLen) + 3, 45) };
  });
}

/**
 * Export ke Excel (.xlsx) — judul di baris 1, sub-judul/filter di baris 2 (kalau ada),
 * header kolom hitam-tulisan putih tebal, lebar kolom otomatis, teks panjang wrap sendiri.
 */
export function exportToExcel({ title, subtitle, columns, rows }) {
  const headerRow = columns.map(c => c.label);
  const dataRows = rows.map(r => columns.map(c => cellText(c, r)));
  const headerRowIndex = subtitle ? 3 : 2;

  const sheetData = [
    [title],
    ...(subtitle ? [[subtitle]] : []),
    [],
    headerRow,
    ...dataRows,
  ];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const numCols = Math.max(columns.length, 1);

  const titleRef = XLSX.utils.encode_cell({ r: 0, c: 0 });
  if (ws[titleRef]) ws[titleRef].s = { font: { bold: true, sz: 14 } };

  if (subtitle) {
    const subRef = XLSX.utils.encode_cell({ r: 1, c: 0 });
    if (ws[subRef]) ws[subRef].s = { font: { italic: true, sz: 10, color: { rgb: '666666' } } };
  }

  for (let c = 0; c < numCols; c++) {
    const ref = XLSX.utils.encode_cell({ r: headerRowIndex, c });
    if (!ws[ref]) continue;
    ws[ref].s = {
      fill: { fgColor: { rgb: '000000' } },
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    };
  }

  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let r = headerRowIndex + 1; r <= range.e.r; r++) {
    for (let c = 0; c <= range.e.c; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) continue;
      ws[ref].s = { alignment: { wrapText: true, vertical: 'top' } };
    }
  }

  ws['!cols'] = autoColWidths(columns, rows);
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }];
  if (subtitle) ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } });

  const wb = XLSX.utils.book_new();
  const sheetName = sanitizeFileName(title).substring(0, 31) || 'Sheet1';
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${sanitizeFileName(title)}.xlsx`);
}

/**
 * Export ke PDF sungguhan (bukan cuma trigger print dialog) — judul + sub-judul/filter,
 * header tabel hitam-putih tebal, kolom melebar otomatis dengan word-wrap.
 */
export function exportToPDF({ title, subtitle, columns, rows }) {
  const orientation = columns.length > 5 ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation, unit: 'mm' });

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(title, 14, 15);

  let startY = 22;
  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(110);
    doc.text(subtitle, 14, 21);
    startY = 27;
  }

  const head = [columns.map(c => c.label)];
  const body = rows.map(r => columns.map(c => cellText(c, r)));
  const columnStyles = {};
  columns.forEach((c, i) => { if (c.align === 'r') columnStyles[i] = { halign: 'right' }; });

  autoTable(doc, {
    head, body, startY,
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
    styles: { overflow: 'linebreak', fontSize: 9, cellPadding: 3 },
    columnStyles,
    margin: { left: 14, right: 14 },
  });

  doc.save(`${sanitizeFileName(title)}.pdf`);
}
