import { lookupMatrixPrice } from '../../utils/matrixPricing';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function PosItemRow({ item, produkList, onUpdate, onConfirm, onEdit, onDelete }) {
  const total = (item.qty || 0) * (item.harga || 0);
  const produkInfo = produkList.find(p => p.nama === item.produk);
  const isMatrix = produkInfo?.tipe === 'Matriks Harga' && produkInfo.hargaMatrix;

  function handleProdukChange(nama) {
    const p = produkList.find(x => x.nama === nama);
    if (p?.tipe === 'Matriks Harga' && p.hargaMatrix) {
      const bahanAwal = p.hargaMatrix.bahan[0]?.nama || '';
      const qty = item.qty || 1;
      onUpdate({
        produk: nama, satuan: p.hargaMatrix.satuan, bahanMatrix: bahanAwal, sisiMatrix: 'satu',
        harga: lookupMatrixPrice(p.hargaMatrix, bahanAwal, qty, 'satu'),
      });
    } else {
      onUpdate({ produk: nama, satuan: p?.satuan ?? item.satuan, harga: p?.harga ?? item.harga, bahanMatrix: null, sisiMatrix: null });
    }
  }

  function handleQtyChange(qty) {
    if (isMatrix && item.bahanMatrix) {
      onUpdate({ qty, harga: lookupMatrixPrice(produkInfo.hargaMatrix, item.bahanMatrix, qty, item.sisiMatrix || 'satu') });
    } else {
      onUpdate({ qty });
    }
  }
  function handleBahanMatrixChange(bahanNama) {
    onUpdate({ bahanMatrix: bahanNama, harga: lookupMatrixPrice(produkInfo.hargaMatrix, bahanNama, item.qty || 1, item.sisiMatrix || 'satu') });
  }
  function handleSisiMatrixChange(sisi) {
    onUpdate({ sisiMatrix: sisi, harga: lookupMatrixPrice(produkInfo.hargaMatrix, item.bahanMatrix, item.qty || 1, sisi) });
  }

  if (item.locked) {
    return (
      <div className="item-row row-grid-pos">
        <div className="cell produk-cell">
          {item.produk}
          {item.bahanMatrix && <div className="pos-matrix-hint">{item.bahanMatrix} · {item.sisiMatrix === 'dua' ? 'Dua Sisi' : 'Satu Sisi'}</div>}
        </div>
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
    <div className="item-row-wrap">
      <div className="item-row row-grid-pos">
        <div className="produk-wrap">
          <select className="pos-produk-select" value={item.produk} onChange={e => handleProdukChange(e.target.value)}>
            <option value="" disabled>Pilih produk...</option>
            {produkList.map(p => <option key={p.id} value={p.nama}>{p.nama}{p.tipe === 'Matriks Harga' ? ' (Matriks)' : ''}</option>)}
          </select>
        </div>
        <input className="pos-input" type="text" placeholder="Keterangan..." value={item.ket || ''} onChange={e => onUpdate({ ket: e.target.value })} />
        <input className="pos-input" type="number" value={item.qty || 1} onChange={e => handleQtyChange(Number(e.target.value))} />
        <input className="pos-input" type="text" value={item.satuan || ''} onChange={e => onUpdate({ satuan: e.target.value })} disabled={isMatrix} />
        <span className="sym">×</span>
        <input className="pos-input" type="text" value={item.harga || 0} onChange={e => onUpdate({ harga: Number(e.target.value) || 0 })} disabled={isMatrix} />
        <span className="sym">=</span>
        <div className="cell num-cell total-cell">{fmt(total)}</div>
        <div className="row-actions">
          <button className="icon-btn act-confirm" title="Konfirmasi" onClick={onConfirm}>✓</button>
          <button className="icon-btn act-delete" title="Hapus" onClick={onDelete}>🗑</button>
        </div>
      </div>

      {isMatrix && (
        <div className="pos-matrix-picker">
          <Icon />
          <span className="pos-matrix-lbl">Matriks Harga:</span>
          <select className="pos-input" style={{ maxWidth: 160 }} value={item.bahanMatrix || ''} onChange={e => handleBahanMatrixChange(e.target.value)}>
            {produkInfo.hargaMatrix.bahan.map(b => <option key={b.nama} value={b.nama}>{b.nama}</option>)}
          </select>
          <select className="pos-input" style={{ maxWidth: 130 }} value={item.sisiMatrix || 'satu'} onChange={e => handleSisiMatrixChange(e.target.value)}>
            <option value="satu">Satu Sisi</option>
            <option value="dua">Dua Sisi</option>
          </select>
          <span className="pos-matrix-tier">
            Harga otomatis: <b>Rp{fmt(item.harga)}</b> / {produkInfo.hargaMatrix.satuan}
          </span>
        </div>
      )}
    </div>
  );
}

function Icon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
