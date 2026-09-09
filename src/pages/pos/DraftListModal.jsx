import { useState } from 'react';
import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function DraftListModal({ onClose, onResume }) {
  const { data, updateRow, deleteRow } = useData();
  const [editId, setEditId] = useState(null);
  const [editCustomer, setEditCustomer] = useState('');
  const [editKode, setEditKode] = useState('');

  const marketers = data.pengguna.filter(p => p.role === 'Marketing' && p.status === 'Aktif');

  function startEdit(draft) {
    setEditId(draft.id);
    setEditCustomer(draft.customer);
    setEditKode(draft.kodeMarketing || '');
  }
  function saveEdit() {
    updateRow('posDraft', editId, { customer: editCustomer, kodeMarketing: editKode });
    setEditId(null);
  }
  function handleHapus(id) {
    if (confirm('Hapus draft ini? Tidak bisa dikembalikan.')) deleteRow('posDraft', id);
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 640 }}>
        <div className="modal-head">
          <b>Draft Transaksi Tersimpan</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <p className="page-sub" style={{ marginTop: -8, marginBottom: 12 }}>
          Cuma tersimpan sementara di perangkat ini — belum tercatat sebagai penjualan sampai dilanjutkan &amp; checkout.
        </p>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Tanggal</th><th>Pelanggan</th><th>Kode Marketing</th><th className="r">Item</th><th className="r">Subtotal</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {data.posDraft.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">Belum ada draft tersimpan.</td></tr>
              ) : data.posDraft.map(d => (
                editId === d.id ? (
                  <tr key={d.id}>
                    <td>{d.tanggal}</td>
                    <td>
                      <select value={editCustomer} onChange={e => setEditCustomer(e.target.value)} style={{ fontSize: 11.5, padding: '5px 7px' }}>
                        {data.pelanggan.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
                      </select>
                    </td>
                    <td>
                      <select value={editKode} onChange={e => setEditKode(e.target.value)} style={{ fontSize: 11.5, padding: '5px 7px' }}>
                        <option value="">— tanpa kode —</option>
                        {marketers.map(m => <option key={m.id} value={m.kodeMarketing}>{m.kodeMarketing}</option>)}
                      </select>
                    </td>
                    <td className="r">{d.items.length}</td>
                    <td className="r">Rp{fmt(d.subtotal)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn act-confirm" title="Simpan" onClick={saveEdit}>✓</button>
                        <button className="icon-btn" title="Batal" onClick={() => setEditId(null)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={d.id}>
                    <td>{d.tanggal}</td>
                    <td>{d.customer}</td>
                    <td>{d.kodeMarketing || <span style={{ color: 'var(--text-faint)' }}>—</span>}</td>
                    <td className="r">{d.items.length}</td>
                    <td className="r">Rp{fmt(d.subtotal)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn act-edit" title="Edit" onClick={() => startEdit(d)}>✎</button>
                        <button className="icon-btn act-delete" title="Hapus" onClick={() => handleHapus(d.id)}>🗑</button>
                        <button className="icon-btn act-confirm" title="Lanjutkan" onClick={() => onResume(d)}>▶</button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
