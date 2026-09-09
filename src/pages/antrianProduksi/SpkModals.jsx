import { useState } from 'react';

export function SpkClosingModal({ spk, onClose, onConfirm }) {
  const [note, setNote] = useState('');
  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 400 }}>
        <div className="modal-head">
          <b>Tutup SPK — {spk.noOrder}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <div className="f-field">
          <label>Keterangan Penutupan (wajib)</label>
          <textarea placeholder="mis. Diambil langsung oleh pelanggan, sudah dicek hasil cetaknya." value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
          <button
            type="button" className="btn-gold"
            onClick={() => { if (!note.trim()) { alert('Keterangan wajib diisi.'); return; } onConfirm(note.trim()); }}
          >
            Tutup SPK
          </button>
        </div>
      </div>
    </div>
  );
}

export function SpkCancelModal({ spk, onClose, onConfirm }) {
  const [note, setNote] = useState('');
  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 400 }}>
        <div className="modal-head">
          <b>Batalkan SPK — {spk.noOrder}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <div className="f-field">
          <label>Alasan Pembatalan (wajib)</label>
          <textarea placeholder="mis. Pelanggan membatalkan pesanan." value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Tutup</button>
          <button
            type="button" className="btn-gold" style={{ background: 'var(--danger)' }}
            onClick={() => { if (!note.trim()) { alert('Alasan wajib diisi.'); return; } onConfirm(note.trim()); }}
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
