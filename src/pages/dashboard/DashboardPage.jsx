import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function DashboardPage() {
  const { data, bukuKas } = useData();

  const totalPenjualan = data.penjualan.reduce((s, p) => s + p.total, 0);
  const totalPembelian = data.pembelian.reduce((s, p) => s + p.total, 0);
  const saldoKas = bukuKas.reduce((s, r) => s + (r.tipe === 'Masuk' ? r.jumlah : -r.jumlah), 0);
  const piutang = data.penjualan.filter(p => p.status === 'DP').reduce((s, p) => s + p.sisaBayar, 0);
  const spkAktif = data.produksi.filter(p => p.statusSpk === 'Aktif').length;
  const bahanMenipis = data.bahanBaku.filter(b => b.stok <= b.stokMinimum).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <div className="page-sub">Ringkasan bisnis hari ini — semua angka live dari data yang ada</div>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 14 }}>
        <div className="stat-card"><div className="lbl">Total Penjualan</div><div className="val">Rp{fmt(totalPenjualan)}</div></div>
        <div className="stat-card"><div className="lbl">Total Pembelian</div><div className="val">Rp{fmt(totalPembelian)}</div></div>
        <div className="stat-card"><div className="lbl">Saldo Kas</div><div className="val" style={{ color: 'var(--gold)' }}>Rp{fmt(saldoKas)}</div></div>
      </div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card"><div className="lbl">Piutang (DP belum lunas)</div><div className="val" style={{ color: 'var(--total-red)' }}>Rp{fmt(piutang)}</div></div>
        <div className="stat-card"><div className="lbl">SPK Sedang Berjalan</div><div className="val">{spkAktif}</div></div>
        <div className="stat-card"><div className="lbl">Bahan Stok Menipis</div><div className="val" style={{ color: bahanMenipis > 0 ? 'var(--total-red)' : 'var(--text)' }}>{bahanMenipis}</div></div>
      </div>
    </div>
  );
}
