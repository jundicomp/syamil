# Audit Visual — Bug Ditemukan & Perbaikan (9 Sep 2026)

Dipicu laporan: teks tak terlihat, panah sidebar hilang, layout berantakan di beberapa modul.

## Akar Masalah Ditemukan

| # | Bug | Penyebab | Dampak | Status |
|---|---|---|---|---|
| 1 | Teks jadi putih/pudar di mode Day, hampir di **semua halaman** | `.content` (pembungkus area konten) tidak punya `color` eksplisit — jadi warna teks ikut warisan dari `body` (yang tetap versi gelap), bukan versi terang mode Day | Judul, label, teks isi nyaris tak terlihat di background terang | ✅ **Diperbaiki** |
| 2 | Panah accordion sidebar (▾) tidak kelihatan | CSS `stroke` salah ditembak ke `<span>` pembungkus, bukan ke `<svg>` di dalamnya — `stroke` cuma berlaku untuk elemen SVG | Sidebar kelihatan seperti kehilangan indikator buka/tutup | ✅ **Diperbaiki** |
| 3 | Semua tombol berpotensi ikon tak kelihatan/salah warna | Elemen `<button>` di HTML/browser tidak otomatis mewarisi warna teks halaman kecuali diberi tahu — belum ada aturan global buat itu | Risiko ikon di tombol manapun jadi hitam pekat/tak kontras tanpa disadari | ✅ **Diperbaiki** (aturan `button{color:inherit}` global) |
| 4 | Kasir (POS) — keranjang &amp; ringkasan total numpuk vertikal, bukan 2 kolom seperti versi HTML | Halaman ini belum pernah dikasih struktur grid 2 kolom sejak awal dibangun (Fase 4) | Tombol "Bayar" & Total kelihatan terpisah/aneh di bawah, beda jauh dari versi HTML | ✅ **Diperbaiki** |

## Yang Sudah Dicek Aman (tidak perlu diubah)
- Kanban Alur SPK, 2 kolom Dashboard Marketing (Owner), Neraca, Buku Kas — semua sudah pakai grid/flex yang benar sejak awal, cuma **kelihatan** berantakan gara-gara bug #1 (teksnya hilang, bukan tata letaknya yang rusak).

## Kalau Masih Ada yang Aneh Setelah Update Ini
Kemungkinan bug spesifik per-halaman yang belum ketahuan dari 2 screenshot kemarin — kirim screenshot lagi bagian mana yang masih kurang pas, saya lanjutkan investigasinya.
