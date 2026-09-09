// Data contoh (portir dari object DUMMY di versi HTML) — khusus modul Fase 1.
// id ditambahkan otomatis lewat withIds().

function withIds(rows) {
  return rows.map((r, i) => ({ id: i + 1, ...r }));
}

export const seedPelanggan = withIds([
  { nama: 'Toko Sinar Jaya', kontak: '0812-3456-7890', alamat: 'Jl. Merdeka No. 12, Bandung', kota: 'Bandung', kategori: 'Ritel', marketingTerkait: 'Fajar Ramadhan' },
  { nama: 'CV Abadi Sentosa', kontak: '0813-2211-4455', alamat: 'Jl. Ahmad Yani No. 45, Bandung', kota: 'Bandung', kategori: 'Bisnis', marketingTerkait: '-' },
  { nama: 'UD Makmur Jaya', kontak: '0857-1234-9988', alamat: 'Jl. Kopo No. 8, Bandung', kota: 'Bandung', kategori: 'Bisnis', marketingTerkait: 'Nia Kusuma' },
  { nama: 'Pelanggan Umum', kontak: '-', alamat: '-', kota: '-', kategori: 'Ritel', marketingTerkait: '-' },
]);

export const seedSupplier = withIds([
  { nama: 'CV Bahan Flexi', pic: 'Hendra Wijaya', tipeSupplier: 'Badan Usaha', kategoriBahan: 'Bahan Banner/Flexi', kontak: '0821-7788-1122', alamat: 'Jl. Industri No. 3, Cimahi', kota: 'Cimahi' },
  { nama: 'UD Kertas Makmur', pic: 'Siti Aminah', tipeSupplier: 'Badan Usaha', kategoriBahan: 'Kertas', kontak: '0838-4455-6677', alamat: 'Jl. Soekarno Hatta No. 90', kota: 'Bandung' },
  { nama: 'Toko Sumber Rejeki', pic: 'Agus Setiawan', tipeSupplier: 'Perorangan', kategoriBahan: 'Aksesoris Cetak', kontak: '0812-9900-1122', alamat: 'Jl. Cibaduyut No. 21', kota: 'Bandung' },
  { nama: 'PT Tinta Nusantara', pic: 'Ratna Dewi', tipeSupplier: 'Badan Usaha', kategoriBahan: 'Tinta', kontak: '021-5566778', alamat: 'Jl. Gatot Subroto No. 100, Jakarta', kota: 'Jakarta' },
]);

export const seedProduk = withIds([
  { nama: 'Banner Flexi China', kategori: 'Banner', satuan: 'm²', harga: 45000, tipe: 'Tetap' },
  { nama: 'X-Banner 60x160', kategori: 'Banner', satuan: 'pcs', harga: 85000, tipe: 'Tetap' },
  { nama: 'Kartu Nama 1 Box', kategori: 'Cetak Digital', satuan: 'box', harga: 45000, tipe: 'Tetap' },
  { nama: 'Buku Nota Rangkap 2', kategori: 'Cetak Digital', satuan: 'pak', harga: 35000, tipe: 'Tetap' },
  { nama: 'Stiker Vinyl A3', kategori: 'Stiker', satuan: 'lembar', harga: 12000, tipe: 'Tetap' },
  { nama: 'Buku Yasin', kategori: 'Cetak Digital', satuan: 'pcs', harga: 25000, tipe: 'Tetap' },
  { nama: 'Spanduk Digital', kategori: 'Banner', satuan: 'm²', harga: 40000, tipe: 'Tetap' },
  { nama: 'Print Laser', kategori: 'Cetak Digital', satuan: 'Lembar', harga: 0, tipe: 'Matriks Harga' },
]);

