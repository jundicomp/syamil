// Data contoh (portir dari object DUMMY di versi HTML) — khusus modul Fase 1.
// id ditambahkan otomatis lewat withIds().
//
// CATATAN: per permintaan, semua data DEMO/transaksi sudah dikosongkan ([]) —
// aplikasi sekarang mulai dari nol, siap dipakai sungguhan. Yang TETAP diisi
// (bukan data dummy, tapi konfigurasi sistem yang perlu ada supaya aplikasi
// bisa jalan): seedSettings, seedPengguna (akun login), seedHakAkses, daftar
// kategori/jenis (STRATEGI_JENIS_LIST_DEFAULT, PELANGGAN_KATEGORI_DEFAULT),
// dan seedAnggaranMarketing.

function withIds(rows) {
  return rows.map((r, i) => ({ id: i + 1, ...r }));
}

export const seedPelanggan = [];
export const seedSupplier = [];
export const seedProduk = [];
export const seedBahanBaku = [];
export const seedPromosi = [];
export const seedKampanye = [];
export const seedLeads = [];

// ===== Fase 2 — Pengaturan Sistem =====
// Konfigurasi awal — silakan diubah lewat Pengaturan Sistem > Perusahaan.

export const seedSettings = {
  namaUsaha: 'Nama Usaha Anda', alamat: '', kota: '',
  telepon: '', whatsapp: '', email: '',
  website: '', instagram: '',
  logoDataUrl: null,
  logoPlacement: { login: true, sidebar: true, struk: true, invoice: true, spk: false },
  mataUang: 'Rupiah (Rp)', metodeBayar: 'Tunai',
  rekening: [
    { bank: '', noRek: '', atasNama: '' },
    { bank: '', noRek: '', atasNama: '' },
    { bank: '', noRek: '', atasNama: '' },
  ],
  qris: '', dana: '', qrisImageDataUrl: null,
  strukWidth: '58',
};

// Akun login — silakan sesuaikan nama/role/status lewat Pengaturan Sistem > User & Hak Akses.
export const seedPengguna = withIds([
  { nama: 'Owner', email: 'owner@usaha.id', hp: '', role: 'Owner', status: 'Aktif', kodeMarketing: '-', fotoDataUrl: null },
]);

export const seedNotifikasi = [];
export const seedAuditTrail = [];

export const HAK_AKSES_ROLES = ['Superadmin', 'Owner', 'Admin', 'Kasir', 'Gudang', 'Marketing'];
export const HAK_AKSES_MODULES = ['Penjualan', 'Pembelian', 'Produksi', 'Kalkulasi HPP', 'Marketing', 'Laporan Keuangan', 'Pengaturan'];
export const seedHakAkses = {
  Superadmin: { Penjualan: true, Pembelian: true, Produksi: true, 'Kalkulasi HPP': true, Marketing: true, 'Laporan Keuangan': true, Pengaturan: true },
  Owner: { Penjualan: true, Pembelian: true, Produksi: true, 'Kalkulasi HPP': true, Marketing: true, 'Laporan Keuangan': true, Pengaturan: true },
  Admin: { Penjualan: true, Pembelian: true, Produksi: true, 'Kalkulasi HPP': true, Marketing: true, 'Laporan Keuangan': true, Pengaturan: false },
  Kasir: { Penjualan: true, Pembelian: false, Produksi: false, 'Kalkulasi HPP': false, Marketing: false, 'Laporan Keuangan': false, Pengaturan: false },
  Gudang: { Penjualan: false, Pembelian: true, Produksi: true, 'Kalkulasi HPP': false, Marketing: false, 'Laporan Keuangan': false, Pengaturan: false },
  Marketing: { Penjualan: false, Pembelian: false, Produksi: false, 'Kalkulasi HPP': false, Marketing: true, 'Laporan Keuangan': false, Pengaturan: false },
};

// ===== Fase 3 — Laporan & Sistem Stok =====

export const seedPenjualan = [];

export const STAGES = ['Desain', 'Cetak', 'Finishing', 'CS', 'Konsumen'];

export const seedProduksi = [];
export const seedHppCalc = [];

// ===== Fase 6 — Marketing =====

export const STRATEGI_JENIS_LIST_DEFAULT = ['Kunjungan langsung', 'Telepon/WA', 'Sosial media'];
export const PELANGGAN_KATEGORI_DEFAULT = ['Umum', 'Reseller', 'Tetap', 'Bisnis', 'Ritel'];

export const seedStrategiMarketing = [];
export const seedAnggaranMarketing = { bulan: '', totalAnggaran: 0 };

export const seedStokLedger = [];

// ===== Fase 4 — Pembelian & Kasir (POS) =====

export const seedPembelian = [];
export const seedStokOpname = [];
export const seedHutang = [];
