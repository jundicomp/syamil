import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';

const COLUMNS = [
  { key: 'noOrder', label: 'No. Order' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'tahap', label: 'Tahap', type: 'badge' },
  { key: 'target', label: 'Target' },
  { key: 'pic', label: 'PIC' },
  { key: 'statusSpk', label: 'Status SPK', type: 'badge' },
];

export default function LaporanProduksiPage() {
  const { data } = useData();

  return (
    <div>
      <DataTable
        title="Laporan Produksi"
        subtitle={`${data.produksi.length} SPK tercatat`}
        columns={COLUMNS}
        rows={data.produksi}
        actions={[]}
        dateKey="target"
      />
    </div>
  );
}
