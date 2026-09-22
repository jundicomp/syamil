import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotify } from '../../context/NotificationContext';

function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

export default function PaymentModal({ subtotal, customer, onClose, onConfirm }) {
  const { data } = useData();
  const { notifyError } = useNotify();
  const [diskon, setDiskon] = useState(0);
  const [payStatus, setPayStatus] = useState('Lunas');
  const [dpAmount, setDpAmount] = useState(0);
  const [metodeBayar, setMetodeBayar] = useState('Tunai');
  const [overrideBatasKredit, setOverrideBatasKredit] = useState(false);

  const total = Math.max(0, subtotal - diskon);
  const sisaBayar = payStatus === 'DP' ? Math.max(0, total - dpAmount) : 0;
  const dpValid = payStatus !== 'DP' || (dpAmount >= 0 && dpAmount < total);

  const pelangganInfo = data.pelanggan.find(p => p.nama === customer);
  const batasKredit = pelangganInfo?.batasKredit || 0;
  const piutangBerjalan = data.piutang.filter(p => p.pelanggan === customer && p.status === 'Belum Lunas').reduce((s, p) => s + p.sisa, 0);
  const piutangSetelahIni = piutangBerjalan + sisaBayar;
  const lewatBatasKredit = batasKredit > 0 && payStatus === 'DP' && piutangSetelahIni > batasKredit;

  function handleConfirm() {
    if (!dpValid) { notifyError('Jumlah DP harus 0 atau lebih, dan kurang dari total (kalau pas totalnya, pilih Lunas saja).'); return; }
    if (lewatBatasKredit && !overrideBatasKredit) { notifyError('Piutang pelanggan ini akan melebihi batas kredit. Centang konfirmasi kalau tetap mau lanjut.'); return; }
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
            <button type="button" className={payStatus === 'DP' ? 'btn-gold' : 'btn-outline'} style={{ flex: 1 }} onClick={() => setPayStatus('DP')}>DP / Hutang</button>
          </div>
        </div>

        {payStatus === 'DP' && (
          <div className="f-field">
            <label>Jumlah Dibayar Sekarang</label>
            <input type="number" min="0" value={dpAmount} onChange={e => setDpAmount(Number(e.target.value))} />
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <button type="button" className="btn-outline" style={{ padding: '4px 10px', fontSize: 10.5 }} onClick={() => setDpAmount(0)}>Rp0 (Full Hutang)</button>
              <button type="button" className="btn-outline" style={{ padding: '4px 10px', fontSize: 10.5 }} onClick={() => setDpAmount(Math.round(total / 2))}>50%</button>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 8 }}>
              {dpAmount === 0
                ? <>Tidak bayar apa-apa sekarang — <b style={{ color: 'var(--total-red)' }}>seluruh Rp{fmt(total)}</b> jadi piutang.</>
                : <>Sisa bayar (jadi piutang): <b style={{ color: 'var(--total-red)' }}>Rp{fmt(sisaBayar)}</b></>}
            </div>
            {batasKredit > 0 && (
              <div style={{ fontSize: 11, color: lewatBatasKredit ? 'var(--total-red)' : 'var(--text-faint)', marginTop: 4 }}>
                {lewatBatasKredit ? '⚠ ' : ''}Piutang {customer} setelah ini: <b>Rp{fmt(piutangSetelahIni)}</b> / batas Rp{fmt(batasKredit)}
                {lewatBatasKredit && ' — melebihi batas kredit!'}
              </div>
            )}
            {lewatBatasKredit && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--total-red)', marginTop: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={overrideBatasKredit} onChange={e => setOverrideBatasKredit(e.target.checked)} />
                Tetap lanjutkan walau melebihi batas kredit
              </label>
            )}
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
