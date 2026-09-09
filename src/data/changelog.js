// Changelog — diperbarui manual tiap ada fase/perubahan selesai.
// Versi terbaru = entri PALING ATAS. version di package.json harus disamakan manual.

export const CHANGELOG = [
  {
    version: '0.6.0',
    tanggal: '2026-09-09',
    judul: 'Fase 6 — Marketing',
    perubahan: [
      'Dashboard Marketing: 4 kartu statistik, leaderboard 2 tab (Bulan Ini/Akumulasi Total)',
      '"Lihat Sebagai" — simulasi tampilan personal per user marketing (data terfilter, leaderboard tetap penuh dengan baris sendiri disorot)',
      'Penjualan Saya (terfilter per kode marketing) di tampilan personal',
      'Strategi Marketing: jenis creatable (bisa tambah baru), toggle Ajukan Anggaran',
      'Antrean Persetujuan Owner: Setuju/Tolak, yang ditolak tetap tersimpan sebagai catatan',
    ],
  },
  {
    version: '0.5.0',
    tanggal: '2026-09-09',
    judul: 'Fase 5 — Alur SPK & Kalkulasi HPP',
    perubahan: [
      'Alur SPK: 4 tab (Kartu/Kanban, Tabel, Arsip, Batal), Ciptakan SPK dari Nota',
      'Kanban 5 tahap (Desain→Cetak→Finishing→CS→Konsumen), tombol Back/Done wajib catatan',
      'Tutup SPK (wajib keterangan) dan Batalkan SPK (wajib alasan), keduanya lewat modal',
      'Status Pengerjaan: ringkasan semua SPK aktif per PIC',
      'Kalkulasi HPP: pilih SPK aktif, Harga Jual otomatis dari Nota (terkunci), keranjang biaya Stok/Bebas, hitung margin, baris Stok otomatis potong stok bahan',
    ],
  },
  {
    version: '0.4.0',
    tanggal: '2026-09-09',
    judul: 'Fase 4 — Pembelian & Kasir (POS)',
    perubahan: [
      'Kasir (POS): keranjang produk, pilih pelanggan & kode marketing, Cek Stok Bahan, diskon',
      'Pembayaran Lunas/DP, cetak struk (window.print), transaksi otomatis masuk Laporan Penjualan',
      'Pembelian: keranjang bahan ke supplier, status Lunas/Belum Lunas',
      'Pembelian otomatis menambah Stok (via addStokMovement) dan tercatat ke Buku Kas kalau Lunas',
      'Laporan Pembelian: ringkasan total per supplier + riwayat',
    ],
  },
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
