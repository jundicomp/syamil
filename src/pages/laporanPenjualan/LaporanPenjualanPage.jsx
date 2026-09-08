import { useData } from '../../context/DataContext';
import DataTable from '../../components/common/DataTable';

const COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'noNota', label: 'No. Nota' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'kodeMarketing', label: 'Kode Marketing' },
  { key: 'total', label: 'Total', type: 'currency', align: 'r' },
  { key: 'sisaBayar', label: 'Sisa Bayar', type: 'currency', align: 'r' },
  { key: 'status', label: 'Status', type: 'badge' },
];

export default function LaporanPenjualanPage() {
  const { data } = useData();
  const totalOmzet = data.penjualan.reduce((s, r) => s + r.total, 0);

  return (
    <div>
      <DataTable
        title="Laporan Penjualan"
        subtitle={`${data.penjualan.length} transaksi · Total omzet Rp${totalOmzet.toLocaleString('id-ID')}`}
        columns={COLUMNS}
        rows={data.penjualan}
        actions={[]}
      />
      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
        Data ini masih dari contoh — transaksi baru akan otomatis muncul di sini setelah modul Kasir (POS) dimigrasi (Fase 4).
      </p>
    </div>
  );
}
