import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import { PRODUKSI_COLUMNS_AKTIF, withHistoryRingkas, groupByNota } from './produksiColumns';
import SpkEditModal from './SpkEditModal';

const COLUMNS_ARSIP = [
  { key: 'noOrder', label: 'No. SPK' },
  { key: 'noNota', label: 'No. Nota' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'pic', label: 'PIC' },
  { key: 'closingNote', label: 'Keterangan Penutupan' },
];

const COLUMNS_BATAL = [
  { key: 'noOrder', label: 'No. SPK' },
  { key: 'noNota', label: 'No. Nota' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'pic', label: 'PIC' },
  { key: 'cancelNote', label: 'Alasan Batal' },
];

export function TabelSpkTab() {
  const { data, deleteRow } = useData();
  const rows = groupByNota(withHistoryRingkas(data.produksi.filter(p => p.statusSpk === 'Aktif')));
  const [editSpk, setEditSpk] = useState(null);

  return (
    <div>
      <DataTable
        title="Tabel SPK"
        subtitle={`${rows.length} SPK aktif — Edit untuk koreksi data salah input, Hapus untuk menghapus SPK sepenuhnya`}
        columns={PRODUKSI_COLUMNS_AKTIF}
        rows={rows}
        actions={['edit', 'delete']}
        onEdit={row => setEditSpk(row)}
        onDelete={row => deleteRow('produksi', row.id)}
        dateKey="target"
      />
      {editSpk && <SpkEditModal spk={editSpk} onClose={() => setEditSpk(null)} />}
    </div>
  );
}

export function ArsipSpkTab() {
  const { data } = useData();
  return <DataTable title="Arsip SPK (Selesai)" columns={COLUMNS_ARSIP} rows={data.produksi.filter(p => p.statusSpk === 'Selesai')} actions={[]} dateKey="target" />;
}

export function SpkBatalTab() {
  const { data } = useData();
  return <DataTable title="SPK Batal" columns={COLUMNS_BATAL} rows={data.produksi.filter(p => p.statusSpk === 'Batal')} actions={[]} dateKey="target" />;
}
