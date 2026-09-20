function fmt(n) { return Math.round(n || 0).toLocaleString('id-ID'); }

/** Format akuntansi: "Rp" rata kiri, nilai rata kanan, dalam 1 elemen — dipakai di tabel/kartu kustom (bukan lewat DataTable). */
export default function Currency({ value, numColor, bold, style }) {
  return (
    <span className="curr-cell" style={style}>
      <span className="curr-sym">Rp</span>
      <span className="curr-num" style={{ color: numColor, fontWeight: bold ? 800 : undefined }}>{fmt(value)}</span>
    </span>
  );
}
