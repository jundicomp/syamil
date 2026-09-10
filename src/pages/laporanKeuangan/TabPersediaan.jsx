import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import DateRangeFilter from '../../components/common/DateRangeFilter';
import ExportButtons from '../../components/common/ExportButtons';
import { parseTanggalID, inRange, formatRangeLabel } from '../../utils/dateUtils';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

const EXPORT_COLUMNS = [
  { key: 'bahan', label: 'Bahan' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'stokAwal', label: 'Stok Awal', align: 'r' },
  { key: 'masuk', label: 'Masuk', align: 'r' },
  { key: 'keluar', label: 'Keluar', align: 'r' },
  { key: 'stokAkhir', label: 'Stok Akhir', align: 'r' },
  { key: 'nilai', label: 'Nilai Persediaan', type: 'currency', align: 'r' },
];

export default function TabPersediaan() {
  const { data } = useData();
  const [range, setRange] = useState({ from: null, to: null });

  const ledgerDalamRentang = useMemo(
    () => data.stokLedger.filter(r => inRange(parseTanggalID(r.tanggal), range.from, range.to)),
    [data.stokLedger, range]
  );

  const rows = useMemo(() => {
    return data.bahanBaku.map(b => {
      const gerakan = ledgerDalamRentang.filter(r => r.bahan === b.nama);
      const masuk = gerakan.filter(r => r.tipe === 'Masuk').reduce((s, r) => s + r.qty, 0);
      const keluar = gerakan.filter(r => r.tipe === 'Keluar').reduce((s, r) => s + r.qty, 0);
      const stokAkhir = b.stok; // stok sistem saat ini selalu jadi titik akhir
      const stokAwal = stokAkhir - masuk + keluar; // dihitung mundur dari pergerakan dalam rentang
      return {
        bahan: b.nama, satuan: b.satuan, stokAwal, masuk, keluar, stokAkhir,
        nilai: stokAkhir * b.hargaBeli,
      };
    });
  }, [data.bahanBaku, ledgerDalamRentang]);

  const totalNilai = rows.reduce((s, r) => s + r.nilai, 0);
  const rangeLabel = formatRangeLabel(range.from, range.to);

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: '1fr', marginBottom: 16, maxWidth: 280 }}>
        <div className="stat-card"><div className="lbl">Total Nilai Persediaan Saat Ini</div><div className="val" style={{ color: 'var(--gold)' }}>Rp{fmt(totalNilai)}</div></div>
      </div>

      <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <ExportButtons title="Laporan Persediaan" rangeLabel={rangeLabel} columns={EXPORT_COLUMNS} rows={rows} summaryKeys={['nilai']} summary={{ nilai: totalNilai }} />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bahan</th><th>Satuan</th>
              <th className="r">Stok Awal</th><th className="r">Masuk</th><th className="r">Keluar</th>
              <th className="r">Stok Akhir</th><th className="r">Nilai Persediaan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.bahan}>
                <td>{r.bahan}</td>
                <td>{r.satuan}</td>
                <td className="r">{r.stokAwal}</td>
                <td className="r" style={{ color: '#1F6B39' }}>{r.masuk > 0 ? `+${r.masuk}` : '0'}</td>
                <td className="r" style={{ color: 'var(--total-red)' }}>{r.keluar > 0 ? `-${r.keluar}` : '0'}</td>
                <td className="r"><b>{r.stokAkhir}</b></td>
                <td className="r">Rp{fmt(r.nilai)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
        "Masuk" dari Pembelian, "Keluar" dari pemakaian produksi (Kalkulasi HPP) atau penyesuaian Stok Opname yang diterapkan.
        Stok Akhir selalu mengikuti Stok Sistem saat ini; Stok Awal dihitung mundur dari pergerakan pada rentang yang dipilih.
      </p>
    </div>
  );
}
