import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';

const COLUMNS = [
  { key: 'tanggalNota', label: 'Tgl. Nota' },
  { key: 'noPO', label: 'No. PO' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'total', label: 'Total', type: 'currency', align: 'r' },
  { key: 'dibayarTunai', label: 'Dibayar Tunai/Bank', type: 'currency', align: 'r' },
  { key: 'hutangAwal', label: 'Hutang (awal)', type: 'currency', align: 'r' },
  { key: 'status', label: 'Status', type: 'badge' },
];

export default function TabPembelian() {
  const { data } = useData();

  const rows = data.pembelian.map(p => ({
    ...p,
    dibayarTunai: p.status === 'Lunas' ? p.total : 0,
    hutangAwal: p.status === 'Belum Lunas' ? p.total : 0,
  }));
  const totalBeli = data.pembelian.reduce((s, r) => s + r.total, 0);

  return (
    <DataTable
      title="Laporan Pembelian"
      subtitle={`${data.pembelian.length} transaksi · Total belanja Rp${totalBeli.toLocaleString('id-ID')}`}
      columns={COLUMNS}
      rows={rows}
      actions={[]}
      dateKey="tanggalNota"
      summaryKeys={['total', 'dibayarTunai', 'hutangAwal']}
    />
  );
}
