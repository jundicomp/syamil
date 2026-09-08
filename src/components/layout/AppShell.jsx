import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getAllNavGroups } from '../../data/navConfig';

export default function AppShell() {
  const location = useLocation();
  const groups = getAllNavGroups();

  let crumb = 'Percetakan Jaya', title = 'Beranda';
  for (const g of groups) {
    const item = g.items.find(it => it.path === location.pathname);
    if (item) { crumb = g.group; title = item.label; break; }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar crumb={crumb} title={title} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
