import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { STAGES } from '../../data/seedData';
import { SpkClosingModal, SpkCancelModal } from './SpkModals';
import { useNotify } from '../../context/NotificationContext';
import { STAGE_COLORS } from './produksiColumns';

export default function KartuSpkTab() {
  const { data, updateRow } = useData();
  const { notifyError, notifySuccess, promptDialog } = useNotify();
  const [closingSpk, setClosingSpk] = useState(null);
  const [cancelSpk, setCancelSpk] = useState(null);

  const aktif = data.produksi.filter(p => p.statusSpk === 'Aktif');

  async function moveStage(spk, direction) {
    const idx = STAGES.indexOf(spk.tahap);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= STAGES.length) return;
    const note = await promptDialog(`Catatan pindah dari "${spk.tahap}" ke "${STAGES[nextIdx]}" (wajib diisi):`, { placeholder: 'Tulis catatan di sini...' });
    if (note === null) return; // batal
    if (!note.trim()) { notifyError('Catatan wajib diisi.'); return; }
    const entry = { from: spk.tahap, to: STAGES[nextIdx], action: direction > 0 ? 'done' : 'back', note: note.trim() };
    updateRow('produksi', spk.id, { tahap: STAGES[nextIdx], history: [...(spk.history || []), entry] });
  }

  function handleClose(note) {
    updateRow('produksi', closingSpk.id, { statusSpk: 'Selesai', closingNote: note });
    notifySuccess(`SPK ${closingSpk.noOrder} ditutup.`);
    setClosingSpk(null);
  }
  function handleCancel(note) {
    updateRow('produksi', cancelSpk.id, { statusSpk: 'Batal', cancelNote: note });
    notifySuccess(`SPK ${cancelSpk.noOrder} dibatalkan.`);
    setCancelSpk(null);
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 12 }}>
        {STAGES.map(stage => {
          const c = STAGE_COLORS[stage];
          const cards = aktif.filter(s => s.tahap === stage);
          return (
            <div key={stage} style={{ background: c.colBg, borderRadius: 14, padding: 12 }}>
              <div style={{
                display: 'flex', alignItems: 'center', marginBottom: 12, padding: '8px 10px',
                borderRadius: 9, background: c.headBg,
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: '#fff' }}>
                  {stage} ({cards.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 60 }}>
                {cards.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(23,23,27,.55)', fontSize: 11, padding: '22px 6px', border: '1px dashed rgba(23,23,27,.2)', borderRadius: 10 }}>
                    Tidak ada SPK
                  </div>
                ) : cards.map(spk => (
                  <div key={spk.id} style={{ background: c.cardBg, border: `1.5px solid ${c.cardBorder}`, borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(20,18,10,.06)' }}>
                    <b style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.02em', color: c.accent }}>{spk.noOrder}</b>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#17171B', margin: '2px 0 7px', lineHeight: 1.3 }}>{spk.produk}</div>
                    <div style={{ fontSize: 10.5, color: '#3A3A3D', fontWeight: 600, marginBottom: 7 }}>{spk.pelanggan}</div>
                    <div style={{ fontSize: 9.5, color: '#57564F', fontWeight: 600, marginBottom: 8 }}>PIC: {spk.pic} · Target: {spk.target}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: stage === 'Desain' ? '1fr' : '1fr 1fr', gap: 6, marginBottom: 6 }}>
                      {stage !== 'Desain' && (
                        <button className="btn-outline" style={{ padding: '5px 0', fontSize: 11, background: 'rgba(255,255,255,.55)' }} onClick={() => moveStage(spk, -1)}>◀ Back</button>
                      )}
                      {stage !== 'Konsumen' ? (
                        <button className="btn-outline" style={{ padding: '5px 0', fontSize: 11, background: 'rgba(255,255,255,.55)' }} onClick={() => moveStage(spk, 1)}>Done ▶</button>
                      ) : (
                        <button className="btn-gold" style={{ padding: '5px 0', fontSize: 11 }} onClick={() => setClosingSpk(spk)}>Tutup SPK</button>
                      )}
                    </div>
                    <button
                      style={{ width: '100%', padding: '5px 0', fontSize: 10.5, background: 'none', border: 'none', color: '#A83232', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => setCancelSpk(spk)}
                    >
                      Batalkan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {closingSpk && <SpkClosingModal spk={closingSpk} onClose={() => setClosingSpk(null)} onConfirm={handleClose} />}
      {cancelSpk && <SpkCancelModal spk={cancelSpk} onClose={() => setCancelSpk(null)} onConfirm={handleCancel} />}
    </div>
  );
}
