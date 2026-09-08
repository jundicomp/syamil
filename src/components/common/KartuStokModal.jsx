import { useData } from '../../context/DataContext';

export default function KartuStokModal({ bahan, onClose }) {
  const { data } = useData();
  const riwayat = data.stokLedger.filter(r => r.bahan === bahan.nama);

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 560 }}>
        <div className="modal-head">
          <b>Kartu Stok — {bahan.nama}</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <div className="page-sub" style={{ marginBottom: 12 }}>
          Stok saat ini: <b style={{ color: 'var(--text)' }}>{bahan.stok} {bahan.satuan}</b>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th><th>Tipe</th><th className="r">Qty</th><th>Referensi</th><th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.length === 0 ? (
                <tr><td colSpan={5} className="empty-row">Belum ada pergerakan untuk bahan ini.</td></tr>
              ) : riwayat.map(r => (
                <tr key={r.id}>
                  <td>{r.tanggal}</td>
                  <td><span className={`badge ${r.tipe === 'Masuk' ? 'badge-pos' : 'badge-neg'}`}>{r.tipe}</span></td>
                  <td className="r">{r.qty} {r.satuan}</td>
                  <td>{r.referensi}</td>
                  <td>{r.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
