import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function HppEditModal({ hpp, onClose }) {
  const { updateRow } = useData();
  const { notifyError, notifySuccess } = useNotify();
  const [items, setItems] = useState(hpp.items.map(it => ({ ...it })));

  const totalHpp = useMemo(() => items.reduce((s, it) => s + it.qty * it.harga, 0), [items]);
  const margin = hpp.hargaJual - totalHpp;
  const marginPct = hpp.hargaJual ? (margin / hpp.hargaJual) * 100 : 0;

  function updateItem(idx, patch) {
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function addItemRow() {
    setItems(prev => [...prev, { sumber: 'Bebas', nama: '', qty: 1, satuan: '', harga: 0 }]);
  }
  function removeItemRow(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validItems = items.filter(it => it.nama && it.qty > 0);
    if (validItems.length === 0) { notifyError('Minimal harus ada 1 item biaya.'); return; }
    updateRow('hppCalc', hpp.id, { items: validItems, totalHpp });
    notifySuccess(`Kalkulasi HPP ${hpp.noOrder} berhasil diperbarui.`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 580 }}>
        <div className="modal-head">
          <b>Edit Kalkulasi HPP — {hpp.noOrder}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        <div className="f-row2">
          <div className="f-field"><label>Produk</label><input value={hpp.produk} disabled /></div>
          <div className="f-field"><label>Harga Jual</label><input value={`Rp${fmt(hpp.hargaJual)}`} disabled /></div>
        </div>
        <p style={{ fontSize: 10.5, color: 'var(--text-faint)', margin: '-8px 0 14px' }}>
          Produk &amp; Harga Jual mengikuti SPK/Nota terkait, tidak bisa diubah dari sini. Kalau ada item
          "Stok Gudang" yang di sini dihapus/dikurangi, stok bahan baku yang <b>sudah terlanjur terpotong
          saat awal simpan TIDAK ikut dikembalikan otomatis</b> — sesuaikan manual lewat Stok Opname kalau perlu.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 8 }}>
            Rincian Biaya
          </label>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.6fr 0.8fr 1fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input placeholder="Nama biaya" value={it.nama} onChange={e => updateItem(idx, { nama: e.target.value })} />
              <input type="number" min="0" value={it.qty} onChange={e => updateItem(idx, { qty: Number(e.target.value) })} placeholder="Qty" />
              <input placeholder="Satuan" value={it.satuan} onChange={e => updateItem(idx, { satuan: e.target.value })} />
              <input type="number" min="0" value={it.harga} onChange={e => updateItem(idx, { harga: Number(e.target.value) })} placeholder="Harga" />
              <button type="button" className="icon-btn act-delete" onClick={() => removeItemRow(idx)} disabled={items.length === 1}>✕</button>
            </div>
          ))}
          <button type="button" className="btn-outline" style={{ padding: '7px 14px', fontSize: 12 }} onClick={addItemRow}>+ Tambah Item</button>

          <div style={{ marginTop: 16, padding: '10px 0', borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Total HPP</b>
              <b style={{ color: 'var(--total-red)' }}>Rp{fmt(totalHpp)}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 12 }}>Margin (Harga Jual − HPP) = {marginPct.toFixed(1)}%</span>
              <b style={{ color: 'var(--total-red)' }}>Rp{fmt(margin)}</b>
            </div>
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
