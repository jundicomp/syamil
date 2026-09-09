import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import CekStokModal from './CekStokModal';
import PaymentModal from './PaymentModal';
import StrukModal from './StrukModal';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function POSPage() {
  const { data, addRow, addBukuKasEntry } = useData();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(data.pelanggan[0]?.nama ?? '');
  const [kodeMarketing, setKodeMarketing] = useState('');
  const [diskon, setDiskon] = useState(0);
  const [showCekStok, setShowCekStok] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.qty * it.harga, 0), [cart]);
  const total = Math.max(0, subtotal - diskon);

  function addProductToCart(produkNama) {
    const p = data.produk.find(x => x.nama === produkNama);
    if (!p) return;
    setCart(prev => [...prev, { cartId: Date.now(), produk: p.nama, qty: 1, satuan: p.satuan, harga: p.harga }]);
  }
  function updateCartItem(cartId, patch) {
    setCart(prev => prev.map(it => (it.cartId === cartId ? { ...it, ...patch } : it)));
  }
  function removeCartItem(cartId) {
    setCart(prev => prev.filter(it => it.cartId !== cartId));
  }

  function handleConfirmPayment(payment) {
    const noteIds = data.penjualan.map(r => r.id);
    const nextNum = 232 + (noteIds.length ? Math.max(...noteIds) : 0);
    const noNota = `INV-${String(nextNum).padStart(4, '0')}`;

    const sale = {
      tanggal: '12 Agu 2026', noNota, pelanggan: customer, total,
      status: payment.status, dpDibayar: payment.dpDibayar, sisaBayar: payment.sisaBayar,
      kodeMarketing, items: cart.map(({ produk, qty, satuan, harga }) => ({ produk, qty, satuan, harga })),
    };
    addRow('penjualan', sale);
    addBukuKasEntry('Masuk', payment.dpDibayar, `Penjualan ${noNota} (${payment.metodeBayar}) — ${customer}`);

    setLastSale({ ...sale });
    setShowPayment(false);
    setCart([]);
    setDiskon(0);
    setKodeMarketing('');
  }

  const marketers = data.pengguna.filter(p => p.role === 'Marketing' && p.status === 'Aktif');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Kasir (POS)</h2>
          <div className="page-sub">Transaksi penjualan baru</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        <div>
          <div className="f-row2" style={{ marginBottom: 6 }}>
            <div className="f-field">
              <label>Pelanggan</label>
              <select value={customer} onChange={e => setCustomer(e.target.value)}>
                {data.pelanggan.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
              </select>
            </div>
            <div className="f-field">
              <label>Kode Marketing (opsional)</label>
              <select value={kodeMarketing} onChange={e => setKodeMarketing(e.target.value)}>
                <option value="">— Walk-in / tanpa kode —</option>
                {marketers.map(m => <option key={m.id} value={m.kodeMarketing}>{m.kodeMarketing} — {m.nama}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-outline" style={{ padding: '7px 14px', fontSize: 12, marginBottom: 16 }} onClick={() => setShowCekStok(true)}>
            Cek Stok Bahan
          </button>

          <div className="f-field" style={{ maxWidth: 320 }}>
            <label>Tambah Produk</label>
            <select value="" onChange={e => { if (e.target.value) addProductToCart(e.target.value); }}>
              <option value="">Pilih produk...</option>
              {data.produk.map(p => <option key={p.id} value={p.nama}>{p.nama} — Rp{fmt(p.harga)}</option>)}
            </select>
          </div>

          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="data-table">
              <thead><tr><th>Produk</th><th className="r">Qty</th><th className="r">Harga</th><th className="r">Subtotal</th><th></th></tr></thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr><td colSpan={5} className="empty-row">Keranjang kosong — pilih produk di atas.</td></tr>
                ) : cart.map(it => (
                  <tr key={it.cartId}>
                    <td>{it.produk}</td>
                    <td className="r"><input type="number" min="1" value={it.qty} style={{ width: 60, textAlign: 'right' }} onChange={e => updateCartItem(it.cartId, { qty: Number(e.target.value) })} /></td>
                    <td className="r"><input type="number" min="0" value={it.harga} style={{ width: 100, textAlign: 'right' }} onChange={e => updateCartItem(it.cartId, { harga: Number(e.target.value) })} /></td>
                    <td className="r">Rp{fmt(it.qty * it.harga)}</td>
                    <td><button className="icon-btn act-delete" onClick={() => removeCartItem(it.cartId)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-wrap" style={{ padding: '18px 20px', position: 'sticky', top: 0 }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-faint)', letterSpacing: '.05em', marginBottom: 6 }}>
            Total Transaksi
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--gold)', marginBottom: 4 }}>Rp{fmt(total)}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginBottom: 16 }}>{cart.length} item ditambahkan</div>

          <div className="f-field">
            <label>Diskon (Rp)</label>
            <input type="number" min="0" value={diskon} onChange={e => setDiskon(Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--line)', marginBottom: 14 }}>
            <b>Total</b>
            <b style={{ fontSize: 16, color: 'var(--total-red)' }}>Rp{fmt(total)}</b>
          </div>
          <button className="btn-gold" style={{ width: '100%', padding: 12 }} disabled={cart.length === 0} onClick={() => setShowPayment(true)}>
            Bayar
          </button>
        </div>
      </div>

      {showCekStok && <CekStokModal onClose={() => setShowCekStok(false)} />}
      {showPayment && <PaymentModal total={total} onClose={() => setShowPayment(false)} onConfirm={handleConfirmPayment} />}
      {lastSale && <StrukModal sale={lastSale} onClose={() => setLastSale(null)} />}
    </div>
  );
}
