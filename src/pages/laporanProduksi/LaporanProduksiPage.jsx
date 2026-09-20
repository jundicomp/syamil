import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import { PRODUKSI_COLUMNS_LAPORAN, withHistoryRingkas } from '../antrianProduksi/produksiColumns';

export default function LaporanProduksiPage() {
  const { data } = useData();
  const rows = withHistoryRingkas(data.produksi);

  return (
    <div>
      <DataTable
        title="Laporan Produksi"
        subtitle={`${data.produksi.length} SPK tercatat`}
        columns={PRODUKSI_COLUMNS_LAPORAN}
        rows={rows}
        actions={[]}
        dateKey="target"
      />
    </div>
  );
}