export const seedBahanBaku = withIds([
  { nama: 'Flexi China 280gr', satuan: 'roll', hargaBeli: 850000, supplier: 'CV Bahan Flexi', stokMinimum: 5, stok: 46 },
  { nama: 'Tinta Epson 6 Warna', satuan: 'botol', hargaBeli: 160000, supplier: 'PT Tinta Nusantara', stokMinimum: 5, stok: 9 },
  { nama: 'Kertas HVS 80gr', satuan: 'rim', hargaBeli: 55000, supplier: 'UD Kertas Makmur', stokMinimum: 10, stok: 58 },
  { nama: 'Art Paper 260gr', satuan: 'rim', hargaBeli: 120000, supplier: 'UD Kertas Makmur', stokMinimum: 10, stok: 12 },
  { nama: 'Mata Ayam Banner', satuan: 'pak', hargaBeli: 35000, supplier: 'CV Bahan Flexi', stokMinimum: 5, stok: 590 },
  { nama: 'Kertas Stiker Vinyl', satuan: 'roll', hargaBeli: 380000, supplier: 'UD Kertas Makmur', stokMinimum: 3, stok: 4 },
  { nama: 'Roll Up Banner Stand 160x60', satuan: 'unit', hargaBeli: 250000, supplier: 'CV Bahan Flexi', stokMinimum: 3, stok: 8 },
]);

export const seedPromosi = withIds([
  { namaPromo: 'Diskon Awal Bulan', jenis: 'Persentase', nilai: 10, periode: '1–5 tiap bulan', status: 'Aktif' },
  { namaPromo: 'Bundling Kartu Nama + Banner', jenis: 'Nominal', nilai: 25000, periode: 'Agu 2026', status: 'Aktif' },
  { namaPromo: 'Promo Kemerdekaan', jenis: 'Persentase', nilai: 17, periode: '10–17 Agu 2026', status: 'Berakhir' },
]);

export const seedKampanye = withIds([
  { namaKampanye: 'Broadcast WA Pelanggan Lama', channel: 'WhatsApp', tanggal: '05 Agu 2026', status: 'Selesai' },
  { namaKampanye: 'Boost Instagram Area Bandung', channel: 'Instagram Ads', tanggal: '11 Agu 2026', status: 'Berjalan' },
  { namaKampanye: 'Sebar Brosur Pasar', channel: 'Offline', tanggal: '08 Agu 2026', status: 'Selesai' },
]);

export const seedLeads = withIds([
  { namaLead: 'Toko Anugerah', sumber: 'Instagram', kontak: '0812-1111-2222', status: 'Deal' },
  { namaLead: 'Warung Bu Yanti', sumber: 'Walk-in', kontak: '0813-3333-4444', status: 'Follow Up' },
  { namaLead: 'CV Karya Mandiri', sumber: 'Referral', kontak: '0857-5555-6666', status: 'Deal' },
  { namaLead: 'Toko Berkah', sumber: 'WhatsApp', kontak: '0821-7777-8888', status: 'Nonaktif' },
]);

// ===== Fase 2 — Pengaturan Sistem =====

export const seedSettings = {
  namaUsaha: 'Percetakan Jaya', alamat: 'Jl. Industri Kreatif No. 7, Bandung', kota: 'Bandung',
  telepon: '022-7788990', whatsapp: '0812-3456-7890', email: 'info@percetakanjaya.id',
  website: 'www.percetakanjaya.id', instagram: '@percetakanjaya',
  logoDataUrl: null,
  logoPlacement: { login: true, sidebar: true, struk: true, invoice: true, spk: false },
  mataUang: 'Rupiah (Rp)', metodeBayar: 'Tunai',
  rekening: [
    { bank: 'BCA', noRek: '1234567890', atasNama: 'Percetakan Jaya' },
    { bank: '', noRek: '', atasNama: '' },
    { bank: '', noRek: '', atasNama: '' },
  ],
  qris: '', dana: '', qrisImageDataUrl: null,
  strukWidth: '58',
};

