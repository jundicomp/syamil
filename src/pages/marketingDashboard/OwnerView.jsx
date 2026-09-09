import { useData } from '../../context/DataContext';
import LeaderboardBlock, { computeLeaderboard } from './LeaderboardBlock';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function StatusBadge({ status }) {
  const cls = status === 'Disetujui' ? 'badge-pos' : (status === 'Ditolak' || status === 'Menunggu') ? 'badge-neg' : 'badge-neu';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function OwnerView() {
  const { data, updateRow, anggaranMarketing } = useData();
  const marketers = data.pengguna.filter(p => p.role === 'Marketing' && p.status === 'Aktif');
  const ranked = computeLeaderboard(marketers, data.penjualan);

  const totalTarget = ranked.reduce((s, m) => s + m.target, 0);
  const totalCapaian = ranked.reduce((s, m) => s + m.omzet, 0);
  const terpakai = data.strategiMarketing.filter(s => s.statusPengajuan === 'Disetujui').reduce((s, x) => s + (x.jumlahAnggaran || 0), 0);

  const pending = data.strategiMarketing.filter(s => s.statusPengajuan === 'Menunggu');

  function setujui(id) { updateRow('strategiMarketing', id, { statusPengajuan: 'Disetujui' }); }
  function tolak(id) { updateRow('strategiMarketing', id, { statusPengajuan: 'Ditolak' }); }

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 18 }}>
        <div className="stat-card"><div className="lbl">Target Bulan Ini</div><div className="val">Rp{fmt(totalTarget)}</div></div>
        <div className="stat-card"><div className="lbl">Real Capaian</div><div className="val">Rp{fmt(totalCapaian)}</div></div>
        <div className="stat-card"><div className="lbl">Anggaran Marketing</div><div className="val">Rp{fmt(anggaranMarketing.totalAnggaran)}</div></div>
        <div className="stat-card"><div className="lbl">Terpakai</div><div className="val">Rp{fmt(terpakai)}</div></div>
      </div>

      <LeaderboardBlock ranked={ranked} viewerName={null} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0 }}>Marketing &amp; Kode</label>
          <table className="data-table">
            <thead><tr><th>Nama</th><th>Kode</th><th className="r">Target</th></tr></thead>
            <tbody>
              {marketers.map(m => (
                <tr key={m.id}><td>{m.nama}</td><td><span className="badge badge-pos">{m.kodeMarketing}</span></td><td className="r">Rp{fmt(m.targetBulanan)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0, marginBottom: 4 }}>Antrean Persetujuan Anggaran</label>
          <div className="page-sub" style={{ marginBottom: 12 }}>Ditolak tetap tersimpan sebagai catatan, tidak dihapus.</div>
          {pending.length === 0 ? <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>Tidak ada pengajuan menunggu.</p> : pending.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: '1px solid var(--line-soft)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 12.5, display: 'block' }}>{s.userMarketing} — {s.jenis}</b>
                <span style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{s.catatan}, Rp{fmt(s.jumlahAnggaran)}</span>
              </div>
              <button className="icon-btn" style={{ background: '#1F6B39' }} title="Setujui" onClick={() => setujui(s.id)}>✓</button>
              <button className="icon-btn" style={{ background: 'var(--danger)' }} title="Tolak" onClick={() => tolak(s.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="table-wrap" style={{ padding: '18px 20px', marginTop: 16 }}>
        <label className="settings-section-label" style={{ marginTop: 0 }}>Semua Strategi Marketing</label>
        <table className="data-table">
          <thead><tr><th>Tanggal</th><th>User</th><th>Jenis</th><th>Catatan</th><th>Status</th></tr></thead>
          <tbody>
            {data.strategiMarketing.map(s => (
              <tr key={s.id}>
                <td>{s.tanggal}</td><td>{s.userMarketing}</td><td>{s.jenis}</td><td>{s.catatan}</td>
                <td><StatusBadge status={s.statusPengajuan} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
