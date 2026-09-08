// Portir dari fungsi badgeHTML() versi HTML.
const POS = ['Lunas', 'Aktif', 'Selesai', 'Deal', 'Berjalan', 'Konsumen'];
const NEG = ['Belum Lunas', 'Nonaktif', 'Batal', 'Berakhir'];

export default function Badge({ value }) {
  const cls = POS.includes(value) ? 'badge-pos' : NEG.includes(value) ? 'badge-neg' : 'badge-neu';
  return <span className={`badge ${cls}`}>{value}</span>;
}
