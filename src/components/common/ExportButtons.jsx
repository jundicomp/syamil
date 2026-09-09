import Icon from './Icon';

/**
 * Tombol Excel/PDF ringan — dipakai di tabel yang tampilannya kustom
 * (bukan lewat komponen <DataTable>), tapi tetap butuh export.
 * columns & rows harus mengikuti format yang sama dengan DataTable:
 * columns: [{ key, label, type?: 'currency', align?: 'r' }]
 */
export default function ExportButtons({ title, subtitle, columns, rows }) {
  async function handleExcel() {
    const { exportToExcel } = await import('../../utils/exportUtils');
    exportToExcel({ title, subtitle, columns, rows });
  }
  async function handlePDF() {
    const { exportToPDF } = await import('../../utils/exportUtils');
    exportToPDF({ title, subtitle, columns, rows });
  }

  return (
    <div className="export-group">
      <button className="btn-export excel" onClick={handleExcel} disabled={rows.length === 0}><Icon name="excel" size={14} /> Excel</button>
      <button className="btn-export pdf" onClick={handlePDF} disabled={rows.length === 0}><Icon name="pdf" size={14} /> PDF</button>
    </div>
  );
}
