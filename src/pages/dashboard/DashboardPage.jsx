import { useState } from 'react';
import { useData } from '../../context/DataContext';
import DownloadLaporanModal from './DownloadLaporanModal';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

function Bar({ label, value, max, color, sublabel }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ fontWeight: 700 }}>{label}</span>
        <span style={{ color: 'var(--text-faint)' }}>{sublabel}</span>
      </div>
      <div style={{ background: 'var(--panel-2)', borderRadius: 8, height: 14, overflow: 'hidden' }}>
        <div style={{ width: `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%`, minWidth: value > 0 ? 6 : 0, height: '100%', background: color, borderRadius: 8, transition: 'width .3s' }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, bukuKas } = useData();
  const [showDownload, setShowDownload] = useState(false);

  const totalPenjualan = data.penjualan.reduce((s, p) => s + p.total, 0);
  const totalPembelian = data.pembelian.reduce((s, p) => s + p.total, 0);
  const withJenis = bukuKas.map(r => ({ ...r, jenisKas: r.jenisKas || 'Toko' }));
  const saldoToko = withJenis.filter(r => r.jenisKas === 'Toko').reduce((s, r) => s + (r.tipe === 'Masuk' ? r.jumlah : -r.jumlah), 0);
  const saldoBank = withJenis.filter(r => r.jenisKas === 'Bank').reduce((s, r) => s + (r.tipe === 'Masuk' ? r.jumlah : -r.jumlah), 0);
  const saldoKas = saldoToko + saldoBank;
  const kasMasuk = bukuKas.filter(r => r.tipe === 'Masuk').reduce((s, r) => s + r.jumlah, 0);
  const kasKeluar = bukuKas.filter(r => r.tipe === 'Keluar').reduce((s, r) => s + r.jumlah, 0);

  const piutang = data.piutang.filter(p => p.status === 'Belum Lunas').reduce((s, p) => s + p.sisa, 0);
  const hutang = data.hutang.filter(h => h.status === 'Belum Lunas').reduce((s, h) => s + h.sisa, 0);

  const spkAktif = data.produksi.filter(p => p.statusSpk === 'Aktif').length;
  const spkSelesai = data.produksi.filter(p => p.statusSpk === 'Selesai').length;
  const spkBatal = data.produksi.filter(p => p.statusSpk === 'Batal').length;
  const totalSpk = Math.max(1, spkAktif + spkSelesai + spkBatal);

  const bahanMenipisList = data.bahanBaku.filter(b => b.stok <= b.stokMinimum);
  const maxKas = Math.max(kasMasuk, kasKeluar, 1);
  const maxPiutangHutang = Math.max(piutang, hutang, 1);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <div className="page-sub">Ringkasan bisnis — semua angka live dari data yang ada</div>
        </div>
        <button className="btn-gold" onClick={() => setShowDownload(true)}>⬇ Unduh Laporan Keuangan Lengkap</button>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 14 }}>
        <div className="stat-card"><div className="lbl">Total Penjualan</div><div className="val">Rp{fmt(totalPenjualan)}</div></div>
        <div className="stat-card"><div className="lbl">Total Pembelian</div><div className="val">Rp{fmt(totalPembelian)}</div></div>
        <div className="stat-card"><div className="lbl">Total Saldo Kas</div><div className="val" style={{ color: 'var(--gold)' }}>Rp{fmt(saldoKas)}</div></div>
      </div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card"><div className="lbl">Piutang Belum Lunas</div><div className="val" style={{ color: 'var(--total-red)' }}>Rp{fmt(piutang)}</div></div>
        <div className="stat-card"><div className="lbl">Hutang Belum Lunas</div><div className="val" style={{ color: 'var(--total-red)' }}>Rp{fmt(hutang)}</div></div>
        <div className="stat-card"><div className="lbl">Bahan Stok Menipis</div><div className="val" style={{ color: bahanMenipisList.length > 0 ? 'var(--total-red)' : 'var(--text)' }}>{bahanMenipisList.length}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0 }}>Kas Masuk vs Keluar (Toko + Bank)</label>
          <Bar label="Kas Masuk" value={kasMasuk} max={maxKas} color="#2FAE6D" sublabel={`Rp${fmt(kasMasuk)}`} />
          <Bar label="Kas Keluar" value={kasKeluar} max={maxKas} color="var(--total-red)" sublabel={`Rp${fmt(kasKeluar)}`} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-soft)' }}>
            <span>Kas Toko</span><b>Rp{fmt(saldoToko)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginTop: 4 }}>
            <span>Kas Bank</span><b>Rp{fmt(saldoBank)}</b>
          </div>
        </div>

        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0 }}>Piutang vs Hutang</label>
          <Bar label="Piutang (uang masuk tertunda)" value={piutang} max={maxPiutangHutang} color="#5CA6E8" sublabel={`Rp${fmt(piutang)}`} />
          <Bar label="Hutang (uang keluar tertunda)" value={hutang} max={maxPiutangHutang} color="#E0923C" sublabel={`Rp${fmt(hutang)}`} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line-soft)' }}>
            <span>Posisi Bersih</span><b style={{ color: piutang - hutang >= 0 ? '#2FAE6D' : 'var(--total-red)' }}>Rp{fmt(piutang - hutang)}</b>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0 }}>Status SPK</label>
          <Bar label="Aktif" value={spkAktif} max={totalSpk} color="#5B9BD9" sublabel={`${spkAktif} SPK`} />
          <Bar label="Selesai" value={spkSelesai} max={totalSpk} color="#4FAE6D" sublabel={`${spkSelesai} SPK`} />
          <Bar label="Batal" value={spkBatal} max={totalSpk} color="#E066A0" sublabel={`${spkBatal} SPK`} />
        </div>

        <div className="table-wrap" style={{ padding: '18px 20px' }}>
          <label className="settings-section-label" style={{ marginTop: 0, color: bahanMenipisList.length > 0 ? 'var(--total-red)' : undefined }}>
            {bahanMenipisList.length > 0 ? '⚠ Bahan Stok Menipis' : 'Bahan Stok Menipis'}
          </label>
          {bahanMenipisList.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>Semua stok bahan baku masih di atas batas minimum. ✓</p>
          ) : bahanMenipisList.map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '7px 0', borderBottom: '1px solid var(--line-soft)' }}>
              <span>{b.nama}</span>
              <span style={{ color: 'var(--total-red)' }}>{b.stok} / min {b.stokMinimum} {b.satuan}</span>
            </div>
          ))}
        </div>
      </div>

      {showDownload && <DownloadLaporanModal onClose={() => setShowDownload(false)} />}
    </div>
  );
}
