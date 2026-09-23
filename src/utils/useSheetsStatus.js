import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;
const CEK_ULANG_MS = 30000; // cek ulang tiap 30 detik
const BATAS_KUAT_MS = 3000; // respons di bawah ini = kuat (hijau)
const BATAS_LEMAH_MS = 8000; // respons di bawah ini (tapi di atas kuat) = lemah (kuning)
const BATAS_ABORT_MS = 12000; // batas keras nunggu — Apps Script kadang lambat "bangun" (cold start) beberapa detik pertama
const GAGAL_BERTURUT_UNTUK_PUTUS = 2; // baru dianggap benar-benar putus kalau gagal 2x berturut-turut (bukan 1x kedipan sesaat)

/**
 * Status: 'checking' | 'connected' | 'weak' | 'disconnected' | 'unconfigured'
 * - unconfigured: VITE_SHEETS_API_URL belum diisi sama sekali (belum setup)
 * - connected: terjawab cepat (<3 detik)
 * - weak: terjawab tapi lambat (3-8 detik) ATAU baru gagal 1x (belum tentu putus beneran)
 * - disconnected: gagal 2x berturut-turut atau lebih
 *
 * Catatan: TIDAK auto-reload halaman lagi kalau cuma kedipan sesaat — cold start
 * Apps Script itu wajar naik-turun, reload tiap kedipan malah bikin app kerasa
 * putus-nyambung terus. Reload cuma terjadi kalau tadinya benar-benar putus lama.
 */
export function useSheetsStatus() {
  const [status, setStatus] = useState(BASE_URL ? 'checking' : 'unconfigured');
  const [lastCheck, setLastCheck] = useState(null);
  const gagalBerturutRef = useRef(0);
  const pernahPutusLamaRef = useRef(false);

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
      if (!res.ok) throw new Error('HTTP ' + res.status);

      gagalBerturutRef.current = 0;
      if (durasi < BATAS_KUAT_MS) setStatus('connected');
      else if (durasi < BATAS_LEMAH_MS) setStatus('weak');
      else setStatus('weak'); // lambat tapi tetap terjawab — bukan putus

      // Baru reload kalau sebelumnya sempat putus BEBERAPA KALI berturut-turut (bukan kedipan sesaat),
      // supaya data yang gagal dimuat waktu itu dicoba lagi dari awal.
      if (pernahPutusLamaRef.current) {
        pernahPutusLamaRef.current = false;
        window.location.reload();
      }
    } catch (err) {
      console.error('[Sheets] gagal terhubung —', err.name + ':', err.message);
      gagalBerturutRef.current += 1;
      if (gagalBerturutRef.current >= GAGAL_BERTURUT_UNTUK_PUTUS) {
        setStatus('disconnected');
        pernahPutusLamaRef.current = true;
      } else {
        setStatus('weak'); // baru gagal sekali — jangan langsung vonis putus
      }
    } finally {
      setLastCheck(new Date());
    }
  }, []);

  useEffect(() => {
    cekKoneksi();
    const interval = setInterval(cekKoneksi, CEK_ULANG_MS);
    return () => clearInterval(interval);
  }, [cekKoneksi]);

  return { status, lastCheck, cekUlang: cekKoneksi, terkonfigurasi: !!BASE_URL };
}
