import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllNavGroups } from '../../data/navConfig';
import Icon from '../common/Icon';

export default function Sidebar() {
  const groups = getAllNavGroups();
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroup, setOpenGroup] = useState(null);

  // Grup yang berisi halaman aktif otomatis terbuka — sisanya tertutup (accordion).
  useEffect(() => {
    const target = groups.find(g => g.items.some(it => it.path === location.pathname));
    if (target) setOpenGroup(target.group);
  }, [location.pathname]);

  function toggleGroup(name) {
    setOpenGroup(prev => (prev === name ? null : name));
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          </svg>
        </div>
        <div className="txt">
          <b>Percetakan Jaya</b>
          <span>Sistem Terpadu</span>
        </div>
      </div>

      <nav className="nav-scroll">
        {groups.map(g => {
          const colorClass = g.color ? `group-${g.color}` : '';
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
                    onClick={e => {
                      e.preventDefault();
                      if (it.path) navigate(it.path);
                      else alert(`Halaman "${it.label}" belum dimigrasi (belum masuk Fase 1).`);
                    }}
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

      <div className="nav-bottom">
        <div className="user-chip">
          <div className="av">PB</div>
          <div className="u"><b>Pak Budi</b><span>Owner</span></div>
        </div>
      </div>
    </aside>
  );
}
