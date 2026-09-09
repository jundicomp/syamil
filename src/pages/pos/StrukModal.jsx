import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function StrukModal({ sale, onClose }) {
  const { settings } = useData();
  const isWide = settings.strukWidth === '80';

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 'none', width: 'auto', background: 'var(--panel-2)' }}>
        <div className="modal-head">
          <b>Struk Transaksi <span style={{ fontWeight: 400, fontSize: 11, color: 'var(--text-faint)' }}>({settings.strukWidth}mm)</span></b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        <div id="struk-print-area" className={`struk-paper ${isWide ? 'w80' : ''}`}>
          <div className="center">
            <div className="store-name">{settings.namaUsaha}</div>
            <div>{settings.alamat}</div>
            {settings.telepon && <div>Telp: {settings.telepon}</div>}
          </div>
          <div className="dash" />
          <div>No. Nota: <b>{sale.noNota}</b></div>
          <div>Tanggal: {sale.tanggal}</div>
          <div>Pelanggan: {sale.pelanggan}</div>
          {sale.kodeMarketing && <div>Kode Marketing: {sale.kodeMarketing}</div>}
          <div className="dash" />
          {sale.items.map((it, i) => (
            <div key={i} style={{ marginBottom: 3 }}>
              <div>{it.produk}</div>
              <div className="row"><span>{it.qty} x {fmt(it.harga)}</span><span>Rp{fmt(it.qty * it.harga)}</span></div>
            </div>
          ))}
          <div className="dash" />
          <div className="row" style={{ fontWeight: 800, fontSize: 13 }}><span>TOTAL</span><span>Rp{fmt(sale.total)}</span></div>
          <div className="row"><span>Status</span><span>{sale.status}</span></div>
          {sale.status === 'DP' && (
            <>
              <div className="row"><span>DP Dibayar</span><span>Rp{fmt(sale.dpDibayar)}</span></div>
              <div className="row"><span>Sisa Bayar</span><span>Rp{fmt(sale.sisaBayar)}</span></div>
            </>
          )}
          <div className="dash" />
          <div className="center" style={{ fontSize: 10.5 }}>Terima kasih atas kunjungan Anda</div>
        </div>

        <div className="modal-actions" style={{ maxWidth: isWide ? 300 : 220, margin: '14px auto 0' }}>
          <button type="button" className="btn-outline" onClick={onClose}>Tutup</button>
          <button type="button" className="btn-gold" onClick={() => window.print()}>Cetak</button>
        </div>
      </div>
    </div>
  );
}
