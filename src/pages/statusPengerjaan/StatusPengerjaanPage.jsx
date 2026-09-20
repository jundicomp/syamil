import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import { PRODUKSI_FULL_COLUMNS, withHistoryRingkas } from '../antrianProduksi/produksiColumns';

export default function StatusPengerjaanPage() {
  const { data } = useData();
  const aktif = withHistoryRingkas(data.produksi.filter(p => p.statusSpk === 'Aktif'));

  return (
    <div>
      <DataTable
        title="Status Pengerjaan"
        subtitle={`${aktif.length} SPK sedang berjalan`}
        columns={PRODUKSI_FULL_COLUMNS}
        rows={aktif}
        actions={[]}
        dateKey="target"
      />
    </div>
  );
}
