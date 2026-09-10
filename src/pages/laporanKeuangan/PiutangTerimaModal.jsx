import { useState } from 'react';
import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function PiutangTerimaModal({ piutang, onClose }) {
  const { data, updateRow, addBukuKasEntry } = useData();
  const [jumlah, setJumlah] = useState(piutang.sisa);
  const [metodeBayar, setMetodeBayar] = useState('Tunai');

  function handleSubmit(e) {
    e.preventDefault();
    if (jumlah <= 0 || jumlah > piutang.sisa) { alert(`Jumlah harus antara Rp1 dan Rp${fmt(piutang.sisa)}.`); return; }

    const sisaBaru = piutang.sisa - jumlah;
    updateRow('piutang', piutang.id, {
      dibayar: piutang.dibayar + jumlah, sisa: sisaBaru,
      status: sisaBaru <= 0 ? 'Lunas' : 'Belum Lunas',
    });
    addBukuKasEntry('Masuk', jumlah, `Terima pelunasan ${piutang.noNota} — ${piutang.pelanggan}`, metodeBayar);

    if (sisaBaru <= 0) {
      const penjualanRow = data.penjualan.find(p => p.noNota === piutang.noNota);
      if (penjualanRow) updateRow('penjualan', penjualanRow.id, { status: 'Lunas', sisaBayar: 0, dpDibayar: penjualanRow.total });
    }

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-head">
          <b>Terima Pelunasan — {piutang.pelanggan}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
            <span>No. Nota</span><span>{piutang.noNota}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 12 }}>
            <span>Sisa Piutang</span><b style={{ color: 'var(--total-red)' }}>Rp{fmt(piutang.sisa)}</b>
          </div>
          <div className="f-field">
            <label>Jumlah Diterima (Rp)</label>
            <input type="number" min="1" max={piutang.sisa} value={jumlah} onChange={e => setJumlah(Number(e.target.value))} />
          </div>
          <div className="f-field">
            <label>Metode Bayar</label>
            <select value={metodeBayar} onChange={e => setMetodeBayar(e.target.value)}>
              <option>Tunai</option>
              <option>Transfer</option>
              <option>QRIS</option>
            </select>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '-6px 0 14px' }}>
            Otomatis tercatat sebagai Kas Masuk di Buku Kas.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-gold">Terima</button>
          </div>
        </form>
      </div>
    </div>
  );
}
