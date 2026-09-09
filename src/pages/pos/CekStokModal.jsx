import { useData } from '../../context/DataContext';

export default function CekStokModal({ onClose }) {
  const { data } = useData();

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <b>Cek Stok Bahan</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>
        <div className="page-sub" style={{ marginBottom: 10 }}>Cuma lihat — tidak bisa diubah dari sini.</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Bahan</th><th className="r">Stok</th><th>Satuan</th></tr></thead>
            <tbody>
              {data.bahanBaku.map(b => (
                <tr key={b.id}>
                  <td>{b.nama}</td>
                  <td className="r" style={{ color: b.stok <= b.stokMinimum ? 'var(--total-red)' : 'var(--text)' }}>{b.stok}</td>
                  <td>{b.satuan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
