import { useTheme } from '../../context/ThemeContext';
import Icon from '../common/Icon';

export default function Topbar({ crumb, title }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="topbar">
      <div>
        <div className="crumb">{crumb}</div>
        <h1 className="page-title-top">{title}</h1>
      </div>
      <div className="spacer" />
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