export const seedPengguna = withIds([
  { nama: 'Pak Budi', email: 'budi@percetakanjaya.id', hp: '0811-2233-4455', role: 'Owner', status: 'Aktif', kodeMarketing: '-', fotoDataUrl: null },
  { nama: 'Siti Aminah', email: 'siti@percetakanjaya.id', hp: '0812-3344-5566', role: 'Kasir', status: 'Aktif', kodeMarketing: '-', fotoDataUrl: null },
  { nama: 'Andi Saputra', email: 'andi@percetakanjaya.id', hp: '0813-4455-6677', role: 'Gudang', status: 'Aktif', kodeMarketing: '-', fotoDataUrl: null },
  { nama: 'Rina Wulandari', email: 'rina@percetakanjaya.id', hp: '0814-5566-7788', role: 'Admin', status: 'Aktif', kodeMarketing: '-', fotoDataUrl: null },
  { nama: 'Joko Prasetyo', email: 'joko@percetakanjaya.id', hp: '0815-6677-8899', role: 'Kasir', status: 'Nonaktif', kodeMarketing: '-', fotoDataUrl: null },
  { nama: 'Dewi Lestari', email: 'dewi@percetakanjaya.id', hp: '0816-7788-9900', role: 'Gudang', status: 'Nonaktif', kodeMarketing: '-', fotoDataUrl: null },
  { nama: 'Fajar Ramadhan', email: 'fajar@percetakanjaya.id', hp: '0817-8899-0011', role: 'Marketing', status: 'Aktif', kodeMarketing: 'FAJ01', targetBulanan: 1000000, fotoDataUrl: null },
  { nama: 'Nia Kusuma', email: 'nia@percetakanjaya.id', hp: '0818-9900-1122', role: 'Marketing', status: 'Aktif', kodeMarketing: 'NIA02', targetBulanan: 1000000, fotoDataUrl: null },
  { nama: 'Reza Pratama', email: 'reza@percetakanjaya.id', hp: '0819-0011-2233', role: 'Marketing', status: 'Aktif', kodeMarketing: 'REZ03', targetBulanan: 1000000, fotoDataUrl: null },
]);

export const seedNotifikasi = withIds([
  { judul: 'Stok Bahan Menipis', pemicu: 'Stok di bawah minimum', status: 'Aktif' },
  { judul: 'Piutang Jatuh Tempo', pemicu: 'H-3 sebelum jatuh tempo', status: 'Aktif' },
  { judul: 'Pembayaran Supplier', pemicu: 'H-1 sebelum jatuh tempo', status: 'Aktif' },
  { judul: 'Target Produksi Terlambat', pemicu: 'Melewati target selesai', status: 'Aktif' },
  { judul: 'Laporan Harian Kas', pemicu: 'Setiap pukul 21:00', status: 'Nonaktif' },
]);

export const seedAuditTrail = withIds([
  { waktu: '12 Agu 2026, 10:24', pengguna: 'Siti Aminah', aktivitas: 'Membuat transaksi penjualan #INV-0231' },
  { waktu: '12 Agu 2026, 09:10', pengguna: 'Andi Saputra', aktivitas: 'Input pembelian bahan baku #PO-0231' },
  { waktu: '11 Agu 2026, 16:40', pengguna: 'Pak Budi', aktivitas: 'Mengubah harga produk "Banner Flexi China"' },
  { waktu: '11 Agu 2026, 14:02', pengguna: 'Rina Wulandari', aktivitas: 'Menambah pengguna baru "Dewi Lestari"' },
  { waktu: '10 Agu 2026, 18:15', pengguna: 'Andi Saputra', aktivitas: 'Melakukan stok opname gudang' },
]);

export const HAK_AKSES_ROLES = ['Owner', 'Admin', 'Kasir', 'Gudang', 'Marketing'];
export const HAK_AKSES_MODULES = ['Penjualan', 'Pembelian', 'Produksi', 'Kalkulasi HPP', 'Marketing', 'Laporan Keuangan', 'Pengaturan'];
export const seedHakAkses = {
  Owner: { Penjualan: true, Pembelian: true, Produksi: true, 'Kalkulasi HPP': true, Marketing: true, 'Laporan Keuangan': true, Pengaturan: true },
  Admin: { Penjualan: true, Pembelian: true, Produksi: true, 'Kalkulasi HPP': true, Marketing: true, 'Laporan Keuangan': true, Pengaturan: false },
  Kasir: { Penjualan: true, Pembelian: false, Produksi: false, 'Kalkulasi HPP': false, Marketing: false, 'Laporan Keuangan': false, Pengaturan: false },
  Gudang: { Penjualan: false, Pembelian: true, Produksi: true, 'Kalkulasi HPP': false, Marketing: false, 'Laporan Keuangan': false, Pengaturan: false },
  Marketing: { Penjualan: false, Pembelian: false, Produksi: false, 'Kalkulasi HPP': false, Marketing: true, 'Laporan Keuangan': false, Pengaturan: false },
};

