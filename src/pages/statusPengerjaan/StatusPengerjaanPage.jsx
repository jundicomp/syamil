import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';

const COLUMNS = [
  { key: 'pic', label: 'PIC' },
  { key: 'noOrder', label: 'No. Order' },
  { key: 'produk', label: 'Produk' },
  { key: 'tahap', label: 'Tahap Sekarang', type: 'badge' },
  { key: 'target', label: 'Target' },
];

export default function StatusPengerjaanPage() {
  const { data } = useData();
  const aktif = data.produksi.filter(p => p.statusSpk === 'Aktif');

  return (
    <div>
      <DataTable
        title="Status Pengerjaan"
        subtitle={`${aktif.length} SPK sedang berjalan`}
        columns={COLUMNS}
        rows={aktif}
        actions={[]}
      />
    </div>
  );
}
