import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import HppCreateModal from './HppCreateModal';
import HppEditModal from './HppEditModal';
import HppDetailModal from './HppDetailModal';

const COLUMNS = [
  { key: 'noOrder', label: 'No. SPK' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'hargaJual', label: 'Harga Jual', type: 'currency', align: 'r' },
  { key: 'totalHpp', label: 'Total HPP', type: 'currency', align: 'r' },
  { key: 'margin', label: 'Margin', type: 'currency', align: 'r' },
];

export default function KalkulasiHppPage() {
  const { data, deleteRow } = useData();
  const [showCreate, setShowCreate] = useState(false);
  const [editHpp, setEditHpp] = useState(null);
  const [viewHpp, setViewHpp] = useState(null);

  const rows = data.hppCalc.map(h => ({ ...h, margin: h.hargaJual - h.totalHpp }));

  return (
    <div>
      <DataTable
        title="Kalkulasi HPP"
        subtitle="🔒 Akses terbatas Owner/Admin — sudah ditegakkan lewat Hak Akses · klik ikon mata untuk lembar verifikasi"
        columns={COLUMNS}
        rows={rows}
        actions={['view', 'edit', 'delete']}
        onAdd={() => setShowCreate(true)}
        onView={row => setViewHpp(row)}
        onEdit={row => setEditHpp(row)}
        onDelete={row => deleteRow('hppCalc', row.id)}
        dateKey="tanggal"
        summaryKeys={['hargaJual', 'totalHpp', 'margin']}
      />
      {showCreate && <HppCreateModal onClose={() => setShowCreate(false)} />}
      {editHpp && <HppEditModal hpp={editHpp} onClose={() => setEditHpp(null)} />}
      {viewHpp && <HppDetailModal hpp={viewHpp} onClose={() => setViewHpp(null)} />}
    </div>
  );
}
