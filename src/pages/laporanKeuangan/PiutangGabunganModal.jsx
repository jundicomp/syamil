import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';
import Currency from '../../components/common/Currency';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function PiutangGabunganModal({ onClose }) {
  const { data, updateRow, addBukuKasEntry } = useData();
  const { notifyError, notifySuccess } = useNotify();

  const belumLunas = data.piutang.filter(p => p.status === 'Belum Lunas');
  const daftarPelanggan = [...new Set(belumLunas.map(p => p.pelanggan))];
  const pelangganAwal = daftarPelanggan[0] || '';
  const notaAwal = belumLunas.filter(p => p.pelanggan === pelangganAwal);

  const [pelanggan, setPelanggan] = useState(pelangganAwal);
  const [dipilih, setDipilih] = useState(() => new Set(notaAwal.map(p => p.id)));
  const [jumlahBayar, setJumlahBayar] = useState(() => notaAwal.reduce((s, p) => s + p.sisa, 0));
  const [metodeBayar, setMetodeBayar] = useState('Tunai');

  const notaPelanggan = belumLunas.filter(p => p.pelanggan === pelanggan);
  const totalTerpilih = notaPelanggan.filter(p => dipilih.has(p.id)).reduce((s, p) => s + p.sisa, 0);

  function gantiPelanggan(nama) {
    setPelanggan(nama);
    const notaBaru = belumLunas.filter(p => p.pelanggan === nama);
    setDipilih(new Set(notaBaru.map(p => p.id)));
    setJumlahBayar(notaBaru.reduce((s, p) => s + p.sisa, 0));
  }

  function toggleNota(id) {
    setDipilih(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (dipilih.size === 0) { notifyError('Pilih minimal 1 nota yang mau dilunasi.'); return; }
    if (jumlahBayar <= 0 || jumlahBayar > totalTerpilih) { notifyError(`Jumlah harus antara Rp1 dan Rp${fmt(totalTerpilih)}.`); return; }

    // Bayar berurutan dari nota terlama (paling atas) sampai jumlah bayar habis.
    let sisaBayar = jumlahBayar;
    const notaTerpilihUrut = notaPelanggan.filter(p => dipilih.has(p.id));
    for (const nota of notaTerpilihUrut) {
      if (sisaBayar <= 0) break;
      const bayarUntukNotaIni = Math.min(sisaBayar, nota.sisa);
      const sisaBaru = nota.sisa - bayarUntukNotaIni;
      updateRow('piutang', nota.id, {
        dibayar: nota.dibayar + bayarUntukNotaIni, sisa: sisaBaru,
        status: sisaBaru <= 0 ? 'Lunas' : 'Belum Lunas',
      });
      if (sisaBaru <= 0) {
        const penjualanRow = data.penjualan.find(p => p.noNota === nota.noNota);
        if (penjualanRow) updateRow('penjualan', penjualanRow.id, { status: 'Lunas', sisaBayar: 0, dpDibayar: penjualanRow.total });
      }
      sisaBayar -= bayarUntukNotaIni;
    }

    addBukuKasEntry('Masuk', jumlahBayar, `Pelunasan gabungan ${notaTerpilihUrut.length} nota — ${pelanggan}`, metodeBayar);
    notifySuccess(`Pelunasan gabungan ${pelanggan} tercatat (${notaTerpilihUrut.length} nota).`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <b>Bayar Gabungan — Beberapa Nota Sekaligus</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        {daftarPelanggan.length === 0 ? (
          <p style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>Tidak ada piutang yang belum lunas saat ini.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="f-field">
              <label>Pelanggan</label>
              <select value={pelanggan} onChange={e => gantiPelanggan(e.target.value)}>
                {daftarPelanggan.map(nama => <option key={nama} value={nama}>{nama}</option>)}
              </select>
            </div>

            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-soft)', margin: '10px 0 6px' }}>
              Pilih Nota yang Mau Dilunasi
            </label>
            <div style={{ border: '1px solid var(--line)', borderRadius: 10, maxHeight: 180, overflowY: 'auto' }}>
              {notaPelanggan.map(p => (
                <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid var(--line-soft)', fontSize: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={dipilih.has(p.id)} onChange={() => toggleNota(p.id)} />
                  <span style={{ flex: 1 }}>{p.noNota} · {p.tanggal}</span>
                  <Currency value={p.sisa} bold />
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '10px 0' }}>
              <span>Total Terpilih ({dipilih.size} nota)</span>
              <b style={{ color: 'var(--total-red)' }}>Rp{fmt(totalTerpilih)}</b>
            </div>

            <div className="f-field">
              <label>Jumlah Dibayar</label>
              <input type="number" min="0" value={jumlahBayar} onChange={e => setJumlahBayar(Number(e.target.value))} />
              <p style={{ fontSize: 10.5, color: 'var(--text-faint)', margin: '5px 0 0' }}>
                Kalau kurang dari total terpilih, dibayarkan berurutan dari nota paling atas dulu.
              </p>
            </div>

            <div className="f-field">
              <label>Metode Bayar</label>
              <select value={metodeBayar} onChange={e => setMetodeBayar(e.target.value)}>
                <option>Tunai</option>
                <option>Transfer</option>
                <option>QRIS</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
              <button type="submit" className="btn-gold">Catat Pelunasan</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
