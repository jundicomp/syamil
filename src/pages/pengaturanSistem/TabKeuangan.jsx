import { useData } from '../../context/DataContext';

export default function TabKeuangan() {
  const { settings, updateSettings } = useData();

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
    <div style={{ maxWidth: 520 }}>
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
        <div className="f-field">
          <label>Ukuran Kertas Struk</label>
          <select value={settings.strukWidth} onChange={e => updateSettings({ strukWidth: e.target.value })}>
            <option value="58">58mm (printer thermal kecil)</option>
            <option value="80">80mm (printer thermal standar)</option>
          </select>
        </div>
      </div>

      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-soft)', margin: '18px 0 8px' }}>
        Rekening Bank (maks. 3)
      </label>
      {settings.rekening.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.3fr', gap: 8, marginBottom: 8 }}>
          <input placeholder="Bank" value={r.bank} onChange={e => updateRekening(i, 'bank', e.target.value)} />
          <input placeholder="No. Rekening" value={r.noRek} onChange={e => updateRekening(i, 'noRek', e.target.value)} />
          <input placeholder="Atas Nama" value={r.atasNama} onChange={e => updateRekening(i, 'atasNama', e.target.value)} />
        </div>
      ))}

      <div className="f-field" style={{ marginTop: 18 }}>
        <label>Nomor DANA</label>
        <input value={settings.dana} onChange={e => updateSettings({ dana: e.target.value })} />
      </div>

      <div className="f-field">
        <label>Gambar QRIS</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 10, background: 'var(--panel-2)',
            border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            {settings.qrisImageDataUrl
              ? <img src={settings.qrisImageDataUrl} alt="QRIS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>Belum ada</span>}
          </div>
          <label className="btn-outline" style={{ cursor: 'pointer' }}>
            Unggah QRIS
            <input type="file" accept="image/*" onChange={handleQrisUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </div>
  );
}
