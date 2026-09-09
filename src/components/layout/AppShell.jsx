import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getAllNavGroups } from '../../data/navConfig';

export default function AppShell() {
  const location = useLocation();
  const groups = getAllNavGroups();
  const [manualCollapsed, setManualCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 880 : false));

  useEffect(() => {
    function handleResize() { setIsMobile(window.innerWidth <= 880); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Di HP, sidebar otomatis mode ikon-saja — tombol hamburger cuma relevan di desktop.
  const collapsed = isMobile || manualCollapsed;

  let crumb = 'Percetakan Jaya', title = 'Beranda';
  for (const g of groups) {
    const item = g.items.find(it => it.path === location.pathname);
    if (item) { crumb = g.group; title = item.label; break; }
  }

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} />
      <div className="main">
        <Topbar
          crumb={crumb} title={title} collapsed={collapsed}
          onToggleCollapsed={isMobile ? null : () => setManualCollapsed(c => !c)}
        />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
