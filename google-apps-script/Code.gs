/**
 * Syamil Sistem Online — Backend Google Apps Script (v2, lengkap 27 tab)
 * Ditempel di Extensions > Apps Script pada Google Sheet database Anda.
 *
 * CARA PAKAI:
 *   1. Buat 1 Google Sheet baru (kosong, judul bebas — mis. "Syamil Database").
 *   2. Buka Extensions > Apps Script, hapus isi default, tempel SELURUH file ini.
 *   3. Di dropdown fungsi (sebelah tombol ▶ Run), pilih `setupSheets`, klik Run.
 *      Ini otomatis membuat SEMUA 27 tab dengan header kolom yang benar —
 *      tidak perlu bikin tab manual satu-satu.
 *   4. Deploy > New deployment > pilih tipe "Web app" >
 *        Execute as: Me
 *        Who has access: Anyone
 *      Klik Deploy, salin URL yang muncul.
 *   5. URL itu ditaruh di file .env React: VITE_SHEETS_API_URL=<url tadi>
 *
 * PEMBAGIAN MASTER vs TRANSAKSI (biar loading cepat):
 *   - MASTER_TABLES: kecil, jarang berubah — diambil SEKALIGUS sekali di awal.
 *   - TRANSACTIONAL_TABLES: terus bertambah seiring waktu — diambil SATU-SATU,
 *     cuma pas halaman yang butuh itu dibuka (?table=Penjualan, dst).
 *   - doGet tanpa parameter apapun = ambil semua MASTER_TABLES sekaligus (1 kali jalan).
 *   - doGet?table=Penjualan = ambil 1 tabel itu saja.
 *   - doGet?tables=all = ambil SEMUA 27 tab (dipakai kalau memang perlu, mis. backup).
 */

// ===== SKEMA: nama tab -> daftar kolom (urutan ini yang dipakai setupSheets) =====
const SCHEMA = {
  // --- Master Data (10 tab): kecil, dimuat sekaligus di awal ---
  Pelanggan: ['id', 'nama', 'kontak', 'alamat', 'kota', 'kategori', 'batasKredit', 'marketingTerkait'],
  Supplier: ['id', 'nama', 'pic', 'tipeSupplier', 'kategoriBahan', 'kontak', 'alamat', 'kota'],
  Produk: ['id', 'nama', 'kategori', 'satuan', 'harga', 'tipe', 'hargaMatrix'],
  BahanBaku: ['id', 'nama', 'satuan', 'hargaBeli', 'supplier', 'stokMinimum', 'stok'],
  Pengguna: ['id', 'nama', 'email', 'hp', 'role', 'status', 'kodeMarketing', 'fotoDataUrl', 'password'],
  Settings: ['key', 'value'], // key-value, nilai kompleks (rekening, logoPlacement) disimpan JSON di 'value'
  HakAkses: ['role', 'Penjualan', 'Pembelian', 'Produksi', 'Kalkulasi HPP', 'Marketing', 'Laporan Keuangan', 'Pengaturan'],
  StrategiJenisList: ['jenis'],
  PelangganKategoriList: ['kategori'],
  AnggaranMarketing: ['key', 'value'], // key-value juga (cuma bulan + totalAnggaran)

  // --- Data Transaksi (17 tab): terus bertambah, dimuat satu-satu per halaman ---
  Penjualan: ['id', 'tanggal', 'noNota', 'pelanggan', 'total', 'status', 'dpDibayar', 'sisaBayar', 'kodeMarketing', 'items'],
  Produksi: ['id', 'noOrder', 'statusSpk', 'noNota', 'produk', 'pelanggan', 'tahap', 'target', 'pic', 'detail', 'dibuatOleh', 'history', 'closingNote', 'cancelNote'],
  StokLedger: ['id', 'tanggal', 'bahan', 'tipe', 'qty', 'satuan', 'referensi', 'keterangan'],
  Pembelian: ['id', 'tanggal', 'tanggalNota', 'noPO', 'noNotaSupplier', 'supplier', 'items', 'total', 'status', 'metodeBayar'],
  HppCalc: ['id', 'noOrder', 'produk', 'pelanggan', 'tanggal', 'hargaJual', 'items', 'totalHpp', 'dibuatOleh'],
  StokOpname: ['id', 'tanggal', 'bahan', 'stokSistem', 'stokFisik', 'selisih'],
  Hutang: ['id', 'tanggal', 'noPO', 'noNotaSupplier', 'supplier', 'total', 'dibayar', 'sisa', 'status'],
  Piutang: ['id', 'tanggal', 'noNota', 'pelanggan', 'total', 'dibayar', 'sisa', 'status'],
  RekonsiliasiKas: ['id', 'tanggal', 'jenisKas', 'saldoSistem', 'saldoFisik', 'selisih'],
  BukuKas: ['id', 'tanggal', 'tipe', 'jumlah', 'keterangan', 'jenisKas'],
  Notifikasi: ['id', 'judul', 'pesan', 'tanggal', 'dibaca'],
  AuditTrail: ['id', 'waktu', 'pengguna', 'aksi', 'detail'],
  Promosi: ['id', 'namaPromo', 'jenis', 'nilai', 'periode', 'status'],
  Kampanye: ['id', 'namaKampanye', 'channel', 'tanggal', 'status'],
  Leads: ['id', 'namaLead', 'sumber', 'kontak', 'status'],
  StrategiMarketing: ['id', 'userMarketing', 'tanggal', 'jenis', 'catatan', 'ajukanAnggaran', 'jumlahAnggaran', 'statusPengajuan'],
  PosDraft: ['id', 'tanggal', 'customer', 'kodeMarketing', 'items', 'subtotal'],
};

