import { useRef, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function HppDetailModal({ hpp, onClose }) {
  const { settings } = useData();
  const { notifySuccess, notifyError } = useNotify();
  const reportRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const margin = hpp.hargaJual - hpp.totalHpp;
  const marginPct = hpp.hargaJual ? (margin / hpp.hargaJual) * 100 : 0;

  async function captureCanvas() {
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(reportRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
  }

  async function handleSaveJPG() {
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.download = `HPP_${hpp.noOrder}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      notifySuccess('Gambar JPG tersimpan — siap dibagikan untuk verifikasi.');
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
      const imgH = (canvas.height * pageW) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);
      pdf.save(`HPP_${hpp.noOrder}.pdf`);
      notifySuccess('PDF tersimpan.');
    } catch {
      notifyError('Gagal membuat PDF. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      canvas.toBlob(async blob => {
        const file = new File([blob], `HPP_${hpp.noOrder}.jpg`, { type: 'image/jpeg' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `HPP ${hpp.noOrder}`, text: `Verifikasi Kalkulasi HPP ${hpp.noOrder}` });
        } else {
          const link = document.createElement('a');
          link.download = `HPP_${hpp.noOrder}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
          notifySuccess('Perangkat ini belum dukung Share langsung — gambar diunduh, tinggal kirim manual.');
        }
      }, 'image/jpeg', 0.95);
    } catch {
      notifyError('Gagal menyiapkan gambar untuk dibagikan.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 640, background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div className="a4-modal-topbar">
          <b>Verifikasi Kalkulasi HPP — {hpp.noOrder}</b>
          <button type="button" className="a4-modal-x" onClick={onClose}>✕</button>
        </div>

        <div ref={reportRef} className="a4-report">
          <div className="a4-header">
            <div>
              <div className="a4-company">{settings.namaUsaha}</div>
              <div className="a4-address">{settings.alamat}</div>
            </div>
            <div className="a4-doctitle">KALKULASI HPP<br /><span>Lembar Verifikasi Biaya Produksi</span></div>
          </div>
          <div className="a4-dash" />

          <div className="a4-nota-info">
            <div><span className="lbl">No. SPK</span><b>{hpp.noOrder}</b></div>
            <div><span className="lbl">Tanggal</span><b>{hpp.tanggal}</b></div>
            <div><span className="lbl">Produk</span><b>{hpp.produk}</b></div>
            <div><span className="lbl">Pelanggan</span><b>{hpp.pelanggan}</b></div>
          </div>

          <div className="a4-dash" />
          <div className="a4-section-title">Rincian Biaya</div>

          <table className="a4-hpp-table">
            <thead>
              <tr><th style={{ width: 28 }}>No</th><th>Uraian</th><th style={{ width: 100 }}>Nilai</th><th style={{ width: 100 }}>Ket</th></tr>
            </thead>
            <tbody>
              {hpp.items.map((it, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{it.nama} <span className="a4-hpp-qty">({it.qty} {it.satuan} × Rp{fmt(it.harga)})</span></td>
                  <td className="r">Rp{fmt(it.qty * it.harga)}</td>
                  <td>{it.sumber === 'Stok' ? 'Stok Gudang' : 'Item Bebas'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}><b>TOTAL HPP</b></td>
                <td className="r"><b>Rp{fmt(hpp.totalHpp)}</b></td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="a4-hpp-summary">
            <div><span>Harga Jual</span><b>Rp{fmt(hpp.hargaJual)}</b></div>
            <div><span>Total HPP</span><b>Rp{fmt(hpp.totalHpp)}</b></div>
            <div><span>Margin ({marginPct.toFixed(1)}%)</span><b style={{ color: margin >= 0 ? '#2E8B4C' : '#C23D74' }}>Rp{fmt(margin)}</b></div>
          </div>

          <div className="a4-dash" />
          <div className="a4-section-title">Persetujuan</div>
          <div className="a4-acc-grid">
            {['Dibuat Oleh', 'Diperiksa Oleh', 'Disetujui Oleh', 'Diketahui Oleh'].map(label => (
              <div key={label} className="a4-acc-box">
                <div className="a4-acc-label">{label}</div>
                <div className="a4-acc-sign" />
                <div className="a4-acc-name">{label === 'Dibuat Oleh' ? hpp.dibuatOleh || '-' : '( ..................... )'}</div>
              </div>
            ))}
          </div>

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
