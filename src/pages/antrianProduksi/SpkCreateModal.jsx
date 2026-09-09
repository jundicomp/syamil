import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function SpkCreateModal({ onClose }) {
  const { data, addRow } = useData();
  const [noNota, setNoNota] = useState(data.penjualan[0]?.noNota ?? '');
  const [produk, setProduk] = useState(data.produk[0]?.nama ?? '');
  const [target, setTarget] = useState('');
  const [pic, setPic] = useState(data.pengguna[0]?.nama ?? '');
  const [detail, setDetail] = useState('');

  const notaTerpilih = data.penjualan.find(p => p.noNota === noNota);

  function handleSubmit(e) {
    e.preventDefault();
    if (!target.trim()) { alert('Isi Target terlebih dahulu.'); return; }

    const ids = data.produksi.map(r => r.id);
    const nextNum = 91 + (ids.length ? Math.max(...ids) : 0);
    const noOrder = `PRD-${String(nextNum).padStart(4, '0')}`;

    addRow('produksi', {
      noOrder, statusSpk: 'Aktif', noNota, produk,
      pelanggan: notaTerpilih?.pelanggan ?? '-', tahap: 'Desain',
      target, pic, detail, dibuatOleh: 'Pak Budi', history: [],
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-head">
          <b>Ciptakan SPK Baru</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="f-field">
            <label>No. Nota</label>
            <select value={noNota} onChange={e => setNoNota(e.target.value)}>
              {data.penjualan.map(p => <option key={p.id} value={p.noNota}>{p.noNota} — {p.pelanggan}</option>)}
            </select>
          </div>
          <div className="f-field">
            <label>Pelanggan</label>
            <input value={notaTerpilih?.pelanggan ?? '-'} disabled />
          </div>
          <div className="f-field">
            <label>Produk</label>
            <select value={produk} onChange={e => setProduk(e.target.value)}>
              {data.produk.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
            </select>
          </div>
          <div className="f-row2">
            <div className="f-field">
              <label>Target</label>
              <input placeholder="mis. 15 Agu 2026" value={target} onChange={e => setTarget(e.target.value)} />
            </div>
            <div className="f-field">
              <label>PIC</label>
              <select value={pic} onChange={e => setPic(e.target.value)}>
                {data.pengguna.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
              </select>
            </div>
          </div>
          <div className="f-field">
            <label>Detail Pekerjaan</label>
            <textarea value={detail} onChange={e => setDetail(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-gold">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
