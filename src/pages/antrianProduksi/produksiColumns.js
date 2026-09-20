/**
 * Semua field yang benar-benar ada di object `produksi` (SPK), dijadikan kolom.
 * Dipakai bersama di Tabel SPK, Status Pengerjaan, dan Laporan Produksi supaya
 * gampang dibandingkan — field id sengaja tidak ditampilkan (nomor baris "No"
 * dari DataTable sudah cukup, id cuma detail teknis internal).
 */
export const PRODUKSI_FULL_COLUMNS = [
  { key: 'noOrder', label: 'No. Order' },
  { key: 'statusSpk', label: 'Status SPK', type: 'badge' },
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
