import { useRef, useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function KartuPiutangModal({ pelanggan, onClose }) {
  const { data, settings } = useData();
  const { notifySuccess, notifyError } = useNotify();
  const reportRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const riwayat = useMemo(
    () => data.piutang.filter(p => p.pelanggan === pelanggan.nama).slice().reverse(),
    [data.piutang, pelanggan.nama]
  );
  const totalTransaksi = riwayat.reduce((s, p) => s + p.total, 0);
  const totalDibayar = riwayat.reduce((s, p) => s + p.dibayar, 0);
  const totalSisa = riwayat.filter(p => p.status === 'Belum Lunas').reduce((s, p) => s + p.sisa, 0);

  async function captureCanvas() {
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(reportRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
  }
  async function handleSaveJPG() {
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.download = `KartuPiutang_${pelanggan.nama}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      notifySuccess('Gambar JPG tersimpan.');
    } catch { notifyError('Gagal membuat JPG. Coba lagi.'); } finally { setBusy(false); }
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
      let heightLeft = imgH, position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`KartuPiutang_${pelanggan.nama}.pdf`);
      notifySuccess('PDF tersimpan.');
    } catch { notifyError('Gagal membuat PDF. Coba lagi.'); } finally { setBusy(false); }
  }
  async function handleShare() {
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      canvas.toBlob(async blob => {
        const file = new File([blob], `KartuPiutang_${pelanggan.nama}.jpg`, { type: 'image/jpeg' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `Kartu Piutang ${pelanggan.nama}`, text: `Kartu Piutang ${pelanggan.nama}` });
        } else {
          const link = document.createElement('a');
          link.download = `KartuPiutang_${pelanggan.nama}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
          notifySuccess('Perangkat ini belum dukung Share langsung — gambar diunduh, tinggal kirim manual.');
        }
      }, 'image/jpeg', 0.95);
    } catch { notifyError('Gagal menyiapkan gambar untuk dibagikan.'); } finally { setBusy(false); }
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 640, background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div className="a4-modal-topbar">
          <b>Kartu Piutang — {pelanggan.nama}</b>
          <button type="button" className="a4-modal-x" onClick={onClose}>✕</button>
        </div>

        <div ref={reportRef} className="a4-report">
          <div className="a4-header">
            <div>
              <div className="a4-company">{settings.namaUsaha}</div>
              <div className="a4-address">{settings.alamat}</div>
            </div>
            <div className="a4-doctitle">KARTU PIUTANG<br /><span>Riwayat Transaksi Pelanggan</span></div>
          </div>
          <div className="a4-dash" />

          <div className="a4-nota-info">
            <div><span className="lbl">Pelanggan</span><b>{pelanggan.nama}</b></div>
            <div><span className="lbl">No. HP/WA</span><b>{pelanggan.kontak || '-'}</b></div>
            <div><span className="lbl">Kategori</span><b>{pelanggan.kategori || '-'}</b></div>
            <div><span className="lbl">Batas Kredit</span><b>{pelanggan.batasKredit > 0 ? `Rp${fmt(pelanggan.batasKredit)}` : 'Tanpa batas'}</b></div>
          </div>

          <div className="a4-hpp-summary" style={{ marginTop: 12 }}>
            <div><span>Total Transaksi Kredit</span><b>Rp{fmt(totalTransaksi)}</b></div>
            <div><span>Total Sudah Dibayar</span><b>Rp{fmt(totalDibayar)}</b></div>
            <div><span>Sisa Saat Ini</span><b style={{ color: totalSisa > 0 ? '#C23D74' : '#2E8B4C' }}>Rp{fmt(totalSisa)}</b></div>
          </div>

          <div className="a4-dash" />
          <div className="a4-section-title">Riwayat Nota ({riwayat.length})</div>

          <table className="a4-hpp-table">
            <thead>
              <tr><th>Tanggal</th><th>No. Nota</th><th style={{ width: 80 }}>Total</th><th style={{ width: 80 }}>Dibayar</th><th style={{ width: 80 }}>Sisa</th><th style={{ width: 70 }}>Status</th></tr>
            </thead>
            <tbody>
              {riwayat.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: '14px 0' }}>Belum ada riwayat piutang untuk pelanggan ini.</td></tr>
              ) : riwayat.map(p => (
                <tr key={p.id}>
                  <td>{p.tanggal}</td><td>{p.noNota}</td>
                  <td className="r">Rp{fmt(p.total)}</td><td className="r">Rp{fmt(p.dibayar)}</td>
                  <td className="r" style={{ color: p.sisa > 0 ? '#C23D74' : undefined, fontWeight: p.sisa > 0 ? 700 : 400 }}>Rp{fmt(p.sisa)}</td>
                  <td style={{ color: p.status === 'Lunas' ? '#2E8B4C' : '#C23D74', fontWeight: 700 }}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="a4-footer">Dicetak dari Sistem {settings.namaUsaha} — {new Date().toLocaleString('id-ID')}</div>
        </div>

        <div className="a4-modal-actions">
          <button type="button" className="a4-btn-outline" onClick={onClose} disabled={busy}>Tutup</button>
          <button type="button" className="a4-btn-outline" onClick={handleShare} disabled={busy}>Share</button>
          <button type="button" className="a4-btn-outline" onClick={handleSaveJPG} disabled={busy}>Simpan JPG</button>
          <button type="button" className="btn-gold" onClick={handleSavePDF} disabled={busy}>Simpan PDF</button>
        </div>
      </div>
    </div>
  );
}
