import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import CekStokModal from './CekStokModal';
import PaymentModal from './PaymentModal';
import StrukModal from './StrukModal';
import PosItemRow from './PosItemRow';

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

  const confirmedItems = useMemo(() => cart.filter(it => it.locked), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, it) => s + (it.qty || 0) * (it.harga || 0), 0), [cart]);
  const total = Math.max(0, subtotal - diskon);

  function addEmptyRow() {
    setCart(prev => [...prev, { cartId: Date.now(), produk: '', ket: '', qty: 1, satuan: '', harga: 0, locked: false }]);
  }
  function updateCartItem(cartId, patch) {
    setCart(prev => prev.map(it => (it.cartId === cartId ? { ...it, ...patch } : it)));
  }
  function confirmCartItem(cartId) {
    const item = cart.find(it => it.cartId === cartId);
    if (!item.produk) { alert('Pilih produk terlebih dahulu.'); return; }
    updateCartItem(cartId, { locked: true });
  }
  function editCartItem(cartId) {
    updateCartItem(cartId, { locked: false });
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
      kodeMarketing, items: confirmedItems.map(({ produk, qty, satuan, harga }) => ({ produk, qty, satuan, harga })),
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
        <div className="table-wrap" style={{ padding: 16 }}>
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

          <div className="table-toolbar">
            <h3 style={{ margin: 0, fontSize: 15 }}>Daftar Item</h3>
            <button className="btn-add-top" onClick={addEmptyRow}>+ Tambah Item</button>
          </div>

          <div className="row-grid-pos pos-col-header">
            <span>Produk</span><span>Keterangan</span><span className="r">Jumlah</span><span className="r">Satuan</span>
            <span></span><span className="r">Harga</span><span></span><span className="r">Total</span><span></span>
          </div>

          {cart.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-faint)', padding: '16px 4px' }}>Keranjang kosong — klik "+ Tambah Item".</p>
          ) : cart.map(item => (
            <PosItemRow
              key={item.cartId}
              item={item}
              produkList={data.produk}
              onUpdate={patch => updateCartItem(item.cartId, patch)}
              onConfirm={() => confirmCartItem(item.cartId)}
              onEdit={() => editCartItem(item.cartId)}
              onDelete={() => removeCartItem(item.cartId)}
            />
          ))}
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
          <div style={{ padding: '10px 0', borderTop: '1px solid var(--line)', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
              <span>Subtotal</span><span>Rp{fmt(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Total</b>
              <b style={{ fontSize: 16, color: 'var(--total-red)' }}>Rp{fmt(total)}</b>
            </div>
          </div>
          <button className="btn-gold" style={{ width: '100%', padding: 12, marginBottom: 8 }} disabled={confirmedItems.length === 0} onClick={() => setShowPayment(true)}>
            Checkout
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button className="btn-outline" onClick={() => alert('Transaksi disimpan sebagai draft (dummy).')}>Simpan</button>
            <button
              className="btn-outline"
              onClick={() => {
                if (confirm('Batalkan transaksi ini? Semua item akan dikosongkan.')) {
                  setCart([]); setDiskon(0); setKodeMarketing('');
                }
              }}
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      {showCekStok && <CekStokModal onClose={() => setShowCekStok(false)} />}
      {showPayment && <PaymentModal total={total} onClose={() => setShowPayment(false)} onConfirm={handleConfirmPayment} />}
      {lastSale && <StrukModal sale={lastSale} onClose={() => setLastSale(null)} />}
    </div>
  );
}
