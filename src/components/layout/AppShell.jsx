import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getAllNavGroups } from '../../data/navConfig';

export default function AppShell() {
  const location = useLocation();
  const groups = getAllNavGroups();
  const [collapsed, setCollapsed] = useState(false);

  let crumb = 'Percetakan Jaya', title = 'Beranda';
  for (const g of groups) {
    const item = g.items.find(it => it.path === location.pathname);
    if (item) { crumb = g.group; title = item.label; break; }
  }

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="main">
        <Topbar crumb={crumb} title={title} collapsed={collapsed} onToggleCollapsed={() => setCollapsed(c => !c)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
