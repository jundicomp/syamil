import Icon from './Icon';
import { useData } from '../../context/DataContext';

/**
 * Tombol export ringan untuk tabel kustom (bukan lewat <DataTable>).
 * `rows` di sini HARUS sudah data final yang mau diekspor (kalau ada filter tanggal,
 * filter itu dilakukan di halaman pemanggil, lalu kirim rangeLabel-nya ke sini).
 */
export default function ExportButtons({ title, reportName, columns, rows, rangeLabel, summaryKeys, summary }) {
  const { settings } = useData();
  const header = { companyName: settings.namaUsaha, reportName: reportName || title, rangeLabel };

  async function handleExcel() {
    const { exportToExcel } = await import('../../utils/exportUtils');
    exportToExcel({ ...header, columns, rows, summaryKeys, summary });
  }
  async function handlePDF() {
    const { exportToPDF } = await import('../../utils/exportUtils');
    exportToPDF({ ...header, columns, rows, summaryKeys, summary });
  }

  return (
    <div className="export-group">
      <button className="btn-export excel" onClick={handleExcel} disabled={rows.length === 0}><Icon name="excel" size={14} /> Excel</button>
      <button className="btn-export pdf" onClick={handlePDF} disabled={rows.length === 0}><Icon name="pdf" size={14} /> PDF</button>
    </div>
  );
}
