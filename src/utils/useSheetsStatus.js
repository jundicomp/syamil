import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;
const CEK_ULANG_MS = 30000; // cek ulang tiap 30 detik
const BATAS_ABORT_MS = 12000; // batas keras nunggu — Apps Script kadang lambat "bangun" (cold start) beberapa detik pertama
const GAGAL_BERTURUT_UNTUK_PUTUS = 2; // baru dianggap benar-benar putus kalau gagal 2x berturut-turut (bukan 1x kedipan sesaat)

/**
 * Status: 'checking' | 'connected' | 'weak' | 'disconnected' | 'unconfigured'
 * - unconfigured: VITE_SHEETS_API_URL belum diisi sama sekali (belum setup)
 * - connected: berhasil dijawab — HIJAU, tidak peduli cepat/lambat (Apps Script wajar butuh
 *   beberapa detik cold start, itu bukan tanda masalah selama akhirnya berhasil)
 * - weak: baru gagal 1x (belum tentu putus beneran, masih dicoba lagi)
 * - disconnected: gagal 2x berturut-turut atau lebih
 *
 * Catatan: TIDAK auto-reload halaman lagi kalau cuma kedipan sesaat — reload cuma
 * terjadi kalau tadinya benar-benar putus lama (2x+ gagal berturut-turut) lalu pulih.
 */
export function useSheetsStatus() {
  const [status, setStatus] = useState(BASE_URL ? 'checking' : 'unconfigured');
  const [lastCheck, setLastCheck] = useState(null);
  const gagalBerturutRef = useRef(0);
  const pernahPutusLamaRef = useRef(false);

  const cekKoneksi = useCallback(async () => {
    if (!BASE_URL) { setStatus('unconfigured'); setLastCheck(new Date()); return; }
    setStatus(prev => (prev === 'unconfigured' ? 'checking' : prev)); // jangan kedip ke 'checking' tiap cek ulang, cuma pas awal
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), BATAS_ABORT_MS);
      const res = await fetch(BASE_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('HTTP ' + res.status);

      gagalBerturutRef.current = 0;
      setStatus('connected');

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
