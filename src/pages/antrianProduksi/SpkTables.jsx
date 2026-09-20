import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';
import { PRODUKSI_COLUMNS_AKTIF, withHistoryRingkas } from './produksiColumns';

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
  const { data } = useData();
  const rows = withHistoryRingkas(data.produksi.filter(p => p.statusSpk === 'Aktif'));
  return <DataTable title="Tabel SPK" columns={PRODUKSI_COLUMNS_AKTIF} rows={rows} actions={[]} dateKey="target" />;
}

export function ArsipSpkTab() {
  const { data } = useData();
  return <DataTable title="Arsip SPK (Selesai)" columns={COLUMNS_ARSIP} rows={data.produksi.filter(p => p.statusSpk === 'Selesai')} actions={[]} dateKey="target" />;
}

export function SpkBatalTab() {
  const { data } = useData();
  return <DataTable title="SPK Batal" columns={COLUMNS_BATAL} rows={data.produksi.filter(p => p.statusSpk === 'Batal')} actions={[]} dateKey="target" />;
}
