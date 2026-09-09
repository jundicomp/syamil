import { useRef } from 'react';
import { useData } from '../../context/DataContext';
import Icon from '../../components/common/Icon';

const PLACEMENTS = [
  { key: 'login', label: 'Halaman Login' },
  { key: 'sidebar', label: 'Sidebar' },
  { key: 'struk', label: 'Struk (Nota Kasir)' },
  { key: 'invoice', label: 'Invoice / Nota Resmi' },
  { key: 'spk', label: 'SPK (Surat Perintah Kerja)' },
];

export default function TabPerusahaan() {
  const { settings, updateSettings } = useData();
  const fileInputRef = useRef(null);

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSettings({ logoDataUrl: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div className="form-wrap">
      <label className="settings-section-label">Logo Usaha</label>
      <div className="logo-upload-box" onClick={() => fileInputRef.current?.click()}>
        <div className="logo-preview">
          {settings.logoDataUrl ? <img src={settings.logoDataUrl} alt="Logo" /> : <Icon name="upload" />}
        </div>
        <div className="logo-upload-text">
          <b>Klik untuk unggah logo</b>
          <span>PNG/JPG, latar transparan disarankan</span>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
      </div>

      <label className="settings-section-label">Tampilkan Logo Di</label>
      <div className="chk-grid">
        {PLACEMENTS.map(p => (
          <label key={p.key} className="chk-row">
            <input
              type="checkbox"
              checked={settings.logoPlacement[p.key]}
              onChange={e => updateSettings({ logoPlacement: { ...settings.logoPlacement, [p.key]: e.target.checked } })}
            />
            <span>{p.label}</span>
          </label>
        ))}
      </div>

      <label className="settings-section-label">Data Perusahaan</label>
      <div className="f-field">
        <label>Nama Usaha</label>
        <input value={settings.namaUsaha} onChange={e => updateSettings({ namaUsaha: e.target.value })} />
      </div>
      <div className="f-field">
        <label>Alamat</label>
        <input value={settings.alamat} onChange={e => updateSettings({ alamat: e.target.value })} />
      </div>
      <div className="f-row2">
        <div className="f-field"><label>Kota</label><input value={settings.kota} onChange={e => updateSettings({ kota: e.target.value })} /></div>
        <div className="f-field"><label>Telepon</label><input value={settings.telepon} onChange={e => updateSettings({ telepon: e.target.value })} /></div>
      </div>
      <div className="f-row2">
        <div className="f-field"><label>WhatsApp</label><input value={settings.whatsapp} onChange={e => updateSettings({ whatsapp: e.target.value })} /></div>
        <div className="f-field"><label>Email</label><input value={settings.email} onChange={e => updateSettings({ email: e.target.value })} /></div>
      </div>
      <div className="f-row2">
        <div className="f-field"><label>Website</label><input value={settings.website} onChange={e => updateSettings({ website: e.target.value })} /></div>
        <div className="f-field"><label>Instagram / Sosmed</label><input value={settings.instagram} onChange={e => updateSettings({ instagram: e.target.value })} /></div>
      </div>
      <button className="btn-gold" onClick={() => alert('Pengaturan tersimpan.')}>Simpan Pengaturan</button>
    </div>
  );
}
