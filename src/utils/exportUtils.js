import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function rawValue(col, row) {
  if (col.type === 'currency') return Number(row[col.key]) || 0;
  const val = row[col.key];
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

// Format akuntansi: "Rp" nempel kiri, angka nempel kanan (mengisi lebar kolom pakai *).
const CURRENCY_NUMFMT = '"Rp"* #,##0;-"Rp"* #,##0;"Rp"* "-"';

function autoColWidths(columns, rows) {
  const noWidth = { wch: Math.max(String(rows.length).length + 2, 5) };
  const dataWidths = columns.map(col => {
    const headerLen = col.label.length;
    const maxDataLen = rows.reduce((max, r) => {
      const v = col.type === 'currency' ? `Rp ${fmt(r[col.key])}` : String(r[col.key] ?? '');
      return Math.max(max, v.length);
    }, 0);
    return { wch: Math.min(Math.max(headerLen, maxDataLen) + 3, 45) };
  });
  return [noWidth, ...dataWidths];
}

const THIN_BORDER = { style: 'thin', color: { rgb: 'CCCCCC' } };
const BORDER_ALL = { top: THIN_BORDER, bottom: THIN_BORDER, left: THIN_BORDER, right: THIN_BORDER };

/**
 * Export ke Excel (.xlsx) — header: Nama Usaha / Nama Laporan / Rentang / (filter cari),
 * kolom No otomatis, header tabel hitam-putih tebal + border tipis, angka Rupiah pakai
 * format akuntansi asli (simbol "Rp" nempel kiri, angka nempel kanan), baris TOTAL
 * abu-abu + tebal + baris lebih tinggi.
 */
export function exportToExcel({ companyName, reportName, rangeLabel, searchLabel, columns, rows, summaryKeys, summary }) {
  const headerLines = buildHeaderLines({ companyName, reportName, rangeLabel, searchLabel });
  const headerRow = ['No', ...columns.map(c => c.label)];
  const dataRows = rows.map((r, i) => [i + 1, ...columns.map(c => rawValue(c, r))]);
  const hasTotal = !!summary && summaryKeys && summaryKeys.length > 0;
  const totalRowValues = hasTotal
    ? [null, ...columns.map((c, i) => (summaryKeys.includes(c.key) ? summary[c.key] : (i === 0 ? 'TOTAL' : '')))]
    : null;
  const tableHeaderRowIndex = headerLines.length + 1;

  const sheetData = [
    ...headerLines.map(l => [l]),
    [],
    headerRow,
    ...dataRows,
    ...(totalRowValues ? [totalRowValues] : []),
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
  const lastDataRowIdx = tableHeaderRowIndex + dataRows.length;
  for (let r = tableHeaderRowIndex + 1; r <= range.e.r; r++) {
    const isTotalRow = hasTotal && r > lastDataRowIdx;
    for (let c = 0; c <= range.e.c; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) continue;
      const colDef = c === 0 ? null : columns[c - 1];
      const isCurrency = colDef && colDef.type === 'currency' && typeof ws[ref].v === 'number';
      ws[ref].s = {
        alignment: { wrapText: true, vertical: 'top', horizontal: c === 0 ? 'center' : undefined },
        border: BORDER_ALL,
        font: isTotalRow ? { bold: true } : undefined,
        fill: isTotalRow ? { fgColor: { rgb: 'D9D9D9' } } : undefined,
      };
      if (isCurrency) ws[ref].z = CURRENCY_NUMFMT;
    }
  }

  ws['!cols'] = autoColWidths(columns, rows);
  ws['!merges'] = headerLines.map((_, r) => ({ s: { r, c: 0 }, e: { r, c: numCols - 1 } }));
  if (hasTotal) ws['!rows'] = [...Array(lastDataRowIdx).fill(undefined), { hpx: 26 }];

  const wb = XLSX.utils.book_new();
  const sheetName = sanitizeFileName(reportName).substring(0, 31) || 'Sheet1';
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${sanitizeFileName(reportName)}.xlsx`);
}

/**
 * Export ke PDF sungguhan — header sama seperti Excel, kolom No otomatis, header tabel
 * hitam-putih tebal + border grid, angka Rupiah digambar manual per sel ("Rp" nempel kiri,
 * angka nempel kanan), baris TOTAL abu-abu + tebal + lebih tinggi.
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

  const hasTotal = !!summary && summaryKeys && summaryKeys.length > 0;
  const head = [['No', ...columns.map(c => c.label)]];
  // Sel currency dikosongkan di body — teksnya digambar manual lewat didDrawCell.
  const body = rows.map((r, i) => [i + 1, ...columns.map(c => (c.type === 'currency' ? '' : (r[c.key] ?? '')))]);
  if (hasTotal) {
    body.push(['', ...columns.map((c, i) => (summaryKeys.includes(c.key) ? '' : (i === 0 ? 'TOTAL' : '')))]);
  }
  const totalRowIndex = hasTotal ? body.length - 1 : -1;

  function currencyValueAt(rowIndex, colIndex) {
    const col = columns[colIndex];
    if (rowIndex === totalRowIndex) {
      return summaryKeys.includes(col.key) ? summary[col.key] : null;
    }
    const row = rows[rowIndex];
    return row && col.type === 'currency' ? (Number(row[col.key]) || 0) : null;
  }

  const columnStyles = { 0: { halign: 'center', cellWidth: 10 } };

  autoTable(doc, {
    head, body, startY,
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
    styles: { overflow: 'linebreak', fontSize: 9, cellPadding: 3, lineWidth: 0.1, lineColor: [200, 200, 200] },
    columnStyles,
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (hasTotal && data.row.index === totalRowIndex && data.section === 'body') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [217, 217, 217];
        data.cell.styles.cellPadding = 4.2;
      }
    },
    didDrawCell: (data) => {
      if (data.section !== 'body' || data.column.index === 0) return;
      const colIndex = data.column.index - 1;
      const col = columns[colIndex];
      if (col.type !== 'currency') return;
      const val = currencyValueAt(data.row.index, colIndex);
      if (val === null) return;
      const { x, y: cy, width, height } = data.cell;
      const midY = cy + height / 2;
      const isBold = data.row.index === totalRowIndex;
      doc.setFontSize(9);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      doc.setTextColor(isBold ? 30 : 100);
      doc.text('Rp', x + 2, midY, { baseline: 'middle' });
      doc.setTextColor(20);
      doc.text(fmt(val), x + width - 2, midY, { align: 'right', baseline: 'middle' });
    },
  });

  doc.save(`${sanitizeFileName(reportName)}.pdf`);
}
