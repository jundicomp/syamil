/**
 * Adapter Google Sheets — panggil Apps Script Web App (Code.gs) sebagai "API" database.
 *
 * BELUM otomatis dipakai oleh DataContext.jsx (masih pakai data lokal / seedData.js).
 * Setelah Code.gs di-deploy dan URL-nya didapat:
 *   1. Buat file `.env` di root proyek: VITE_SHEETS_API_URL=https://script.google.com/macros/s/xxx/exec
 *   2. Lihat README bagian "Menyalakan Google Sheets" untuk cara mengganti DataContext memakai adapter ini.
 *
 * Nama tabel di Sheet pakai PascalCase (Pelanggan, BahanBaku, StokLedger, dst),
 * di kode React pakai camelCase (pelanggan, bahanBaku, stokLedger) — TABLE_NAME memetakan ini.
 */

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;

function assertConfigured() {
  if (!BASE_URL) {
    throw new Error('VITE_SHEETS_API_URL belum diatur di file .env — lihat README.');
  }
}

export const TABLE_NAME = {
  // Master Data
  pelanggan: 'Pelanggan', supplier: 'Supplier', produk: 'Produk', bahanBaku: 'BahanBaku',
  pengguna: 'Pengguna', settings: 'Settings', hakAkses: 'HakAkses',
  strategiJenisList: 'StrategiJenisList', pelangganKategoriList: 'PelangganKategoriList',
  anggaranMarketing: 'AnggaranMarketing',
  // Data Transaksi
  penjualan: 'Penjualan', produksi: 'Produksi', stokLedger: 'StokLedger', pembelian: 'Pembelian',
  hppCalc: 'HppCalc', stokOpname: 'StokOpname', hutang: 'Hutang', piutang: 'Piutang',
  rekonsiliasiKas: 'RekonsiliasiKas', bukuKas: 'BukuKas', notifikasi: 'Notifikasi',
  auditTrail: 'AuditTrail', promosi: 'Promosi', kampanye: 'Kampanye', leads: 'Leads',
  strategiMarketing: 'StrategiMarketing', posDraft: 'PosDraft',
};

/** Ambil semua Master Data sekaligus (1 request) — dipanggil sekali saat aplikasi pertama dibuka. */
export async function fetchMasterTables() {
  assertConfigured();
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Gagal memuat data master dari Google Sheets.');
  return res.json(); // { pelanggan: [...], settings: {...}, hakAkses: {...}, ... }
}

/** Ambil 1 tabel transaksi tertentu — dipanggil belakangan, pas halaman yang butuh itu dibuka. */
export async function fetchTable(key) {
  assertConfigured();
  const table = TABLE_NAME[key];
  const res = await fetch(`${BASE_URL}?table=${encodeURIComponent(table)}`);
  if (!res.ok) throw new Error(`Gagal memuat ${table} dari Google Sheets.`);
  return res.json();
}

/** Ambil BENAR-BENAR semua 27 tabel sekaligus — berat, pakai cuma kalau perlu (mis. backup/export). */
export async function fetchAllTables() {
  assertConfigured();
  const res = await fetch(`${BASE_URL}?tables=all`);
  if (!res.ok) throw new Error('Gagal memuat seluruh data dari Google Sheets.');
  return res.json();
}

export async function addRowRemote(key, row) {
  assertConfigured();
  const res = await fetch(BASE_URL, { method: 'POST', body: JSON.stringify({ action: 'add', table: TABLE_NAME[key], row }) });
  return res.json();
}
export async function updateRowRemote(key, id, patch) {
  assertConfigured();
  const res = await fetch(BASE_URL, { method: 'POST', body: JSON.stringify({ action: 'update', table: TABLE_NAME[key], id, row: patch }) });
  return res.json();
}
export async function deleteRowRemote(key, id) {
  assertConfigured();
  const res = await fetch(BASE_URL, { method: 'POST', body: JSON.stringify({ action: 'delete', table: TABLE_NAME[key], id }) });
  return res.json();
}
/** Untuk tabel key-value (settings, anggaranMarketing). */
export async function setKvRemote(key, kvKey, value) {
  assertConfigured();
  const res = await fetch(BASE_URL, { method: 'POST', body: JSON.stringify({ action: 'setKv', table: TABLE_NAME[key], row: { key: kvKey, value } }) });
  return res.json();
}
/** Untuk tabel daftar sederhana (strategiJenisList, pelangganKategoriList). */
export async function addToListRemote(key, value) {
  assertConfigured();
  const res = await fetch(BASE_URL, { method: 'POST', body: JSON.stringify({ action: 'add', table: TABLE_NAME[key], row: { value } }) });
  return res.json();
}
export async function toggleHakAksesRemote(role, modul, value) {
  assertConfigured();
  const res = await fetch(BASE_URL, { method: 'POST', body: JSON.stringify({ action: 'toggleHakAkses', row: { role, modul, value } }) });
  return res.json();
}
