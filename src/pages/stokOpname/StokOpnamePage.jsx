import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function StokOpnamePage() {
  const { data, addStokMovement } = useData();
  const [fisik, setFisik] = useState({}); // { [bahanId]: string }

  function getFisik(row) {
    return fisik[row.id] !== undefined ? fisik[row.id] : String(row.stok);
  }
  function getSelisih(row) {
    const f = Number(getFisik(row));
    return isNaN(f) ? 0 : f - row.stok;
  }

  function handleSimpan(row) {
    const selisih = getSelisih(row);
    if (selisih === 0) return;
    addStokMovement(
      row.nama,
      selisih > 0 ? 'Masuk' : 'Keluar',
      Math.abs(selisih),
      row.satuan,
      'Stok Opname',
      'Penyesuaian hasil stok opname'
    );
    setFisik(prev => { const n = { ...prev }; delete n[row.id]; return n; });
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Stok Opname</h2>
          <div className="page-sub">Stok Sistem otomatis dari data — isi Stok Fisik hasil hitung gudang</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bahan</th>
              <th>Satuan</th>
              <th className="r">Stok Sistem</th>
              <th className="r">Stok Fisik</th>
              <th className="r">Selisih</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.bahanBaku.map(row => {
              const selisih = getSelisih(row);
              return (
                <tr key={row.id}>
                  <td>{row.nama}</td>
                  <td>{row.satuan}</td>
                  <td className="r">{row.stok}</td>
                  <td className="r">
                    <input
                      type="number"
                      style={{ width: 90, textAlign: 'right' }}
                      value={getFisik(row)}
                      onChange={e => setFisik(prev => ({ ...prev, [row.id]: e.target.value }))}
                    />
                  </td>
                  <td className="r" style={{ color: selisih !== 0 ? 'var(--total-red)' : 'var(--text-faint)', fontWeight: 700 }}>
                    {selisih > 0 ? '+' : ''}{selisih}
                  </td>
                  <td>
                    <button
                      className="btn-outline"
                      disabled={selisih === 0}
                      onClick={() => handleSimpan(row)}
                      style={{ padding: '5px 12px', fontSize: 11.5 }}
                    >
                      Simpan
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 12 }}>
        Klik "Simpan" per baris untuk mencatat selisihnya ke Kartu Stok dan menyesuaikan Stok Sistem.
      </p>
    </div>
  );
}
