/**
 * Adapter Google Sheets — panggil Apps Script Web App sebagai "API" database.
 *
 * BELUM otomatis dipakai oleh DataContext.jsx (masih pakai data lokal / seedData.js).
 * Setelah Code.gs (folder google-apps-script/) di-deploy dan URL-nya didapat:
 *   1. Buat file `.env` di root proyek: VITE_SHEETS_API_URL=https://script.google.com/macros/s/xxx/exec
 *   2. Lihat README bagian "Menyalakan Google Sheets" untuk cara mengganti DataContext memakai adapter ini.
 */

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;

function assertConfigured() {
  if (!BASE_URL) {
    throw new Error('VITE_SHEETS_API_URL belum diatur di file .env — lihat README.');
  }
}

// Nama tabel di Sheet pakai huruf besar di awal (Pelanggan, BahanBaku, dst),
// sementara di kode React pakai camelCase (pelanggan, bahanBaku) — ini pemetaannya.
const TABLE_NAME = {
  pelanggan: 'Pelanggan', supplier: 'Supplier', produk: 'Produk',
  bahanBaku: 'BahanBaku', promosi: 'Promosi', kampanye: 'Kampanye', leads: 'Leads',
};

export async function fetchAllTables() {
  assertConfigured();
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Gagal memuat data dari Google Sheets.');
  return res.json(); // { pelanggan: [...], supplier: [...], ... }
}

export async function addRowRemote(key, row) {
  assertConfigured();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'add', table: TABLE_NAME[key], row }),
  });
  return res.json();
}

export async function updateRowRemote(key, id, patch) {
  assertConfigured();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'update', table: TABLE_NAME[key], id, row: patch }),
  });
  return res.json();
}

export async function deleteRowRemote(key, id) {
  assertConfigured();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', table: TABLE_NAME[key], id }),
  });
  return res.json();
}
