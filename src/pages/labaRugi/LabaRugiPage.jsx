import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function LabaRugiPage() {
  const { data, bukuKas } = useData();

  const pendapatan = bukuKas.filter(r => r.tipe === 'Masuk').reduce((s, r) => s + r.jumlah, 0);
  const totalBebanKas = bukuKas.filter(r => r.tipe === 'Keluar').reduce((s, r) => s + r.jumlah, 0);
  const totalHppTercatat = data.hppCalc.reduce((s, h) => s + h.totalHpp, 0);
  const labaKotor = pendapatan - totalBebanKas;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Laporan Laba Rugi</h2>
          <div className="page-sub">Dihitung otomatis dari Buku Kas &amp; Kalkulasi HPP — bukan angka statis</div>
        </div>
      </div>

      <div className="table-wrap" style={{ padding: '20px 24px', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-soft)' }}>
          <span>Pendapatan (kas masuk)</span><b style={{ color: '#1F6B39' }}>Rp{fmt(pendapatan)}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-soft)' }}>
          <span>Total Pengeluaran (kas keluar)</span><b style={{ color: 'var(--total-red)' }}>Rp{fmt(totalBebanKas)}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 15 }}>
          <b>Estimasi Laba Kotor</b>
          <b style={{ color: labaKotor >= 0 ? '#1F6B39' : 'var(--total-red)' }}>Rp{fmt(labaKotor)}</b>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--line)', fontSize: 12, color: 'var(--text-faint)' }}>
          Referensi — Total HPP tercatat (Kalkulasi HPP): <b style={{ color: 'var(--text-soft)' }}>Rp{fmt(totalHppTercatat)}</b>
        </div>
      </div>

      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 14, maxWidth: 520 }}>
        ⚠ Ini perhitungan <b>kas masuk-keluar sederhana</b> (cash-basis), bukan laporan laba-rugi akrual formal.
        Belum memisahkan biaya per periode, belum menghitung penyusutan, dan pengeluaran Pembelian tercampur
        dengan pengeluaran lain di Buku Kas — jadi anggap ini sebagai perkiraan kasar, bukan angka final buat pajak/audit.
      </p>
    </div>
  );
}
