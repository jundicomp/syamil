/**
 * Warna per tahap — persis versi HTML, dipakai bersama di Kanban (Alur SPK)
 * dan Dashboard Produksi supaya konsisten.
 */
export const STAGE_COLORS = {
  Desain: { colBg: '#BFDBF5', headBg: '#5B9BD9', cardBg: '#DCEAFB', cardBorder: '#9EC8EF', accent: '#2E5FA3' },
  Cetak: { colBg: '#F5D896', headBg: '#E8A93D', cardBg: '#FCE9C9', cardBorder: '#EBBE72', accent: '#B9791C' },
  Finishing: { colBg: '#B8E5C4', headBg: '#4FAE6D', cardBg: '#D9F2DE', cardBorder: '#8FD4A0', accent: '#2E8B4C' },
  CS: { colBg: '#F5BFDB', headBg: '#E066A0', cardBg: '#FBDEEA', cardBorder: '#ED9BC0', accent: '#C23D74' },
  Konsumen: { colBg: '#EDDD9E', headBg: '#D4B347', cardBg: '#F6ECB8', cardBorder: '#DDBE55', accent: '#A9823C' },
};

/**
 * Field yang ada di object `produksi` (SPK), dijadikan kolom.
 * Dipisah 2 versi:
 * - PRODUKSI_COLUMNS_AKTIF: buat Tabel SPK (isinya cuma yang Aktif, jadi kolom
 *   Keterangan Penutupan/Alasan Batal tidak relevan — selalu kosong).
 * - PRODUKSI_COLUMNS_LAPORAN: buat Laporan Produksi (semua status, jadi
 *   kedua kolom itu relevan), Status SPK sengaja diletakkan paling ujung.
 * id sengaja tidak ditampilkan (nomor baris "No" dari DataTable sudah cukup).
 */
export const PRODUKSI_COLUMNS_AKTIF = [
  { key: 'noOrder', label: 'No. SPK' },
  { key: 'noNota', label: 'No. Nota' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'tahap', label: 'Tahap', type: 'badge' },
  { key: 'target', label: 'Target' },
  { key: 'pic', label: 'PIC' },
  { key: 'detail', label: 'Detail Pekerjaan' },
  { key: 'dibuatOleh', label: 'Dibuat Oleh' },
  { key: 'historyRingkas', label: 'Riwayat Pindah Tahap' },
];

export const PRODUKSI_COLUMNS_LAPORAN = [
  { key: 'noOrder', label: 'No. SPK' },
  { key: 'noNota', label: 'No. Nota' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'tahap', label: 'Tahap', type: 'badge' },
  { key: 'target', label: 'Target' },
  { key: 'pic', label: 'PIC' },
  { key: 'detail', label: 'Detail Pekerjaan' },
  { key: 'dibuatOleh', label: 'Dibuat Oleh' },
  { key: 'historyRingkas', label: 'Riwayat Pindah Tahap' },
  { key: 'closingNote', label: 'Keterangan Penutupan' },
  { key: 'cancelNote', label: 'Alasan Batal' },
  { key: 'statusSpk', label: 'Status SPK', type: 'badge' },
];

/** history adalah array — diringkas jadi 1 baris teks supaya bisa tampil di sel tabel biasa. */
export function withHistoryRingkas(rows) {
  return rows.map(r => {
    const h = r.history || [];
    const last = h[h.length - 1];
    return {
      ...r,
      historyRingkas: h.length === 0 ? '-' : `${h.length}x pindah (terakhir: ${last.from} → ${last.to} — "${last.note}")`,
    };
  });
}
