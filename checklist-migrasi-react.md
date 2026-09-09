# Checklist Migrasi ke React — Sistem Percetakan

Disusun berdasarkan urutan pengerjaan yang disarankan (bukan urutan menu di sidebar), dari yang paling sederhana ke paling kompleks. Total **30 unit kerja** dari 6 fase.

**Legenda kompleksitas:** 🟢 Ringan · 🟡 Sedang · 🔴 Berat

---

## Fase 0 — Fondasi (wajib sebelum modul manapun)

- [ ] Routing (React Router — 1 route per key halaman)
- [ ] Store/state global (pengganti object `DUMMY` — Context API / Zustand)
- [ ] Sistem tema Day/Night (CSS variables → tetap bisa dipakai)
- [ ] Komponen generik: `<DataTable>` (cari/urut/paginasi/export), `<Modal>`, `<FormField>`
- [ ] Sidebar + accordion grup (yang barusan dibuat collapsible)

---

## Fase 1 — Data Master (paling sederhana, buat bentuk pola dulu)

- [ ] 🟢 Pelanggan *(tab dari "Pelanggan & Supplier")*
- [ ] 🟢 Supplier *(tab dari "Pelanggan & Supplier")*
- [ ] 🟢 Produk *(tab dari "Produk & Bahan Baku")*
- [ ] 🟢 Bahan Baku *(tab dari "Produk & Bahan Baku" — kolom Stok Saat Ini readonly)*
- [ ] 🟢 Promosi & Diskon
- [ ] 🟢 Kampanye Pelanggan
- [ ] 🟢 Sumber Leads

## Fase 2 — Pengaturan Sistem (4 tab)

- [x] 🟡 Tab **Perusahaan** (upload logo, identitas usaha, checklist penempatan logo)
- [x] 🟡 Tab **Keuangan** (rekening bank ×3, upload gambar QRIS)
- [x] 🟡 Tab **User** (daftar Pengguna + matriks Hak Akses per role)
- [x] 🟡 Tab **Sistem** (Notifikasi & Pengingat + Backup & Audit Trail)

## Fase 3 — Laporan & Sistem Stok

- [x] 🟢 Laporan Penjualan
- [x] 🟢 Laporan Produksi
- [x] 🟡 Stok Opname (Stok Sistem otomatis, Selisih real-time)
- [x] 🔴 **Kartu Stok / Ledger** *(infrastruktur inti — dipakai banyak modul lain: `addStokMovement`)*

## Fase 4 — Transaksi Inti

- [x] 🟡 Pembelian — tab Order Pembelian (keranjang bahan, auto update stok + Buku Kas)
- [x] 🟢 Pembelian — tab Laporan (filter tanggal, ringkasan per supplier/bulan)
- [x] 🔴 **Kasir (POS)** *(paling kompleks: keranjang, DP/Lunas, cetak struk, cek stok bahan)*

## Fase 5 — Alur SPK & Produksi

- [x] 🔴 Alur SPK — Kartu (Kanban 5 tahap, Back/Done wajib catatan, over-hand)
- [x] 🟡 Alur SPK — Tabel
- [x] 🟡 Alur SPK — Arsip SPK (Selesai) + mekanisme Tutup SPK
- [x] 🟡 Alur SPK — SPK Batal + mekanisme Batalkan
- [x] 🟢 Status Pengerjaan
- [x] 🔴 **Kalkulasi HPP** *(akses terbatas, keranjang biaya stok/jasa, tarik Harga Jual otomatis dari Nota, hitung margin)*

## Fase 6 — Marketing

- [x] 🟡 Dashboard Marketing (leaderboard 2 tab: Bulan Ini/Akumulasi, 4 kartu statistik)
- [x] 🔴 Tampilan personal Marketing ("Lihat Sebagai", data terfilter per user)
- [x] 🟡 Strategi Marketing + alur pengajuan & persetujuan anggaran

## Fase 7 — Laporan Keuangan

- [x] 🟢 Buku Kas
- [x] 🟢 Dashboard (kartu ringkasan utama)
- [x] 🟡 Laporan Laba Rugi ✅ *diperbaiki saat migrasi — sekarang benar-benar terhitung otomatis (cash-basis), bukan statis lagi*
- [x] 🟡 Laporan Neraca ✅ *sebagian terhitung otomatis (Kas, Stok, Piutang) — Hutang & Modal masih gap yang sama seperti versi HTML*

---

## 🎉 Semua 30 unit kerja di 7 fase sudah selesai (v0.7.0)

Ini menandai migrasi HTML → React selesai untuk seluruh scope yang direncanakan di awal. Sisa yang masih berupa gap/catatan jujur ada di README.md, bukan di checklist ini — karena itu bukan "belum dimigrasi", tapi memang keterbatasan yang sudah ada sejak versi HTML dan belum ditutup.

---

## Catatan Penting

1. **Kartu Stok (Fase 3)** dan **Kasir/POS (Fase 4)** sebaiknya tidak dilompati — banyak modul lain (Pembelian, HPP, Pengurangan Manual) bergantung ke situ.
2. **Kalkulasi HPP** dan **Dashboard Marketing** butuh data dari POS (No. Nota, Kode Marketing) sudah ada duluan — jangan dikerjakan sebelum Fase 4 selesai.
3. Modul bertanda ⚠️ (Laba Rugi, Neraca) memang belum "benar" secara logika bahkan di versi HTML — kalau mau dibetulkan sekalian saat migrasi, itu kerjaan tambahan di luar migrasi murni.
