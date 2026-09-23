import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { firstAccessiblePath } from '../../data/navConfig';
import { useSheetsStatus } from '../../utils/useSheetsStatus';
import { requestPasswordReset } from '../../data/sheetsAdapter';

export default function LoginPage() {
  const { data, settings, hakAkses } = useData();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { status: sheetsStatus, terkonfigurasi } = useSheetsStatus();
  const [mode, setMode] = useState('login'); // 'login' | 'lupa'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [lupaEmail, setLupaEmail] = useState('');
  const [lupaBusy, setLupaBusy] = useState(false);
  const [lupaPesan, setLupaPesan] = useState(null); // { ok, teks }

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

    // Akun staf lain yang didaftarkan lewat Pengaturan Sistem > User & Hak Akses.
    const user = data.pengguna.find(p => p.status === 'Aktif' && (p.nama.toLowerCase() === u.toLowerCase() || p.email?.toLowerCase() === u.toLowerCase()));
    if (user) {
      // Kalau akun ini sudah pernah dapat password (lewat Lupa Password), wajib cocok persis.
      // Kalau belum pernah (password kosong), sementara masih terima password apa saja.
      if (user.password && user.password !== password) { setError('Password salah.'); return; }
      login(user);
      navigate(firstAccessiblePath(user.role, hakAkses));
      return;
    }

    setError('Username tidak ditemukan.');
  }

  async function handleLupaSubmit(e) {
    e.preventDefault();
    if (!lupaEmail.trim()) { setLupaPesan({ ok: false, teks: 'Isi email terlebih dahulu.' }); return; }
    if (!terkonfigurasi) { setLupaPesan({ ok: false, teks: 'Google Sheets belum diatur — fitur ini butuh koneksi Sheets buat kirim email.' }); return; }
    setLupaBusy(true);
    setLupaPesan(null);
    try {
      const res = await requestPasswordReset(lupaEmail.trim());
      if (res.ok) {
        setLupaPesan({ ok: true, teks: 'Password baru sudah dikirim ke email itu. Cek inbox (dan folder spam), lalu MUAT ULANG halaman ini dulu sebelum login pakai password barunya.' });
      } else {
        setLupaPesan({ ok: false, teks: res.error || 'Gagal mengirim. Coba lagi.' });
      }
    } catch {
      setLupaPesan({ ok: false, teks: 'Gagal menghubungi server. Coba lagi.' });
    } finally {
      setLupaBusy(false);
    }
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

        {mode === 'login' ? (
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
            <button
              type="button"
              onClick={() => { setMode('lupa'); setLupaPesan(null); setError(''); }}
              style={{ display: 'block', width: '100%', textAlign: 'center', background: 'none', border: 'none', color: 'var(--gold)', fontSize: 11.5, marginTop: 14, cursor: 'pointer' }}
            >
              Lupa password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleLupaSubmit} className="modal-card" style={{ maxWidth: 'none' }}>
            <b style={{ display: 'block', fontSize: 13.5, marginBottom: 4 }}>Lupa Password</b>
            <p style={{ fontSize: 11.5, color: 'var(--text-faint)', margin: '0 0 14px' }}>
              Masukkan email akun Anda — password sementara akan dikirim ke email itu.
            </p>
            <div className="f-field">
              <label>Email</label>
              <input type="email" value={lupaEmail} onChange={e => setLupaEmail(e.target.value)} placeholder="nama@usaha.id" autoFocus disabled={lupaBusy} />
            </div>
            {lupaPesan && (
              <p style={{ color: lupaPesan.ok ? '#2FAE6D' : 'var(--total-red)', fontSize: 11.5, margin: '0 0 10px' }}>{lupaPesan.teks}</p>
            )}
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: 12 }} disabled={lupaBusy}>
              {lupaBusy ? 'Mengirim...' : 'Kirim Password Baru'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setLupaPesan(null); }}
              style={{ display: 'block', width: '100%', textAlign: 'center', background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: 11.5, marginTop: 14, cursor: 'pointer' }}
            >
              ← Kembali ke halaman login
            </button>
          </form>
        )}

        <p style={{ fontSize: 10.5, color: 'var(--text-faint)', textAlign: 'center', marginTop: 14 }}>
          ⚠ Login admin/123456 selalu berfungsi terlepas dari koneksi Sheets.
        </p>
      </div>
    </div>
  );
}
