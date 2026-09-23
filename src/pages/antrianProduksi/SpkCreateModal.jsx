import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotify } from '../../context/NotificationContext';

/**
 * Item nota yang belum ada SPK-nya — portir dari getRemainingItemsForNota() versi HTML.
 * Nota lama tanpa rincian .items dianggap 1 slot generik (pilih produk manual),
 * kecuali sudah ada SPK untuk nota itu (dianggap selesai, tidak muncul lagi di pilihan).
 */
function getRemainingItemsForNota(nota, produksiList) {
  const existingProduk = new Set(produksiList.filter(sp => sp.noNota === nota.noNota).map(sp => sp.produk));
  if (nota.items && nota.items.length > 0) {
    return nota.items.filter(it => !existingProduk.has(it.produk));
  }
  if (existingProduk.size > 0) return [];
  return [{ produk: null, qty: null, satuan: null }];
}

export default function SpkCreateModal({ onClose }) {
  const { user } = useAuth();
  const { data, addRow } = useData();
  const { notifyError, notifySuccess } = useNotify();

  const notaOptions = useMemo(() => {
    return data.penjualan
      .map(p => ({ nota: p, remaining: getRemainingItemsForNota(p, data.produksi) }))
      .filter(x => x.remaining.length > 0);
  }, [data.penjualan, data.produksi]);

  const [noNota, setNoNota] = useState(notaOptions[0]?.nota.noNota ?? '');
  const [produkManual, setProdukManual] = useState(data.produk[0]?.nama ?? '');
  const [selectedItems, setSelectedItems] = useState(() => {
    const first = notaOptions[0];
    if (first && first.remaining.length > 1) {
      const init = {};
      first.remaining.forEach(it => { init[it.produk] = true; });
      return init;
    }
    return {};
  });
  const [target, setTarget] = useState('');
  const [pic, setPic] = useState(data.pengguna[0]?.nama ?? '');
  const [detail, setDetail] = useState('');

  const current = notaOptions.find(x => x.nota.noNota === noNota);
  const notaTerpilih = current?.nota;
  const remaining = current?.remaining ?? [];
  const isGenericSlot = remaining.length === 1 && remaining[0].produk === null;
  const isMulti = remaining.length > 1;

  function handleNotaChange(val) {
    setNoNota(val);
    const next = notaOptions.find(x => x.nota.noNota === val);
    const nextRemaining = next?.remaining ?? [];
    if (nextRemaining.length > 1) {
      const init = {};
      nextRemaining.forEach(it => { init[it.produk] = true; });
      setSelectedItems(init);
    } else {
      setSelectedItems({});
    }
  }

  function toggleItem(produkName) {
    setSelectedItems(prev => ({ ...prev, [produkName]: !prev[produkName] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!notaTerpilih) { notifyError('Pilih No. Nota terlebih dahulu.'); return; }
    if (!target.trim()) { notifyError('Isi Target terlebih dahulu.'); return; }

    let produkList;
    if (isGenericSlot) {
      produkList = [produkManual];
    } else if (isMulti) {
      produkList = remaining.filter(it => selectedItems[it.produk]).map(it => it.produk);
      if (produkList.length === 0) { notifyError('Pilih minimal 1 produk untuk diciptakan SPK-nya.'); return; }
    } else {
      produkList = [remaining[0].produk];
    }

    const baseIds = data.produksi.map(r => r.id);
    const startNum = 91 + (baseIds.length ? Math.max(...baseIds) : 0);
    const createdOrders = [];

    produkList.forEach((produkNama, i) => {
      const noOrder = `SPK-${String(startNum + i).padStart(4, '0')}`;
      addRow('produksi', {
        noOrder, statusSpk: 'Aktif', noNota, produk: produkNama,
        pelanggan: notaTerpilih.pelanggan, tahap: 'Desain',
        target, pic, detail, dibuatOleh: user?.nama || '-', history: [],
      });
      createdOrders.push(noOrder);
    });

    notifySuccess(createdOrders.length > 1
      ? `${createdOrders.length} SPK berhasil dibuat: ${createdOrders.join(', ')}.`
      : `SPK ${createdOrders[0]} berhasil dibuat.`);
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
            {notaOptions.length === 0 ? (
              <input value="Semua nota sudah punya SPK lengkap" disabled />
            ) : (
              <select value={noNota} onChange={e => handleNotaChange(e.target.value)}>
                {notaOptions.map(({ nota, remaining: rem }) => {
                  const totalItems = nota.items?.length ?? 1;
                  const label = totalItems > 1
                    ? `${nota.noNota} — ${totalItems} item, ${rem.length} belum ada SPK`
                    : `${nota.noNota} — ${nota.pelanggan}`;
                  return <option key={nota.id} value={nota.noNota}>{label}</option>;
                })}
              </select>
            )}
          </div>

          <div className="f-field">
            <label>Pelanggan</label>
            <input value={notaTerpilih?.pelanggan ?? '-'} disabled />
          </div>

          {isMulti ? (
            <div className="f-field">
              <label>Produk — {remaining.length} item nota ini belum ada SPK, ciptakan untuk item mana saja</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {remaining.map(it => (
                  <label key={it.produk} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!selectedItems[it.produk]} onChange={() => toggleItem(it.produk)} />
                    <span>{it.produk} <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>({it.qty} {it.satuan})</span></span>
                  </label>
                ))}
              </div>
            </div>
          ) : isGenericSlot ? (
            <div className="f-field">
              <label>Produk</label>
              <select value={produkManual} onChange={e => setProdukManual(e.target.value)}>
                {data.produk.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
              </select>
            </div>
          ) : (
            <div className="f-field">
              <label>Produk (otomatis, satu-satunya item tersisa di nota ini)</label>
              <input value={remaining[0]?.produk ?? '-'} disabled />
            </div>
          )}

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
            <label>Detail Pekerjaan {isMulti ? '(berlaku sama untuk semua SPK yang dipilih)' : ''}</label>
            <textarea value={detail} onChange={e => setDetail(e.target.value)} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-gold" disabled={notaOptions.length === 0}>Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
