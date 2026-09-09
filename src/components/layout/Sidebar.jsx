import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllNavGroups } from '../../data/navConfig';
import { CURRENT_VERSION } from '../../data/changelog';
import { useData } from '../../context/DataContext';
import Icon from '../common/Icon';

function formatBuildTime(iso) {
  return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Sidebar({ collapsed }) {
  const groups = getAllNavGroups();
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useData();
  const [openGroup, setOpenGroup] = useState(null);
  const [flyoutGroup, setFlyoutGroup] = useState(null);

  // Grup yang berisi halaman aktif otomatis terbuka — sisanya tertutup (accordion).
  useEffect(() => {
    const target = groups.find(g => g.items.some(it => it.path === location.pathname));
    if (target) setOpenGroup(target.group);
  }, [location.pathname]);

  // Tutup flyout begitu berpindah mode (ciut/penuh) atau pindah halaman.
  useEffect(() => { setFlyoutGroup(null); }, [collapsed, location.pathname]);

  function toggleGroup(name) {
    setOpenGroup(prev => (prev === name ? null : name));
  }
  function toggleFlyout(name) {
    setFlyoutGroup(prev => (prev === name ? null : name));
  }
  function go(path, label) {
    if (path) navigate(path);
    else alert(`Halaman "${label}" belum dimigrasi (belum masuk Fase 1).`);
    setFlyoutGroup(null);
  }

  const flyoutData = flyoutGroup ? groups.find(g => g.group === flyoutGroup) : null;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div className="mark">
          {settings.logoDataUrl ? (
            <img src={settings.logoDataUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9 }} />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
            </svg>
          )}
        </div>
        {!collapsed && (
          <div className="txt">
            <b>{settings.namaUsaha}</b>
            <span>Sistem Terpadu</span>
          </div>
        )}
      </div>

      <nav className="nav-scroll">
        {groups.map(g => {
          const colorClass = g.color ? `group-${g.color}` : '';
          const isActiveGroup = g.items.some(it => it.path === location.pathname);

          if (collapsed) {
            return (
              <div className={`nav-group ${colorClass}`} key={g.group}>
                <button
                  className={`rail-icon ${isActiveGroup ? 'active' : ''} ${flyoutGroup === g.group ? 'open' : ''}`}
                  onClick={() => toggleFlyout(g.group)}
                >
                  <Icon name={g.items[0]?.icon} />
                  <span className="rail-tooltip">{g.group}</span>
                </button>
              </div>
            );
          }

          const isOpen = openGroup === g.group;
          return (
            <div className={`nav-group ${colorClass}`} key={g.group}>
              <button className={`group-toggle ${isOpen ? 'open' : ''}`} onClick={() => toggleGroup(g.group)}>
                <span className="group-label">{g.group}</span>
                <span className="chevron"><Icon name="chev" size={13} /></span>
              </button>
              <div className={`settings-items ${isOpen ? 'open' : ''}`}>
                {g.items.map(it => (
                  <a
                    key={it.key}
                    className={`nav-item ${location.pathname === it.path ? 'active' : ''}`}
                    href={it.path || '#'}
                    title={it.label}
                    onClick={e => { e.preventDefault(); go(it.path, it.label); }}
                  >
                    <Icon name={it.icon} />
                    <span>{it.label}</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {collapsed && flyoutData && (
        <>
          <div className="rail-flyout-backdrop show" onClick={() => setFlyoutGroup(null)} />
          <div className="rail-flyout show">
            <h3>{flyoutData.group}</h3>
            <p className="sub">{flyoutData.items.length} halaman</p>
            {flyoutData.items.map(it => (
              <div
                key={it.key}
                className={`rail-flyout-item ${location.pathname === it.path ? 'active' : ''}`}
                onClick={() => go(it.path, it.label)}
              >
                <Icon name={it.icon} size={15} />
                <span>{it.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="nav-bottom">
        <button
          onClick={() => navigate('/changelog')}
          title="Lihat Changelog"
          className="version-footer"
        >
          <span className="v">v{CURRENT_VERSION}</span>
          {!collapsed && <span className="t">Push: {formatBuildTime(__BUILD_TIME__)}</span>}
        </button>
      </div>
    </aside>
  );
}