// ===== Fase 3 — Laporan & Sistem Stok =====
// Catatan: penjualan & produksi di sini cuma data LAPORAN (read-only) —
// alur pembuatannya (Kasir POS, Alur SPK) baru dimigrasi di Fase 4 & 5.

export const seedPenjualan = withIds([
  { tanggal: '12 Agu 2026', noNota: 'INV-0231', pelanggan: 'Toko Sinar Jaya', total: 320000, status: 'Lunas', dpDibayar: 0, sisaBayar: 0, kodeMarketing: 'FAJ01' },
  { tanggal: '12 Agu 2026', noNota: 'INV-0230', pelanggan: 'CV Abadi Sentosa', total: 700000, status: 'Lunas', dpDibayar: 0, sisaBayar: 0, kodeMarketing: '' },
  { tanggal: '11 Agu 2026', noNota: 'INV-0229', pelanggan: 'Pelanggan Umum', total: 180000, status: 'Lunas', dpDibayar: 0, sisaBayar: 0, kodeMarketing: '' },
  { tanggal: '11 Agu 2026', noNota: 'INV-0228', pelanggan: 'UD Makmur Jaya', total: 1250000, status: 'DP', dpDibayar: 500000, sisaBayar: 750000, kodeMarketing: 'NIA02' },
  { tanggal: '10 Agu 2026', noNota: 'INV-0227', pelanggan: 'Toko Sinar Jaya', total: 455000, status: 'Lunas', dpDibayar: 0, sisaBayar: 0, kodeMarketing: 'FAJ01' },
  { tanggal: '09 Agu 2026', noNota: 'INV-0226', pelanggan: 'CV Abadi Sentosa', total: 90000, status: 'Lunas', dpDibayar: 0, sisaBayar: 0, kodeMarketing: '' },
  { tanggal: '08 Agu 2026', noNota: 'INV-0225', pelanggan: 'Pelanggan Umum', total: 620000, status: 'DP', dpDibayar: 200000, sisaBayar: 420000, kodeMarketing: 'REZ03' },
  { tanggal: '07 Agu 2026', noNota: 'INV-0224', pelanggan: 'UD Makmur Jaya', total: 340000, status: 'Lunas', dpDibayar: 0, sisaBayar: 0, kodeMarketing: '' },
]);

export const STAGES = ['Desain', 'Cetak', 'Finishing', 'CS', 'Konsumen'];

