import { useData } from '../../context/DataContext';
import ExportButtons from '../../components/common/ExportButtons';
import { APP_TODAY, BULAN_LENGKAP } from '../../utils/dateUtils';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

const EXPORT_COLUMNS = [
  { key: 'label', label: 'Keterangan' },
  { key: 'nilai', label: 'Nilai', type: 'currency', align: 'r' },
];

export default function NeracaPage() {
  const { data, bukuKas } = useData();

  const kas = bukuKas.reduce((s, r) => s + (r.tipe === 'Masuk' ? r.jumlah : -r.jumlah), 0);
  const nilaiStok = data.bahanBaku.reduce((s, b) => s + b.stok * b.hargaBeli, 0);
  const piutang = data.penjualan.filter(p => p.status === 'DP').reduce((s, p) => s + p.sisaBayar, 0);
  const totalAset = kas + nilaiStok + piutang;

  const hutangBelumLunas = data.pembelian.filter(p => p.status === 'Belum Lunas').reduce((s, p) => s + p.total, 0);
  const snapshotLabel = `Per ${APP_TODAY.getDate()} ${BULAN_LENGKAP[APP_TODAY.getMonth()]} ${APP_TODAY.getFullYear()} (posisi saat ini)`;

  const exportRows = [
    { label: 'Kas', nilai: kas },
    { label: 'Piutang (DP belum lunas)', nilai: piutang },
    { label: 'Nilai Stok Gudang', nilai: nilaiStok },
    { label: 'Total Aset', nilai: totalAset },
    { label: 'Hutang ke Supplier (Belum Lunas)', nilai: hutangBelumLunas },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Laporan Neraca</h2>
          <div className="page-sub">Neraca sederhana — sebagian dihitung dari data riil</div>
        </div>
      </div>

      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginBottom: 4 }}>
        ℹ️ Neraca itu "foto posisi saat ini", bukan rentang periode — jadi di sini <b>tidak ada filter tanggal</b>,
        cuma tanggal cetaknya saja: <b style={{ color: 'var(--text-soft)' }}>{snapshotLabel}</b>.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <ExportButtons title="Laporan Neraca" rangeLabel={snapshotLabel} columns={EXPORT_COLUMNS} rows={exportRows} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="table-wrap" style={{ padding: '18px 22px' }}>
          <b style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>Aset</b>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
            <span>Kas</span><b>Rp{fmt(kas)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
            <span>Piutang (DP belum lunas)</span><b>Rp{fmt(piutang)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>Nilai Stok Gudang</span><b>Rp{fmt(nilaiStok)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 8, borderTop: '2px solid var(--gold)' }}>
            <b>Total Aset</b><b style={{ color: 'var(--gold)' }}>Rp{fmt(totalAset)}</b>
          </div>
        </div>

        <div className="table-wrap" style={{ padding: '18px 22px' }}>
          <b style={{ fontSize: 14, display: 'block', marginBottom: 12 }}>Kewajiban &amp; Modal</b>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
            <span>Hutang ke Supplier (Belum Lunas)</span><b>Rp{fmt(hutangBelumLunas)}</b>
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
            ⚠ Cuma total dari status "Belum Lunas" di Pembelian — belum ada pelacakan hutang per supplier
            atau fitur "Bayar Hutang" (sama seperti versi HTML aslinya, ini masih gap yang belum ditutup).
          </p>
        </div>
      </div>

      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 14 }}>
        ⚠ Neraca ini <b>tidak seimbang secara formal</b> (Aset ≠ Kewajiban + Modal) karena Modal pemilik belum
        dihitung sama sekali. Anggap ini sebagai ringkasan posisi kas/stok/piutang-hutang, bukan neraca akuntansi resmi.
      </p>
    </div>
  );
}
