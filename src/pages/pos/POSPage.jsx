import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import CekStokModal from './CekStokModal';
import PaymentModal from './PaymentModal';
import PosItemRow from './PosItemRow';
import CustomerSearchSelect from './CustomerSearchSelect';
import LiveStrukPreview from './LiveStrukPreview';
import DraftListModal from './DraftListModal';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function POSPage() {
  const { data, addRow, deleteRow, addBukuKasEntry } = useData();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(data.pelanggan[0]?.nama ?? '');
  const [kodeMarketing, setKodeMarketing] = useState('');
  const [showCekStok, setShowCekStok] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDraftList, setShowDraftList] = useState(false);

  const confirmedItems = useMemo(() => cart.filter(it => it.locked), [cart]);
  const subtotal = useMemo(() => confirmedItems.reduce((s, it) => s + it.qty * it.harga, 0), [confirmedItems]);

  const selectedCustomer = data.pelanggan.find(p => p.nama === customer);
  const customerInfo = selectedCustomer ? `${selectedCustomer.kota} · ${selectedCustomer.kontak}` : '';

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
  function resetTransaksi() {
    setCart([]); setKodeMarketing('');
  }

  function handleBatal() {
    if (cart.length === 0) return;
    if (confirm('Batalkan transaksi ini? Semua item akan dikosongkan.')) resetTransaksi();
  }
  function handleSimpanDraft() {
    if (confirmedItems.length === 0) { alert('Belum ada item dikonfirmasi untuk disimpan.'); return; }
    addRow('posDraft', {
      tanggal: '12 Agu 2026', customer, kodeMarketing,
      items: confirmedItems.map(({ produk, ket, qty, satuan, harga }) => ({ produk, ket, qty, satuan, harga })),
      subtotal,
    });
    resetTransaksi();
    alert('Draft tersimpan — bisa dilanjutkan lewat tombol "Draft Tersimpan".');
  }
  function handleResumeDraft(draft) {
    setCustomer(draft.customer);
    setKodeMarketing(draft.kodeMarketing || '');
    setCart(draft.items.map(it => ({ ...it, cartId: Date.now() + Math.random(), locked: true })));
    deleteRow('posDraft', draft.id);
    setShowDraftList(false);
  }

  function handleConfirmPayment(payment) {
    const noteIds = data.penjualan.map(r => r.id);
    const nextNum = 232 + (noteIds.length ? Math.max(...noteIds) : 0);
    const noNota = `INV-${String(nextNum).padStart(4, '0')}`;

    const sale = {
      tanggal: '12 Agu 2026', noNota, pelanggan: customer, total: payment.total,
      status: payment.status, dpDibayar: payment.dpDibayar, sisaBayar: payment.sisaBayar,
      kodeMarketing, items: confirmedItems.map(({ produk, qty, satuan, harga }) => ({ produk, qty, satuan, harga })),
    };
    addRow('penjualan', sale);
    addBukuKasEntry('Masuk', payment.dpDibayar, `Penjualan ${noNota} (${payment.metodeBayar}) — ${customer}`);

    setShowPayment(false);
    window.print();
    resetTransaksi();
    alert(`Transaksi berhasil — No. Nota: ${noNota}`);
  }

  const marketers = data.pengguna.filter(p => p.role === 'Marketing' && p.status === 'Aktif');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Kasir (POS)</h2>
          <div className="page-sub">Transaksi penjualan baru</div>
        </div>
        <button type="button" className="btn-outline" onClick={() => setShowDraftList(true)}>
          Draft Tersimpan {data.posDraft.length > 0 ? `(${data.posDraft.length})` : ''}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
        <div>
          <div className="f-row2" style={{ marginBottom: 6 }}>
            <div className="f-field">
              <label>Pelanggan</label>
              <CustomerSearchSelect value={customer} onChange={setCustomer} />
              {customerInfo && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 5 }}>{customerInfo}</div>}
            </div>
            <div className="f-field">
              <label>Kode Marketing (opsional)</label>
              <select value={kodeMarketing} onChange={e => setKodeMarketing(e.target.value)}>
                <option value="">— Walk-in / tanpa kode —</option>
                {marketers.map(m => <option key={m.id} value={m.kodeMarketing}>{m.kodeMarketing} — {m.nama}</option>)}
              </select>
            </div>
          </div>

          <div className="table-toolbar" style={{ marginTop: 18, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn-add-top" onClick={addEmptyRow}>+ Tambah Item</button>
              <button type="button" className="btn-outline" onClick={() => setShowCekStok(true)}>Cek Stok Bahan</button>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-faint)', letterSpacing: '.05em' }}>Total Transaksi</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--gold)' }}>Rp{fmt(subtotal)}</div>
            </div>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 18 }}>
            <button type="button" className="btn-outline" onClick={handleBatal}>Batal</button>
            <button type="button" className="btn-outline" onClick={handleSimpanDraft}>Simpan</button>
            <button type="button" className="btn-gold" disabled={confirmedItems.length === 0} onClick={() => setShowPayment(true)}>Checkout</button>
          </div>
        </div>

        <LiveStrukPreview
          customer={customer} customerInfo={customerInfo} kodeMarketing={kodeMarketing}
          items={confirmedItems} total={subtotal}
        />
      </div>

      {showCekStok && <CekStokModal onClose={() => setShowCekStok(false)} />}
      {showPayment && <PaymentModal subtotal={subtotal} onClose={() => setShowPayment(false)} onConfirm={handleConfirmPayment} />}
      {showDraftList && <DraftListModal onClose={() => setShowDraftList(false)} onResume={handleResumeDraft} />}
    </div>
  );
}
