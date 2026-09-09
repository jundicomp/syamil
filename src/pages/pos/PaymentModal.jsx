import { useState } from 'react';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function PaymentModal({ subtotal, onClose, onConfirm }) {
  const [diskon, setDiskon] = useState(0);
  const [payStatus, setPayStatus] = useState('Lunas');
  const [dpAmount, setDpAmount] = useState(0);
  const [metodeBayar, setMetodeBayar] = useState('Tunai');

  const total = Math.max(0, subtotal - diskon);
  const sisaBayar = payStatus === 'DP' ? Math.max(0, total - dpAmount) : 0;
  const dpValid = payStatus !== 'DP' || (dpAmount > 0 && dpAmount < total);

  function handleConfirm() {
    if (!dpValid) { alert('Jumlah DP harus lebih dari 0 dan kurang dari total.'); return; }
    onConfirm({
      diskon, total,
      status: payStatus,
      dpDibayar: payStatus === 'DP' ? dpAmount : total,
      sisaBayar: payStatus === 'DP' ? sisaBayar : 0,
      metodeBayar,
    });
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 400 }}>
        <div className="modal-head">
          <b>Pembayaran</b>
          <button type="button" className="x" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}>
          <span>Subtotal</span><span>Rp{fmt(subtotal)}</span>
        </div>
        <div className="f-field" style={{ margin: '8px 0' }}>
          <label>Diskon (Rp)</label>
          <input type="number" min="0" value={diskon} onChange={e => setDiskon(Number(e.target.value))} />
        </div>

        <div style={{ textAlign: 'center', padding: '10px 0 16px', borderTop: '1px dashed var(--line)', borderBottom: '1px dashed var(--line)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>Total Tagihan</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>Rp{fmt(total)}</div>
        </div>

        <div className="f-field" style={{ marginTop: 16 }}>
          <label>Status Pembayaran</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className={payStatus === 'Lunas' ? 'btn-gold' : 'btn-outline'} style={{ flex: 1 }} onClick={() => setPayStatus('Lunas')}>Lunas</button>
            <button type="button" className={payStatus === 'DP' ? 'btn-gold' : 'btn-outline'} style={{ flex: 1 }} onClick={() => setPayStatus('DP')}>DP</button>
          </div>
        </div>

        {payStatus === 'DP' && (
          <div className="f-field">
            <label>Jumlah DP Dibayar</label>
            <input type="number" value={dpAmount} onChange={e => setDpAmount(Number(e.target.value))} />
            <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 6 }}>
              Sisa bayar: <b style={{ color: 'var(--total-red)' }}>Rp{fmt(sisaBayar)}</b>
            </div>
          </div>
        )}

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
          <button type="button" className="btn-gold" onClick={handleConfirm}>Cetak</button>
        </div>
      </div>
    </div>
  );
}
