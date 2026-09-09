import { useState } from 'react';
import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function HutangBayarModal({ hutang, onClose }) {
  const { data, updateRow, addBukuKasEntry } = useData();
  const [jumlah, setJumlah] = useState(hutang.sisa);

  function handleSubmit(e) {
    e.preventDefault();
    if (jumlah <= 0 || jumlah > hutang.sisa) { alert(`Jumlah harus antara Rp1 dan Rp${fmt(hutang.sisa)}.`); return; }

    const sisaBaru = hutang.sisa - jumlah;
    updateRow('hutang', hutang.id, {
      dibayar: hutang.dibayar + jumlah, sisa: sisaBaru,
      status: sisaBaru <= 0 ? 'Lunas' : 'Belum Lunas',
    });
    addBukuKasEntry('Keluar', jumlah, `Bayar hutang ${hutang.noPO} — ${hutang.supplier}`);

    // Ikut perbarui status Pembelian aslinya kalau sudah lunas total.
    if (sisaBaru <= 0) {
      const pembelianRow = data.pembelian.find(p => p.noPO === hutang.noPO);
      if (pembelianRow) updateRow('pembelian', pembelianRow.id, { status: 'Lunas' });
    }

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-head">
          <b>Bayar Hutang — {hutang.supplier}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
            <span>No. PO / Nota</span><span>{hutang.noPO} / {hutang.noNotaSupplier}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 12 }}>
            <span>Sisa Hutang</span><b style={{ color: 'var(--total-red)' }}>Rp{fmt(hutang.sisa)}</b>
          </div>
          <div className="f-field">
            <label>Jumlah Dibayar (Rp)</label>
            <input type="number" min="1" max={hutang.sisa} value={jumlah} onChange={e => setJumlah(Number(e.target.value))} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '-6px 0 14px' }}>
            Otomatis tercatat sebagai Kas Keluar di Buku Kas.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-gold">Bayar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
