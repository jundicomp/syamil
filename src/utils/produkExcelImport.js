const HEADERS_TETAP = ['Nama', 'Kategori', 'Satuan', 'Harga'];
const CONTOH_TETAP = [
  ['Banner Flexi China', 'Banner', 'm²', 45000],
  ['Kartu Nama 1 Box', 'Cetak Digital', 'box', 45000],
];

const HEADERS_MATRIKS = ['Nama Produk', 'Kategori', 'Satuan', 'Tingkat Min', 'Tingkat Max', 'Bahan', 'Harga Satu Sisi', 'Harga Dua Sisi'];
// Baris dengan "Nama Produk" sama digabung jadi 1 produk — beberapa baris per produk,
// satu baris per kombinasi Tingkat×Bahan. Tingkat Max kosong = "tanpa batas".
const CONTOH_MATRIKS = [
  ['Print Laser', 'Cetak Digital', 'Lembar', 1, 10, 'HVS', 2000, 3200],
  ['Print Laser', 'Cetak Digital', 'Lembar', 1, 10, 'K120', 2200, 3500],
  ['Print Laser', 'Cetak Digital', 'Lembar', 11, 25, 'HVS', 1600, 2900],
  ['Print Laser', 'Cetak Digital', 'Lembar', 11, 25, 'K120', 1800, 3100],
  ['Print Laser', 'Cetak Digital', 'Lembar', 26, '', 'HVS', 1400, 2600],
  ['Print Laser', 'Cetak Digital', 'Lembar', 26, '', 'K120', 1600, 2700],
];

function headerRow(ws, headers) {
  headers.forEach((_, i) => {
    const ref = String.fromCharCode(65 + i) + '1';
    if (ws[ref]) ws[ref].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1E3A5F' } } };
  });
}

