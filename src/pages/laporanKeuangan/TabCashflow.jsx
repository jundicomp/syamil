import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import DateRangeFilter from '../../components/common/DateRangeFilter';
import ExportButtons from '../../components/common/ExportButtons';
import { parseTanggalID, inRange, formatRangeLabel } from '../../utils/dateUtils';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function kategoriDari(keterangan) {
  if (keterangan.startsWith('Penjualan')) return 'Penjualan';
  if (keterangan.startsWith('Terima pelunasan')) return 'Piutang Tertagih';
  if (keterangan.startsWith('Pembelian')) return 'Pembelian';
  if (keterangan.startsWith('Bayar hutang')) return 'Hutang Dibayar';
  return 'Lain-lain';
}

const EXPORT_COLUMNS = [
  { key: 'kategori', label: 'Kategori' },
  { key: 'jumlah', label: 'Jumlah', type: 'currency', align: 'r' },
];

export default function TabCashflow() {
  const { bukuKas } = useData();
  const [range, setRange] = useState({ from: null, to: null });

  const rowsDalamRentang = useMemo(
    () => bukuKas.filter(r => inRange(parseTanggalID(r.tanggal), range.from, range.to)),
    [bukuKas, range]
  );

  const masuk = rowsDalamRentang.filter(r => r.tipe === 'Masuk');
  const keluar = rowsDalamRentang.filter(r => r.tipe === 'Keluar');

  function groupByKategori(rows) {
    const map = {};
    rows.forEach(r => {
      const k = kategoriDari(r.keterangan);
      map[k] = (map[k] || 0) + r.jumlah;
    });
    return Object.entries(map).map(([kategori, jumlah]) => ({ kategori, jumlah }));
  }

  const masukPerKategori = groupByKategori(masuk);
  const keluarPerKategori = groupByKategori(keluar);
  const totalMasuk = masuk.reduce((s, r) => s + r.jumlah, 0);
  const totalKeluar = keluar.reduce((s, r) => s + r.jumlah, 0);
  const netCashflow = totalMasuk - totalKeluar;
  const rangeLabel = formatRangeLabel(range.from, range.to);

  const exportRows = [
    ...masukPerKategori.map(r => ({ kategori: `Masuk — ${r.kategori}`, jumlah: r.jumlah })),
    ...keluarPerKategori.map(r => ({ kategori: `Keluar — ${r.kategori}`, jumlah: -r.jumlah })),
  ];

  return (
    <div>
      <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <ExportButtons title="Laporan Cashflow" rangeLabel={rangeLabel} columns={EXPORT_COLUMNS} rows={exportRows} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="table-wrap" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: '#1F6B39', letterSpacing: '.04em', marginBottom: 10 }}>Kas Masuk</div>
          {masukPerKategori.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>Tidak ada kas masuk pada rentang ini.</p>
          ) : masukPerKategori.map(r => (
            <div key={r.kategori} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-soft)', fontSize: 12.5 }}>
              <span>{r.kategori}</span><span>Rp{fmt(r.jumlah)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontWeight: 800 }}>
            <span>Total Masuk</span><span style={{ color: '#1F6B39' }}>Rp{fmt(totalMasuk)}</span>
          </div>
        </div>

        <div className="table-wrap" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: 'var(--total-red)', letterSpacing: '.04em', marginBottom: 10 }}>Kas Keluar</div>
          {keluarPerKategori.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>Tidak ada kas keluar pada rentang ini.</p>
          ) : keluarPerKategori.map(r => (
            <div key={r.kategori} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-soft)', fontSize: 12.5 }}>
              <span>{r.kategori}</span><span>Rp{fmt(r.jumlah)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontWeight: 800 }}>
            <span>Total Keluar</span><span style={{ color: 'var(--total-red)' }}>Rp{fmt(totalKeluar)}</span>
          </div>
        </div>
      </div>

      <div className="table-wrap" style={{ padding: '18px 20px', maxWidth: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
          <b>Arus Kas Bersih (Net Cashflow)</b>
          <b style={{ color: netCashflow >= 0 ? '#1F6B39' : 'var(--total-red)' }}>Rp{fmt(netCashflow)}</b>
        </div>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12, maxWidth: 520 }}>
        Versi sederhana — 2 kelompok (Masuk/Keluar), bukan format akuntansi baku 3 kelompok
        (Operasi/Investasi/Pendanaan). Digabung dari Kas Toko + Kas Bank.
      </p>
    </div>
  );
}
