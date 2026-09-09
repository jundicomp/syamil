import { useState } from 'react';
import { useData } from '../../context/DataContext';
import OwnerView from './OwnerView';
import PersonalView from './PersonalView';

export default function MarketingDashboardPage() {
  const { data } = useData();
  const [viewAs, setViewAs] = useState('');
  const marketers = data.pengguna.filter(p => p.role === 'Marketing' && p.status === 'Aktif');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard Marketing</h2>
          <div className="page-sub">Hasil kinerja tim marketing, berbasis penjualan riil</div>
        </div>
      </div>

      <div className="f-field" style={{ maxWidth: 320, marginBottom: 18 }}>
        <label>Lihat Sebagai <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(simulasi, belum ada login sungguhan)</span></label>
        <select value={viewAs} onChange={e => setViewAs(e.target.value)}>
          <option value="">Semua (Owner/Admin)</option>
          {marketers.map(m => <option key={m.id} value={m.nama}>{m.nama}</option>)}
        </select>
      </div>

      {viewAs ? <PersonalView nama={viewAs} /> : <OwnerView />}
    </div>
  );
}