export async function downloadProdukTemplate() {
  const XLSX = await import('xlsx-js-style');
  const wb = XLSX.utils.book_new();

  const wsTetap = XLSX.utils.aoa_to_sheet([HEADERS_TETAP, ...CONTOH_TETAP]);
  wsTetap['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 12 }, { wch: 14 }];
  headerRow(wsTetap, HEADERS_TETAP);
  XLSX.utils.book_append_sheet(wb, wsTetap, 'Produk Tetap');

  const wsMatriks = XLSX.utils.aoa_to_sheet([HEADERS_MATRIKS, ...CONTOH_MATRIKS]);
  wsMatriks['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
  headerRow(wsMatriks, HEADERS_MATRIKS);
  XLSX.utils.book_append_sheet(wb, wsMatriks, 'Produk Matriks');

  XLSX.writeFile(wb, 'Template_Import_Produk.xlsx');
}

function parseTetapRows(rows) {
  const valid = [];
  const invalid = [];
  rows.forEach((r, i) => {
    const nama = String(r.Nama || r.nama || '').trim();
    const kategori = String(r.Kategori || r.kategori || '').trim();
    const satuan = String(r.Satuan || r.satuan || '').trim();
    const harga = Number(r.Harga ?? r.harga);
    const baris = i + 2;

    if (!nama) { invalid.push({ sheet: 'Produk Tetap', baris, alasan: 'Nama kosong' }); return; }
    if (!kategori) { invalid.push({ sheet: 'Produk Tetap', baris, alasan: 'Kategori kosong' }); return; }
    if (!satuan) { invalid.push({ sheet: 'Produk Tetap', baris, alasan: 'Satuan kosong' }); return; }
    if (!harga || harga <= 0 || Number.isNaN(harga)) { invalid.push({ sheet: 'Produk Tetap', baris, alasan: 'Harga tidak valid' }); return; }

    valid.push({ nama, kategori, satuan, harga, tipe: 'Tetap' });
  });
  return { valid, invalid };
}

function parseMatriksRows(rows) {
  const invalid = [];
  const groups = {}; // nama -> { kategori, satuan, tiers:[{min,max}], tierKeySet, bahan: { nama: { tierKey: {satu,dua} } } }

  rows.forEach((r, i) => {
    const baris = i + 2;
    const nama = String(r['Nama Produk'] || '').trim();
    const kategori = String(r['Kategori'] || '').trim();
    const satuan = String(r['Satuan'] || '').trim();
    const bahan = String(r['Bahan'] || '').trim();
    const minRaw = r['Tingkat Min'];
    const maxRaw = r['Tingkat Max'];
    const satuRaw = r['Harga Satu Sisi'];
    const duaRaw = r['Harga Dua Sisi'];

    if (!nama) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Nama Produk kosong' }); return; }
    if (!kategori) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Kategori kosong' }); return; }
    if (!satuan) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Satuan kosong' }); return; }
    if (!bahan) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Bahan kosong' }); return; }

    const min = (minRaw === '' || minRaw === undefined || minRaw === null) ? NaN : Number(minRaw);
    if (Number.isNaN(min) || min < 0) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Tingkat Min tidak valid' }); return; }
    const max = (maxRaw === '' || maxRaw === undefined || maxRaw === null) ? null : Number(maxRaw);
    if (max !== null && (Number.isNaN(max) || max < min)) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Tingkat Max tidak valid (kosongkan untuk "tanpa batas")' }); return; }

    const satu = satuRaw === '' || satuRaw === undefined ? 0 : Number(satuRaw);
    const dua = duaRaw === '' || duaRaw === undefined ? 0 : Number(duaRaw);
    if (Number.isNaN(satu) || Number.isNaN(dua)) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Harga Satu/Dua Sisi tidak valid' }); return; }
    if (satu <= 0 && dua <= 0) { invalid.push({ sheet: 'Produk Matriks', baris, alasan: 'Isi minimal salah satu: Harga Satu Sisi atau Dua Sisi' }); return; }

    if (!groups[nama]) groups[nama] = { kategori, satuan, tiers: [], tierKeySet: new Set(), bahan: {} };
    const g = groups[nama];
    const tierKey = min + '-' + (max ?? 'x');
    if (!g.tierKeySet.has(tierKey)) { g.tierKeySet.add(tierKey); g.tiers.push({ min, max }); }
    if (!g.bahan[bahan]) g.bahan[bahan] = {};
    g.bahan[bahan][tierKey] = { satu, dua };
  });

  const valid = Object.entries(groups).map(([nama, g]) => {
    const tiersSorted = [...g.tiers].sort((a, b) => a.min - b.min);
    const bahanList = Object.entries(g.bahan).map(([bahanNama, hargaMap]) => ({
      nama: bahanNama,
      harga: tiersSorted.map(t => hargaMap[t.min + '-' + (t.max ?? 'x')] || { satu: 0, dua: 0 }),
    }));
    return {
      nama, kategori: g.kategori, satuan: g.satuan, harga: 0, tipe: 'Matriks Harga',
      hargaMatrix: { satuan: g.satuan, tiers: tiersSorted, bahan: bahanList },
    };
  });

  return { valid, invalid, produkCount: valid.length };
}

/**
 * Baca file Excel yang diupload (2 sheet: "Produk Tetap" dan "Produk Matriks"),
 * kembalikan { valid, invalid, total } — valid siap ditambah lewat addRow('produk', ...).
 * Sheet Produk Matriks: baris dengan "Nama Produk" sama otomatis digabung jadi 1
 * produk dengan beberapa tingkatan × bahan.
 */
export async function parseProdukExcel(file) {
  const XLSX = await import('xlsx-js-style');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });

        const wsTetap = wb.Sheets['Produk Tetap'] || wb.Sheets[wb.SheetNames[0]];
        const rowsTetap = wsTetap ? XLSX.utils.sheet_to_json(wsTetap, { defval: '' }) : [];
        const hasilTetap = parseTetapRows(rowsTetap);

        const wsMatriks = wb.Sheets['Produk Matriks'];
        const rowsMatriks = wsMatriks ? XLSX.utils.sheet_to_json(wsMatriks, { defval: '' }) : [];
        const hasilMatriks = wsMatriks ? parseMatriksRows(rowsMatriks) : { valid: [], invalid: [], produkCount: 0 };

        resolve({
          valid: [...hasilTetap.valid, ...hasilMatriks.valid],
          invalid: [...hasilTetap.invalid, ...hasilMatriks.invalid],
          total: rowsTetap.length + rowsMatriks.length,
          matriksProdukCount: hasilMatriks.produkCount,
          matriksBarisCount: rowsMatriks.length,
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsArrayBuffer(file);
  });
}
