import { useData } from '../../context/DataContext';

const TEXT_FIELDS = [
  { key: 'namaUsaha', label: 'Nama Usaha' },
  { key: 'kota', label: 'Kota' },
  { key: 'alamat', label: 'Alamat' },
  { key: 'telepon', label: 'Telepon' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'email', label: 'Email' },
  { key: 'website', label: 'Website' },
  { key: 'instagram', label: 'Instagram' },
];

const PLACEMENT_LABELS = {
  login: 'Halaman Login', sidebar: 'Sidebar', struk: 'Struk Kasir', invoice: 'Invoice/Nota', spk: 'Dokumen SPK',
};

export default function TabPerusahaan() {
  const { settings, updateSettings } = useData();

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSettings({ logoDataUrl: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="f-field">
        <label>Logo Usaha</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 10, background: 'var(--panel-2)',
            border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            {settings.logoDataUrl
              ? <img src={settings.logoDataUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>Belum ada</span>}
          </div>
          <label className="btn-outline" style={{ cursor: 'pointer' }}>
            Unggah Logo
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {TEXT_FIELDS.map(f => (
        <div className="f-field" key={f.key}>
          <label>{f.label}</label>
          <input value={settings[f.key]} onChange={e => updateSettings({ [f.key]: e.target.value })} />
        </div>
      ))}

      <div className="f-field">
        <label>Tampilkan Logo di</label>
        {Object.keys(PLACEMENT_LABELS).map(k => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, marginBottom: 6, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.logoPlacement[k]}
              onChange={e => updateSettings({ logoPlacement: { ...settings.logoPlacement, [k]: e.target.checked } })}
            />
            {PLACEMENT_LABELS[k]}
          </label>
        ))}
      </div>
    </div>
  );
}
