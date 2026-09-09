import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { data, settings } = useData();
  const { login } = useAuth();
  const navigate = useNavigate();
  const akunAktif = data.pengguna.filter(p => p.status === 'Aktif');
  const [userId, setUserId] = useState(akunAktif[0]?.id ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const user = akunAktif.find(p => p.id === Number(userId));
    if (!user) { setError('Pilih akun terlebih dahulu.'); return; }
    if (!password.trim()) { setError('Isi password (bebas — ini akun demo).'); return; }
    login(user);
    navigate('/dashboard');
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

        <form onSubmit={handleSubmit} className="modal-card" style={{ maxWidth: 'none' }}>
          <div className="f-field">
            <label>Masuk Sebagai</label>
            <select value={userId} onChange={e => setUserId(e.target.value)}>
              {akunAktif.map(p => <option key={p.id} value={p.id}>{p.nama} — {p.role}</option>)}
            </select>
          </div>
          <div className="f-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Bebas — ini akun demo" />
          </div>
          {error && <p style={{ color: 'var(--total-red)', fontSize: 11.5, margin: '0 0 10px' }}>{error}</p>}
          <button type="submit" className="btn-gold" style={{ width: '100%', padding: 12 }}>Masuk</button>
          <p style={{ fontSize: 10.5, color: 'var(--text-faint)', textAlign: 'center', marginTop: 14 }}>
            ⚠ Ini akun dummy untuk demo — belum ada verifikasi password sungguhan.
          </p>
        </form>
      </div>
    </div>
  );
}
