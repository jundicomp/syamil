import { useState } from 'react';
import { useData } from '../../context/DataContext';
import LeaderboardBlock, { computeLeaderboard } from './LeaderboardBlock';
import ExportButtons from '../../components/common/ExportButtons';

const SALES_EXPORT_COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'noNota', label: 'No. Nota' },
  { key: 'pelanggan', label: 'Pelanggan' },
  { key: 'total', label: 'Total', type: 'currency', align: 'r' },
  { key: 'status', label: 'Status' },
];
const STRATEGI_EXPORT_COLUMNS = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'jenis', label: 'Jenis' },
  { key: 'catatan', label: 'Catatan' },
  { key: 'statusPengajuan', label: 'Status' },
];

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function StatusBadge({ status }) {
  const cls = status === 'Disetujui' ? 'badge-pos' : (status === 'Ditolak' || status === 'Menunggu') ? 'badge-neg' : 'badge-neu';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function PersonalView({ nama }) {
  const { data, addRow, strategiJenisList, addStrategiJenis } = useData();
  const user = data.pengguna.find(p => p.nama === nama);
  const marketers = data.pengguna.filter(p => p.role === 'Marketing' && p.status === 'Aktif');
  const ranked = computeLeaderboard(marketers, data.penjualan);
  const me = ranked.find(m => m.nama === nama) || { omzet: 0, target: user.targetBulanan };
  const rank = Math.max(1, ranked.findIndex(m => m.nama === nama) + 1);
  const pct = me.target ? Math.round((me.omzet / me.target) * 100) : 0;

  const mySales = data.penjualan.filter(p => p.kodeMarketing === user.kodeMarketing);
  const myStrategi = data.strategiMarketing.filter(s => s.userMarketing === nama);

  const [jenis, setJenis] = useState(strategiJenisList[0]);
  const [catatan, setCatatan] = useState('');
  const [ajukan, setAjukan] = useState(false);
  const [jumlah, setJumlah] = useState(0);

  function handleJenisChange(e) {
    if (e.target.value === '__new__') {
      const v = prompt('Tambah jenis strategi baru:');
      if (v && v.trim()) { addStrategiJenis(v.trim()); setJenis(v.trim()); }
      return;
    }
    setJenis(e.target.value);
  }

  function handleSubmitStrategi() {
    if (!catatan.trim()) { alert('Isi catatan strategi terlebih dahulu.'); return; }
    if (ajukan && jumlah <= 0) { alert('Isi jumlah anggaran yang diajukan.'); return; }
    addRow('strategiMarketing', {
      userMarketing: nama, tanggal: '12 Agu 2026', jenis, catatan,
      ajukanAnggaran: ajukan, jumlahAnggaran: ajukan ? jumlah : 0,
      statusPengajuan: ajukan ? 'Menunggu' : 'Tanpa Pengajuan',
    });
    setCatatan(''); setAjukan(false); setJumlah(0);
  }

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 18 }}>
        <div className="stat-card"><div className="lbl">Target Saya</div><div className="val">Rp{fmt(me.target)}</div></div>
        <div className="stat-card"><div className="lbl">Capaian Saya</div><div className="val">Rp{fmt(me.omzet)}</div></div>
        <div className="stat-card"><div className="lbl">Persentase</div><div className="val">{pct}%</div></div>
        <div className="stat-card"><div className="lbl">Peringkat</div><div className="val">#{rank} dari {ranked.length}</div></div>
      </div>

      <LeaderboardBlock ranked={ranked} viewerName={nama} />

      <div className="table-wrap" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="settings-section-label" style={{ marginTop: 0, marginBottom: 4 }}>Penjualan Saya</label>
          <ExportButtons title={`Penjualan Saya - ${nama}`} columns={SALES_EXPORT_COLUMNS} rows={mySales} />
        </div>
        <div className="page-sub" style={{ marginBottom: 12 }}>Cuma transaksi berkode {user.kodeMarketing} — bukan seluruh Laporan Penjualan.</div>
        <table className="data-table">
          <thead><tr><th>Tanggal</th><th>No. Nota</th><th>Pelanggan</th><th className="r">Total</th><th>Status</th></tr></thead>
          <tbody>
            {mySales.length === 0 ? <tr><td colSpan={5} className="empty-row">Belum ada transaksi.</td></tr> : mySales.map(s => (
              <tr key={s.id}><td>{s.tanggal}</td><td>{s.noNota}</td><td>{s.pelanggan}</td><td className="r">Rp{fmt(s.total)}</td><td><StatusBadge status={s.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-wrap" style={{ padding: '18px 20px' }}>
        <label className="settings-section-label" style={{ marginTop: 0 }}>Strategi Saya</label>
        <div className="f-field">
          <label>Jenis Strategi</label>
          <select value={jenis} onChange={handleJenisChange}>
            {strategiJenisList.map(j => <option key={j} value={j}>{j}</option>)}
            <option value="__new__">+ Tambah jenis baru...</option>
          </select>
        </div>
        <div className="f-field">
          <label>Catatan</label>
          <textarea value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Tulis rencana atau catatan strategi..." />
        </div>
        <label className="chk-row">
          <input type="checkbox" checked={ajukan} onChange={e => setAjukan(e.target.checked)} />
          Ajukan sebagai pengeluaran anggaran marketing
        </label>
        {ajukan && (
          <div className="f-field"><label>Jumlah Diajukan (Rp)</label><input type="number" value={jumlah} onChange={e => setJumlah(Number(e.target.value))} /></div>
        )}
        <button className="btn-gold" style={{ marginBottom: 16 }} onClick={handleSubmitStrategi}>Simpan Strategi</button>

        <table className="data-table">
          <thead><tr><th>Tanggal</th><th>Jenis</th><th>Catatan</th><th>Status</th></tr></thead>
          <tbody>
            {myStrategi.length === 0 ? <tr><td colSpan={4} className="empty-row">Belum ada strategi.</td></tr> : myStrategi.map(s => (
              <tr key={s.id}><td>{s.tanggal}</td><td>{s.jenis}</td><td>{s.catatan}</td><td><StatusBadge status={s.statusPengajuan} /></td></tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <ExportButtons title={`Strategi Saya - ${nama}`} columns={STRATEGI_EXPORT_COLUMNS} rows={myStrategi} />
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 10 }}>
          🔒 Antrean persetujuan cuma bisa dibuka Owner — di sini Anda hanya bisa mengajukan &amp; memantau status.
        </p>
      </div>
    </div>
  );
}
