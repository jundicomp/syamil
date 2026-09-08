import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { CURRENT_VERSION } from '../../data/changelog';
import Icon from '../common/Icon';

function formatBuildTime(iso) {
  return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Topbar({ crumb, title }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div>
        <div className="crumb">{crumb}</div>
        <h1 className="page-title-top">{title}</h1>
      </div>
      <div className="spacer" />
      <button
        onClick={() => navigate('/changelog')}
        title="Lihat Changelog"
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1,
          background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 9,
          padding: '6px 12px', cursor: 'pointer', color: 'var(--text-soft)',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)' }}>v{CURRENT_VERSION}</span>
        <span style={{ fontSize: 9.5, color: 'var(--text-faint)' }}>Push: {formatBuildTime(__BUILD_TIME__)}</span>
      </button>
      <button className="theme-toggle" onClick={toggleTheme} title="Ganti mode tampilan">
        <Icon name={theme === 'day' ? 'moon' : 'sun'} size={15} />
      </button>
      <div className="kasir-chip">
        <div className="av">PB</div>
        <b>Pak Budi</b>
      </div>
    </div>
  );
}
