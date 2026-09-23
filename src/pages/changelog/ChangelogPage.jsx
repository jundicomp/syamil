import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHANGELOG } from '../../data/changelog';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';
import { firstAccessiblePath } from '../../data/navConfig';

function formatTanggal(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ChangelogPage() {
  const { user } = useAuth();
  const { settings, hakAkses } = useData();
  const { notifyError, notifySuccess } = useNotify();
  const navigate = useNavigate();
  const [terbuka, setTerbuka] = useState(() => new Set([CHANGELOG[0]?.version]));
  const [busy, setBusy] = useState(false);

  if (user?.role !== 'Superadmin') {
    navigate(firstAccessiblePath(user?.role, hakAkses), { replace: true });
    return null;
  }

  function toggle(version) {
    setTerbuka(prev => {
      const next = new Set(prev);
      if (next.has(version)) next.delete(version); else next.add(version);
      return next;
    });
  }

  async function handleUnduhPDF() {
    setBusy(true);
    try {
      const { exportChangelogPDF } = await import('../../utils/changelogExport');
      exportChangelogPDF(CHANGELOG, settings);
      notifySuccess('Changelog PDF tersimpan.');
    } catch { notifyError('Gagal membuat PDF. Coba lagi.'); } finally { setBusy(false); }
  }
  async function handleUnduhExcel() {
    setBusy(true);
    try {
      const { exportChangelogExcel } = await import('../../utils/changelogExport');
      exportChangelogExcel(CHANGELOG, settings);
      notifySuccess('Changelog Excel tersimpan.');
    } catch { notifyError('Gagal membuat Excel. Coba lagi.'); } finally { setBusy(false); }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Changelog</h2>
          <div className="page-sub">Riwayat versi & perubahan aplikasi — {CHANGELOG.length} versi tercatat</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline" style={{ padding: '8px 14px', fontSize: 12 }} onClick={handleUnduhExcel} disabled={busy}>⬇ Excel</button>
          <button className="btn-gold" style={{ padding: '8px 14px', fontSize: 12 }} onClick={handleUnduhPDF} disabled={busy}>⬇ PDF</button>
        </div>
      </div>

      {CHANGELOG.map((entry, i) => {
        const buka = terbuka.has(entry.version);
        return (
          <div key={entry.version} className="table-wrap changelog-entry" style={{ padding: 0, marginBottom: 10, overflow: 'hidden' }}>
            <button type="button" className="changelog-head" onClick={() => toggle(entry.version)}>
              <span className={`badge ${i === 0 ? 'badge-pos' : 'badge-neu'}`}>v{entry.version}</span>
              <b style={{ fontSize: 13.5 }}>{entry.judul}</b>
              {i === 0 && <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700 }}>· TERBARU</span>}
              <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 'auto', marginRight: 10 }}>{formatTanggal(entry.tanggal)}</span>
              <span className={`changelog-chevron ${buka ? 'open' : ''}`}>▾</span>
            </button>
            {buka && (
              <ul className="changelog-list">
                {entry.perubahan.map((c, ci) => <li key={ci}>{c}</li>)}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
