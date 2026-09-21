import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';

export default function SpkEditModal({ spk, onClose }) {
  const { data, updateRow } = useData();
  const { notifyError, notifySuccess } = useNotify();

  const [produk, setProduk] = useState(spk.produk);
  const [pelanggan, setPelanggan] = useState(spk.pelanggan);
  const [target, setTarget] = useState(spk.target);
  const [pic, setPic] = useState(spk.pic);
  const [detail, setDetail] = useState(spk.detail || '');

  function handleSubmit(e) {
    e.preventDefault();
    if (!produk.trim() || !pelanggan.trim() || !target.trim() || !pic.trim()) {
      notifyError('Produk, Pelanggan, Target, dan PIC wajib diisi.');
      return;
    }
    updateRow('produksi', spk.id, { produk: produk.trim(), pelanggan: pelanggan.trim(), target: target.trim(), pic, detail });
    notifySuccess(`SPK ${spk.noOrder} berhasil diperbarui.`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-head">
          <b>Edit SPK — {spk.noOrder}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        <div className="f-row2">
          <div className="f-field"><label>No. SPK</label><input value={spk.noOrder} disabled /></div>
          <div className="f-field"><label>No. Nota</label><input value={spk.noNota || '— (tanpa nota)'} disabled /></div>
        </div>
        <p style={{ fontSize: 10.5, color: 'var(--text-faint)', margin: '-8px 0 14px' }}>
          No. SPK, No. Nota, dan Tahap tidak bisa diubah dari sini — Tahap diatur lewat Kanban di Alur SPK.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="f-field">
            <label>Produk</label>
            <input value={produk} onChange={e => setProduk(e.target.value)} />
          </div>
          <div className="f-field">
            <label>Pelanggan</label>
            <input value={pelanggan} onChange={e => setPelanggan(e.target.value)} />
          </div>
          <div className="f-row2">
            <div className="f-field">
              <label>Target</label>
              <input value={target} onChange={e => setTarget(e.target.value)} placeholder="mis. 25 Agu 2026" />
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
            <button type="submit" className="btn-gold">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
