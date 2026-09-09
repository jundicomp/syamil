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

---

# Ronde 2 — Audit Logika (9 Sep 2026, lanjutan)

Dipicu: total POS tetap Rp0 padahal baris sudah keisi. Kali ini saya bandingkan **logika perhitungan**, bukan cuma CSS, langsung dari kode `sistem-percetakan-app.html`.

| # | Bug | Penyebab | Status |
|---|---|---|---|
| 5 | Total POS tetap Rp0 walau baris sudah diisi (belum diklik ✓) | Saya cuma menjumlah item yang sudah "locked" — HTML aslinya menjumlah **semua baris** (termasuk yang belum dikonfirmasi) untuk Total, cuma yang locked yang tersimpan pas checkout | ✅ Diperbaiki |
| 6 | Harga Jual di Kalkulasi HPP kurang presisi | Saya cuma ambil total keseluruhan Nota — HTML aslinya mencari **harga item spesifik** dalam Nota dulu (qty×harga produk itu saja), baru fallback ke total kalau tidak ketemu | ✅ Diperbaiki |
| 7 | Margin % dibulatkan ke bilangan bulat | HTML pakai 1 angka desimal (`toFixed(1)`) | ✅ Diperbaiki |
| 8 | **Stok Opname langsung mengubah stok sungguhan** | Ternyata di HTML, Stok Opname **cuma catatan/log riwayat** (audit) — tidak pernah otomatis menyesuaikan `bahanBaku.stok`. Punya saya sebelumnya salah asumsi dan langsung memakai `addStokMovement` | ✅ **Diperbaiki** — sekarang jadi tabel CRUD log seperti aslinya, sudah tidak menyentuh stok sungguhan lagi |

## Perbedaan yang Saya Putuskan TIDAK Diubah (minor, bukan bug)
- **Kartu Stok**: di HTML dibuka dengan klik nama bahan (link halus), di React saya pakai tombol ikon 👁️ terpisah — sama-sama berfungsi, cuma beda titik klik. Saya biarkan karena justru lebih jelas/mudah ditemukan.

## Jujur soal batasan audit ini
Saya sudah cek detail logika untuk: **POS, Kalkulasi HPP, Stok Opname, Alur SPK (tahapan), Leaderboard Marketing**. Saya **belum** membandingkan baris-per-baris untuk semua 30 halaman (itu akan sangat panjang) — kalau ada modul lain yang terasa janggal, kirim screenshot spesifik halaman itu, saya cek langsung ke kode HTML asli seperti pola di atas.

---

# Ronde 3 — Fitur yang Belum Pernah Dibangun Sama Sekali (9 Sep 2026, lanjutan)

Beda dari ronde 1-2 (itu bug logika/CSS) — ini murni **fitur yang lupa/belum sempat diportir** sejak Fase 0, ketauan karena dibandingkan sisi-sisi topbar & footer POS langsung dengan HTML.

| # | Fitur Hilang | Status |
|---|---|---|
| 9 | Tombol collapse sidebar (ciutkan jadi mode ikon-saja) — sama sekali belum ada di React sejak awal | ✅ Dibangun |
| 10 | Pil "Data Dummy · Google Sheets belum tersambung" di topbar — belum ada | ✅ Dibangun |
| 11 | POS: tombol "Bayar" seharusnya "Checkout" + ada baris "Subtotal" terpisah + tombol "Simpan" (dummy) & "Batal" (reset keranjang) — di React cuma ada 1 tombol "Bayar" | ✅ Dibangun |

## Catatan
Mode collapse sidebar **baru saya bangun untuk desktop** (sesuai yang diminta/ditunjukkan) — versi mobile (drawer geser dari kiri) di HTML asli belum ikut diportir, karena React belum punya sistem mobile-responsive sidebar sama sekali sejak awal. Kalau nanti dipakai di HP, kabari saya.

