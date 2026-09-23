import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  seedPelanggan, seedSupplier, seedProduk, seedBahanBaku,
  seedPromosi, seedKampanye, seedLeads,
  seedSettings, seedPengguna, seedNotifikasi, seedAuditTrail, seedHakAkses,
  seedPenjualan, seedProduksi, seedStokLedger, seedPembelian, seedHppCalc, seedStokOpname, seedHutang,
  seedStrategiMarketing, seedAnggaranMarketing, STRATEGI_JENIS_LIST_DEFAULT, PELANGGAN_KATEGORI_DEFAULT,
} from '../data/seedData';
import { todayID } from '../utils/dateUtils';
import {
  fetchAllTables, addRowRemote, updateRowRemote, deleteRowRemote,
  setKvRemote, addToListRemote, toggleHakAksesRemote,
} from '../data/sheetsAdapter';
import SkeletonLoader from '../components/common/SkeletonLoader';

const DataContext = createContext(null);

const SHEETS_ON = !!import.meta.env.VITE_SHEETS_API_URL;

// Kunci di `data` yang punya tabel sendiri di Sheets (dipetakan sheetsAdapter.TABLE_NAME).
// posDraft & rekonsiliasiKas & piutang sengaja mulai kosong lokal juga kalau Sheets belum ada baris untuknya.
function seedLocalData() {
  return {
    pelanggan: seedPelanggan, supplier: seedSupplier, produk: seedProduk, bahanBaku: seedBahanBaku,
    promosi: seedPromosi, kampanye: seedKampanye, leads: seedLeads,
    pengguna: seedPengguna, notifikasi: seedNotifikasi, auditTrail: seedAuditTrail,
    penjualan: seedPenjualan, produksi: seedProduksi, stokLedger: seedStokLedger,
    pembelian: seedPembelian, hppCalc: seedHppCalc, strategiMarketing: seedStrategiMarketing,
    stokOpname: seedStokOpname, posDraft: [], hutang: seedHutang, piutang: [], rekonsiliasiKas: [],
  };
}

