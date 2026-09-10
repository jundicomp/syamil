import { useState } from 'react';
import TabPenjualan from './TabPenjualan';
import TabPembelian from './TabPembelian';
import TabPersediaan from './TabPersediaan';
import TabKas from './TabKas';
import TabPiutangHutang from './TabPiutangHutang';
import TabLabaRugi from './TabLabaRugi';
import TabCashflow from './TabCashflow';

const TABS = [
  { key: 'penjualan', label: 'Penjualan', Comp: TabPenjualan },
  { key: 'pembelian', label: 'Pembelian', Comp: TabPembelian },
  { key: 'persediaan', label: 'Persediaan', Comp: TabPersediaan },
  { key: 'kas', label: 'Kas Toko/Bank', Comp: TabKas },
  { key: 'piutangHutang', label: 'Piutang/Hutang', Comp: TabPiutangHutang },
  { key: 'labaRugi', label: 'Laba Rugi', Comp: TabLabaRugi },
  { key: 'cashflow', label: 'Cashflow', Comp: TabCashflow },
];

export default function LaporanKeuanganPage() {
  const [tab, setTab] = useState('penjualan');
  const Active = TABS.find(t => t.key === tab)?.Comp ?? TabPenjualan;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Laporan Keuangan</h2>
          <div className="page-sub">Penjualan &middot; Pembelian &middot; Persediaan &middot; Kas &middot; Piutang/Hutang &middot; Laba Rugi &middot; Cashflow</div>
        </div>
      </div>
      <div className="subtab-switch" style={{ flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <Active />
    </div>
  );
}
