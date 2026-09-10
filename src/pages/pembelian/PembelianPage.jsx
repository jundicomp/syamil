import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import SupplierSearchSelect from './SupplierSearchSelect';
import PembelianItemRow from './PembelianItemRow';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function OrderPembelianForm() {
  const { data, addRow, addStokMovement, addBukuKasEntry } = useData();
  const [supplier, setSupplier] = useState(data.supplier[0]?.nama ?? '');
  const [noNotaSupplier, setNoNotaSupplier] = useState('');
  const [tanggalNota, setTanggalNota] = useState('2026-08-12');
  const [status, setStatus] = useState('Belum Lunas');
  const [metodeBayar, setMetodeBayar] = useState('Tunai');
  const [cart, setCart] = useState([]);
  const tanggalInput = '12 Agu 2026'; // tanggal sistem saat data ini diinput — bukan tanggal nota supplier

  const confirmedItems = useMemo(() => cart.filter(it => it.locked), [cart]);
  const subtotal = useMemo(() => confirmedItems.reduce((s, it) => s + it.qty * it.harga, 0), [confirmedItems]);

  function addEmptyRow() {
    setCart(prev => [...prev, { cartId: Date.now(), bahan: '', ket: '', qty: 1, satuan: '', harga: 0, locked: false }]);
  }
  function updateCartItem(cartId, patch) {
    setCart(prev => prev.map(it => (it.cartId === cartId ? { ...it, ...patch } : it)));
  }
  function confirmCartItem(cartId) {
    const item = cart.find(it => it.cartId === cartId);
    if (!item.bahan) { alert('Pilih bahan terlebih dahulu.'); return; }
    updateCartItem(cartId, { locked: true });
  }
  function editCartItem(cartId) { updateCartItem(cartId, { locked: false }); }
  function removeCartItem(cartId) { setCart(prev => prev.filter(it => it.cartId !== cartId)); }
  function resetForm() { setCart([]); setStatus('Belum Lunas'); setNoNotaSupplier(''); setMetodeBayar('Tunai'); }

  function handleBatal() {
    if (cart.length === 0) return;
    if (confirm('Batalkan order ini? Semua item akan dikosongkan.')) resetForm();
  }

  function formatTanggalNota(isoDate) {
    const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const [y, m, d] = isoDate.split('-').map(Number);
    return `${d} ${BULAN[m - 1]} ${y}`;
  }

  function handleSubmit() {
    if (confirmedItems.length === 0) { alert('Konfirmasi minimal 1 bahan terlebih dahulu.'); return; }
    if (!noNotaSupplier.trim()) { alert('Isi No. Nota dari supplier terlebih dahulu.'); return; }

    const poIds = data.pembelian.map(r => r.id);
    const nextNum = 231 + (poIds.length ? Math.max(...poIds) : 0);
    const noPO = `PO-${String(nextNum).padStart(4, '0')}`;
    const items = confirmedItems.map(({ bahan, qty, satuan, harga }) => ({ bahan, qty, satuan, harga }));
    const tanggalNotaFmt = formatTanggalNota(tanggalNota);

    addRow('pembelian', {
      tanggal: tanggalInput, tanggalNota: tanggalNotaFmt, noNotaSupplier: noNotaSupplier.trim(),
      noPO, supplier, total: subtotal, status, items,
    });
    items.forEach(it => addStokMovement(it.bahan, 'Masuk', it.qty, it.satuan, noPO, `Pembelian dari ${supplier}`));

    if (status === 'Lunas') {
      addBukuKasEntry('Keluar', subtotal, `Pembelian ${noPO} (${noNotaSupplier.trim()}) — ${supplier}`, metodeBayar);
    } else {
      addRow('hutang', {
        tanggal: tanggalNotaFmt, noPO, noNotaSupplier: noNotaSupplier.trim(), supplier,
        total: subtotal, dibayar: 0, sisa: subtotal, status: 'Belum Lunas',
      });
    }

    resetForm();
    alert(`Order pembelian berhasil dibuat — No. PO: ${noPO}` + (status === 'Belum Lunas' ? ' (tercatat sebagai Hutang Supplier)' : ''));
  }

  return (
    <div>
      <div className="f-row2" style={{ marginBottom: 6 }}>
        <div className="f-field">
          <label>Supplier</label>
          <SupplierSearchSelect value={supplier} onChange={setSupplier} />
        </div>
        <div className="f-field">
          <label>No. Nota dari Supplier</label>
          <input value={noNotaSupplier} onChange={e => setNoNotaSupplier(e.target.value)} placeholder="mis. NOTA-88213" />
        </div>
      </div>
      <div className="f-row2" style={{ marginBottom: 6 }}>
        <div className="f-field">
          <label>Tanggal Pembelian (sesuai Nota)</label>
          <input type="date" value={tanggalNota} onChange={e => setTanggalNota(e.target.value)} />
        </div>
        <div className="f-field">
          <label>Status Pembayaran</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option>Belum Lunas</option>
            <option>Lunas</option>
          </select>
        </div>
      </div>
      {status === 'Lunas' && (
        <div className="f-field" style={{ maxWidth: 260 }}>
          <label>Metode Bayar</label>
          <select value={metodeBayar} onChange={e => setMetodeBayar(e.target.value)}>
            <option>Tunai</option>
            <option>Transfer</option>
            <option>QRIS</option>
          </select>
        </div>
      )}
      <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '-2px 0 14px' }}>
        Tanggal input ke sistem: <b style={{ color: 'var(--text-soft)' }}>{tanggalInput}</b> (otomatis, beda dari tanggal nota di atas)
      </p>

      <div className="table-toolbar" style={{ marginTop: 18, alignItems: 'center' }}>
        <button type="button" className="btn-add-top" onClick={addEmptyRow}>+ Tambah Item</button>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-faint)', letterSpacing: '.05em' }}>Total Order</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--gold)' }}>Rp{fmt(subtotal)}</div>
        </div>
      </div>

      <div className="row-grid-pos pos-col-header">
        <span>Bahan</span><span>Keterangan</span><span className="r">Jumlah</span><span className="r">Satuan</span>
        <span></span><span className="r">Harga</span><span></span><span className="r">Total</span><span></span>
      </div>

      {cart.length === 0 ? (
        <p style={{ fontSize: 12, color: 'var(--text-faint)', padding: '16px 4px' }}>Belum ada bahan — klik "+ Tambah Item".</p>
      ) : cart.map(item => (
        <PembelianItemRow
          key={item.cartId}
          item={item}
          bahanList={data.bahanBaku}
          onUpdate={patch => updateCartItem(item.cartId, patch)}
          onConfirm={() => confirmCartItem(item.cartId)}
          onEdit={() => editCartItem(item.cartId)}
          onDelete={() => removeCartItem(item.cartId)}
        />
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 18 }}>
        <button type="button" className="btn-outline" onClick={handleBatal}>Batal</button>
        <button type="button" className="btn-gold" disabled={confirmedItems.length === 0} onClick={handleSubmit}>Buat Order Pembelian</button>
      </div>
    </div>
  );
}

export default function PembelianPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pembelian</h2>
          <div className="page-sub">Order pembelian bahan baku ke supplier — riwayat &amp; hutang lihat di menu Laporan Keuangan</div>
        </div>
      </div>
      <OrderPembelianForm />
    </div>
  );
}
