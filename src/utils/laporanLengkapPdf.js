import { parseTanggalID, inRange, formatRangeLabel, todayID } from './dateUtils';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }
function kategoriDari(keterangan) {
  if (keterangan.startsWith('Penjualan')) return 'Penjualan';
  if (keterangan.startsWith('Terima pelunasan')) return 'Piutang Tertagih';
  if (keterangan.startsWith('Pembelian')) return 'Pembelian';
  if (keterangan.startsWith('Bayar hutang')) return 'Hutang Dibayar';
  return 'Lain-lain';
}

/**
 * Generate PDF satu set laporan keuangan: Laba Rugi, Cashflow, Neraca (portrait, ringkas)
 * + lampiran Buku Kas / Piutang / Hutang (landscape, tabel detail).
 */
export async function generateLaporanLengkapPdf({ data, bukuKas, settings, range }) {
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const autoTable = autoTableModule.default;

  const rangeLabel = formatRangeLabel(range.from, range.to);
  const kasDalamRentang = bukuKas.filter(r => inRange(parseTanggalID(r.tanggal), range.from, range.to));
  const withJenis = bukuKas.map(r => ({ ...r, jenisKas: r.jenisKas || 'Toko' }));
  const kasDalamRentangJenis = withJenis.filter(r => inRange(parseTanggalID(r.tanggal), range.from, range.to));

  const pendapatan = kasDalamRentang.filter(r => r.tipe === 'Masuk').reduce((s, r) => s + r.jumlah, 0);
  const beban = kasDalamRentang.filter(r => r.tipe === 'Keluar').reduce((s, r) => s + r.jumlah, 0);
  const labaBersih = pendapatan - beban;

  const masuk = kasDalamRentang.filter(r => r.tipe === 'Masuk');
  const keluar = kasDalamRentang.filter(r => r.tipe === 'Keluar');
  function groupByKategori(rows) {
    const map = {};
    rows.forEach(r => { const k = kategoriDari(r.keterangan); map[k] = (map[k] || 0) + r.jumlah; });
    return Object.entries(map);
  }
  const masukKategori = groupByKategori(masuk);
  const keluarKategori = groupByKategori(keluar);

  const kas = bukuKas.reduce((s, r) => s + (r.tipe === 'Masuk' ? r.jumlah : -r.jumlah), 0);
  const nilaiStok = data.bahanBaku.reduce((s, b) => s + b.stok * b.hargaBeli, 0);
  const piutangTotal = data.piutang.filter(p => p.status === 'Belum Lunas').reduce((s, p) => s + p.sisa, 0);
  const hutangTotal = data.hutang.filter(h => h.status === 'Belum Lunas').reduce((s, h) => s + h.sisa, 0);
  const totalAset = kas + nilaiStok + piutangTotal;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const marginX = 16;
  let y = 20;

  function header(judul, subjudul) {
    doc.setFontSize(15);
    doc.setFont(undefined, 'bold');
    doc.text(settings.namaUsaha, marginX, y);
    y += 6;
    doc.setFontSize(12);
    doc.text(judul, marginX, y);
    y += 5;
    doc.setFontSize(9.5);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(110);
    doc.text(subjudul, marginX, y);
    doc.setTextColor(20);
    y += 8;
  }

  // ===== COVER =====
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('LAPORAN KEUANGAN LENGKAP', marginX, 60);
  doc.setFontSize(13);
  doc.text(settings.namaUsaha, marginX, 70);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10.5);
  doc.text(settings.alamat || '', marginX, 77);
  doc.setFontSize(11);
  doc.text(`Periode: ${rangeLabel}`, marginX, 92);
  doc.text(`Dicetak: ${todayID()}`, marginX, 99);
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text('Isi: Laba Rugi \u00b7 Cashflow \u00b7 Neraca (posisi saat ini) \u00b7 Lampiran Buku Kas, Piutang, Hutang', marginX, 112);
  doc.setTextColor(20);

  // ===== LABA RUGI =====
  doc.addPage('a4', 'portrait');
  y = 20;
  header('Laporan Laba Rugi', rangeLabel);
  autoTable(doc, {
    startY: y,
    head: [['Keterangan', 'Nilai']],
    body: [
      ['Pendapatan (kas masuk)', `Rp${fmt(pendapatan)}`],
      ['Total Pengeluaran (kas keluar)', `Rp${fmt(beban)}`],
    ],
    foot: [['LABA BERSIH', `Rp${fmt(labaBersih)}`]],
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: [242, 242, 242], textColor: [20, 20, 20], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: marginX, right: marginX },
  });

  // ===== CASHFLOW =====
  doc.addPage('a4', 'portrait');
  y = 20;
  header('Laporan Cashflow', rangeLabel);
  autoTable(doc, {
    startY: y,
    head: [['Kas Masuk — Kategori', 'Jumlah']],
    body: masukKategori.length ? masukKategori.map(([k, v]) => [k, `Rp${fmt(v)}`]) : [['Tidak ada data', '-']],
    foot: [['Total Masuk', `Rp${fmt(pendapatan)}`]],
    theme: 'grid',
    headStyles: { fillColor: [47, 174, 109], textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: [242, 242, 242], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: marginX, right: marginX },
  });
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    head: [['Kas Keluar — Kategori', 'Jumlah']],
    body: keluarKategori.length ? keluarKategori.map(([k, v]) => [k, `Rp${fmt(v)}`]) : [['Tidak ada data', '-']],
    foot: [['Total Keluar', `Rp${fmt(beban)}`], ['ARUS KAS BERSIH', `Rp${fmt(pendapatan - beban)}`]],
    theme: 'grid',
    headStyles: { fillColor: [229, 52, 43], textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: [242, 242, 242], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: marginX, right: marginX },
  });

  // ===== NERACA =====
  doc.addPage('a4', 'portrait');
  y = 20;
  header('Laporan Neraca', `Per ${todayID()} (posisi saat ini — bukan per periode)`);
  autoTable(doc, {
    startY: y,
    head: [['ASET', 'Nilai']],
    body: [
      ['Kas (Toko + Bank)', `Rp${fmt(kas)}`],
      ['Piutang Usaha', `Rp${fmt(piutangTotal)}`],
      ['Persediaan Bahan Baku', `Rp${fmt(nilaiStok)}`],
    ],
    foot: [['TOTAL ASET', `Rp${fmt(totalAset)}`]],
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: [242, 242, 242], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: marginX, right: marginX },
  });
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    head: [['LIABILITAS + MODAL', 'Nilai']],
    body: [
      ['Hutang Usaha (Supplier)', `Rp${fmt(hutangTotal)}`],
      ['Modal Pemilik', '(perlu saldo awal manual)'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: marginX, right: marginX },
  });

  // ===== LAMPIRAN: BUKU KAS (landscape, lebar) =====
  doc.addPage('a4', 'landscape');
  y = 16;
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.text(`Lampiran — Buku Kas (${rangeLabel})`, marginX, y);
  y += 7;
  autoTable(doc, {
    startY: y,
    head: [['Tanggal', 'Jenis Kas', 'Tipe', 'Keterangan', 'Jumlah']],
    body: kasDalamRentangJenis.length
      ? kasDalamRentangJenis.map(r => [r.tanggal, r.jenisKas, r.tipe, r.keterangan, `Rp${fmt(r.jumlah)}`])
      : [['-', '-', '-', 'Tidak ada transaksi pada periode ini', '-']],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 4: { halign: 'right' } },
    styles: { fontSize: 8.5 },
    margin: { left: marginX, right: marginX },
  });

  // ===== LAMPIRAN: PIUTANG (landscape) =====
  doc.addPage('a4', 'landscape');
  y = 16;
  doc.setFontSize(13);
  doc.text('Lampiran — Piutang Pelanggan (posisi saat ini)', marginX, y);
  y += 7;
  autoTable(doc, {
    startY: y,
    head: [['Tanggal', 'No. Nota', 'Pelanggan', 'Total', 'Dibayar', 'Sisa', 'Status']],
    body: data.piutang.length
      ? data.piutang.map(p => [p.tanggal, p.noNota, p.pelanggan, `Rp${fmt(p.total)}`, `Rp${fmt(p.dibayar)}`, `Rp${fmt(p.sisa)}`, p.status])
      : [['-', '-', 'Tidak ada piutang tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' } },
    styles: { fontSize: 8.5 },
    margin: { left: marginX, right: marginX },
  });

  // ===== LAMPIRAN: HUTANG (landscape) =====
  doc.addPage('a4', 'landscape');
  y = 16;
  doc.setFontSize(13);
  doc.text('Lampiran — Hutang Supplier (posisi saat ini)', marginX, y);
  y += 7;
  autoTable(doc, {
    startY: y,
    head: [['Tanggal', 'No. PO', 'Supplier', 'Total', 'Dibayar', 'Sisa', 'Status']],
    body: data.hutang.length
      ? data.hutang.map(h => [h.tanggal, h.noPO, h.supplier, `Rp${fmt(h.total)}`, `Rp${fmt(h.dibayar)}`, `Rp${fmt(h.sisa)}`, h.status])
      : [['-', '-', 'Tidak ada hutang tercatat', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' } },
    styles: { fontSize: 8.5 },
    margin: { left: marginX, right: marginX },
  });

  const fname = `Laporan_Keuangan_Lengkap_${rangeLabel.replace(/\s+/g, '_')}.pdf`;
  doc.save(fname);
}
