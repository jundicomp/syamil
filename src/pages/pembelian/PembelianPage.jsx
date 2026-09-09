import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import ExportButtons from '../../components/common/ExportButtons';
import SupplierSearchSelect from './SupplierSearchSelect';
import PembelianItemRow from './PembelianItemRow';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

const ORDER_COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'noPO', label: 'No. PO' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'total', label: 'Total', type: 'currency', align: 'r' },
  { key: 'status', label: 'Status', type: 'badge' },
];
const SUPPLIER_EXPORT_COLUMNS = [
  { key: 'supplier', label: 'Supplier' },
  { key: 'total', label: 'Total Dibeli', type: 'currency', align: 'r' },
];

function OrderPembelianForm() {
  const { data, addRow, addStokMovement, addBukuKasEntry } = useData();
  const [supplier, setSupplier] = useState(data.supplier[0]?.nama ?? '');
  const [status, setStatus] = useState('Belum Lunas');
  const [cart, setCart] = useState([]);

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
  function resetForm() { setCart([]); setStatus('Belum Lunas'); }

  function handleBatal() {
    if (cart.length === 0) return;
    if (confirm('Batalkan order ini? Semua item akan dikosongkan.')) resetForm();
  }

  function handleSubmit() {
    if (confirmedItems.length === 0) { alert('Konfirmasi minimal 1 bahan terlebih dahulu.'); return; }

    const poIds = data.pembelian.map(r => r.id);
    const nextNum = 231 + (poIds.length ? Math.max(...poIds) : 0);
    const noPO = `PO-${String(nextNum).padStart(4, '0')}`;
    const items = confirmedItems.map(({ bahan, qty, satuan, harga }) => ({ bahan, qty, satuan, harga }));

    addRow('pembelian', { tanggal: '12 Agu 2026', noPO, supplier, total: subtotal, status, items });
    items.forEach(it => addStokMovement(it.bahan, 'Masuk', it.qty, it.satuan, noPO, `Pembelian dari ${supplier}`));
    if (status === 'Lunas') addBukuKasEntry('Keluar', subtotal, `Pembelian ${noPO} — ${supplier}`);

    resetForm();
    alert(`Order pembelian berhasil dibuat — No. PO: ${noPO}`);
  }

  return (
    <div>
      <div className="f-row2" style={{ marginBottom: 6 }}>
        <div className="f-field">
          <label>Supplier</label>
          <SupplierSearchSelect value={supplier} onChange={setSupplier} />
        </div>
        <div className="f-field">
          <label>Status Pembayaran</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option>Belum Lunas</option>
            <option>Lunas</option>
          </select>
        </div>
      </div>

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
  const [tab, setTab] = useState('order');
  const { data } = useData();

  const perSupplier = useMemo(() => {
    const map = {};
    data.pembelian.forEach(p => { map[p.supplier] = (map[p.supplier] || 0) + p.total; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([supplier, total]) => ({ supplier, total }));
  }, [data.pembelian]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pembelian</h2>
          <div className="page-sub">Order pembelian bahan baku ke supplier</div>
        </div>
      </div>
      <div className="subtab-switch">
        <button className={tab === 'order' ? 'active' : ''} onClick={() => setTab('order')}>Order Pembelian</button>
        <button className={tab === 'laporan' ? 'active' : ''} onClick={() => setTab('laporan')}>Riwayat &amp; Laporan</button>
      </div>

      {tab === 'order' ? (
        <OrderPembelianForm />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <ExportButtons title="Total Pembelian per Supplier" reportName="Ringkasan Pembelian per Supplier" columns={SUPPLIER_EXPORT_COLUMNS} rows={perSupplier} summaryKeys={['total']} summary={{ total: perSupplier.reduce((s, r) => s + r.total, 0) }} />
          </div>
          <div className="table-wrap" style={{ marginBottom: 16 }}>
            <table className="data-table">
              <thead><tr><th>Supplier</th><th className="r">Total Dibeli</th></tr></thead>
              <tbody>
                {perSupplier.map(row => (
                  <tr key={row.supplier}><td>{row.supplier}</td><td className="r">Rp{fmt(row.total)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <DataTable
            title="Riwayat Pembelian"
            columns={ORDER_COLUMNS}
            rows={data.pembelian}
            actions={[]}
            dateKey="tanggal"
            summaryKeys={['total']}
          />
        </div>
      )}
    </div>
  );
}