const MASTER_TABLES = ['Pelanggan', 'Supplier', 'Produk', 'BahanBaku', 'Pengguna', 'Settings', 'HakAkses', 'StrategiJenisList', 'PelangganKategoriList', 'AnggaranMarketing'];
const KV_TABLES = ['Settings', 'AnggaranMarketing']; // key-value, bukan array baris
const SINGLE_COL_TABLES = { StrategiJenisList: 'jenis', PelangganKategoriList: 'kategori' }; // array string biasa

// ===== SETUP: jalankan sekali manual dari editor Apps Script =====
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SCHEMA).forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.clear();
    sheet.getRange(1, 1, 1, SCHEMA[name].length).setValues([SCHEMA[name]]);
    sheet.setFrozenRows(1);
  });
  // Hapus tab default "Sheet1" kalau masih ada dan kosong.
  const default1 = ss.getSheetByName('Sheet1');
  if (default1 && ss.getSheets().length > 1) ss.deleteSheet(default1);
  SpreadsheetApp.getUi().alert('Selesai! ' + Object.keys(SCHEMA).length + ' tab berhasil dibuat/direset dengan header yang benar.');
}

// ===== doGet: baca data =====
function doGet(e) {
  const table = e.parameter.table;
  const tables = e.parameter.tables;

  if (table) return jsonOut(readAny(table));
  if (tables === 'all') {
    const all = {};
    Object.keys(SCHEMA).forEach(name => { all[toKey(name)] = readAny(name); });
    return jsonOut(all);
  }
  // Default: cuma Master Data (cepat, dipakai pas aplikasi pertama dibuka)
  const master = {};
  MASTER_TABLES.forEach(name => { master[toKey(name)] = readAny(name); });
  return jsonOut(master);
}

// ===== doPost: tulis data =====
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const { action, table, id, row } = body;

  if (action === 'toggleHakAkses') return jsonOut(updateHakAkses(row.role, row.modul, row.value));
  if (action === 'forgotPassword') return jsonOut(forgotPassword(row.email));

  if (!SCHEMA[table]) return jsonOut({ error: 'Tabel tidak dikenal: ' + table });

  if (KV_TABLES.includes(table)) {
    if (action === 'setKv') return jsonOut(setKvValue(table, row.key, row.value));
    return jsonOut({ error: 'Tabel key-value cuma dukung aksi setKv.' });
  }
  if (SINGLE_COL_TABLES[table]) {
    if (action === 'add') return jsonOut(addSingleCol(table, row.value));
    return jsonOut({ error: 'Tabel daftar cuma dukung aksi add.' });
  }

  if (action === 'add') return jsonOut(addRow(table, row));
  if (action === 'update') return jsonOut(updateRow(table, id, row));
  if (action === 'delete') return jsonOut(deleteRow(table, id));
  return jsonOut({ error: 'Aksi tidak dikenal: ' + action });
}

// ===== Baca: pilih strategi sesuai jenis tabel =====
function readAny(name) {
  if (name === 'HakAkses') return readHakAkses();
  if (KV_TABLES.includes(name)) return readKv(name);
  if (SINGLE_COL_TABLES[name]) return readSingleCol(name);
  return readTable(name);
}

function getSheet(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Sheet "' + name + '" tidak ditemukan — jalankan setupSheets() dulu.');
  return sheet;
}
function toKey(name) { return name.charAt(0).toLowerCase() + name.slice(1); }

// Cell yang isinya JSON (diawali { atau [) diparse balik jadi object/array.
function parseCell(v) {
  if (typeof v === 'string' && (v.startsWith('{') || v.startsWith('['))) {
    try { return JSON.parse(v); } catch { return v; }
  }
  return v;
}
// Object/array ditulis sebagai JSON string ke sel.
function stringifyCell(v) {
  return (typeof v === 'object' && v !== null) ? JSON.stringify(v) : (v ?? '');
}

function readTable(name) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter(r => r[0] !== '').map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = parseCell(row[i]); });
    return obj;
  });
}

