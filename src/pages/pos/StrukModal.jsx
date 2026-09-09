import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function StrukModal({ sale, onClose }) {
  const { settings } = useData();

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 340 }}>
        <div className="modal-head">
          <b>Struk Transaksi</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        <div id="struk-print-area" style={{ fontSize: 12.5, lineHeight: 1.7 }}>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <b style={{ fontSize: 14 }}>{settings.namaUsaha}</b><br />
            <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>{settings.alamat}</span>
          </div>
          <div style={{ borderTop: '1px dashed var(--line)', borderBottom: '1px dashed var(--line)', padding: '8px 0', margin: '8px 0' }}>
            <div>No. Nota: <b>{sale.noNota}</b></div>
            <div>Tanggal: {sale.tanggal}</div>
            <div>Pelanggan: {sale.pelanggan}</div>
            {sale.kodeMarketing && <div>Kode Marketing: {sale.kodeMarketing}</div>}
          </div>
          {sale.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{it.produk} ×{it.qty}</span>
              <span>Rp{fmt(it.qty * it.harga)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px dashed var(--line)', marginTop: 8, paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
              <span>Total</span><span>Rp{fmt(sale.total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Status</span><span>{sale.status}</span>
            </div>
            {sale.status === 'DP' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>DP Dibayar</span><span>Rp{fmt(sale.dpDibayar)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--total-red)' }}><span>Sisa Bayar</span><span>Rp{fmt(sale.sisaBayar)}</span></div>
              </>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>Tutup</button>
          <button type="button" className="btn-gold" onClick={() => window.print()}>Cetak</button>
        </div>
      </div>
    </div>
  );
}
