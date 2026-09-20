import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [modal, setModal] = useState(null);
  const timerRef = useRef(null);

  const clearTimer = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };

  /** Notifikasi sukses — dipakai setelah aksi "Simpan": progress singkat lalu centang sukses, auto-tutup. */
  const notifySuccess = useCallback((message) => {
    clearTimer();
    setModal({ type: 'progress', message });
    timerRef.current = setTimeout(() => {
      setModal({ type: 'success', message });
      timerRef.current = setTimeout(() => setModal(null), 1100);
    }, 650);
  }, []);

  /** Notifikasi gagal/peringatan — tampil modal, tidak auto-hilang, user klik OK. */
  const notifyError = useCallback((message) => {
    clearTimer();
    setModal({ type: 'error', message });
  }, []);

  /** Pengganti confirm() — kembalikan Promise<boolean>. */
  const confirmDialog = useCallback((message, opts = {}) => {
    clearTimer();
    return new Promise(resolve => {
      setModal({
        type: 'confirm', message,
        danger: !!opts.danger,
        confirmLabel: opts.confirmLabel || 'Ya, Lanjutkan',
        cancelLabel: opts.cancelLabel || 'Batal',
        onConfirm: () => { setModal(null); resolve(true); },
        onCancel: () => { setModal(null); resolve(false); },
      });
    });
  }, []);

  function closeModal() {
    clearTimer();
    setModal(null);
  }

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, confirmDialog }}>
      {children}
      {modal && (
        <div className="notif-backdrop">
          <div className={`notif-card notif-${modal.type}`}>
            {modal.type === 'progress' && (
              <>
                <div className="notif-progress-track"><div className="notif-progress-fill" /></div>
                <p className="notif-msg">{modal.message}</p>
              </>
            )}
            {modal.type === 'success' && (
              <>
                <div className="notif-icon notif-icon-success">✓</div>
                <p className="notif-msg">{modal.message}</p>
              </>
            )}
            {modal.type === 'error' && (
              <>
                <div className="notif-icon notif-icon-error">✕</div>
                <p className="notif-msg">{modal.message}</p>
                <button type="button" className="btn-gold" onClick={closeModal}>OK</button>
              </>
            )}
            {modal.type === 'confirm' && (
              <>
                <div className={`notif-icon ${modal.danger ? 'notif-icon-error' : 'notif-icon-confirm'}`}>{modal.danger ? '!' : '?'}</div>
                <p className="notif-msg">{modal.message}</p>
                <div className="notif-actions">
                  <button type="button" className="btn-outline" onClick={modal.onCancel}>{modal.cancelLabel}</button>
                  <button type="button" className={modal.danger ? 'btn-danger' : 'btn-gold'} onClick={modal.onConfirm}>{modal.confirmLabel}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify harus dipakai di dalam <NotificationProvider>');
  return ctx;
}