function readKv(name) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  const obj = {};
  values.slice(1).forEach(row => { if (row[0]) obj[row[0]] = parseCell(row[1]); });
  return obj;
}
function setKvValue(name, key, value) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  for (let r = 1; r < values.length; r++) {
    if (values[r][0] === key) { sheet.getRange(r + 1, 2).setValue(stringifyCell(value)); return { ok: true }; }
  }
  sheet.appendRow([key, stringifyCell(value)]);
  return { ok: true };
}

function readSingleCol(name) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  return values.slice(1).map(r => r[0]).filter(v => v !== '');
}
function addSingleCol(name, value) {
  const sheet = getSheet(name);
  const existing = readSingleCol(name);
  if (existing.includes(value)) return { ok: true, skipped: true };
  sheet.appendRow([value]);
  return { ok: true };
}

// HakAkses disimpan sebagai matriks (baris=role, kolom=modul) -> dibaca jadi { Owner: {...}, Admin: {...} }
function readHakAkses() {
  const sheet = getSheet('HakAkses');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const result = {};
  values.slice(1).forEach(row => {
    const role = row[0];
    if (!role) return;
    const modul = {};
    headers.slice(1).forEach((h, i) => { modul[h] = row[i + 1] === true || row[i + 1] === 'TRUE'; });
    result[role] = modul;
  });
  return result;
}

function addRow(table, row) {
  const sheet = getSheet(table);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let newId = row.id;
  if (newId === undefined || newId === null) {
    // Fallback: cuma dipakai kalau client tidak kirim id (harusnya selalu kirim).
    const lastRow = sheet.getLastRow();
    const existingIds = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().filter(v => v !== '') : [];
    newId = (existingIds.length ? Math.max(...existingIds) : 0) + 1;
  }
  const fullRow = { ...row, id: newId };
  sheet.appendRow(headers.map(h => stringifyCell(fullRow[h])));
  return { ok: true, id: newId };
}

function updateHakAkses(role, modul, value) {
  const sheet = getSheet('HakAkses');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const modulCol = headers.indexOf(modul);
  if (modulCol < 0) return { error: 'Modul tidak dikenal: ' + modul };
  for (let r = 1; r < values.length; r++) {
    if (values[r][0] === role) {
      sheet.getRange(r + 1, modulCol + 1).setValue(value);
      return { ok: true };
    }
  }
  return { error: 'Role tidak ditemukan: ' + role };
}

/**
 * Lupa password: cari akun berdasarkan email di sheet Pengguna, buat password
 * sementara acak, simpan ke kolom "password", kirim ke email itu lewat MailApp
 * (dikirim dari akun Google pemilik Apps Script ini — tidak butuh layanan email lain).
 */
function forgotPassword(email) {
  if (!email) return { error: 'Email wajib diisi.' };
  const sheet = getSheet('Pengguna');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const emailCol = headers.indexOf('email');
  const namaCol = headers.indexOf('nama');
  const statusCol = headers.indexOf('status');
  const passCol = headers.indexOf('password');

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][emailCol]).toLowerCase() === String(email).toLowerCase()) {
      if (values[r][statusCol] !== 'Aktif') return { error: 'Akun ini nonaktif — hubungi Owner/Admin.' };
      const nama = values[r][namaCol];
      const passwordBaru = Math.random().toString(36).slice(-4).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
      sheet.getRange(r + 1, passCol + 1).setValue(passwordBaru);

      MailApp.sendEmail({
        to: email,
        subject: 'Password Baru — Sistem Percetakan',
        body:
          'Halo ' + nama + ',\n\n' +
          'Anda meminta reset password. Password sementara Anda:\n\n' +
          '    ' + passwordBaru + '\n\n' +
          'Gunakan ini untuk login, lalu segera ganti lewat halaman Profil Saya.\n\n' +
          'Kalau Anda tidak meminta ini, abaikan saja email ini — password lama Anda tidak berubah kecuali lewat proses ini.',
      });
      return { ok: true };
    }
  }
  return { error: 'Email tidak ditemukan di sistem.' };
}

function updateRow(table, id, patch) {
  const sheet = getSheet(table);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf('id');
  for (let r = 1; r < values.length; r++) {
    if (values[r][idCol] === id) {
      headers.forEach((h, c) => {
        if (patch[h] !== undefined) sheet.getRange(r + 1, c + 1).setValue(stringifyCell(patch[h]));
      });
      return { ok: true };
    }
  }
  return { error: 'id ' + id + ' tidak ditemukan di ' + table };
}

function deleteRow(table, id) {
  const sheet = getSheet(table);
  const values = sheet.getDataRange().getValues();
  const idCol = values[0].indexOf('id');
  for (let r = 1; r < values.length; r++) {
    if (values[r][idCol] === id) { sheet.deleteRow(r + 1); return { ok: true }; }
  }
  return { error: 'id ' + id + ' tidak ditemukan di ' + table };
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
