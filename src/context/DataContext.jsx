import { createContext, useContext, useState, useCallback } from 'react';
import {
  seedPelanggan, seedSupplier, seedProduk, seedBahanBaku,
  seedPromosi, seedKampanye, seedLeads,
  seedSettings, seedPengguna, seedNotifikasi, seedAuditTrail, seedHakAkses,
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
  });
  const [settings, setSettings] = useState(seedSettings);
  const [hakAkses, setHakAkses] = useState(seedHakAkses);

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

  return (
    <DataContext.Provider value={{ data, addRow, updateRow, deleteRow, settings, updateSettings, hakAkses, toggleHakAkses }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData harus dipakai di dalam <DataProvider>');
  return ctx;
}
