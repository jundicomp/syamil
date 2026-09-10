# Percetakan Jaya — Migrasi React (Fase 0–7 · SELESAI)

## Cara menjalankan
```bash
npm install
npm run dev
```
Lalu buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

## Status migrasi — 🎉 Semua 7 fase selesai (v0.7.0)
Lihat `checklist-migrasi-react.md` untuk daftar lengkap modul & fase.

### ✅ Selesai
- Fase 0 — Fondasi (routing, state global, tema, komponen generik, sidebar accordion)
- Fase 1 — 7 modul data master (Pelanggan & Supplier, Produk & Bahan Baku, Promosi, Kampanye, Leads)
- Fase 2 — Pengaturan Sistem, 4 tab (Perusahaan, Keuangan, User + Hak Akses, Sistem)
- Fase 3 — Laporan Penjualan, Laporan Produksi, Stok Opname, Kartu Stok (+ `addStokMovement`)
- Fase 4 — Kasir (POS): keranjang, DP/Lunas, cetak struk · Pembelian: keranjang bahan, auto stok+kas
- Fase 5 — Alur SPK (Kanban 4 tab), Status Pengerjaan, Kalkulasi HPP
- Fase 6 — Dashboard Marketing (leaderboard, "Lihat Sebagai", Strategi + persetujuan anggaran)
- Fase 7 — Buku Kas, Dashboard, Laba Rugi & Neraca (dihitung otomatis dari data riil)
- **v0.15.0**: Buku Kas & Laba Rugi dikonsolidasi jadi halaman "Laporan Keuangan" (7 tab), plus Piutang, Rekonsiliasi Kas, Persediaan, Cashflow — lihat catatan di bawah
- Export Excel & PDF sungguhan di semua tabel (v0.8.0)
- Filter rentang tanggal + header laporan terstruktur (Nama Usaha/Nama Laporan/Rentang) + baris Total (v0.9.0)
- Info versi & waktu push (footer sidebar) + halaman Changelog

Semua halaman di sidebar sekarang aktif — tidak ada lagi alert "belum dimigrasi".

### Catatan jujur (gap yang masih sama seperti versi HTML, belum ditutup)
- **Matriks Harga** (harga bertingkat per jumlah/ukuran) di POS belum otomatis — harga bisa diedit manual dulu.
- **QRIS** baru jadi pilihan metode bayar, belum menampilkan gambar QRIS dari Pengaturan.
- **"Ciptakan SPK"** disederhanakan — pilih 1 Nota + 1 Produk manual, belum auto-pecah beberapa SPK dari nota multi-item.
- **Kalkulasi HPP** belum benar-benar dibatasi ke role Owner/Admin — belum ada sistem login sungguhan.
- **Hutang ke Supplier** cuma total status "Belum Lunas", belum ada pelacakan per-supplier atau fitur "Bayar Hutang".
- **Piutang/Pelunasan susulan** — kalau transaksi DP, belum ada tombol "Terima Pelunasan" untuk menutup sisa bayarnya nanti.
- **Laporan Laba Rugi & Neraca** — ini yang **sudah diperbaiki** saat migrasi (dulu statis di HTML), sekarang beneran terhitung dari Buku Kas/HPP/Stok. Tapi masih versi cash-basis sederhana, bukan akuntansi akrual formal — lihat catatan ⚠ di masing-masing halaman.

### Langkah lanjutan yang masuk akal (di luar 7 fase awal)
- Sambungkan Google Sheets sungguhan (kerangkanya sudah ada, lihat "Bagian 2" di bawah)
- Tutup gap Piutang/Hutang di atas
- Login sungguhan + penegakan Hak Akses per halaman (sekarang cuma matriks visual, belum menggerbang navigasi)

### Catatan cakupan Export Excel/PDF
Diterapkan ke semua tabel data (lewat komponen `DataTable`, atau `ExportButtons` untuk tabel kustom seperti Buku Kas & Dashboard Marketing). **Sengaja dilewati**: matriks Hak Akses (tabel User) dan modal Cek Stok Bahan (POS) — keduanya bukan "laporan" yang biasa diekspor, cuma alat bantu interaktif/lihat cepat.

### Catatan cakupan Filter Rentang Tanggal (v0.9.0)
- **Punya filter tanggal**: Laporan Penjualan, Laporan Produksi, Stok Opname, Order & Riwayat Pembelian, Tabel/Arsip/Batal SPK, Status Pengerjaan, Kalkulasi HPP, Audit Trail, Buku Kas, Laporan Laba Rugi.
- **Sengaja TIDAK punya filter tanggal** (bukan data transaksi/tidak relevan): Pelanggan, Supplier, Produk, Bahan Baku, Promosi, Kampanye, Sumber Leads, Pengguna, Notifikasi, Hak Akses.
- **Laporan Neraca**: sengaja tidak dikasih rentang — neraca itu "foto posisi saat ini" (snapshot), bukan laporan per-periode. Sudah dikasih export dengan label tanggal cetak.
- **Belum sempat dikasih filter tanggal** (masih ada di daftar kerja lanjutan): 4 tabel di Dashboard Marketing (Marketing & Kode, Antrean Persetujuan, Semua Strategi Marketing, Penjualan/Strategi Saya) — sudah punya export, tapi belum bisa difilter per rentang tanggal.

