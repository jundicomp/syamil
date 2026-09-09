import { useData } from '../../context/DataContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

/**
 * Struk hidup — update otomatis mengikuti keranjang, dipakai sebagai pengganti
 * kartu "Total Transaksi" statis di kolom kanan POS.
 */
export default function LiveStrukPreview({ customer, customerInfo, kodeMarketing, items, total }) {
  const { settings } = useData();
  const isWide = settings.strukWidth === '80';

  return (
    <div className="table-wrap" style={{ padding: 16 }}>
      <div className={`struk-paper live ${isWide ? 'w80' : ''}`}>
        <div className="center">
          <div className="store-name">{settings.namaUsaha}</div>
          <div>{settings.alamat}</div>
        </div>
        <div className="dash" />
        <div>Pelanggan: {customer || '-'}</div>
        {customerInfo && <div style={{ opacity: .75 }}>{customerInfo}</div>}
        {kodeMarketing && <div>Kode Marketing: {kodeMarketing}</div>}
        <div className="dash" />

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: .5, padding: '10px 0' }}>Belum ada item dikonfirmasi</div>
        ) : items.map((it, i) => (
          <div key={i} style={{ marginBottom: 3 }}>
            <div>{it.produk}</div>
            <div className="row"><span>{it.qty} x {fmt(it.harga)}</span><span>Rp{fmt(it.qty * it.harga)}</span></div>
          </div>
        ))}

        <div className="dash" />
        <div className="row" style={{ fontWeight: 800, fontSize: 13 }}><span>TOTAL</span><span>Rp{fmt(total)}</span></div>
      </div>
    </div>
  );
}
