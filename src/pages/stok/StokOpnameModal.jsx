import { useState } from 'react';
import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function StokOpnameModal({ existingRow, onClose }) {
  const { data, addRow, updateRow, addStokMovement } = useData();
  const initBahan = existingRow ? existingRow.bahan : (data.bahanBaku[0]?.nama ?? '');
  const initStokSistem = existingRow ? existingRow.stokSistem : (data.bahanBaku.find(b => b.nama === initBahan)?.stok ?? 0);

  const [bahan, setBahan] = useState(initBahan);
  const [stokSistem, setStokSistem] = useState(initStokSistem);
  const [stokFisik, setStokFisik] = useState(existingRow ? existingRow.stokFisik : initStokSistem);
  const [terapkan, setTerapkan] = useState(false);

  const selisih = (Number(stokFisik) || 0) - (Number(stokSistem) || 0);

  function handleBahanChange(nama) {
    const b = data.bahanBaku.find(x => x.nama === nama);
    setBahan(nama);
    setStokSistem(b?.stok ?? 0);
    setStokFisik(b?.stok ?? 0);
  }

  function handleSave() {
    if (existingRow) {
      updateRow('stokOpname', existingRow.id, { bahan, stokSistem: Number(stokSistem), stokFisik: Number(stokFisik), selisih });
    } else {
      addRow('stokOpname', { tanggal: '12 Agu 2026', bahan, stokSistem: Number(stokSistem), stokFisik: Number(stokFisik), selisih });
    }
    if (terapkan && selisih !== 0) {
      const bahanObj = data.bahanBaku.find(b => b.nama === bahan);
      addStokMovement(bahan, selisih > 0 ? 'Masuk' : 'Keluar', Math.abs(selisih), bahanObj?.satuan ?? '', 'OPNAME', 'Penyesuaian dari Stok Opname');
    }
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-head">
          <b>{existingRow ? 'Edit' : 'Tambah'} Stok Opname</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <div className="f-field">
          <label>Bahan</label>
          <select value={bahan} onChange={e => handleBahanChange(e.target.value)}>
            {data.bahanBaku.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
          </select>
        </div>
        <div className="f-row2">
          <div className="f-field"><label>Stok Sistem</label><input value={fmt(stokSistem)} disabled /></div>
          <div className="f-field"><label>Stok Fisik</label><input type="number" value={stokFisik} onChange={e => setStokFisik(e.target.value)} /></div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 9,
          background: selisih !== 0 ? 'var(--total-red-bg)' : 'var(--panel-2)', marginBottom: 4,
        }}>
          <span style={{ fontSize: 12.5 }}>Selisih</span>
          <b style={{ color: selisih !== 0 ? 'var(--total-red)' : 'var(--text)' }}>{selisih > 0 ? '+' : ''}{fmt(selisih)}</b>
        </div>
        {selisih !== 0 && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--text-soft)', margin: '10px 2px 4px', cursor: 'pointer' }}>
            <input type="checkbox" checked={terapkan} onChange={e => setTerapkan(e.target.checked)} />
            Terapkan penyesuaian ini ke Stok Sistem sekarang (stok bahan baku akan disesuaikan jadi {fmt(stokFisik)})
          </label>
        )}
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
          <button type="button" className="btn-gold" onClick={handleSave}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
