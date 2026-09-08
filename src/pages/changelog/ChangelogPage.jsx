import { CHANGELOG } from '../../data/changelog';

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ChangelogPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Changelog</h2>
          <div className="page-sub">Riwayat versi & perubahan aplikasi</div>
        </div>
      </div>

      {CHANGELOG.map((entry, i) => (
        <div key={entry.version} className="table-wrap" style={{ padding: '18px 22px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className={`badge ${i === 0 ? 'badge-pos' : 'badge-neu'}`}>v{entry.version}</span>
            <b style={{ fontSize: 14 }}>{entry.judul}</b>
            {i === 0 && <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700 }}>· TERBARU</span>}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginBottom: 10 }}>{formatTanggal(entry.tanggal)}</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--text-soft)', lineHeight: 1.7 }}>
            {entry.perubahan.map((c, ci) => <li key={ci}>{c}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