---

## Bagian 1 — Push ke GitHub (repo publik)

Saya sudah siapkan repo Git **lokal** (sudah `git init` + 1 commit pertama) — tapi membuat repo di GitHub.com dan push butuh akun Anda sendiri, jadi bagian ini perlu dilakukan manual:

1. Buka [github.com/new](https://github.com/new), buat repo baru:
   - Nama bebas, misal `percetakan-jaya-react`
   - Pilih **Public**
   - **Jangan** centang "Add a README" (biar tidak bentrok dengan yang sudah ada)
2. Setelah repo dibuat, GitHub akan kasih URL-nya. Di terminal, masuk ke folder proyek ini lalu jalankan:
   ```bash
   git remote add origin https://github.com/USERNAME_ANDA/percetakan-jaya-react.git
   git push -u origin main
   ```
3. Selesai — repo publik Anda sudah berisi kode Fase 0+1 ini.

Setiap kali saya lanjutkan fase berikutnya, saya akan commit lagi di repo lokal — tinggal `git push` lagi dari sisi Anda.

---

## Bagian 2 — Menyalakan Google Sheets sebagai Database

Ini **belum aktif** — proyek masih pakai data di memori (`src/data/seedData.js`). Sudah saya siapkan kerangkanya (backend + adapter), tapi Sheet-nya sendiri cuma bisa dibuat di akun Google Anda. Langkahnya:

1. **Buat Google Sheet baru**, buat 7 tab dengan nama & kolom header persis seperti ini (lihat komentar di `google-apps-script/Code.gs` untuk daftar lengkap kolomnya):
   `Pelanggan`, `Supplier`, `Produk`, `BahanBaku`, `Promosi`, `Kampanye`, `Leads`
2. Buka **Extensions > Apps Script** dari Sheet itu, hapus kode default, **paste isi file `google-apps-script/Code.gs`** dari proyek ini.
3. Klik **Deploy > New deployment** → pilih tipe **Web app** → Execute as: **Me**, Who has access: **Anyone**. Deploy, lalu salin URL yang muncul (`https://script.google.com/macros/s/xxx/exec`).
4. Di proyek React, buat file `.env` (copy dari `.env.example`), isi:
   ```
   VITE_SHEETS_API_URL=https://script.google.com/macros/s/xxx/exec
   ```
5. **Beri tahu saya** setelah langkah di atas selesai — saya akan sambungkan `DataContext.jsx` supaya benar-benar memanggil `src/data/sheetsAdapter.js`, gantikan data lokal. Ini sengaja belum saya sambungkan otomatis karena saya tidak bisa mengetes terhadap Sheet Anda yang sungguhan dari sini.

## Bagian 3 — Deploy ke GitHub Pages (kenapa tadi blank)

Layar putih tadi karena file yang tersaji itu masih **file sumber mentah** (JSX belum diproses jadi JavaScript biasa) — browser tidak bisa langsung menjalankan JSX. Sudah saya perbaiki dua hal:

1. `vite.config.js` — ditambah `base: '/syamil/'` supaya path file CSS/JS hasil build benar (repo ini disajikan dari subpath `/syamil/`, bukan dari root domain).
2. `.github/workflows/deploy.yml` — otomatis **build** lalu deploy hasilnya (folder `dist/`, bukan source mentah) tiap kali ada `git push` ke branch `main`.

**Satu langkah manual yang perlu Anda lakukan sekali saja** (saya tidak bisa mengubah pengaturan repo Anda):

1. Buka `github.com/jundicomp/syamil` → **Settings** → **Pages**
2. Di bagian **Build and deployment → Source**, ganti dari "Deploy from a branch" jadi **"GitHub Actions"**
3. Push perubahan ini (`git push`), tunggu 1-2 menit, cek tab **Actions** di repo — kalau centang hijau, buka lagi `https://jundicomp.github.io/syamil/`

## Struktur folder
```
src/
  data/          navConfig, seedData (data lokal), sheetsAdapter (belum aktif)
  context/       DataContext, ThemeContext
  components/    DataTable, FormModal, Badge, Icon, Sidebar, Topbar, AppShell
  pages/         1 folder per modul
google-apps-script/
  Code.gs        backend, di-paste ke Apps Script Sheet Anda
```

## Catatan jujur
- Export Excel/PDF di tabel baru tampilan tombolnya, belum difungsikan.
- Adapter Sheets (`sheetsAdapter.js`) saya tulis mengikuti struktur `Code.gs` tapi **belum pernah dites terhadap Sheet sungguhan** — kemungkinan ada penyesuaian kecil begitu Anda coba deploy beneran.
