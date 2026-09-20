import { useRef, useState } from 'react';
import { useData } from '../../context/DataContext';
import { STAGE_COLORS } from './produksiColumns';
import { useNotify } from '../../context/NotificationContext';

function StageBadge({ tahap }) {
  const c = STAGE_COLORS[tahap];
  if (!c) return <span>{tahap}</span>;
  return (
    <span style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, color: c.accent, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>
      {tahap}
    </span>
  );
}

function StatusPill({ status }) {
  const map = { Aktif: { bg: '#DCEAFB', color: '#2E5FA3' }, Selesai: { bg: '#D9F2DE', color: '#2E8B4C' }, Batal: { bg: '#FBDEEA', color: '#C23D74' } };
  const c = map[status] || map.Aktif;
  return <span style={{ background: c.bg, color: c.color, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>{status}</span>;
}

export default function NotaSpkDetailModal({ noNota, onClose }) {
  const { data, settings } = useData();
  const { notifySuccess, notifyError } = useNotify();
  const reportRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());

  const nota = data.penjualan.find(p => p.noNota === noNota);
  const spkList = data.produksi.filter(p => p.noNota === noNota);

  function toggleExpand(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function captureCanvas() {
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(reportRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
  }

  async function handleSaveJPG() {
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.download = `SPK_${noNota}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      notifySuccess('Gambar JPG tersimpan.');
    } catch {
      notifyError('Gagal membuat JPG. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSavePDF() {
    setBusy(true);
    try {
      const [{ default: jsPDF }, canvas] = await Promise.all([import('jspdf'), captureCanvas()]);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pageW) / canvas.width;

      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`SPK_${noNota}.pdf`);
      notifySuccess('PDF tersimpan.');
    } catch {
      notifyError('Gagal membuat PDF. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 720, background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div className="a4-modal-topbar">
          <b>Laporan SPK — {noNota}</b>
          <button type="button" className="a4-modal-x" onClick={onClose}>✕</button>
        </div>

        <div ref={reportRef} className="a4-report">
          <div className="a4-header">
            <div>
              <div className="a4-company">{settings.namaUsaha}</div>
              <div className="a4-address">{settings.alamat}</div>
            </div>
            <div className="a4-doctitle">LAPORAN SPK<br /><span>per Nota Penjualan</span></div>
          </div>
          <div className="a4-dash" />

          <div className="a4-nota-info">
            <div><span className="lbl">No. Nota</span><b>{noNota}</b></div>
            <div><span className="lbl">Tanggal</span><b>{nota?.tanggal ?? '-'}</b></div>
            <div><span className="lbl">Pelanggan</span><b>{nota?.pelanggan ?? '-'}</b></div>
            <div><span className="lbl">Total Nota</span><b>Rp{Math.round(nota?.total ?? 0).toLocaleString('id-ID')}</b></div>
          </div>

          <div className="a4-dash" />
          <div className="a4-section-title">Daftar SPK ({spkList.length})</div>

          {spkList.length === 0 ? (
            <p style={{ fontSize: 12, color: '#888', padding: '10px 0' }}>Belum ada SPK yang diciptakan untuk nota ini.</p>
          ) : spkList.map((spk, i) => (
            <div key={spk.id} className="a4-spk-card" onClick={() => toggleExpand(spk.id)}>
              <div className="a4-spk-row1">
                <span className="a4-spk-no">{i + 1}. {spk.noOrder}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <StageBadge tahap={spk.tahap} />
                  <StatusPill status={spk.statusSpk} />
                </div>
              </div>
              <div className="a4-spk-produk">{spk.produk}</div>
              <div className="a4-spk-meta">Target: <b>{spk.target}</b> &nbsp;·&nbsp; PIC: <b>{spk.pic}</b> &nbsp;·&nbsp; Dibuat: {spk.dibuatOleh || '-'}</div>

              {expanded.has(spk.id) && (
                <div className="a4-spk-expand">
                  {spk.detail && <div className="a4-spk-detail"><b>Detail:</b> {spk.detail}</div>}
                  {spk.history && spk.history.length > 0 && (
                    <div className="a4-spk-history">
                      <b>Riwayat:</b>
                      {spk.history.map((h, hi) => (
                        <div key={hi}>&bull; {h.from} → {h.to}: "{h.note}"</div>
                      ))}
                    </div>
                  )}
                  {spk.closingNote && <div className="a4-spk-detail"><b>Penutupan:</b> {spk.closingNote}</div>}
                  {spk.cancelNote && <div className="a4-spk-detail"><b>Pembatalan:</b> {spk.cancelNote}</div>}
                </div>
              )}
              <div className="a4-spk-hint">{expanded.has(spk.id) ? '▲ klik untuk ringkas' : '▼ klik untuk detail'}</div>
            </div>
          ))}

          <div className="a4-footer">Dicetak dari Sistem {settings.namaUsaha} — {new Date().toLocaleString('id-ID')}</div>
        </div>

        <div className="a4-modal-actions">
          <button type="button" className="a4-btn-outline" onClick={onClose} disabled={busy}>Tutup</button>
          <button type="button" className="a4-btn-outline" onClick={handleSaveJPG} disabled={busy}>Simpan JPG</button>
          <button type="button" className="btn-gold" onClick={handleSavePDF} disabled={busy}>Simpan PDF</button>
        </div>
      </div>
    </div>
  );
}
