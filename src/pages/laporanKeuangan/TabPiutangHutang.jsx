import { useState } from 'react';
import { useData } from '../../context/DataContext';
import PiutangTerimaModal from './PiutangTerimaModal';
import PiutangGabunganModal from './PiutangGabunganModal';
import HutangBayarModal from '../pembelian/HutangBayarModal';
import Currency from '../../components/common/Currency';

export default function TabPiutangHutang() {
  const { data } = useData();
  const [sub, setSub] = useState('piutang');
  const [terimaModal, setTerimaModal] = useState(null);
  const [gabunganModal, setGabunganModal] = useState(false);
  const [bayarModal, setBayarModal] = useState(null);

  const totalPiutang = data.piutang.filter(p => p.status === 'Belum Lunas').reduce((s, p) => s + p.sisa, 0);
  const totalHutang = data.hutang.filter(h => h.status === 'Belum Lunas').reduce((s, h) => s + h.sisa, 0);

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <div className="stat-card"><div className="lbl">Total Piutang Belum Lunas</div><div className="val" style={{ color: 'var(--total-red)' }}><Currency value={totalPiutang} /></div></div>
        <div className="stat-card"><div className="lbl">Total Hutang Belum Lunas</div><div className="val" style={{ color: 'var(--total-red)' }}><Currency value={totalHutang} /></div></div>
        <div className="stat-card"><div className="lbl">Posisi Bersih (Piutang &minus; Hutang)</div><div className="val"><Currency value={totalPiutang - totalHutang} /></div></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="subtab-switch" style={{ marginBottom: 0 }}>
          <button className={sub === 'piutang' ? 'active' : ''} onClick={() => setSub('piutang')}>Piutang Pelanggan</button>
          <button className={sub === 'hutang' ? 'active' : ''} onClick={() => setSub('hutang')}>Hutang Supplier</button>
        </div>
        {sub === 'piutang' && <button className="btn-outline" style={{ padding: '7px 14px', fontSize: 11.5 }} onClick={() => setGabunganModal(true)}>💰 Bayar Gabungan</button>}
      </div>

      {sub === 'piutang' ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Tanggal</th><th>No. Nota</th><th>Pelanggan</th><th className="r">Total</th><th className="r">Dibayar</th><th className="r">Sisa</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {data.piutang.length === 0 ? (
                <tr><td colSpan={8} className="empty-row">Belum ada piutang tercatat — semua penjualan sejauh ini Lunas.</td></tr>
              ) : data.piutang.map(p => (
                <tr key={p.id}>
                  <td>{p.tanggal}</td><td>{p.noNota}</td><td>{p.pelanggan}</td>
                  <td className="r"><Currency value={p.total} /></td><td className="r"><Currency value={p.dibayar} /></td>
                  <td className="r" style={{ fontWeight: 700 }}><Currency value={p.sisa} numColor={p.sisa > 0 ? 'var(--total-red)' : undefined} /></td>
                  <td><span className={`badge ${p.status === 'Lunas' ? 'badge-pos' : 'badge-neg'}`}>{p.status}</span></td>
                  <td>{p.status === 'Belum Lunas' && <button className="btn-outline" style={{ padding: '5px 12px', fontSize: 11.5 }} onClick={() => setTerimaModal(p)}>Terima</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
            Muncul otomatis dari transaksi Kasir (POS) berstatus DP. Klik "Terima" untuk mencatat pelunasan — otomatis tercatat sebagai Kas Masuk.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Tanggal</th><th>No. PO</th><th>Supplier</th><th className="r">Total</th><th className="r">Dibayar</th><th className="r">Sisa</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {data.hutang.length === 0 ? (
                <tr><td colSpan={8} className="empty-row">Belum ada hutang tercatat — semua pembelian sejauh ini Lunas.</td></tr>
              ) : data.hutang.map(h => (
                <tr key={h.id}>
                  <td>{h.tanggal}</td><td>{h.noPO}</td><td>{h.supplier}</td>
                  <td className="r"><Currency value={h.total} /></td><td className="r"><Currency value={h.dibayar} /></td>
                  <td className="r" style={{ fontWeight: 700 }}><Currency value={h.sisa} numColor={h.sisa > 0 ? 'var(--total-red)' : undefined} /></td>
                  <td><span className={`badge ${h.status === 'Lunas' ? 'badge-pos' : 'badge-neg'}`}>{h.status}</span></td>
                  <td>{h.status === 'Belum Lunas' && <button className="btn-outline" style={{ padding: '5px 12px', fontSize: 11.5 }} onClick={() => setBayarModal(h)}>Bayar</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
            Muncul otomatis dari Order Pembelian berstatus Belum Lunas. Klik "Bayar" untuk mencatat pelunasan — otomatis tercatat sebagai Kas Keluar.
          </p>
        </div>
      )}

      {terimaModal && <PiutangTerimaModal piutang={terimaModal} onClose={() => setTerimaModal(null)} />}
      {gabunganModal && <PiutangGabunganModal onClose={() => setGabunganModal(false)} />}
      {bayarModal && <HutangBayarModal hutang={bayarModal} onClose={() => setBayarModal(null)} />}
    </div>
  );
}
