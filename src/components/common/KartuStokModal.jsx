import { useRef, useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function KartuStokModal({ bahan, onClose }) {
  const { data, settings } = useData();
  const { notifySuccess, notifyError } = useNotify();
  const reportRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const riwayat = useMemo(() => {
    const kronologis = data.stokLedger.filter(r => r.bahan === bahan.nama).slice().reverse();
    let saldo = 0;
    const withSaldo = kronologis.map(r => {
      saldo += r.tipe === 'Masuk' ? r.qty : -r.qty;
      return { ...r, saldo };
    });
    return withSaldo.reverse();
  }, [data.stokLedger, bahan.nama]);

  async function captureCanvas() {
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(reportRef.current, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
  }

  async function handleSaveJPG() {
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      const link = document.createElement('a');
      link.download = `KartuStok_${bahan.nama}.jpg`;
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
      let heightLeft = imgH, position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`KartuStok_${bahan.nama}.pdf`);
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
        const file = new File([blob], `KartuStok_${bahan.nama}.jpg`, { type: 'image/jpeg' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `Kartu Stok ${bahan.nama}`, text: `Kartu Stok ${bahan.nama}` });
        } else {
          const link = document.createElement('a');
          link.download = `KartuStok_${bahan.nama}.jpg`;
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
          <b>Kartu Stok — {bahan.nama}</b>
          <button type="button" className="a4-modal-x" onClick={onClose}>✕</button>
        </div>

        <div ref={reportRef} className="a4-report">
          <div className="a4-header">
            <div>
              <div className="a4-company">{settings.namaUsaha}</div>
              <div className="a4-address">{settings.alamat}</div>
            </div>
            <div className="a4-doctitle">KARTU STOK<br /><span>Riwayat Pergerakan Bahan Baku</span></div>
          </div>
          <div className="a4-dash" />

          <div className="a4-nota-info">
            <div><span className="lbl">Nama Bahan</span><b>{bahan.nama}</b></div>
            <div><span className="lbl">Satuan</span><b>{bahan.satuan}</b></div>
            <div><span className="lbl">Stok Saat Ini</span><b>{bahan.stok} {bahan.satuan}</b></div>
            <div><span className="lbl">Harga Beli</span><b>Rp{fmt(bahan.hargaBeli)}</b></div>
            <div><span className="lbl">Supplier</span><b>{bahan.supplier || '-'}</b></div>
            <div><span className="lbl">Stok Minimum</span><b>{bahan.stokMinimum} {bahan.satuan}</b></div>
          </div>

          <div className="a4-dash" />
          <div className="a4-section-title">Riwayat Pergerakan ({riwayat.length})</div>

          <table className="a4-hpp-table">
            <thead>
              <tr><th>Tanggal</th><th>Tipe</th><th style={{ width: 70 }}>Qty</th><th>Referensi</th><th style={{ width: 70 }}>Saldo</th></tr>
            </thead>
            <tbody>
              {riwayat.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '14px 0' }}>Belum ada pergerakan untuk bahan ini.</td></tr>
              ) : riwayat.map(r => (
                <tr key={r.id}>
                  <td>{r.tanggal}</td>
                  <td style={{ color: r.tipe === 'Masuk' ? '#2E8B4C' : '#C23D74', fontWeight: 700 }}>{r.tipe}</td>
                  <td className="r">{r.tipe === 'Masuk' ? '+' : '-'}{r.qty}</td>
                  <td>{r.referensi} <span className="a4-hpp-qty">{r.keterangan}</span></td>
                  <td className="r"><b>{r.saldo}</b></td>
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
