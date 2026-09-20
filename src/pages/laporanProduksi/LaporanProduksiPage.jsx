import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import { PRODUKSI_COLUMNS_LAPORAN, withHistoryRingkas, groupByNota } from '../antrianProduksi/produksiColumns';
import NotaSpkDetailModal from '../antrianProduksi/NotaSpkDetailModal';

export default function LaporanProduksiPage() {
  const { data } = useData();
  const rows = groupByNota(withHistoryRingkas(data.produksi));
  const [viewNota, setViewNota] = useState(null);

  return (
    <div>
      <DataTable
        title="Laporan Produksi"
        subtitle={`${data.produksi.length} SPK tercatat — klik ikon mata untuk lihat semua SPK dalam satu Nota`}
        columns={PRODUKSI_COLUMNS_LAPORAN}
        rows={rows}
        actions={['view']}
        onView={row => setViewNota(row.noNota)}
        dateKey="target"
      />
      {viewNota && <NotaSpkDetailModal noNota={viewNota} onClose={() => setViewNota(null)} />}
    </div>
  );
}