export function DataProvider({ children }) {
  const [data, setData] = useState(seedLocalData);
  const [settings, setSettings] = useState(seedSettings);
  const [hakAkses, setHakAkses] = useState(seedHakAkses);
  const [anggaranMarketing, setAnggaranMarketing] = useState(seedAnggaranMarketing);
  const [strategiJenisList, setStrategiJenisList] = useState(STRATEGI_JENIS_LIST_DEFAULT);
  const [pelangganKategoriList, setPelangganKategoriList] = useState(PELANGGAN_KATEGORI_DEFAULT);
  const [bukuKas, setBukuKas] = useState([]);

  const [sheetsLoading, setSheetsLoading] = useState(SHEETS_ON);
  const settingsSyncTimers = useRef({});
  const [sheetsError, setSheetsError] = useState(null);

  // ===== Ambil semua data dari Google Sheets sekali di awal (kalau tersambung) =====
  useEffect(() => {
    if (!SHEETS_ON) return;
    let batal = false;
    (async () => {
      try {
        const all = await fetchAllTables();
        if (batal) return;
        setData(prev => ({
          ...prev,
          pelanggan: all.pelanggan ?? [], supplier: all.supplier ?? [], produk: all.produk ?? [],
          bahanBaku: all.bahanBaku ?? [], promosi: all.promosi ?? [], kampanye: all.kampanye ?? [],
          leads: all.leads ?? [], notifikasi: all.notifikasi ?? [],
          // pengguna sengaja TIDAK ditimpa kalau Sheets masih kosong — supaya tetap ada
          // akun Owner default buat login, sampai Anda isi tab Pengguna di Sheet sungguhan.
          pengguna: all.pengguna?.length > 0 ? all.pengguna : prev.pengguna,
          auditTrail: all.auditTrail ?? [], penjualan: all.penjualan ?? [], produksi: all.produksi ?? [],
          stokLedger: all.stokLedger ?? [], pembelian: all.pembelian ?? [], hppCalc: all.hppCalc ?? [],
          strategiMarketing: all.strategiMarketing ?? [], stokOpname: all.stokOpname ?? [],
          posDraft: all.posDraft ?? [], hutang: all.hutang ?? [], piutang: all.piutang ?? [],
          rekonsiliasiKas: all.rekonsiliasiKas ?? [],
        }));
        if (all.settings && Object.keys(all.settings).length > 0) setSettings(prev => ({ ...prev, ...all.settings }));
        if (all.hakAkses && Object.keys(all.hakAkses).length > 0) setHakAkses(all.hakAkses);
        if (all.anggaranMarketing && Object.keys(all.anggaranMarketing).length > 0) setAnggaranMarketing(all.anggaranMarketing);
        if (all.strategiJenisList?.length > 0) setStrategiJenisList(all.strategiJenisList);
        if (all.pelangganKategoriList?.length > 0) setPelangganKategoriList(all.pelangganKategoriList);
        setBukuKas(all.bukuKas ?? []);
      } catch (err) {
        console.error('Gagal memuat data dari Google Sheets, tetap pakai data lokal:', err);
        if (!batal) setSheetsError(err.message || 'Gagal memuat dari Google Sheets');
      } finally {
        if (!batal) setSheetsLoading(false);
      }
    })();
    return () => { batal = true; };
  }, []);

  // Sinkron ke Sheets di belakang layar — gagal cuma dicatat di console, tidak mengganggu pemakaian lokal.
  function syncBackground(promise) {
    if (!SHEETS_ON) return;
    promise.catch(err => console.error('Gagal sinkron ke Google Sheets:', err));
  }

  // Tambah baris baru — id otomatis (max id + 1) dihitung di sini (client), lalu dikirim
  // apa adanya ke Sheets supaya id lokal & Sheets selalu sama persis.
  const addRow = useCallback((key, row) => {
    let newRow;
    setData(prev => {
      const arr = prev[key];
      const ids = arr.map(r => r.id);
      const newId = (ids.length ? Math.max(...ids) : 0) + 1;
      newRow = { id: newId, ...row };
      return { ...prev, [key]: [newRow, ...arr] };
    });
    syncBackground(addRowRemote(key, newRow));
  }, []);

  const updateRow = useCallback((key, id, patch) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].map(r => (r.id === id ? { ...r, ...patch } : r)),
    }));
    syncBackground(updateRowRemote(key, id, patch));
  }, []);

  const deleteRow = useCallback((key, id) => {
    setData(prev => ({ ...prev, [key]: prev[key].filter(r => r.id !== id) }));
    syncBackground(deleteRowRemote(key, id));
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
    if (SHEETS_ON) {
      Object.entries(patch).forEach(([k, v]) => {
        // Debounce per-field — kalau field ini diketik lagi sebelum 900ms, batalkan
        // kiriman lama dan tunggu lagi. Cegah puluhan request race per huruf yang diketik.
        if (settingsSyncTimers.current[k]) clearTimeout(settingsSyncTimers.current[k]);
        settingsSyncTimers.current[k] = setTimeout(() => {
          syncBackground(setKvRemote('settings', k, v));
          delete settingsSyncTimers.current[k];
        }, 900);
      });
    }
  }, []);

  const toggleHakAkses = useCallback((role, mod) => {
    let newValue;
    setHakAkses(prev => {
      newValue = !prev[role][mod];
      return { ...prev, [role]: { ...prev[role], [mod]: newValue } };
    });
    syncBackground(toggleHakAksesRemote(role, mod, newValue));
  }, []);

  /**
   * Fungsi inti pergerakan stok — portir dari addStokMovement() versi HTML.
   * Dipanggil modul lain (Pembelian, Kalkulasi HPP, Pengurangan Manual) untuk
   * menambah/mengurangi stok bahan baku SEKALIGUS mencatatnya ke Kartu Stok.
   */
  const addStokMovement = useCallback((bahanNama, tipe, qty, satuan, referensi, keterangan) => {
    let entry, bahanUpdate;
    setData(prev => {
      const bahanBaku = prev.bahanBaku.map(b => {
        if (b.nama !== bahanNama) return b;
        bahanUpdate = { id: b.id, stok: b.stok + (tipe === 'Masuk' ? qty : -qty) };
        return { ...b, stok: bahanUpdate.stok };
      });
      const ledgerIds = prev.stokLedger.map(r => r.id);
      const newId = (ledgerIds.length ? Math.max(...ledgerIds) : 0) + 1;
      entry = { id: newId, tanggal: todayID(), bahan: bahanNama, tipe, qty, satuan, referensi, keterangan };
      return { ...prev, bahanBaku, stokLedger: [entry, ...prev.stokLedger] };
    });
    syncBackground(addRowRemote('stokLedger', entry));
    if (bahanUpdate) syncBackground(updateRowRemote('bahanBaku', bahanUpdate.id, { stok: bahanUpdate.stok }));
  }, []);

  const addBukuKasEntry = useCallback((tipe, jumlah, keterangan, metodeBayar) => {
    const jenisKas = metodeBayar === 'Tunai' ? 'Toko' : metodeBayar ? 'Bank' : 'Toko';
    let entry;
    setBukuKas(prev => {
      const ids = prev.map(r => r.id);
      const newId = (ids.length ? Math.max(...ids) : 0) + 1;
      entry = { id: newId, tanggal: todayID(), tipe, jumlah, keterangan, jenisKas };
      return [entry, ...prev];
    });
    syncBackground(addRowRemote('bukuKas', entry));
  }, []);

  const addStrategiJenis = useCallback((jenis) => {
    setStrategiJenisList(prev => (prev.includes(jenis) ? prev : [...prev, jenis]));
    syncBackground(addToListRemote('strategiJenisList', jenis));
  }, []);

  const addPelangganKategori = useCallback((kategori) => {
    setPelangganKategoriList(prev => (prev.includes(kategori) ? prev : [...prev, kategori]));
    syncBackground(addToListRemote('pelangganKategoriList', kategori));
  }, []);

  if (sheetsLoading) {
    return <SkeletonLoader />;
  }

  return (
    <DataContext.Provider value={{
      data, addRow, updateRow, deleteRow,
      settings, updateSettings, hakAkses, toggleHakAkses, addStokMovement,
      bukuKas, addBukuKasEntry,
      anggaranMarketing, strategiJenisList, addStrategiJenis,
      pelangganKategoriList, addPelangganKategori,
      sheetsError,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData harus dipakai di dalam <DataProvider>');
  return ctx;
}
