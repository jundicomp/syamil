import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';
import { downloadProdukTemplate, parseProdukExcel } from '../../utils/produkExcelImport';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function ProdukImportModal({ onClose }) {
  const { addRow } = useData();
  const { notifyError, notifySuccess } = useNotify();
  const fileInputRef = useRef(null);
  const [hasil, setHasil] = useState(null); // { valid, invalid, total }
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const r = await parseProdukExcel(file);
      setHasil(r);
      if (r.valid.length === 0) notifyError('Tidak ada baris valid di file ini — cek format sesuai template.');
    } catch {
      notifyError('Gagal membaca file. Pastikan formatnya .xlsx sesuai template.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  function handleImportkan() {
    if (!hasil || hasil.valid.length === 0) return;
    hasil.valid.forEach(row => addRow('produk', row));
    notifySuccess(`${hasil.valid.length} produk berhasil diimpor.`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <div className="modal-head">
          <b>Import Produk dari Excel</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: -4 }}>
          Kolom yang dibaca: <b>Nama, Kategori, Satuan, Harga</b>. Semua produk yang diimpor otomatis
          bertipe "Tetap" — produk Matriks Harga tetap perlu disiapkan satu-satu (matriksnya butuh
          input tier + bahan yang tidak muat di 1 baris Excel).
        </p>

        <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: 14 }} onClick={downloadProdukTemplate}>
          ⬇ Unduh Template Excel
        </button>

        <div className="f-field">
          <label>Upload File Terisi (.xlsx)</label>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFile} disabled={busy} />
        </div>

        {hasil && (
          <div style={{ background: 'var(--panel-2)', borderRadius: 10, padding: '12px 14px', marginTop: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 12.5, marginBottom: 6 }}>
              <b style={{ color: '#2FAE6D' }}>{hasil.valid.length} baris valid</b>
              {hasil.invalid.length > 0 && <> · <b style={{ color: 'var(--total-red)' }}>{hasil.invalid.length} ditolak</b></>}
              {' '}dari {hasil.total} baris total.
            </div>
            {hasil.invalid.length > 0 && (
              <div style={{ maxHeight: 100, overflowY: 'auto', fontSize: 11, color: 'var(--text-faint)' }}>
                {hasil.invalid.map((x, i) => <div key={i}>Baris {x.baris}: {x.alasan}</div>)}
              </div>
            )}
            {hasil.valid.length > 0 && (
              <div style={{ maxHeight: 140, overflowY: 'auto', marginTop: 8, borderTop: '1px dashed var(--line)', paddingTop: 8 }}>
                {hasil.valid.slice(0, 8).map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '3px 0' }}>
                    <span>{p.nama} <span style={{ color: 'var(--text-faint)' }}>({p.kategori})</span></span>
                    <span>Rp{fmt(p.harga)}</span>
                  </div>
                ))}
                {hasil.valid.length > 8 && <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>+{hasil.valid.length - 8} lainnya...</div>}
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
          <button type="button" className="btn-gold" onClick={handleImportkan} disabled={!hasil || hasil.valid.length === 0}>
            Importkan {hasil?.valid.length ? `(${hasil.valid.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
