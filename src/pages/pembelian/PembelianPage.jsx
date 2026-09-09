import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import ExportButtons from '../../components/common/ExportButtons';
import PembelianCartModal from './PembelianCartModal';

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

export default function PembelianPage() {
  const [tab, setTab] = useState('order');
  const { data } = useData();
  const [showCart, setShowCart] = useState(false);

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
        <button className={tab === 'laporan' ? 'active' : ''} onClick={() => setTab('laporan')}>Laporan</button>
      </div>

      {tab === 'order' ? (
        <DataTable
          title="Order Pembelian"
          columns={ORDER_COLUMNS}
          rows={data.pembelian}
          actions={[]}
          onAdd={() => setShowCart(true)}
          dateKey="tanggal"
          summaryKeys={['total']}
        />
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

      {showCart && <PembelianCartModal onClose={() => setShowCart(false)} />}
    </div>
  );
}
