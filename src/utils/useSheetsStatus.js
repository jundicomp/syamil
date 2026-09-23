import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;
const CEK_ULANG_MS = 30000; // cek ulang tiap 30 detik
const BATAS_KUAT_MS = 3000; // respons di bawah ini = kuat (hijau)
const BATAS_LEMAH_MS = 8000; // respons di bawah ini (tapi di atas kuat) = lemah (kuning), di atasnya/gagal = putus (merah)
const BATAS_ABORT_MS = 12000; // batas keras nunggu — Apps Script kadang lambat "bangun" (cold start) beberapa detik pertama

/**
 * Status: 'checking' | 'connected' | 'weak' | 'disconnected' | 'unconfigured'
 * - unconfigured: VITE_SHEETS_API_URL belum diisi sama sekali (belum setup)
 * - connected: terjawab cepat (<3 detik)
 * - weak: terjawab tapi lambat (3-8 detik)
 * - disconnected: gagal atau lebih dari 8 detik
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
      const timeoutId = setTimeout(() => controller.abort(), BATAS_ABORT_MS);
      const res = await fetch(BASE_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      const durasi = Date.now() - mulai;
      if (!res.ok) { console.warn('[Sheets] respons tidak OK, status:', res.status); setStatus('disconnected'); }
      else if (durasi < BATAS_KUAT_MS) { setStatus('connected'); }
      else if (durasi < BATAS_LEMAH_MS) { setStatus('weak'); }
      else { setStatus('disconnected'); }
    } catch (err) {
      console.error('[Sheets] gagal terhubung —', err.name + ':', err.message);
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
