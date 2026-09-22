import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';
import Icon from '../../components/common/Icon';

function tierLabel(tier, satuan) {
  const s = satuan || '';
  if (tier.max == null) return `>${tier.min > 0 ? tier.min - 1 : 0} ${s}`.trim();
  return `${tier.min}-${tier.max} ${s}`.trim();
}

const DEFAULT_MATRIX = {
  satuan: 'Lembar',
  tiers: [{ min: 1, max: 10 }, { min: 11, max: 25 }, { min: 26, max: null }],
  bahan: [],
};

export default function MatrixHargaModal({ produk, onClose }) {
  const { updateRow } = useData();
  const { notifySuccess } = useNotify();
  const [m, setM] = useState(() => produk.hargaMatrix ? JSON.parse(JSON.stringify(produk.hargaMatrix)) : JSON.parse(JSON.stringify(DEFAULT_MATRIX)));

  function updateTier(i, patch) {
    setM(prev => ({ ...prev, tiers: prev.tiers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) }));
  }
  function addTier() {
    setM(prev => {
      const last = prev.tiers[prev.tiers.length - 1];
      const newMin = last ? (last.max != null ? last.max + 1 : last.min + 1) : 1;
      return {
        ...prev,
        tiers: [...prev.tiers, { min: newMin, max: null }],
        bahan: prev.bahan.map(b => ({ ...b, harga: [...b.harga, { satu: 0, dua: 0 }] })),
      };
    });
  }
  function removeTier(i) {
    setM(prev => ({
      ...prev,
      tiers: prev.tiers.filter((_, idx) => idx !== i),
      bahan: prev.bahan.map(b => ({ ...b, harga: b.harga.filter((_, idx) => idx !== i) })),
    }));
  }

  function addBahanRow() {
    setM(prev => ({ ...prev, bahan: [...prev.bahan, { nama: 'Bahan Baru', harga: prev.tiers.map(() => ({ satu: 0, dua: 0 })) }] }));
  }
  function removeBahanRow(i) {
    setM(prev => ({ ...prev, bahan: prev.bahan.filter((_, idx) => idx !== i) }));
  }
  function updateBahanNama(i, nama) {
    setM(prev => ({ ...prev, bahan: prev.bahan.map((b, idx) => (idx === i ? { ...b, nama } : b)) }));
  }
  function updatePrice(bahanIdx, tierIdx, sisi, value) {
    setM(prev => ({
      ...prev,
      bahan: prev.bahan.map((b, bi) => (bi !== bahanIdx ? b : {
        ...b,
        harga: b.harga.map((h, ti) => (ti !== tierIdx ? h : { ...h, [sisi]: parseFloat(value) || 0 })),
      })),
    }));
  }

  function handleSave() {
    updateRow('produk', produk.id, { hargaMatrix: m });
    notifySuccess(`Matriks harga ${produk.nama} tersimpan (${m.bahan.length} bahan, ${m.tiers.length} tingkatan).`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card matrix-modal">
        <div className="modal-head">
          <b>Matriks Harga — {produk.nama}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <p className="trans-sub">
          Harga otomatis berbeda sesuai jenis bahan, tingkatan jumlah, dan sisi cetak. Rentang tingkatan &amp;
          satuan bisa disesuaikan untuk produk apa pun — bukan cuma yang satuannya Lembar.
        </p>

        <div className="f-field">
          <label>Satuan Hitung</label>
          <input type="text" value={m.satuan} onChange={e => setM(prev => ({ ...prev, satuan: e.target.value }))} placeholder="mis. Lembar, Pcs, Meter" />
        </div>

        <label className="mtx-section-label">Tingkatan Jumlah</label>
        <div className="mtx-tier-editor">
          {m.tiers.map((t, i) => (
            <div className="mtx-tier-row" key={i}>
              <span className="mtx-tier-idx">Tingkat {i + 1}</span>
              <span className="mtx-tier-lbl">Dari</span>
              <input type="number" min="0" value={t.min} onChange={e => updateTier(i, { min: parseInt(e.target.value) || 0 })} />
              <span className="mtx-tier-lbl">Sampai</span>
              <input type="number" min="0" value={t.max == null ? '' : t.max} placeholder="—" disabled={t.max == null} onChange={e => updateTier(i, { max: parseInt(e.target.value) || 0 })} />
              <label className="mtx-tier-unlimited">
                <input type="checkbox" checked={t.max == null} onChange={e => updateTier(i, { max: e.target.checked ? null : (t.min || 0) })} />
                Tanpa batas
              </label>
              <button type="button" className="mtx-remove-tier" title="Hapus tingkatan" onClick={() => removeTier(i)}><Icon name="trash" size={12} /></button>
            </div>
          ))}
          <button type="button" className="btn-add-top" onClick={addTier}>+ Tambah Tingkatan</button>
        </div>

        <label className="mtx-section-label">Tabel Harga per Bahan</label>
        <p className="trans-sub" style={{ margin: '-4px 0 10px' }}>Kosongkan sel (atau isi 0) untuk opsi yang tidak tersedia — akan tampil sebagai "-".</p>
        <div className="matrix-table-wrap">
          <table className="matrix-table">
            <thead>
              <tr>
                <th rowSpan={2}>Jenis Bahan</th>
                {m.tiers.map((t, i) => <th key={i} colSpan={2}>{tierLabel(t, m.satuan)}</th>)}
                <th rowSpan={2}></th>
              </tr>
              <tr>
                {m.tiers.map((_, i) => <><th key={`s${i}`}>Satu Sisi</th><th key={`d${i}`}>Dua Sisi</th></>)}
              </tr>
            </thead>
            <tbody>
              {m.bahan.map((b, bi) => (
                <tr key={bi}>
                  <td className="mtx-bahan-name"><input type="text" value={b.nama} onChange={e => updateBahanNama(bi, e.target.value)} /></td>
                  {m.tiers.map((_, ti) => (
                    <>
                      <td key={`s${ti}`}><input type="text" value={b.harga[ti]?.satu || ''} onChange={e => updatePrice(bi, ti, 'satu', e.target.value)} /></td>
                      <td key={`d${ti}`}><input type="text" value={b.harga[ti]?.dua || ''} onChange={e => updatePrice(bi, ti, 'dua', e.target.value)} /></td>
                    </>
                  ))}
                  <td className="mtx-remove-cell"><button type="button" className="mtx-remove-row" onClick={() => removeBahanRow(bi)}><Icon name="trash" size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn-add-top" style={{ marginTop: 10 }} onClick={addBahanRow}>+ Tambah Jenis Bahan</button>

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
          <button type="button" className="btn-gold" onClick={handleSave}>Simpan Matriks</button>
        </div>
      </div>
    </div>
  );
}
