import { useState } from 'react';
import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function PembelianCartModal({ onClose }) {
  const { data, addRow, addStokMovement, addBukuKasEntry } = useData();
  const [supplier, setSupplier] = useState(data.supplier[0]?.nama ?? '');
  const [status, setStatus] = useState('Belum Lunas');
  const [items, setItems] = useState([{ bahan: '', qty: 1, satuan: '', harga: 0 }]);

  const total = items.reduce((s, it) => s + it.qty * it.harga, 0);

  function updateItem(idx, patch) {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      const next = { ...it, ...patch };
      if (patch.bahan !== undefined) {
        const b = data.bahanBaku.find(x => x.nama === patch.bahan);
        if (b) { next.satuan = b.satuan; next.harga = b.hargaBeli; }
      }
      return next;
    }));
  }
  function addItemRow() {
    setItems(prev => [...prev, { bahan: '', qty: 1, satuan: '', harga: 0 }]);
  }
  function removeItemRow(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validItems = items.filter(it => it.bahan && it.qty > 0);
    if (validItems.length === 0) { alert('Tambahkan minimal 1 bahan.'); return; }

    const poIds = data.pembelian.map(r => r.id);
    const nextNum = 231 + (poIds.length ? Math.max(...poIds) : 0); // sekadar penomoran berjalan
    const noPO = `PO-${String(nextNum).padStart(4, '0')}`;

    addRow('pembelian', { tanggal: '12 Agu 2026', noPO, supplier, total, status, items: validItems });

    // Stok bertambah untuk tiap bahan yang dibeli — sekaligus tercatat di Kartu Stok.
    validItems.forEach(it => {
      addStokMovement(it.bahan, 'Masuk', it.qty, it.satuan, noPO, `Pembelian dari ${supplier}`);
    });

    if (status === 'Lunas') {
      addBukuKasEntry('Keluar', total, `Pembelian ${noPO} — ${supplier}`);
    }

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 560 }}>
        <div className="modal-head">
          <b>Order Pembelian Baru</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="f-row2">
            <div className="f-field">
              <label>Supplier</label>
              <select value={supplier} onChange={e => setSupplier(e.target.value)}>
                {data.supplier.map(s => <option key={s.id} value={s.nama}>{s.nama}</option>)}
              </select>
            </div>
            <div className="f-field">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option>Belum Lunas</option>
                <option>Lunas</option>
              </select>
            </div>
          </div>

          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-soft)', margin: '14px 0 8px' }}>
            Bahan Dibeli
          </label>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1.1fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <select value={it.bahan} onChange={e => updateItem(idx, { bahan: e.target.value })}>
                <option value="">Pilih bahan...</option>
                {data.bahanBaku.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
              </select>
              <input type="number" min="0" value={it.qty} onChange={e => updateItem(idx, { qty: Number(e.target.value) })} placeholder="Qty" />
              <input type="number" min="0" value={it.harga} onChange={e => updateItem(idx, { harga: Number(e.target.value) })} placeholder="Harga satuan" />
              <button type="button" className="icon-btn act-delete" onClick={() => removeItemRow(idx)} disabled={items.length === 1}>✕</button>
            </div>
          ))}
          <button type="button" className="btn-outline" style={{ padding: '7px 14px', fontSize: 12 }} onClick={addItemRow}>
            + Tambah Bahan
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '10px 0', borderTop: '1px solid var(--line)' }}>
            <b style={{ fontSize: 13 }}>Total</b>
            <b style={{ fontSize: 16, color: 'var(--gold)' }}>Rp{fmt(total)}</b>
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
