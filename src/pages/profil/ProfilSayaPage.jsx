import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';

export default function ProfilSayaPage() {
  const { updateRow } = useData();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [nama, setNama] = useState(user?.nama ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [hp, setHp] = useState(user?.hp ?? '');
  const [foto, setFoto] = useState(user?.fotoDataUrl ?? null);
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');

  function handleFotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!nama.trim() || !email.trim()) { alert('Nama dan email wajib diisi.'); return; }
    if (passwordBaru || konfirmasiPassword) {
      if (passwordBaru.length < 6) { alert('Password baru minimal 6 karakter.'); return; }
      if (passwordBaru !== konfirmasiPassword) { alert('Konfirmasi password tidak sama.'); return; }
    }

    const patch = { nama: nama.trim(), email: email.trim(), hp: hp.trim(), fotoDataUrl: foto };
    updateRow('pengguna', user.id, patch);
    updateUser(patch);
    setPasswordBaru(''); setKonfirmasiPassword('');
    alert('Profil tersimpan.' + (passwordBaru ? ' Password juga diperbarui (demo, belum ada verifikasi sungguhan).' : ''));
  }

  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Profil Saya</h2>
          <div className="page-sub">Pengaturan akun pribadi Anda — foto, kontak, dan password</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-wrap">
        <label className="settings-section-label" style={{ marginTop: 0 }}>Foto Profil</label>
        <div className="logo-upload-box" onClick={() => fileInputRef.current?.click()}>
          <div className="logo-preview" style={{ borderRadius: '50%' }}>
            {foto ? <img src={foto} alt="Foto profil" /> : <Icon name="upload" />}
          </div>
          <div className="logo-upload-text">
            <b>Klik untuk unggah foto</b>
            <span>PNG/JPG, disarankan foto wajah persegi</span>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoUpload} style={{ display: 'none' }} />
        </div>

        <label className="settings-section-label">Informasi Akun</label>
        <div className="f-field">
          <label>Nama Lengkap</label>
          <input value={nama} onChange={e => setNama(e.target.value)} />
        </div>
        <div className="f-row2">
          <div className="f-field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div className="f-field"><label>No. HP</label><input value={hp} onChange={e => setHp(e.target.value)} /></div>
        </div>
        <div className="f-field">
          <label>Role</label>
          <input value={user.role} disabled />
        </div>

        <label className="settings-section-label">Ganti Password</label>
        <div className="f-row2">
          <div className="f-field"><label>Password Baru</label><input type="password" value={passwordBaru} onChange={e => setPasswordBaru(e.target.value)} placeholder="Kosongkan kalau tidak diganti" /></div>
          <div className="f-field"><label>Konfirmasi Password Baru</label><input type="password" value={konfirmasiPassword} onChange={e => setKonfirmasiPassword(e.target.value)} /></div>
        </div>
        <p style={{ fontSize: 10.5, color: 'var(--text-faint)', margin: '-6px 0 14px' }}>
          ⚠ Demo — password belum benar-benar diverifikasi/dienkripsi, cuma disimpan sebagai contoh alur.
        </p>

        <button type="submit" className="btn-gold">Simpan Perubahan</button>
      </form>
    </div>
  );
}
