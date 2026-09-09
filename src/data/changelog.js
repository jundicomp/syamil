// Changelog — diperbarui manual tiap ada fase/perubahan selesai.
// Versi terbaru = entri PALING ATAS. version di package.json harus disamakan manual.

export const CHANGELOG = [
  {
    version: '0.10.1',
    tanggal: '2026-09-09',
    judul: 'Dropdown Menu Profil (foto, Pengaturan, Tampilan Mode, Keluar)',
    perubahan: [
      'Klik nama di pojok kanan atas sekarang buka dropdown menu, bukan langsung keluar',
      'Isi dropdown: foto/inisial + nama + role, Pengaturan Sistem, Tampilan Mode, Keluar — masing-masing dengan ikon',
      'Toggle Tampilan Mode (Terang/Gelap) dipindah dari tombol terpisah ke dalam dropdown ini',
      'Tombol theme-toggle lama dihapus total dari topbar',
    ],
  },
  {
    version: '0.10.0',
    tanggal: '2026-09-09',
    judul: 'Halaman Login + Sidebar Ciut Diperbaiki + Logo Dinamis',
    perubahan: [
      'Halaman Login baru — pilih akun dummy dari daftar Pengguna, password bebas (belum ada verifikasi sungguhan)',
      'Semua halaman sekarang butuh login dulu, otomatis diarahkan ke /login kalau belum masuk',
      'Topbar menampilkan nama user yang benar-benar login (bukan hardcode "Pak Budi"), plus tombol Keluar',
      'Sidebar mode ciut dirombak total: dulu numpuk-scroll semua ikon, sekarang per-grup + flyout + tooltip nama modul saat hover',
      'Mobile (lebar layar ≤880px) otomatis mode ciut, tombol hamburger disembunyikan',
      'Logo sidebar & halaman Login sekarang ambil dari Pengaturan Sistem (kalau belum upload, pakai ikon default)',
      'Nama usaha di sidebar juga dinamis dari Pengaturan (dulu hardcode "Percetakan Jaya")',
    ],
  },
  {
    version: '0.9.1',
    tanggal: '2026-09-09',
    judul: 'Format Rupiah rapi + warna header navy + baris Total lebih jelas',
    perubahan: [
      'Format Rupiah: "Rp" rata kiri, angka rata kanan dalam satu sel — berlaku di tabel web, Excel (format akuntansi asli), dan PDF (digambar manual per sel)',
      'Baris TOTAL: latar abu-abu, baris lebih tinggi, tebal, ukuran font tetap sama — konsisten di web maupun file export',
      'Header tabel: emas → navy (kontras lebih baik di atas latar terang)',
      'Mode Day: latar putih polos diganti biru sangat lembut, supaya tidak terlalu tajam',
    ],
  },
  {
    version: '0.9.0',
    tanggal: '2026-09-09',
    judul: 'Filter Rentang Tanggal + Header Laporan Terstruktur (fase laporan)',
    perubahan: [
      'Filter rentang tanggal (dari-sampai) + tombol cepat Bulan Ini/Bulan Lalu/Tahun Ini, diterapkan ke semua tabel yang punya kolom tanggal',
      'Export mengikuti data yang sedang difilter (Excel & PDF)',
      'Header export dirombak: Nama Usaha / Nama Laporan / Rentang Tanggal / (filter cari jika ada)',
      'Baris TOTAL otomatis di bawah kolom angka yang relevan (di layar maupun hasil export)',
      'Laporan Laba Rugi sekarang benar-benar per-periode (bukan cuma all-time)',
      'Laporan Neraca ditambah export, dengan label "posisi saat ini" (bukan rentang, karena neraca itu snapshot)',
      'Buku Kas: filter periode + Saldo Akhir Periode terpisah dari Saldo Kas keseluruhan',
    ],
  },
  {
    version: '0.8.0',
    tanggal: '2026-09-09',
    judul: 'Fitur Export Excel & PDF (sungguhan, bukan cuma print dialog)',
    perubahan: [
      'Semua tombol Excel/PDF sekarang benar-benar berfungsi (sebelumnya cuma tampilan)',
      'Judul tabel di baris 1, filter pencarian aktif (kalau ada) di baris 2',
      'Header kolom hitam-tulisan putih tebal, lebar kolom otomatis, teks panjang wrap sendiri',
      'Nama file & nama sheet Excel mengikuti judul tabel',
      'Berlaku otomatis di semua tabel yang pakai komponen DataTable',
      'Tabel kustom (Buku Kas, ringkasan per-supplier, tabel-tabel Dashboard Marketing) ditambahkan tombol export terpisah',
      'Library berat (jsPDF, xlsx-js-style) baru dimuat saat tombol diklik — tidak membebani waktu buka halaman',
    ],
  },
  {
    version: '0.7.0',
    tanggal: '2026-09-09',
    judul: 'Fase 7 — Laporan Keuangan (fase terakhir, migrasi 100% selesai)',
    perubahan: [
      'Buku Kas: saldo berjalan otomatis, bisa juga catat manual (Masuk/Keluar)',
      'Dashboard: 6 kartu ringkasan live — Penjualan, Pembelian, Saldo Kas, Piutang, SPK Aktif, Stok Menipis',
      'Laporan Laba Rugi — DIPERBAIKI: sekarang benar-benar terhitung dari Buku Kas + HPP (cash-basis), bukan angka statis lagi seperti versi HTML',
      'Laporan Neraca — sebagian real (Kas, Stok, Piutang), Hutang & Modal masih gap yang sama seperti versi HTML',
      'Halaman utama (/) sekarang mengarah ke Dashboard, bukan Pelanggan & Supplier',
    ],
  },
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
