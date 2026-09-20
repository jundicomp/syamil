import { useData } from '../../context/DataContext';
import { STAGES } from '../../data/seedData';
import { STAGE_COLORS } from '../antrianProduksi/produksiColumns';
import { parseTanggalID } from '../../utils/dateUtils';

export default function StatusPengerjaanPage() {
  const { data } = useData();
  const aktif = data.produksi.filter(p => p.statusSpk === 'Aktif');
  const selesai = data.produksi.filter(p => p.statusSpk === 'Selesai');
  const batal = data.produksi.filter(p => p.statusSpk === 'Batal');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const besok = new Date(today); besok.setDate(besok.getDate() + 1);

  const lewatTarget = aktif.filter(p => {
    const t = parseTanggalID(p.target);
    return t && t < today;
  });
  const targetDekat = aktif.filter(p => {
    const t = parseTanggalID(p.target);
    return t && t >= today && t <= besok;
  });

  const perTahap = STAGES.map(stage => ({ stage, count: aktif.filter(p => p.tahap === stage).length }));
  const maxTahap = Math.max(1, ...perTahap.map(t => t.count));

  const perPic = {};
  aktif.forEach(p => { perPic[p.pic] = (perPic[p.pic] || 0) + 1; });
  const picList = Object.entries(perPic).sort((a, b) => b[1] - a[1]);
  const maxPic = Math.max(1, ...picList.map(([, c]) => c));

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <div className="page-sub">Ringkasan visual seluruh SPK — diambil langsung dari data Alur SPK</div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="lbl">SPK Aktif</div><div className="val" style={{ color: 'var(--gold)' }}>{aktif.length}</div></div>
        <div className="stat-card"><div className="lbl">Lewat Target</div><div className="val" style={{ color: lewatTarget.length > 0 ? 'var(--total-red)' : undefined }}>{lewatTarget.length}</div></div>
        <div className="stat-card"><div className="lbl">Target Hari Ini/Besok</div><div className="val" style={{ color: targetDekat.length > 0 ? '#E8A93D' : undefined }}>{targetDekat.length}</div></div>
        <div className="stat-card"><div className="lbl">Selesai</div><div className="val" style={{ color: '#1F6B39' }}>{selesai.length}</div></div>
        <div className="stat-card"><div className="lbl">Batal</div><div className="val">{batal.length}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0 }}>Distribusi per Tahap</label>
          {perTahap.map(({ stage, count }) => {
            const c = STAGE_COLORS[stage];
            return (
              <div key={stage} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700 }}>{stage}</span>
                  <span style={{ color: 'var(--text-faint)' }}>{count} SPK</span>
                </div>
                <div style={{ background: 'var(--panel-2)', borderRadius: 8, height: 14, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(count / maxTahap) * 100}%`, minWidth: count > 0 ? 6 : 0, height: '100%',
                    background: c.headBg, borderRadius: 8, transition: 'width .3s',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0 }}>Beban Kerja per PIC</label>
          {picList.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>Belum ada SPK aktif.</p>
          ) : picList.map(([pic, count]) => (
            <div key={pic} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{pic}</span>
                <span style={{ color: 'var(--text-faint)' }}>{count}</span>
              </div>
              <div style={{ background: 'var(--panel-2)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${(count / maxPic) * 100}%`, height: '100%', background: 'var(--gold)', borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {lewatTarget.length > 0 && (
        <div className="table-wrap" style={{ padding: '18px 20px', marginTop: 16, borderColor: 'var(--total-red)' }}>
          <label className="settings-section-label" style={{ marginTop: 0, color: 'var(--total-red)' }}>⚠ SPK Lewat Target</label>
          {lewatTarget.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '7px 0', borderBottom: '1px solid var(--line-soft)' }}>
              <span><b>{p.noOrder}</b> — {p.produk} ({p.pelanggan})</span>
              <span style={{ color: 'var(--total-red)' }}>Target: {p.target} · PIC: {p.pic}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
