/**
 * Cetak dengan ukuran kertas yang benar-benar diterapkan — bukan andalkan CSS
 * @page bernama (dukungan browser tidak konsisten), tapi suntik <style> @page
 * tanpa nama sesaat sebelum window.print(), lalu bersihkan setelahnya.
 */
export function printStruk(strukWidth) {
  const widthMm = strukWidth === '80' ? 80 : 58;
  const styleEl = document.createElement('style');
  styleEl.id = 'struk-print-page-size';
  styleEl.textContent = `@page{size:${widthMm}mm auto;margin:2mm;}`;
  document.head.appendChild(styleEl);

  function cleanup() {
    styleEl.remove();
    window.removeEventListener('afterprint', cleanup);
  }
  window.addEventListener('afterprint', cleanup);

  window.print();
  // Jaga-jaga kalau afterprint tidak terpicu (beberapa browser/print-to-PDF flow).
  setTimeout(cleanup, 3000);
}