export const seedProduksi = withIds([
  {
    noOrder: 'PRD-0091', statusSpk: 'Aktif', noNota: 'INV-0231', produk: 'Banner Flexi China 3x1m',
    pelanggan: 'Toko Sinar Jaya', tahap: 'Cetak', target: '13 Agu 2026', pic: 'Andi Saputra',
    detail: 'Ukuran 3×1m, Flexi China 280gr, Mata Ayam + Tali', dibuatOleh: 'Pak Budi',
    history: [{ from: 'Desain', to: 'Cetak', action: 'done', note: 'Desain final disetujui pelanggan, lanjut cetak.' }],
  },
  {
    noOrder: 'PRD-0090', statusSpk: 'Aktif', noNota: 'INV-0230', produk: 'Buku Nota Rangkap 2',
    pelanggan: 'CV Abadi Sentosa', tahap: 'Finishing', target: '12 Agu 2026', pic: 'Rina Wulandari',
    detail: '5 pak, rangkap 2, jilid staples', dibuatOleh: 'Pak Budi',
    history: [
      { from: 'Desain', to: 'Cetak', action: 'done', note: 'Layout disetujui.' },
      { from: 'Cetak', to: 'Finishing', action: 'done', note: 'Selesai cetak, lanjut jilid.' },
    ],
  },
  {
    noOrder: 'PRD-0089', statusSpk: 'Aktif', noNota: 'INV-0228', produk: 'X-Banner 60x160',
    pelanggan: 'UD Makmur Jaya', tahap: 'Desain', target: '14 Agu 2026', pic: 'Siti Aminah',
    detail: 'Ukuran 60×160cm, desain logo + testimoni', dibuatOleh: 'Rina Wulandari', history: [],
  },
  {
    noOrder: 'PRD-0088', statusSpk: 'Selesai', produk: 'Kartu Nama 1 Box', pelanggan: 'Toko Sinar Jaya',
    tahap: 'Konsumen', target: '10 Agu 2026', pic: 'Andi Saputra', detail: '1 box (100pcs), desain sudah disetujui',
    dibuatOleh: 'Pak Budi', closingNote: 'Diambil langsung oleh pelanggan, sudah dicek kualitas cetak & jumlah pcs sesuai pesanan.',
    history: [
      { from: 'Desain', to: 'Cetak', action: 'done', note: 'Desain oke.' },
      { from: 'Cetak', to: 'Finishing', action: 'done', note: 'Cetak selesai.' },
      { from: 'Finishing', to: 'CS', action: 'done', note: 'Sudah dipotong rapi.' },
      { from: 'CS', to: 'Konsumen', action: 'done', note: 'Konsumen dihubungi, siap diambil.' },
    ],
  },
  {
    noOrder: 'PRD-0087', statusSpk: 'Aktif', produk: 'Stiker Vinyl A3', pelanggan: 'Pelanggan Umum',
    tahap: 'CS', target: '09 Agu 2026', pic: 'Rina Wulandari', detail: 'A3, laminasi doff',
    dibuatOleh: 'Pak Budi', history: [],
  },
  {
    noOrder: 'PRD-0086', statusSpk: 'Batal', produk: 'Spanduk Digital 2x1m', pelanggan: 'CV Abadi Sentosa',
    tahap: 'Desain', target: '13 Agu 2026', pic: 'Andi Saputra', detail: 'Ukuran 2×1m, Flexi Korea 340gr',
    dibuatOleh: 'Pak Budi', cancelNote: 'Pelanggan membatalkan pesanan, ganti ke produk lain.', history: [],
  },
]);

export const seedHppCalc = withIds([
  {
    noOrder: 'PRD-0088', produk: 'Kartu Nama 1 Box', pelanggan: 'Toko Sinar Jaya', tanggal: '10 Agu 2026',
    hargaJual: 45000,
    items: [
      { nama: 'Art Paper 260gr', sumber: 'Stok', qty: 0.1, satuan: 'rim', harga: 120000 },
      { nama: 'Ongkos Cetak & Laminasi', sumber: 'Bebas', qty: 1, satuan: 'jasa', harga: 15000 },
    ],
    totalHpp: 27000, dibuatOleh: 'Pak Budi',
  },
]);

// ===== Fase 6 — Marketing =====

export const STRATEGI_JENIS_LIST_DEFAULT = ['Kunjungan langsung', 'Telepon/WA', 'Sosial media'];

export const seedStrategiMarketing = withIds([
  { userMarketing: 'Nia Kusuma', tanggal: '11 Agu 2026', jenis: 'Sosial media', catatan: 'Boost iklan Instagram area Bandung', ajukanAnggaran: true, jumlahAnggaran: 150000, statusPengajuan: 'Menunggu' },
  { userMarketing: 'Reza Pratama', tanggal: '08 Agu 2026', jenis: 'Kunjungan langsung', catatan: 'Cetak brosur promosi', ajukanAnggaran: true, jumlahAnggaran: 100000, statusPengajuan: 'Disetujui' },
  { userMarketing: 'Fajar Ramadhan', tanggal: '12 Agu 2026', jenis: 'Telepon/WA', catatan: 'Follow-up 12 leads lama', ajukanAnggaran: false, jumlahAnggaran: 0, statusPengajuan: 'Tanpa Pengajuan' },
  { userMarketing: 'Nia Kusuma', tanggal: '05 Agu 2026', jenis: 'Kunjungan langsung', catatan: 'Sewa booth pameran', ajukanAnggaran: true, jumlahAnggaran: 500000, statusPengajuan: 'Ditolak' },
]);

