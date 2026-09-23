const HEADERS = ['Nama', 'Kategori', 'Satuan', 'Harga'];
const CONTOH = [
  ['Banner Flexi China', 'Banner', 'm²', 45000],
  ['Kartu Nama 1 Box', 'Cetak Digital', 'box', 45000],
];

export async function downloadProdukTemplate() {
  const XLSX = await import('xlsx-js-style');
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...CONTOH]);
  ws['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 12 }, { wch: 14 }];
  ['A1', 'B1', 'C1', 'D1'].forEach(ref => {
    ws[ref].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1E3A5F' } } };
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Produk');
  XLSX.writeFile(wb, 'Template_Import_Produk.xlsx');
}

/**
 * Baca file Excel yang diupload, kembalikan { valid, invalid } — valid siap ditambah
 * lewat addRow('produk', ...), invalid berisi alasan baris itu ditolak.
 * Catatan: import bulk cuma untuk tipe "Tetap" — produk Matriks Harga tetap harus
 * disiapkan satu-satu lewat halaman Produk (matriksnya butuh input tier+bahan).
 */
export async function parseProdukExcel(file) {
  const XLSX = await import('xlsx-js-style');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const valid = [];
        const invalid = [];
        rows.forEach((r, i) => {
          const nama = String(r.Nama || r.nama || '').trim();
          const kategori = String(r.Kategori || r.kategori || '').trim();
          const satuan = String(r.Satuan || r.satuan || '').trim();
          const harga = Number(r.Harga ?? r.harga);
          const baris = i + 2; // +2: baris 1 = header

          if (!nama) { invalid.push({ baris, alasan: 'Nama kosong' }); return; }
          if (!kategori) { invalid.push({ baris, alasan: 'Kategori kosong' }); return; }
          if (!satuan) { invalid.push({ baris, alasan: 'Satuan kosong' }); return; }
          if (!harga || harga <= 0 || Number.isNaN(harga)) { invalid.push({ baris, alasan: 'Harga tidak valid' }); return; }

          valid.push({ nama, kategori, satuan, harga, tipe: 'Tetap' });
        });
        resolve({ valid, invalid, total: rows.length });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsArrayBuffer(file);
  });
}
