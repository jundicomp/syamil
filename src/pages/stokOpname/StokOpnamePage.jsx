import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import StokOpnameModal from './StokOpnameModal';

const COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'bahan', label: 'Bahan' },
  { key: 'stokSistem', label: 'Stok Sistem', align: 'r' },
  { key: 'stokFisik', label: 'Stok Fisik', align: 'r' },
  { key: 'selisih', label: 'Selisih', align: 'r' },
];

export default function StokOpnamePage() {
  const { data, deleteRow } = useData();
  const [modal, setModal] = useState(null); // { row: null|object }

  return (
    <div>
      <DataTable
        title="Stok Opname"
        subtitle="Catatan hasil hitung fisik gudang — tidak otomatis mengubah Stok Sistem"
        columns={COLUMNS}
        rows={data.stokOpname}
        actions={['edit', 'delete']}
        onAdd={() => setModal({ row: null })}
        onEdit={row => setModal({ row })}
        onDelete={row => deleteRow('stokOpname', row.id)}
        dateKey="tanggal"
      />
      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
        Ini murni catatan pembanding (audit) — kalau ada selisih, penyesuaian Stok Sistem yang sesungguhnya
        tetap harus lewat mekanisme lain (mis. Pembelian atau HPP), sama seperti versi HTML aslinya.
      </p>

      {modal && <StokOpnameModal existingRow={modal.row} onClose={() => setModal(null)} />}
    </div>
  );
}
