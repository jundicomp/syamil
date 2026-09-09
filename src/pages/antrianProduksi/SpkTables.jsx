import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';

const COLUMNS_AKTIF = [
  { key: 'noOrder', label: 'No. Order' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'tahap', label: 'Tahap', type: 'badge' },
  { key: 'target', label: 'Target' },
  { key: 'pic', label: 'PIC' },
];

const COLUMNS_ARSIP = [
  { key: 'noOrder', label: 'No. Order' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'pic', label: 'PIC' },
  { key: 'closingNote', label: 'Keterangan Penutupan' },
];

const COLUMNS_BATAL = [
  { key: 'noOrder', label: 'No. Order' },
  { key: 'produk', label: 'Produk' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'pic', label: 'PIC' },
  { key: 'cancelNote', label: 'Alasan Batal' },
];

export function TabelSpkTab() {
  const { data } = useData();
  return <DataTable title="Tabel SPK" columns={COLUMNS_AKTIF} rows={data.produksi.filter(p => p.statusSpk === 'Aktif')} actions={[]} dateKey="target" />;
}

export function ArsipSpkTab() {
  const { data } = useData();
  return <DataTable title="Arsip SPK (Selesai)" columns={COLUMNS_ARSIP} rows={data.produksi.filter(p => p.statusSpk === 'Selesai')} actions={[]} dateKey="target" />;
}

export function SpkBatalTab() {
  const { data } = useData();
  return <DataTable title="SPK Batal" columns={COLUMNS_BATAL} rows={data.produksi.filter(p => p.statusSpk === 'Batal')} actions={[]} dateKey="target" />;
}
