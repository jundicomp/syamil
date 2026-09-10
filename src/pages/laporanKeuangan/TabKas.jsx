import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import DateRangeFilter from '../../components/common/DateRangeFilter';
import ExportButtons from '../../components/common/ExportButtons';
import RekonsiliasiKasModal from './RekonsiliasiKasModal';
import { parseTanggalID, inRange, formatRangeLabel } from '../../utils/dateUtils';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

const EXPORT_COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'jenisKas', label: 'Jenis Kas' },
  { key: 'tipe', label: 'Tipe' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'jumlah', label: 'Jumlah', type: 'currency', align: 'r' },
];

export default function TabKas() {
  const { bukuKas, addBukuKasEntry } = useData();
  const [jenisAktif, setJenisAktif] = useState('Toko');
  const [tipe, setTipe] = useState('Masuk');
  const [jumlah, setJumlah] = useState(0);
  const [keterangan, setKeterangan] = useState('');
  const [metodeBayar, setMetodeBayar] = useState('Tunai');
  const [range, setRange] = useState({ from: null, to: null });
  const [showRekon, setShowRekon] = useState(false);

  const withJenis = useMemo(() => bukuKas.map(r => ({ ...r, jenisKas: r.jenisKas || 'Toko' })), [bukuKas]);

  const saldoToko = withJenis.filter(r => r.jenisKas === 'Toko').reduce((s, r) => s + (r.tipe === 'Masuk' ? r.jumlah : -r.jumlah), 0);
  const saldoBank = withJenis.filter(r => r.jenisKas === 'Bank').reduce((s, r) => s + (r.tipe === 'Masuk' ? r.jumlah : -r.jumlah), 0);

  const rowsJenis = useMemo(() => withJenis.filter(r => r.jenisKas === jenisAktif), [withJenis, jenisAktif]);
  const rowsWithSaldo = useMemo(() => {
    let running = 0;
    const chrono = [...rowsJenis].reverse();
    const withSaldo = chrono.map(r => { running += r.tipe === 'Masuk' ? r.jumlah : -r.jumlah; return { ...r, saldo: running }; });
    return withSaldo.reverse();
  }, [rowsJenis]);

  const rowsFiltered = useMemo(() => {
    if (!range.from && !range.to) return rowsWithSaldo;
    return rowsWithSaldo.filter(r => inRange(parseTanggalID(r.tanggal), range.from, range.to));
  }, [rowsWithSaldo, range]);

  const rangeLabel = formatRangeLabel(range.from, range.to);
  const saldoAktif = jenisAktif === 'Toko' ? saldoToko : saldoBank;

  function handleSubmit(e) {
    e.preventDefault();
    if (!keterangan.trim() || jumlah <= 0) { alert('Isi jumlah dan keterangan terlebih dahulu.'); return; }
    addBukuKasEntry(tipe, jumlah, keterangan.trim(), metodeBayar);
    setJumlah(0); setKeterangan('');
  }

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <div className="stat-card"><div className="lbl">Saldo Kas Toko (Tunai)</div><div className="val" style={{ color: 'var(--gold)' }}>Rp{fmt(saldoToko)}</div></div>
        <div className="stat-card"><div className="lbl">Saldo Kas Bank</div><div className="val" style={{ color: 'var(--gold)' }}>Rp{fmt(saldoBank)}</div></div>
        <div className="stat-card"><div className="lbl">Total Kas</div><div className="val">Rp{fmt(saldoToko + saldoBank)}</div></div>
      </div>

      <div className="subtab-switch" style={{ marginBottom: 14 }}>
        <button className={jenisAktif === 'Toko' ? 'active' : ''} onClick={() => setJenisAktif('Toko')}>Kas Toko</button>
        <button className={jenisAktif === 'Bank' ? 'active' : ''} onClick={() => setJenisAktif('Bank')}>Kas Bank</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr 0.9fr 1.6fr auto', gap: 8, marginBottom: 14, alignItems: 'end' }}>
        <div className="f-field" style={{ margin: 0 }}>
          <label>Tipe</label>
          <select value={tipe} onChange={e => setTipe(e.target.value)}><option>Masuk</option><option>Keluar</option></select>
        </div>
        <div className="f-field" style={{ margin: 0 }}>
          <label>Jumlah (Rp)</label>
          <input type="number" min="0" value={jumlah} onChange={e => setJumlah(Number(e.target.value))} />
        </div>
        <div className="f-field" style={{ margin: 0 }}>
          <label>Masuk ke</label>
          <select value={metodeBayar} onChange={e => setMetodeBayar(e.target.value)}>
            <option value="Tunai">Kas Toko</option>
            <option value="Transfer">Kas Bank</option>
          </select>
        </div>
        <div className="f-field" style={{ margin: 0 }}>
          <label>Keterangan</label>
          <input value={keterangan} onChange={e => setKeterangan(e.target.value)} placeholder="mis. Bayar listrik bulan ini" />
        </div>
        <button type="submit" className="btn-gold" style={{ height: 37 }}>+ Catat</button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline" onClick={() => setShowRekon(true)}>Rekonsiliasi Kas {jenisAktif}</button>
          <ExportButtons title={`Buku Kas ${jenisAktif}`} rangeLabel={rangeLabel} columns={EXPORT_COLUMNS} rows={rowsFiltered} />
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Tanggal</th><th>Tipe</th><th>Keterangan</th><th className="r">Jumlah</th><th className="r">Saldo</th></tr></thead>
          <tbody>
            {rowsFiltered.length === 0 ? (
              <tr><td colSpan={5} className="empty-row">Tidak ada catatan kas {jenisAktif.toLowerCase()} pada rentang ini.</td></tr>
            ) : rowsFiltered.map(r => (
              <tr key={r.id}>
                <td>{r.tanggal}</td>
                <td><span className={`badge ${r.tipe === 'Masuk' ? 'badge-pos' : 'badge-neg'}`}>{r.tipe}</span></td>
                <td>{r.keterangan}</td>
                <td className="r" style={{ color: r.tipe === 'Masuk' ? '#1F6B39' : 'var(--total-red)' }}>{r.tipe === 'Masuk' ? '+' : '-'}Rp{fmt(r.jumlah)}</td>
                <td className="r"><b>Rp{fmt(r.saldo)}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRekon && <RekonsiliasiKasModal jenisKas={jenisAktif} saldoSistem={saldoAktif} onClose={() => setShowRekon(false)} />}
    </div>
  );
}
