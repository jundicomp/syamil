import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { firstAccessiblePath } from '../../data/navConfig';
import { useSheetsStatus } from '../../utils/useSheetsStatus';

export default function LoginPage() {
  const { data, settings, hakAkses } = useData();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { status: sheetsStatus } = useSheetsStatus();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const u = username.trim();
    if (!u) { setError('Isi username terlebih dahulu.'); return; }
    if (!password.trim()) { setError('Isi password terlebih dahulu.'); return; }

    // Login utama — akses penuh ke semua modul.
    if (u.toLowerCase() === 'admin' && password === '123456') {
      const superadmin = { id: 0, nama: 'Admin', email: 'admin', hp: '', role: 'Superadmin', status: 'Aktif', kodeMarketing: '-', fotoDataUrl: null };
      login(superadmin);
      navigate(firstAccessiblePath('Superadmin', hakAkses));
      return;
    }

    // Akun staf lain yang didaftarkan lewat Pengaturan Sistem > User & Hak Akses
    // (password bebas untuk sekarang — belum ada verifikasi password sungguhan).
    const user = data.pengguna.find(p => p.status === 'Aktif' && (p.nama.toLowerCase() === u.toLowerCase() || p.email?.toLowerCase() === u.toLowerCase()));
    if (user) {
      login(user);
      navigate(firstAccessiblePath(user.role, hakAkses));
      return;
    }

    setError('Username tidak ditemukan.');
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'var(--gold-bg)', border: '1px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', overflow: 'hidden',
          }}>
            {settings.logoDataUrl ? (
              <img src={settings.logoDataUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
              </svg>
            )}
          </div>
          <h1 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700, margin: 0 }}>{settings.namaUsaha}</h1>
          <p style={{ color: 'var(--text-faint)', fontSize: 12, margin: '4px 0 0' }}>Sistem Terpadu</p>
        </div>

        <div className={`login-conn-status status-${sheetsStatus}`}>
          <span className="pulse-dot" />
          <span>
            {sheetsStatus === 'connected' && 'Google Sheets tersambung'}
            {sheetsStatus === 'weak' && 'Mencoba menyambungkan ke Google Sheets...'}
            {sheetsStatus === 'checking' && 'Memeriksa koneksi...'}
            {sheetsStatus === 'unconfigured' && 'Google Sheets belum diatur — pakai data lokal'}
            {sheetsStatus === 'disconnected' && 'Google Sheets tidak tersambung — pakai data lokal'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="modal-card" style={{ maxWidth: 'none' }}>
          <div className="f-field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoFocus />
          </div>
          <div className="f-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
          </div>
          {error && <p style={{ color: 'var(--total-red)', fontSize: 11.5, margin: '0 0 10px' }}>{error}</p>}
          <button type="submit" className="btn-gold" style={{ width: '100%', padding: 12 }}>Masuk</button>
          <p style={{ fontSize: 10.5, color: 'var(--text-faint)', textAlign: 'center', marginTop: 14 }}>
            ⚠ Belum ada verifikasi password sungguhan — sekadar gerbang awal.
          </p>
        </form>
      </div>
    </div>
  );
}
