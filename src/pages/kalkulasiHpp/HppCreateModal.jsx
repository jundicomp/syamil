import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function HppCreateModal({ onClose }) {
  const { data, addRow, addStokMovement } = useData();
  const spkAktif = data.produksi.filter(p => p.statusSpk === 'Aktif');
  const [noOrder, setNoOrder] = useState(spkAktif[0]?.noOrder ?? '');
  const [items, setItems] = useState([{ sumber: 'Bebas', nama: '', bahanRef: '', qty: 1, satuan: '', harga: 0 }]);

  const spk = data.produksi.find(p => p.noOrder === noOrder);
  const notaTerkait = spk ? data.penjualan.find(p => p.noNota === spk.noNota) : null;
  const hargaJual = notaTerkait?.total ?? 0;

  const totalHpp = useMemo(() => items.reduce((s, it) => s + it.qty * it.harga, 0), [items]);
  const margin = hargaJual - totalHpp;
  const marginPct = hargaJual ? Math.round((margin / hargaJual) * 100) : 0;

  function updateItem(idx, patch) {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it;
      const next = { ...it, ...patch };
      if (patch.sumber === 'Stok') { next.nama = ''; next.bahanRef = ''; next.satuan = ''; next.harga = 0; }
      if (patch.bahanRef !== undefined) {
        const b = data.bahanBaku.find(x => x.nama === patch.bahanRef);
        if (b) { next.nama = b.nama; next.satuan = b.satuan; next.harga = b.hargaBeli; }
      }
      return next;
    }));
  }
  function addItemRow() {
    setItems(prev => [...prev, { sumber: 'Bebas', nama: '', bahanRef: '', qty: 1, satuan: '', harga: 0 }]);
  }
  function removeItemRow(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validItems = items.filter(it => it.nama && it.qty > 0);
    if (validItems.length === 0) { alert('Tambahkan minimal 1 item biaya.'); return; }
    if (!spk) { alert('Pilih SPK terlebih dahulu.'); return; }

    addRow('hppCalc', {
      noOrder, produk: spk.produk, pelanggan: spk.pelanggan, tanggal: '12 Agu 2026',
      hargaJual, items: validItems, totalHpp, dibuatOleh: 'Pak Budi',
    });

    // Baris "Stok Gudang" otomatis mengurangi stok bahan baku.
    validItems.filter(it => it.sumber === 'Stok').forEach(it => {
      addStokMovement(it.nama, 'Keluar', it.qty, it.satuan, noOrder, `Dipakai untuk HPP ${noOrder}`);
    });

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 580 }}>
        <div className="modal-head">
          <b>Kalkulasi HPP Baru</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="f-field">
            <label>No. SPK (aktif)</label>
            <select value={noOrder} onChange={e => setNoOrder(e.target.value)}>
              {spkAktif.map(s => <option key={s.id} value={s.noOrder}>{s.noOrder} — {s.produk}</option>)}
            </select>
          </div>
          <div className="f-field">
            <label>Harga Jual {notaTerkait ? '(otomatis dari Nota, terkunci)' : '(nota tidak ditemukan)'}</label>
            <input value={`Rp${fmt(hargaJual)}`} disabled />
          </div>

          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-soft)', margin: '14px 0 8px' }}>
            Rincian Biaya
          </label>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.6fr 0.6fr 1fr auto', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <select value={it.sumber} onChange={e => updateItem(idx, { sumber: e.target.value })}>
                <option value="Bebas">Item Bebas</option>
                <option value="Stok">Stok Gudang</option>
              </select>
              {it.sumber === 'Stok' ? (
                <select value={it.bahanRef} onChange={e => updateItem(idx, { bahanRef: e.target.value })}>
                  <option value="">Pilih bahan...</option>
                  {data.bahanBaku.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
                </select>
              ) : (
                <input placeholder="Nama biaya (mis. Ongkos Cetak)" value={it.nama} onChange={e => updateItem(idx, { nama: e.target.value })} />
              )}
              <input type="number" min="0" value={it.qty} onChange={e => updateItem(idx, { qty: Number(e.target.value) })} placeholder="Qty" />
              <input type="number" min="0" value={it.harga} onChange={e => updateItem(idx, { harga: Number(e.target.value) })} placeholder="Harga" disabled={it.sumber === 'Stok'} />
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
              <span style={{ fontSize: 12 }}>Margin (Harga Jual − HPP) = {marginPct}%</span>
              <b style={{ color: 'var(--total-red)' }}>Rp{fmt(margin)}</b>
            </div>
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
