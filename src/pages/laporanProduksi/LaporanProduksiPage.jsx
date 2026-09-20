import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import { PRODUKSI_FULL_COLUMNS, withHistoryRingkas } from '../antrianProduksi/produksiColumns';

export default function LaporanProduksiPage() {
  const { data } = useData();
  const rows = withHistoryRingkas(data.produksi);

  return (
    <div>
      <DataTable
        title="Laporan Produksi"
        subtitle={`${data.produksi.length} SPK tercatat`}
        columns={PRODUKSI_FULL_COLUMNS}
        rows={rows}
        actions={[]}
        dateKey="target"
      />
    </div>
  );
}
