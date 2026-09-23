import { useEffect } from 'react';
import { useData } from '../../context/DataContext';

/**
 * Tidak merender apa-apa — cuma efek samping: judul tab browser ikut Nama Usaha,
 * dan favicon ikut Logo yang diupload di Pengaturan Sistem > Perusahaan (kalau ada).
 */
export default function DocumentMeta() {
  const { settings } = useData();

  useEffect(() => {
    document.title = settings.namaUsaha ? `${settings.namaUsaha} — Sistem Terpadu` : 'Sistem Terpadu';
  }, [settings.namaUsaha]);

  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]');
    if (link) link.href = settings.logoDataUrl || '/favicon.svg';
  }, [settings.logoDataUrl]);

  return null;
}
