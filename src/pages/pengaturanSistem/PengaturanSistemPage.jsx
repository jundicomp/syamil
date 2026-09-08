import { useState } from 'react';
import TabPerusahaan from './TabPerusahaan';
import TabKeuangan from './TabKeuangan';
import TabUser from './TabUser';
import TabSistem from './TabSistem';

const TABS = [
  { key: 'perusahaan', label: 'Perusahaan', Component: TabPerusahaan },
  { key: 'keuangan', label: 'Keuangan', Component: TabKeuangan },
  { key: 'user', label: 'User', Component: TabUser },
  { key: 'sistem', label: 'Sistem', Component: TabSistem },
];

export default function PengaturanSistemPage() {
  const [tab, setTab] = useState('perusahaan');
  const Active = TABS.find(t => t.key === tab).Component;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pengaturan Sistem</h2>
          <div className="page-sub">Identitas usaha, keuangan, pengguna, dan sistem</div>
        </div>
      </div>
      <div className="subtab-switch">
        {TABS.map(t => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <Active />
    </div>
  );
}
