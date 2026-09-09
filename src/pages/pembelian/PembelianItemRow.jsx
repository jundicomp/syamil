function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function PembelianItemRow({ item, bahanList, onUpdate, onConfirm, onEdit, onDelete }) {
  const total = (item.qty || 0) * (item.harga || 0);

  function handleBahanChange(nama) {
    const b = bahanList.find(x => x.nama === nama);
    onUpdate({ bahan: nama, satuan: b?.satuan ?? item.satuan, harga: b?.hargaBeli ?? item.harga });
  }

  if (item.locked) {
    return (
      <div className="item-row row-grid-pos">
        <div className="cell produk-cell">{item.bahan}</div>
        <div className="cell ket-cell">{item.ket || '—'}</div>
        <div className="cell num-cell">{item.qty}</div>
        <div className="cell num-cell">{item.satuan}</div>
        <span className="sym">×</span>
        <div className="cell num-cell">{fmt(item.harga)}</div>
        <span className="sym">=</span>
        <div className="cell num-cell total-cell">{fmt(total)}</div>
        <div className="row-actions">
          <button className="icon-btn act-edit" title="Edit" onClick={onEdit}>✎</button>
          <button className="icon-btn act-delete" title="Hapus" onClick={onDelete}>🗑</button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-row row-grid-pos">
      <div className="produk-wrap">
        <select className="pos-produk-select" value={item.bahan} onChange={e => handleBahanChange(e.target.value)}>
          <option value="" disabled>Pilih bahan...</option>
          {bahanList.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
        </select>
      </div>
      <input className="pos-input" type="text" placeholder="Keterangan..." value={item.ket || ''} onChange={e => onUpdate({ ket: e.target.value })} />
      <input className="pos-input" type="number" value={item.qty || 1} onChange={e => onUpdate({ qty: Number(e.target.value) })} />
      <input className="pos-input" type="text" value={item.satuan || ''} onChange={e => onUpdate({ satuan: e.target.value })} />
      <span className="sym">×</span>
      <input className="pos-input" type="text" value={item.harga || 0} onChange={e => onUpdate({ harga: Number(e.target.value) || 0 })} />
      <span className="sym">=</span>
      <div className="cell num-cell total-cell">{fmt(total)}</div>
      <div className="row-actions">
        <button className="icon-btn act-confirm" title="Konfirmasi" onClick={onConfirm}>✓</button>
        <button className="icon-btn act-delete" title="Hapus" onClick={onDelete}>🗑</button>
      </div>
    </div>
  );
}
