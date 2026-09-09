import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';

function initials(nama) {
  return nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Topbar({ crumb, title, collapsed, onToggleCollapsed }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    if (confirm('Keluar dari akun ini?')) {
      logout();
      navigate('/login');
    }
  }
  function goSettings() {
    setMenuOpen(false);
    navigate('/pengaturan-sistem');
  }

  return (
    <div className="topbar">
      {onToggleCollapsed && (
        <button className="hamburger" onClick={onToggleCollapsed} title={collapsed ? 'Buka sidebar' : 'Ciutkan sidebar'}>
          <Icon name={collapsed ? 'arrowRight' : 'arrowLeft'} size={17} />
        </button>
      )}
      <div>
        <div className="crumb">{crumb}</div>
        <h1 className="page-title-top">{title}</h1>
      </div>
      <div className="spacer" />
      <div className="sheet-pill">
        <span className="dot" />
        <span>Data Dummy · Google Sheets belum tersambung</span>
      </div>

      <div style={{ position: 'relative' }}>
        <button className="kasir-chip" onClick={() => setMenuOpen(o => !o)}>
          <div className="av">{user ? initials(user.nama) : '?'}</div>
          <b>{user?.nama ?? 'Tamu'}</b>
        </button>

        {menuOpen && (
          <>
            <div className="profile-menu-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="profile-menu">
              <div className="profile-menu-header">
                <div className="av-lg">{user ? initials(user.nama) : '?'}</div>
                <div>
                  <b>{user?.nama ?? 'Tamu'}</b>
                  <span>{user?.role ?? '-'}</span>
                </div>
              </div>

              <button className="profile-menu-item" onClick={goSettings}>
                <Icon name="settings" size={16} />
                <span>Pengaturan Sistem</span>
              </button>

              <button className="profile-menu-item" onClick={toggleTheme}>
                <Icon name={theme === 'day' ? 'moon' : 'sun'} size={16} />
                <span>Tampilan Mode</span>
                <span className="profile-menu-badge">{theme === 'day' ? 'Terang' : 'Gelap'}</span>
              </button>

              <div className="profile-menu-divider" />

              <button className="profile-menu-item danger" onClick={handleLogout}>
                <Icon name="logout" size={16} />
                <span>Keluar</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