export const seedAnggaranMarketing = { bulan: 'Agustus 2026', totalAnggaran: 1000000 };



export const seedStokLedger = withIds([
  { tanggal: '12 Agu 2026', bahan: 'Mata Ayam Banner', tipe: 'Masuk', qty: 20, satuan: 'pak', referensi: 'PO-0231', keterangan: 'Pembelian dari Toko Sumber Rejeki' },
  { tanggal: '12 Agu 2026', bahan: 'Kertas Stiker Vinyl', tipe: 'Masuk', qty: 1.5, satuan: 'roll', referensi: 'PO-0231', keterangan: 'Pembelian dari Toko Sumber Rejeki' },
  { tanggal: '10 Agu 2026', bahan: 'Flexi China 280gr', tipe: 'Masuk', qty: 4, satuan: 'roll', referensi: 'PO-0230', keterangan: 'Pembelian dari CV Bahan Flexi' },
  { tanggal: '10 Agu 2026', bahan: 'Mata Ayam Banner', tipe: 'Masuk', qty: 8, satuan: 'pak', referensi: 'PO-0230', keterangan: 'Pembelian dari CV Bahan Flexi' },
  { tanggal: '08 Agu 2026', bahan: 'Kertas HVS 80gr', tipe: 'Masuk', qty: 20, satuan: 'rim', referensi: 'PO-0229', keterangan: 'Pembelian dari UD Kertas Makmur' },
  { tanggal: '08 Agu 2026', bahan: 'Art Paper 260gr', tipe: 'Masuk', qty: 8.4, satuan: 'rim', referensi: 'PO-0229', keterangan: 'Pembelian dari UD Kertas Makmur' },
  { tanggal: '11 Agu 2026', bahan: 'Flexi China 280gr', tipe: 'Keluar', qty: 3, satuan: 'roll', referensi: 'PRD-0091', keterangan: 'Dipakai untuk produksi SPK' },
]);

// ===== Fase 4 — Pembelian & Kasir (POS) =====

export const seedPembelian = withIds([
  {
    tanggal: '12 Agu 2026', noPO: 'PO-0231', supplier: 'Toko Sumber Rejeki', total: 1240000, status: 'Belum Lunas',
    items: [{ bahan: 'Mata Ayam Banner', qty: 20, satuan: 'pak', harga: 35000 }, { bahan: 'Kertas Stiker Vinyl', qty: 1.5, satuan: 'roll', harga: 380000 }],
  },
  {
    tanggal: '10 Agu 2026', noPO: 'PO-0230', supplier: 'CV Bahan Flexi', total: 3780000, status: 'Lunas',
    items: [{ bahan: 'Flexi China 280gr', qty: 4, satuan: 'roll', harga: 850000 }, { bahan: 'Mata Ayam Banner', qty: 8, satuan: 'pak', harga: 35000 }],
  },
  {
    tanggal: '08 Agu 2026', noPO: 'PO-0229', supplier: 'UD Kertas Makmur', total: 2150000, status: 'Lunas',
    items: [{ bahan: 'Kertas HVS 80gr', qty: 20, satuan: 'rim', harga: 55000 }, { bahan: 'Art Paper 260gr', qty: 8.4, satuan: 'rim', harga: 120000 }],
  },
]);

export const seedStokOpname = withIds([
  { tanggal: '05 Agu 2026', bahan: 'Flexi China 280gr', stokSistem: 46, stokFisik: 45, selisih: -1 },
]);



