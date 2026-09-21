import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';
import DateRangeFilter from '../../components/common/DateRangeFilter';
import { formatRangeLabel } from '../../utils/dateUtils';

export default function DownloadLaporanModal({ onClose }) {
  const { data, bukuKas, settings } = useData();
  const { notifySuccess, notifyError } = useNotify();
  const [range, setRange] = useState({ from: null, to: null });
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const { generateLaporanLengkapPdf } = await import('../../utils/laporanLengkapPdf');
      await generateLaporanLengkapPdf({ data, bukuKas, settings, range });
      notifySuccess('Laporan Keuangan Lengkap tersimpan.');
      onClose();
    } catch {
      notifyError('Gagal membuat PDF. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <b>Unduh Laporan Keuangan Lengkap</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: -4, marginBottom: 14 }}>
          Satu file PDF berisi: Laba Rugi, Cashflow, Neraca, plus lampiran detail Buku Kas, Piutang, dan Hutang.
        </p>

        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 8 }}>
          Pilih Periode Laporan
        </label>
        <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: -4 }}>
          Periode ini berlaku untuk Laba Rugi, Cashflow, dan lampiran Buku Kas. Neraca, Piutang, dan Hutang
          selalu menunjukkan <b>posisi saat ini</b> (bukan per periode), karena sifatnya snapshot.
        </p>
        <div style={{ background: 'var(--panel-2)', borderRadius: 9, padding: '9px 12px', fontSize: 12, marginBottom: 16 }}>
          Periode terpilih: <b>{formatRangeLabel(range.from, range.to)}</b>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={busy}>Batal</button>
          <button type="button" className="btn-gold" onClick={handleDownload} disabled={busy}>
            {busy ? 'Membuat PDF...' : 'Unduh PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
