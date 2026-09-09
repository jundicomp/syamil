import { useState } from 'react';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export function computeLeaderboard(marketers, penjualan) {
  return marketers.map(m => {
    const omzet = penjualan.filter(p => p.kodeMarketing === m.kodeMarketing).reduce((s, p) => s + p.total, 0);
    return { nama: m.nama, kode: m.kodeMarketing, omzet, target: m.targetBulanan || 0 };
  }).sort((a, b) => b.omzet - a.omzet);
}

export default function LeaderboardBlock({ ranked, viewerName }) {
  const [tab, setTab] = useState('bulan');
  const maxOmzet = Math.max(...ranked.map(m => m.omzet), 1);

  return (
    <div className="table-wrap" style={{ padding: '18px 20px', marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <label className="settings-section-label" style={{ marginTop: 0 }}>🏆 Leaderboard Marketing</label>
        <div className="subtab-switch" style={{ margin: 0 }}>
          <button className={tab === 'bulan' ? 'active' : ''} onClick={() => setTab('bulan')}>Bulan Ini</button>
          <button className={tab === 'total' ? 'active' : ''} onClick={() => setTab('total')}>Akumulasi Total</button>
        </div>
      </div>

      {ranked.map((m, i) => {
        const isMe = m.nama === viewerName;
        const pct = m.target ? Math.round((m.omzet / m.target) * 100) : 0;
        const barPct = tab === 'bulan' ? Math.min(100, pct) : Math.round((m.omzet / maxOmzet) * 100);
        return (
          <div
            key={m.nama}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: isMe ? '11px 12px' : '11px 4px',
              borderBottom: isMe ? 'none' : '1px solid var(--line-soft)',
              background: isMe ? 'var(--gold-bg)' : 'transparent', borderRadius: isMe ? 10 : 0, marginBottom: isMe ? 2 : 0,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 12.5, flexShrink: 0,
              background: i === 0 ? '#fff' : 'var(--panel-2)', color: i === 0 ? 'var(--gold-deep)' : 'var(--text-soft)',
            }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block', fontSize: 13.5 }}>
                {m.nama}{isMe && <span style={{ background: 'var(--gold-deep)', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 6, marginLeft: 6 }}>ANDA</span>}
              </b>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{m.kode}</span>
            </div>
            {tab === 'bulan' && (
              <div style={{ flex: 1, height: 6, background: 'var(--panel-2)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${barPct}%`, height: '100%', background: pct >= 100 ? '#1F6B39' : 'var(--gold)' }} />
              </div>
            )}
            <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', minWidth: 130, textAlign: 'right' }}>
              Rp{fmt(m.omzet)} {tab === 'bulan' && <span style={{ fontWeight: 500, color: 'var(--text-faint)' }}>{pct}%</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
