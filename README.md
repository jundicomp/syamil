# Percetakan Jaya — Migrasi React (Fase 0–2)

## Cara menjalankan
```bash
npm install
npm run dev
```
Lalu buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

## Status migrasi
Lihat `checklist-migrasi-react.md` untuk daftar lengkap modul & fase.

### ✅ Selesai
- Fase 0 — Fondasi (routing, state global, tema, komponen generik, sidebar accordion)
- Fase 1 — 7 modul data master (Pelanggan & Supplier, Produk & Bahan Baku, Promosi, Kampanye, Leads)
- Fase 2 — Pengaturan Sistem, 4 tab (Perusahaan, Keuangan, User + Hak Akses, Sistem)

### ⏳ Belum
Menu lain masih alert "belum dimigrasi" kalau diklik.

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
