import { useRef } from 'react';
import { useData } from '../../context/DataContext';
import Icon from '../../components/common/Icon';

export default function TabKeuangan() {
  const { settings, updateSettings } = useData();
  const qrisInputRef = useRef(null);

  function updateRekening(idx, field, value) {
    const rekening = settings.rekening.map((r, i) => (i === idx ? { ...r, [field]: value } : r));
    updateSettings({ rekening });
  }

  function handleQrisUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSettings({ qrisImageDataUrl: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div className="form-wrap">
      <label className="settings-section-label">Preferensi Umum</label>
      <div className="f-row2">
        <div className="f-field">
          <label>Mata Uang</label>
          <select value={settings.mataUang} onChange={e => updateSettings({ mataUang: e.target.value })}>
            <option>Rupiah (Rp)</option>
          </select>
        </div>
        <div className="f-field">
          <label>Metode Bayar Default</label>
          <select value={settings.metodeBayar} onChange={e => updateSettings({ metodeBayar: e.target.value })}>
            <option>Tunai</option>
            <option>Transfer</option>
            <option>QRIS</option>
          </select>
        </div>
      </div>
      <div className="f-field">
        <label>Ukuran Kertas Struk</label>
        <select value={settings.strukWidth} onChange={e => updateSettings({ strukWidth: e.target.value })}>
          <option value="58">58mm (printer thermal kecil)</option>
          <option value="80">80mm (printer thermal standar)</option>
        </select>
      </div>

      <label className="settings-section-label">Rekening Bank</label>
      {settings.rekening.map((r, i) => (
        <div key={i} className="rek-card">
          <div className="rek-card-title">Rekening {i + 1}</div>
          <div className="f-row2">
            <div className="f-field"><label>Bank</label><input placeholder="mis. BCA" value={r.bank} onChange={e => updateRekening(i, 'bank', e.target.value)} /></div>
            <div className="f-field"><label>No. Rekening</label><input placeholder="mis. 1234567890" value={r.noRek} onChange={e => updateRekening(i, 'noRek', e.target.value)} /></div>
          </div>
          <div className="f-field" style={{ marginBottom: 0 }}>
            <label>Atas Nama</label>
            <input placeholder="Nama pemilik rekening" value={r.atasNama} onChange={e => updateRekening(i, 'atasNama', e.target.value)} />
          </div>
        </div>
      ))}

      <label className="settings-section-label">Pembayaran Digital</label>
      <div className="f-row2">
        <div className="f-field">
          <label>ID QRIS / Merchant</label>
          <input placeholder={`mis. QRIS a.n ${settings.namaUsaha}`} value={settings.qris} onChange={e => updateSettings({ qris: e.target.value })} />
        </div>
        <div className="f-field">
          <label>Nomor DANA</label>
          <input placeholder="mis. 0812-3456-7890" value={settings.dana} onChange={e => updateSettings({ dana: e.target.value })} />
        </div>
      </div>
      <div className="f-field"><label>Gambar Kode QRIS</label></div>
      <div className="logo-upload-box" onClick={() => qrisInputRef.current?.click()}>
        <div className="logo-preview">
          {settings.qrisImageDataUrl ? <img src={settings.qrisImageDataUrl} alt="QRIS" /> : <Icon name="upload" />}
        </div>
        <div className="logo-upload-text">
          <b>Klik untuk unggah gambar QRIS</b>
          <span>Akan ditampilkan ke pelanggan saat bayar QRIS di Kasir</span>
        </div>
        <input ref={qrisInputRef} type="file" accept="image/*" onChange={handleQrisUpload} style={{ display: 'none' }} />
      </div>

      <button className="btn-gold" style={{ marginTop: 12 }} onClick={() => alert('Pengaturan tersimpan.')}>Simpan Pengaturan</button>
    </div>
  );
}
