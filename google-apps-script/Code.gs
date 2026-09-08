/**
 * Percetakan Jaya — Backend Google Apps Script
 * Diletakkan (paste) di Extensions > Apps Script pada Google Sheet database.
 *
 * Struktur Sheet yang dibutuhkan (1 tab per modul, baris 1 = nama kolom):
 *   Pelanggan   : id, nama, kontak, alamat, kota, kategori, marketingTerkait
 *   Supplier    : id, nama, pic, tipeSupplier, kategoriBahan, kontak, alamat, kota
 *   Produk      : id, nama, kategori, satuan, harga, tipe
 *   BahanBaku   : id, nama, satuan, hargaBeli, supplier, stokMinimum, stok
 *   Promosi     : id, namaPromo, jenis, nilai, periode, status
 *   Kampanye    : id, namaKampanye, channel, tanggal, status
 *   Leads       : id, namaLead, sumber, kontak, status
 *
 * Setelah paste kode ini:
 *   Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone
 *   Salin URL yang muncul, itu yang dipakai di file .env React (VITE_SHEETS_API_URL).
 */

const SHEET_NAMES = ['Pelanggan', 'Supplier', 'Produk', 'BahanBaku', 'Promosi', 'Kampanye', 'Leads'];

function doGet(e) {
  const table = e.parameter.table;
  if (table) return jsonOut(readTable(table));
  const all = {};
  SHEET_NAMES.forEach(name => { all[toKey(name)] = readTable(name); });
  return jsonOut(all);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const { action, table, id, row } = body;
  if (!SHEET_NAMES.includes(table)) return jsonOut({ error: 'Tabel tidak dikenal: ' + table });

  if (action === 'add') return jsonOut(addRow(table, row));
  if (action === 'update') return jsonOut(updateRow(table, id, row));
  if (action === 'delete') return jsonOut(deleteRow(table, id));
  return jsonOut({ error: 'Aksi tidak dikenal: ' + action });
}

function toKey(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function getSheet(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Sheet "' + name + '" tidak ditemukan.');
  return sheet;
}

function readTable(name) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function addRow(table, row) {
  const sheet = getSheet(table);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const existingIds = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat()
    : [];
  const newId = (existingIds.length ? Math.max(...existingIds) : 0) + 1;
  const fullRow = { id: newId, ...row };
  sheet.appendRow(headers.map(h => fullRow[h] ?? ''));
  return { ok: true, id: newId };
}

function updateRow(table, id, patch) {
  const sheet = getSheet(table);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf('id');
  for (let r = 1; r < values.length; r++) {
    if (values[r][idCol] === id) {
      headers.forEach((h, c) => {
        if (patch[h] !== undefined) sheet.getRange(r + 1, c + 1).setValue(patch[h]);
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
    if (values[r][idCol] === id) {
      sheet.deleteRow(r + 1);
      return { ok: true };
    }
  }
  return { error: 'id ' + id + ' tidak ditemukan di ' + table };
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
