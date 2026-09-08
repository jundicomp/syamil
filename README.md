# Percetakan Jaya — Migrasi React (Fase 0 + Fase 1)

## Cara menjalankan
```bash
npm install
npm run dev
```
Lalu buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk build produksi:
```bash
npm run build
```

## Status migrasi

### ✅ Fase 0 — Fondasi (selesai)
- Routing (React Router, mode Hash supaya aman dibuka dari file manapun)
- State global (`DataContext` — pengganti object `DUMMY`)
- Tema Day/Night (`ThemeContext`)
- Komponen generik: `DataTable` (cari/urut/paginasi), `FormModal` (tambah/edit), `Badge`
- Sidebar accordion (grup otomatis buka/tutup sesuai halaman aktif) + Topbar

### ✅ Fase 1 — Data Master (selesai, 7 modul)
- Pelanggan & Supplier (2 tab)
- Produk & Bahan Baku (2 tab)
- Promosi & Diskon
- Kampanye Pelanggan
- Sumber Leads

### ⏳ Belum dimigrasi
Semua menu lain di sidebar (Kasir POS, Alur SPK, Kalkulasi HPP, Dashboard Marketing, dst) — kalau diklik akan muncul alert "belum dimigrasi". Lihat `checklist-migrasi-react.md` untuk urutan Fase 2 dan seterusnya.

## Struktur folder
```
src/
  data/          konfigurasi navigasi + data contoh (pengganti DUMMY)
  context/       state global (Data & Theme)
  components/
    common/      DataTable, FormModal, Badge, Icon
    layout/      Sidebar, Topbar, AppShell
  pages/         1 folder per modul
```

## Catatan jujur
- Data masih di memori (hilang kalau refresh) — sama seperti versi HTML, belum tersambung ke Google Sheets/backend.
- Export Excel/PDF di tabel baru tampilan tombolnya saja, belum difungsikan (di versi HTML pakai SheetJS — belum diportir).
