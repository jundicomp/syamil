import { useState } from 'react';
import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function RekonsiliasiKasModal({ jenisKas, saldoSistem, onClose }) {
  const { addRow } = useData();
  const [saldoFisik, setSaldoFisik] = useState(saldoSistem);

  const selisih = (Number(saldoFisik) || 0) - saldoSistem;

  function handleSave() {
    addRow('rekonsiliasiKas', {
      tanggal: '12 Agu 2026', jenisKas, saldoSistem, saldoFisik: Number(saldoFisik), selisih,
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-head">
          <b>Rekonsiliasi Kas {jenisKas === 'Toko' ? '— Peti Cash / Kasir' : '— Rekening Bank'}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <div className="f-field">
          <label>Saldo Sistem (otomatis)</label>
          <input value={`Rp${fmt(saldoSistem)}`} disabled />
        </div>
        <div className="f-field">
          <label>{jenisKas === 'Toko' ? 'Saldo Fisik (hasil hitung uang tunai)' : 'Saldo Rekening (sesuai buku/aplikasi bank)'}</label>
          <input type="number" value={saldoFisik} onChange={e => setSaldoFisik(e.target.value)} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 9,
          background: selisih !== 0 ? 'var(--total-red-bg)' : 'var(--panel-2)', marginBottom: 14,
        }}>
          <span style={{ fontSize: 12.5 }}>Selisih</span>
          <b style={{ color: selisih !== 0 ? 'var(--total-red)' : 'var(--text)' }}>{selisih > 0 ? '+' : ''}Rp{fmt(selisih)}</b>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-faint)', margin: '-8px 0 14px' }}>
          Ini murni catatan pembanding (audit) — tidak otomatis mengubah Saldo Sistem. Kalau ada selisih,
          telusuri dulu penyebabnya (transaksi belum tercatat, salah input, dll) sebelum menyesuaikan manual.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
          <button type="button" className="btn-gold" onClick={handleSave}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
