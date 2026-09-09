import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import DateRangeFilter from '../../components/common/DateRangeFilter';
import ExportButtons from '../../components/common/ExportButtons';
import { parseTanggalID, inRange, formatRangeLabel } from '../../utils/dateUtils';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

const EXPORT_COLUMNS = [
  { key: 'label', label: 'Keterangan' },
  { key: 'nilai', label: 'Nilai', type: 'currency', align: 'r' },
];

export default function LabaRugiPage() {
  const { data, bukuKas } = useData();
  const [range, setRange] = useState({ from: null, to: null });

  const kasDalamRentang = useMemo(
    () => bukuKas.filter(r => inRange(parseTanggalID(r.tanggal), range.from, range.to)),
    [bukuKas, range]
  );
  const hppDalamRentang = useMemo(
    () => data.hppCalc.filter(h => inRange(parseTanggalID(h.tanggal), range.from, range.to)),
    [data.hppCalc, range]
  );

  const pendapatan = kasDalamRentang.filter(r => r.tipe === 'Masuk').reduce((s, r) => s + r.jumlah, 0);
  const totalBebanKas = kasDalamRentang.filter(r => r.tipe === 'Keluar').reduce((s, r) => s + r.jumlah, 0);
  const totalHppTercatat = hppDalamRentang.reduce((s, h) => s + h.totalHpp, 0);
  const labaKotor = pendapatan - totalBebanKas;
  const rangeLabel = formatRangeLabel(range.from, range.to);

  const exportRows = [
    { label: 'Pendapatan (kas masuk)', nilai: pendapatan },
    { label: 'Total Pengeluaran (kas keluar)', nilai: totalBebanKas },
    { label: 'Estimasi Laba Kotor', nilai: labaKotor },
    { label: 'Referensi — Total HPP Tercatat', nilai: totalHppTercatat },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Laporan Laba Rugi</h2>
          <div className="page-sub">Dihitung otomatis dari Buku Kas &amp; Kalkulasi HPP — bukan angka statis</div>
        </div>
      </div>

      <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <ExportButtons title="Laporan Laba Rugi" rangeLabel={rangeLabel} columns={EXPORT_COLUMNS} rows={exportRows} />
      </div>

      <div className="table-wrap" style={{ padding: '20px 24px', maxWidth: 520 }}>
        <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 10 }}>{rangeLabel}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-soft)' }}>
          <span>Pendapatan (kas masuk)</span><b style={{ color: '#1F6B39' }}>Rp{fmt(pendapatan)}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-soft)' }}>
          <span>Total Pengeluaran (kas keluar)</span><b style={{ color: 'var(--total-red)' }}>Rp{fmt(totalBebanKas)}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 15 }}>
          <b>Estimasi Laba Kotor</b>
          <b style={{ color: labaKotor >= 0 ? '#1F6B39' : 'var(--total-red)' }}>Rp{fmt(labaKotor)}</b>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--line)', fontSize: 12, color: 'var(--text-faint)' }}>
          Referensi — Total HPP tercatat (Kalkulasi HPP) pada periode ini: <b style={{ color: 'var(--text-soft)' }}>Rp{fmt(totalHppTercatat)}</b>
        </div>
      </div>

      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 14, maxWidth: 520 }}>
        ⚠ Ini perhitungan <b>kas masuk-keluar sederhana</b> (cash-basis), bukan laporan laba-rugi akrual formal.
        Belum menghitung penyusutan, dan pengeluaran Pembelian tercampur dengan pengeluaran lain di Buku Kas —
        jadi anggap ini sebagai perkiraan kasar, bukan angka final buat pajak/audit.
      </p>
    </div>
  );
}
