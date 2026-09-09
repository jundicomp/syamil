import { useState } from 'react';
import { useData } from '../../context/DataContext';
import KartuSpkTab from './KartuSpkTab';
import { TabelSpkTab, ArsipSpkTab, SpkBatalTab } from './SpkTables';
import SpkCreateModal from './SpkCreateModal';

const TABS = [
  { key: 'kartu', label: 'Kartu SPK' },
  { key: 'tabel', label: 'Tabel SPK' },
  { key: 'arsip', label: 'Arsip SPK' },
  { key: 'batal', label: 'SPK Batal' },
];

export default function AntrianProduksiPage() {
  const [tab, setTab] = useState('kartu');
  const { data } = useData();
  const [showCreate, setShowCreate] = useState(false);

  const belumSpkCount = data.penjualan.filter(p => !data.produksi.some(s => s.noNota === p.noNota)).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Alur SPK</h2>
          <div className="page-sub">{belumSpkCount} nota belum ada SPK</div>
        </div>
        <button className="btn-gold" onClick={() => setShowCreate(true)}>+ Ciptakan SPK</button>
      </div>

      <div className="subtab-switch">
        {TABS.map(t => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {tab === 'kartu' && <KartuSpkTab />}
      {tab === 'tabel' && <TabelSpkTab />}
      {tab === 'arsip' && <ArsipSpkTab />}
      {tab === 'batal' && <SpkBatalTab />}

      {showCreate && <SpkCreateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
