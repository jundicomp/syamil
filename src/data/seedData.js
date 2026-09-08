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
