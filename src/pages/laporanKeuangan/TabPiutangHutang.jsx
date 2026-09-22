import { useState } from 'react';
import { useData } from '../../context/DataContext';
import PiutangTerimaModal from './PiutangTerimaModal';
import PiutangGabunganModal from './PiutangGabunganModal';
import HutangBayarModal from '../pembelian/HutangBayarModal';
import Currency from '../../components/common/Currency';
import { parseTanggalID } from '../../utils/dateUtils';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function hitungUmurHari(tanggalStr) {
  const t = parseTanggalID(tanggalStr);
  if (!t) return 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today - t) / 86400000));
}
function bucketAging(umur) {
  if (umur <= 30) return { label: '0-30 hari', color: '#2FAE6D' };
  if (umur <= 60) return { label: '31-60 hari', color: '#E0923C' };
  if (umur <= 90) return { label: '61-90 hari', color: '#E1665A' };
  return { label: '>90 hari', color: '#B23B2E' };
}
function waLink(kontak, pesan) {
  const nomor = (kontak || '').replace(/[^0-9]/g, '').replace(/^0/, '62');
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
}

export default function TabPiutangHutang() {
  const { data } = useData();
  const [sub, setSub] = useState('piutang');
  const [terimaModal, setTerimaModal] = useState(null);
  const [gabunganModal, setGabunganModal] = useState(false);
  const [bayarModal, setBayarModal] = useState(null);

  const totalPiutang = data.piutang.filter(p => p.status === 'Belum Lunas').reduce((s, p) => s + p.sisa, 0);
  const totalHutang = data.hutang.filter(h => h.status === 'Belum Lunas').reduce((s, h) => s + h.sisa, 0);

  const piutangAktif = data.piutang.filter(p => p.status === 'Belum Lunas').map(p => ({ ...p, umur: hitungUmurHari(p.tanggal) }));
  const agingBuckets = [
    { label: '0-30 hari', min: 0, max: 30, color: '#2FAE6D' },
    { label: '31-60 hari', min: 31, max: 60, color: '#E0923C' },
    { label: '61-90 hari', min: 61, max: 90, color: '#E1665A' },
    { label: '>90 hari', min: 91, max: Infinity, color: '#B23B2E' },
  ].map(b => ({ ...b, total: piutangAktif.filter(p => p.umur >= b.min && p.umur <= b.max).reduce((s, p) => s + p.sisa, 0) }));
  const maxAging = Math.max(1, ...agingBuckets.map(b => b.total));

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
          <div style={{ marginBottom: 16 }}>
            <label className="settings-section-label" style={{ marginTop: 0 }}>Umur Piutang (Aging)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {agingBuckets.map(b => (
                <div key={b.label} style={{ background: 'var(--panel-2)', borderRadius: 9, padding: '9px 11px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: b.color, marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 5 }}>Rp{fmt(b.total)}</div>
                  <div style={{ background: 'var(--line-soft)', borderRadius: 6, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${(b.total / maxAging) * 100}%`, height: '100%', background: b.color, borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Tanggal</th><th>No. Nota</th><th>Pelanggan</th><th className="r">Total</th><th className="r">Dibayar</th><th className="r">Sisa</th><th>Umur</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {data.piutang.length === 0 ? (
                <tr><td colSpan={9} className="empty-row">Belum ada piutang tercatat — semua penjualan sejauh ini Lunas.</td></tr>
              ) : data.piutang.map(p => {
                const umur = hitungUmurHari(p.tanggal);
                const bucket = bucketAging(umur);
                const pelangganInfo = data.pelanggan.find(pl => pl.nama === p.pelanggan);
                const pesanWA = `Halo ${p.pelanggan}, mengingatkan piutang Nota ${p.noNota} tanggal ${p.tanggal} sebesar Rp${fmt(p.sisa)} yang masih belum lunas. Mohon konfirmasi pembayarannya ya, terima kasih — ${data.settings?.namaUsaha || ''}`;
                return (
                  <tr key={p.id}>
                    <td>{p.tanggal}</td><td>{p.noNota}</td><td>{p.pelanggan}</td>
                    <td className="r"><Currency value={p.total} /></td><td className="r"><Currency value={p.dibayar} /></td>
                    <td className="r" style={{ fontWeight: 700 }}><Currency value={p.sisa} numColor={p.sisa > 0 ? 'var(--total-red)' : undefined} /></td>
                    <td>{p.status === 'Belum Lunas' ? <span style={{ color: bucket.color, fontWeight: 700, fontSize: 11 }}>{umur} hari</span> : '-'}</td>
                    <td><span className={`badge ${p.status === 'Lunas' ? 'badge-pos' : 'badge-neg'}`}>{p.status}</span></td>
                    <td>
                      {p.status === 'Belum Lunas' && (
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="btn-outline" style={{ padding: '5px 10px', fontSize: 11 }} onClick={() => setTerimaModal(p)}>Terima</button>
                          {pelangganInfo?.kontak && pelangganInfo.kontak !== '-' && (
                            <a className="btn-outline" style={{ padding: '5px 9px', fontSize: 11, textDecoration: 'none' }} href={waLink(pelangganInfo.kontak, pesanWA)} target="_blank" rel="noopener noreferrer" title="Kirim pengingat via WhatsApp">💬</a>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
            Muncul otomatis dari transaksi Kasir (POS) berstatus DP. Klik "Terima" untuk mencatat pelunasan — otomatis tercatat sebagai Kas Masuk. Tombol 💬 kirim pengingat WhatsApp (perlu No. HP/WA terisi di data Pelanggan).
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
