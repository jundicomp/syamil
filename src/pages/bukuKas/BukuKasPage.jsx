import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import ExportButtons from '../../components/common/ExportButtons';
import DateRangeFilter from '../../components/common/DateRangeFilter';
import { parseTanggalID, inRange, formatRangeLabel } from '../../utils/dateUtils';

const EXPORT_COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'tipe', label: 'Tipe' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'jumlah', label: 'Jumlah', type: 'currency', align: 'r' },
  { key: 'saldo', label: 'Saldo', type: 'currency', align: 'r' },
];

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function BukuKasPage() {
  const { bukuKas, addBukuKasEntry } = useData();
  const [tipe, setTipe] = useState('Masuk');
  const [jumlah, setJumlah] = useState(0);
  const [keterangan, setKeterangan] = useState('');
  const [range, setRange] = useState({ from: null, to: null });

  // Saldo berjalan dihitung dari SELURUH riwayat dulu (urutan penting), baru difilter tampilannya.
  const allRowsWithSaldo = useMemo(() => {
    let running = 0;
    const chronological = [...bukuKas].reverse();
    const withSaldo = chronological.map(r => {
      running += r.tipe === 'Masuk' ? r.jumlah : -r.jumlah;
      return { ...r, saldo: running };
    });
    return withSaldo.reverse();
  }, [bukuKas]);

  const rows = useMemo(() => {
    if (!range.from && !range.to) return allRowsWithSaldo;
    return allRowsWithSaldo.filter(r => inRange(parseTanggalID(r.tanggal), range.from, range.to));
  }, [allRowsWithSaldo, range]);

  const saldoAkhir = rows[0]?.saldo ?? allRowsWithSaldo[0]?.saldo ?? 0;
  const totalMasuk = rows.filter(r => r.tipe === 'Masuk').reduce((s, r) => s + r.jumlah, 0);
  const totalKeluar = rows.filter(r => r.tipe === 'Keluar').reduce((s, r) => s + r.jumlah, 0);
  const rangeLabel = formatRangeLabel(range.from, range.to);

  function handleSubmit(e) {
    e.preventDefault();
    if (!keterangan.trim() || jumlah <= 0) { alert('Isi jumlah dan keterangan terlebih dahulu.'); return; }
    addBukuKasEntry(tipe, jumlah, keterangan.trim());
    setJumlah(0); setKeterangan('');
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Buku Kas</h2>
          <div className="page-sub">Terisi otomatis dari transaksi Kasir &amp; Pembelian Lunas, bisa juga dicatat manual</div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 18 }}>
        <div className="stat-card"><div className="lbl">Total Masuk {(range.from || range.to) ? '(periode ini)' : ''}</div><div className="val" style={{ color: '#1F6B39' }}>Rp{fmt(totalMasuk)}</div></div>
        <div className="stat-card"><div className="lbl">Total Keluar {(range.from || range.to) ? '(periode ini)' : ''}</div><div className="val" style={{ color: 'var(--total-red)' }}>Rp{fmt(totalKeluar)}</div></div>
        <div className="stat-card"><div className="lbl">Saldo {(range.from || range.to) ? 'Akhir Periode' : 'Kas'}</div><div className="val" style={{ color: 'var(--gold)' }}>Rp{fmt(saldoAkhir)}</div></div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 2fr auto', gap: 8, marginBottom: 18, alignItems: 'end' }}>
        <div className="f-field" style={{ margin: 0 }}>
          <label>Tipe</label>
          <select value={tipe} onChange={e => setTipe(e.target.value)}>
            <option>Masuk</option><option>Keluar</option>
          </select>
        </div>
        <div className="f-field" style={{ margin: 0 }}>
          <label>Jumlah (Rp)</label>
          <input type="number" min="0" value={jumlah} onChange={e => setJumlah(Number(e.target.value))} />
        </div>
        <div className="f-field" style={{ margin: 0 }}>
          <label>Keterangan</label>
          <input value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="mis. Bayar listrik bulan ini" />
        </div>
        <button type="submit" className="btn-gold" style={{ height: 37 }}>+ Catat</button>
      </form>

      <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <ExportButtons
          title="Buku Kas" reportName="Buku Kas" rangeLabel={rangeLabel}
          columns={EXPORT_COLUMNS} rows={rows}
          summaryKeys={['jumlah']} summary={{ jumlah: totalMasuk - totalKeluar }}
        />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Tanggal</th><th>Tipe</th><th>Keterangan</th><th className="r">Jumlah</th><th className="r">Saldo</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="empty-row">Tidak ada catatan kas pada rentang ini.</td></tr>
            ) : rows.map(r => (
              <tr key={r.id}>
                <td>{r.tanggal}</td>
                <td><span className={`badge ${r.tipe === 'Masuk' ? 'badge-pos' : 'badge-neg'}`}>{r.tipe}</span></td>
                <td>{r.keterangan}</td>
                <td className="r" style={{ color: r.tipe === 'Masuk' ? '#1F6B39' : 'var(--total-red)' }}>
                  {r.tipe === 'Masuk' ? '+' : '-'}Rp{fmt(r.jumlah)}
                </td>
                <td className="r"><b>Rp{fmt(r.saldo)}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
