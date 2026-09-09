import { createContext, useContext, useState, useCallback } from 'react';
import {
  seedPelanggan, seedSupplier, seedProduk, seedBahanBaku,
  seedPromosi, seedKampanye, seedLeads,
  seedSettings, seedPengguna, seedNotifikasi, seedAuditTrail, seedHakAkses,
  seedPenjualan, seedProduksi, seedStokLedger, seedPembelian, seedHppCalc,
  seedStrategiMarketing, seedAnggaranMarketing, STRATEGI_JENIS_LIST_DEFAULT,
} from '../data/seedData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState({
    pelanggan: seedPelanggan,
    supplier: seedSupplier,
    produk: seedProduk,
    bahanBaku: seedBahanBaku,
    promosi: seedPromosi,
    kampanye: seedKampanye,
    leads: seedLeads,
    pengguna: seedPengguna,
    notifikasi: seedNotifikasi,
    auditTrail: seedAuditTrail,
    penjualan: seedPenjualan,
    produksi: seedProduksi,
    stokLedger: seedStokLedger,
    pembelian: seedPembelian,
    hppCalc: seedHppCalc,
    strategiMarketing: seedStrategiMarketing,
  });
  const [settings, setSettings] = useState(seedSettings);
  const [hakAkses, setHakAkses] = useState(seedHakAkses);
  const [anggaranMarketing] = useState(seedAnggaranMarketing);
  const [strategiJenisList, setStrategiJenisList] = useState(STRATEGI_JENIS_LIST_DEFAULT);
  // Buku Kas belum punya halaman sendiri (Fase 7) — tapi transaksi Lunas/DP di POS
  // dan Pembelian Lunas sudah otomatis tercatat ke sini dari sekarang.
  const [bukuKas, setBukuKas] = useState([]);

  // Tambah baris baru — id otomatis (max id + 1), sama seperti pola versi HTML.
  const addRow = useCallback((key, row) => {
    setData(prev => {
      const arr = prev[key];
      const ids = arr.map(r => r.id);
      const newId = (ids.length ? Math.max(...ids) : 0) + 1;
      return { ...prev, [key]: [{ id: newId, ...row }, ...arr] };
    });
  }, []);

  const updateRow = useCallback((key, id, patch) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].map(r => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const deleteRow = useCallback((key, id) => {
    setData(prev => ({ ...prev, [key]: prev[key].filter(r => r.id !== id) }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const toggleHakAkses = useCallback((role, mod) => {
    setHakAkses(prev => ({ ...prev, [role]: { ...prev[role], [mod]: !prev[role][mod] } }));
  }, []);

  /**
   * Fungsi inti pergerakan stok — portir dari addStokMovement() versi HTML.
   * Dipanggil modul lain (Pembelian, Kalkulasi HPP, Pengurangan Manual) untuk
   * menambah/mengurangi stok bahan baku SEKALIGUS mencatatnya ke Kartu Stok.
   */
  const addStokMovement = useCallback((bahanNama, tipe, qty, satuan, referensi, keterangan) => {
    setData(prev => {
      const bahanBaku = prev.bahanBaku.map(b =>
        b.nama === bahanNama ? { ...b, stok: b.stok + (tipe === 'Masuk' ? qty : -qty) } : b
      );
      const ledgerIds = prev.stokLedger.map(r => r.id);
      const newId = (ledgerIds.length ? Math.max(...ledgerIds) : 0) + 1;
      const entry = {
        id: newId, tanggal: '12 Agu 2026', bahan: bahanNama, tipe, qty, satuan, referensi, keterangan,
      };
      return { ...prev, bahanBaku, stokLedger: [entry, ...prev.stokLedger] };
    });
  }, []);

  const addBukuKasEntry = useCallback((tipe, jumlah, keterangan) => {
    setBukuKas(prev => [{ id: prev.length + 1, tanggal: '12 Agu 2026', tipe, jumlah, keterangan }, ...prev]);
  }, []);

  const addStrategiJenis = useCallback((jenis) => {
    setStrategiJenisList(prev => (prev.includes(jenis) ? prev : [...prev, jenis]));
  }, []);

  return (
    <DataContext.Provider value={{
      data, addRow, updateRow, deleteRow,
      settings, updateSettings, hakAkses, toggleHakAkses, addStokMovement,
      bukuKas, addBukuKasEntry,
      anggaranMarketing, strategiJenisList, addStrategiJenis,
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
