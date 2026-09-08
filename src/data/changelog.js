// Changelog — diperbarui manual tiap ada fase/perubahan selesai.
// Versi terbaru = entri PALING ATAS. version di package.json harus disamakan manual.

export const CHANGELOG = [
  {
    version: '0.3.0',
    tanggal: '2026-09-09',
    judul: 'Fase 3 — Laporan & Sistem Stok + Info Versi',
    perubahan: [
      'Laporan Penjualan & Laporan Produksi (read-only, siap disambung ke Fase 4/5)',
      'Stok Opname: Stok Sistem otomatis, Selisih real-time, simpan penyesuaian per baris',
      'Kartu Stok (ledger) — bisa dibuka dari tabel Bahan Baku, + fungsi inti addStokMovement',
      'Badge versi & waktu build terakhir di Topbar, plus halaman Changelog baru',
    ],
  },
  {
    version: '0.2.0',
    tanggal: '2026-09-09',
    judul: 'Fase 2 — Pengaturan Sistem',
    perubahan: [
      'Tab Perusahaan: identitas usaha, upload logo, checklist penempatan logo',
      'Tab Keuangan: rekening bank ×3, upload QRIS, nomor DANA',
      'Tab User: tabel Pengguna + matriks Hak Akses per role (interaktif)',
      'Tab Sistem: Notifikasi & Pengingat + Backup & Audit Trail (read-only)',
    ],
  },
  {
    version: '0.1.1',
    tanggal: '2026-09-09',
    judul: 'Perbaikan deploy GitHub Pages',
    perubahan: [
      'Tambah base path Vite (/syamil/) supaya asset tidak 404',
      'Tambah GitHub Actions untuk build + deploy otomatis tiap push',
      'Rapikan judul tab browser & atribut bahasa halaman',
    ],
  },
  {
    version: '0.1.0',
    tanggal: '2026-09-08',
    judul: 'Fase 0 + Fase 1 — Fondasi & Data Master',
    perubahan: [
      'Fondasi: routing, state global, tema Day/Night, sidebar accordion',
      'Komponen generik: DataTable (cari/urut/paginasi), FormModal, Badge',
      'Modul: Pelanggan & Supplier, Produk & Bahan Baku, Promosi & Diskon, Kampanye Pelanggan, Sumber Leads',
    ],
  },
];

export const CURRENT_VERSION = CHANGELOG[0].version;
