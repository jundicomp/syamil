import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { STAGES } from '../../data/seedData';
import { SpkClosingModal, SpkCancelModal } from './SpkModals';

export default function KartuSpkTab() {
  const { data, updateRow } = useData();
  const [closingSpk, setClosingSpk] = useState(null);
  const [cancelSpk, setCancelSpk] = useState(null);

  const aktif = data.produksi.filter(p => p.statusSpk === 'Aktif');

  function moveStage(spk, direction) {
    const idx = STAGES.indexOf(spk.tahap);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= STAGES.length) return;
    const note = prompt(`Catatan pindah dari "${spk.tahap}" ke "${STAGES[nextIdx]}" (wajib diisi):`);
    if (note === null) return; // batal
    if (!note.trim()) { alert('Catatan wajib diisi.'); return; }
    const entry = { from: spk.tahap, to: STAGES[nextIdx], action: direction > 0 ? 'done' : 'back', note: note.trim() };
    updateRow('produksi', spk.id, { tahap: STAGES[nextIdx], history: [...(spk.history || []), entry] });
  }

  function handleClose(note) {
    updateRow('produksi', closingSpk.id, { statusSpk: 'Selesai', closingNote: note });
    setClosingSpk(null);
  }
  function handleCancel(note) {
    updateRow('produksi', cancelSpk.id, { statusSpk: 'Batal', cancelNote: note });
    setCancelSpk(null);
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 12 }}>
        {STAGES.map(stage => (
          <div key={stage}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8, letterSpacing: '.05em' }}>
              {stage} <span style={{ color: 'var(--gold)' }}>({aktif.filter(s => s.tahap === stage).length})</span>
            </div>
            {aktif.filter(s => s.tahap === stage).map(spk => (
              <div key={spk.id} className="table-wrap" style={{ padding: 12, marginBottom: 10 }}>
                <b style={{ fontSize: 12.5 }}>{spk.noOrder}</b>
                <div style={{ fontSize: 12, margin: '3px 0 6px' }}>{spk.produk}</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{spk.pelanggan}</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 8 }}>PIC: {spk.pic} · Target: {spk.target}</div>
                <div style={{ display: 'grid', gridTemplateColumns: stage === 'Desain' ? '1fr' : '1fr 1fr', gap: 6, marginBottom: 6 }}>
                  {stage !== 'Desain' && (
                    <button className="btn-outline" style={{ padding: '5px 0', fontSize: 11 }} onClick={() => moveStage(spk, -1)}>◀ Back</button>
                  )}
                  {stage !== 'Konsumen' ? (
                    <button className="btn-outline" style={{ padding: '5px 0', fontSize: 11 }} onClick={() => moveStage(spk, 1)}>Done ▶</button>
                  ) : (
                    <button className="btn-gold" style={{ padding: '5px 0', fontSize: 11 }} onClick={() => setClosingSpk(spk)}>Tutup SPK</button>
                  )}
                </div>
                <button
                  style={{ width: '100%', padding: '5px 0', fontSize: 10.5, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                  onClick={() => setCancelSpk(spk)}
                >
                  Batalkan
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {closingSpk && <SpkClosingModal spk={closingSpk} onClose={() => setClosingSpk(null)} onConfirm={handleClose} />}
      {cancelSpk && <SpkCancelModal spk={cancelSpk} onClose={() => setCancelSpk(null)} onConfirm={handleCancel} />}
    </div>
  );
}
