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

  function handleLogout() {
    if (confirm('Keluar dari akun ini?')) {
      logout();
      navigate('/login');
    }
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
      <button className="theme-toggle" onClick={toggleTheme} title="Ganti mode tampilan">
        <Icon name={theme === 'day' ? 'moon' : 'sun'} size={15} />
      </button>
      <button className="kasir-chip" onClick={handleLogout} title="Klik untuk keluar" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
        <div className="av">{user ? initials(user.nama) : '?'}</div>
        <b>{user?.nama ?? 'Tamu'}</b>
      </button>
    </div>
  );
}
