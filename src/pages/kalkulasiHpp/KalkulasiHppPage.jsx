import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import HppCreateModal from './HppCreateModal';

const COLUMNS = [
  { key: 'noOrder', label: 'No. SPK' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'hargaJual', label: 'Harga Jual', type: 'currency', align: 'r' },
  { key: 'totalHpp', label: 'Total HPP', type: 'currency', align: 'r' },
  { key: 'margin', label: 'Margin', type: 'currency', align: 'r' },
];

export default function KalkulasiHppPage() {
  const { data } = useData();
  const [showCreate, setShowCreate] = useState(false);

  const rows = data.hppCalc.map(h => ({ ...h, margin: h.hargaJual - h.totalHpp }));

  return (
    <div>
      <DataTable
        title="Kalkulasi HPP"
        subtitle="⚠ Akses terbatas — mestinya cuma Owner/Admin (belum ada login sungguhan)"
        columns={COLUMNS}
        rows={rows}
        actions={[]}
        onAdd={() => setShowCreate(true)}
        dateKey="tanggal"
        summaryKeys={['hargaJual', 'totalHpp', 'margin']}
      />
      {showCreate && <HppCreateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
