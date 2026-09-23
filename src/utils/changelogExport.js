import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function exportChangelogPDF(changelog, settings) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const marginX = 16;
  const pageH = doc.internal.pageSize.getHeight();
  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Changelog — ' + (settings.namaUsaha || 'Sistem'), marginX, y);
  y += 6;
  doc.setFontSize(9.5);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(110);
  doc.text('Dicetak: ' + new Date().toLocaleString('id-ID'), marginX, y);
  doc.setTextColor(20);
  y += 10;

  changelog.forEach((entry, i) => {
    const blokTinggi = 14 + entry.perubahan.length * 5.2;
    if (y + blokTinggi > pageH - 15) { doc.addPage(); y = 20; }

    doc.setFontSize(11.5);
    doc.setFont(undefined, 'bold');
    doc.text(`v${entry.version} — ${entry.judul}`, marginX, y);
    y += 5;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(120);
    doc.text(formatTanggal(entry.tanggal) + (i === 0 ? '  (Terbaru)' : ''), marginX, y);
    doc.setTextColor(20);
    y += 6;

    doc.setFontSize(9.5);
    entry.perubahan.forEach(c => {
      const lines = doc.splitTextToSize('• ' + c, pageW - marginX * 2 - 4);
      lines.forEach(line => {
        if (y > pageH - 15) { doc.addPage(); y = 20; }
        doc.text(line, marginX + 3, y);
        y += 4.6;
      });
    });
    y += 5;
  });

  doc.save('Changelog.pdf');
}

export function exportChangelogExcel(changelog, settings) {
  const rows = changelog.map((entry, i) => ({
    Versi: 'v' + entry.version,
    Tanggal: formatTanggal(entry.tanggal),
    Judul: entry.judul,
    Perubahan: entry.perubahan.map(c => '• ' + c).join('\n'),
    Status: i === 0 ? 'Terbaru' : '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 10 }, { wch: 18 }, { wch: 40 }, { wch: 90 }, { wch: 10 }];
  rows.forEach((_, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: i + 1, c: 3 });
    if (ws[cellRef]) ws[cellRef].s = { alignment: { wrapText: true, vertical: 'top' } };
  });
  Object.keys(ws).forEach(key => {
    if (key.startsWith('!')) return;
    if (!ws[key].s) ws[key].s = {};
    ws[key].s.alignment = { ...ws[key].s.alignment, vertical: 'top', wrapText: key.match(/^D/) ? true : ws[key].s.alignment?.wrapText };
  });
  // Header bold
  ['A1', 'B1', 'C1', 'D1', 'E1'].forEach(ref => {
    if (ws[ref]) ws[ref].s = { ...ws[ref].s, font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1E3A5F' } } };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Changelog');
  XLSX.writeFile(wb, `Changelog_${(settings.namaUsaha || 'Sistem').replace(/\s+/g, '_')}.xlsx`);
}
