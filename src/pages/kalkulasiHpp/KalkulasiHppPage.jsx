import { useState } from 'react';
import { useData } from '../../context/DataContext';
import HppCreateModal from './HppCreateModal';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function KalkulasiHppPage() {
  const { data } = useData();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Kalkulasi HPP</h2>
          <div className="page-sub">⚠ Akses terbatas — mestinya cuma Owner/Admin (belum ada login sungguhan)</div>
        </div>
        <button className="btn-gold" onClick={() => setShowCreate(true)}>+ Tambah</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>No. SPK</th><th>Produk</th><th>Pelanggan</th>
              <th className="r">Harga Jual</th><th className="r">Total HPP</th><th className="r">Margin</th>
            </tr>
          </thead>
          <tbody>
            {data.hppCalc.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">Belum ada kalkulasi HPP.</td></tr>
            ) : data.hppCalc.map(h => {
              const margin = h.hargaJual - h.totalHpp;
              return (
                <tr key={h.id}>
                  <td>{h.noOrder}</td>
                  <td>{h.produk}</td>
                  <td>{h.pelanggan}</td>
                  <td className="r">Rp{fmt(h.hargaJual)}</td>
                  <td className="r" style={{ color: 'var(--total-red)', fontWeight: 700 }}>Rp{fmt(h.totalHpp)}</td>
                  <td className="r" style={{ color: 'var(--total-red)', fontWeight: 700 }}>Rp{fmt(margin)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCreate && <HppCreateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
