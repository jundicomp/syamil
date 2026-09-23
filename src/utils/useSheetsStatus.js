import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;
const CEK_ULANG_MS = 30000; // cek ulang tiap 30 detik
const BATAS_KUAT_MS = 1500; // respons di bawah ini = kuat (hijau)
const BATAS_LEMAH_MS = 4000; // respons di bawah ini (tapi di atas kuat) = lemah (kuning), di atasnya/gagal = putus (merah)

/**
 * Status: 'checking' | 'connected' | 'weak' | 'disconnected' | 'unconfigured'
 * - unconfigured: VITE_SHEETS_API_URL belum diisi sama sekali (belum setup)
 * - connected: terjawab cepat (<1.5 detik)
 * - weak: terjawab tapi lambat (1.5-4 detik)
 * - disconnected: gagal atau lebih dari 4 detik
 */
export function useSheetsStatus() {
  const [status, setStatus] = useState(BASE_URL ? 'checking' : 'unconfigured');
  const [lastCheck, setLastCheck] = useState(null);
  const prevStatusRef = useRef(status);

  const cekKoneksi = useCallback(async () => {
    if (!BASE_URL) { setStatus('unconfigured'); setLastCheck(new Date()); return; }
    setStatus(prev => (prev === 'unconfigured' ? 'checking' : prev)); // jangan kedip ke 'checking' tiap cek ulang, cuma pas awal
    const mulai = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), BATAS_LEMAH_MS + 1000);
      const res = await fetch(BASE_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      const durasi = Date.now() - mulai;
      if (!res.ok) { setStatus('disconnected'); }
      else if (durasi < BATAS_KUAT_MS) { setStatus('connected'); }
      else if (durasi < BATAS_LEMAH_MS) { setStatus('weak'); }
      else { setStatus('disconnected'); }
    } catch {
      setStatus('disconnected');
    } finally {
      setLastCheck(new Date());
    }
  }, []);

  useEffect(() => {
    cekKoneksi();
    const interval = setInterval(cekKoneksi, CEK_ULANG_MS);
    return () => clearInterval(interval);
  }, [cekKoneksi]);

  // Kalau baru saja PULIH dari putus/lemah ke tersambung penuh, muat ulang halaman
  // supaya data yang sempat gagal dimuat dicoba lagi dari awal.
  useEffect(() => {
    if (prevStatusRef.current === 'disconnected' && status === 'connected') {
      window.location.reload();
    }
    prevStatusRef.current = status;
  }, [status]);

  return { status, lastCheck, cekUlang: cekKoneksi, terkonfigurasi: !!BASE_URL };
}
