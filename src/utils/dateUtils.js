export const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const BULAN_LENGKAP = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// "Hari ini" simulasi aplikasi — konsisten dengan data contoh yang dianchor ke 12 Agustus 2026.
export const APP_TODAY = new Date(2026, 7, 12);

/** Parse "12 Agu 2026" atau "12 Agu 2026, 10:24" jadi objek Date. Null kalau gagal. */
export function parseTanggalID(str) {
  if (!str) return null;
  const parts = String(str).trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const monthIdx = BULAN_SINGKAT.indexOf(parts[1]);
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || monthIdx === -1 || isNaN(year)) return null;
  return new Date(year, monthIdx, day);
}

/** Date -> "2026-08-12" untuk value input type=date */
export function toInputDate(d) {
  if (!d) return '';
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** "2026-08-12" (dari input type=date) -> Date */
export function fromInputDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Cek apakah tanggal (Date) berada dalam rentang [from, to] inklusif. from/to null = tak terbatas. */
export function inRange(date, from, to) {
  if (!date) return false;
  if (from && date < from) return false;
  if (to) {
    const toEnd = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59);
    if (date > toEnd) return false;
  }
  return true;
}

/** Label rentang buat header laporan, mis. "Per 1 - 20 September 2026" atau "Semua Data". */
export function formatRangeLabel(from, to) {
  if (!from && !to) return 'Semua Data';
  if (from && to) {
    const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
    if (sameMonth) {
      return `Per ${from.getDate()} - ${to.getDate()} ${BULAN_LENGKAP[to.getMonth()]} ${to.getFullYear()}`;
    }
    return `Per ${from.getDate()} ${BULAN_LENGKAP[from.getMonth()]} ${from.getFullYear()} - ${to.getDate()} ${BULAN_LENGKAP[to.getMonth()]} ${to.getFullYear()}`;
  }
  if (from) return `Sejak ${from.getDate()} ${BULAN_LENGKAP[from.getMonth()]} ${from.getFullYear()}`;
  return `Sampai ${to.getDate()} ${BULAN_LENGKAP[to.getMonth()]} ${to.getFullYear()}`;
}

export function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
export function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
export function startOfYear(d) { return new Date(d.getFullYear(), 0, 1); }
export function endOfYear(d) { return new Date(d.getFullYear(), 11, 31); }
