/** Layar loading awal — pulse dot berkedip + tulisan "Loading" berkedip, dipakai saat ambil data awal dari Sheets. */
export default function SkeletonLoader() {
  return (
    <div className="simple-loading-screen">
      <span className="blink-dot" />
      <span className="blink-text">Loading</span>
    </div>
  );
}
