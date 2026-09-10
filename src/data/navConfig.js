// Struktur navigasi — portir langsung dari NAV/BOTTOM di versi HTML
// Fase 1: cuma item yang sudah dimigrasi yang punya `path`; sisanya masih placeholder.

export const NAV = [
  {
    group: 'Penjualan', color: 'green',
    items: [
      { key: 'pos', label: 'Kasir (POS)', icon: 'cart', path: '/pos' },
    ],
  },
  {
    group: 'Pembelian', color: 'blue',
    items: [
      { key: 'pembelian', label: 'Pembelian', icon: 'box', path: '/pembelian' },
      { key: 'stok', label: 'Stok', icon: 'checksquare', path: '/stok' },
    ],
  },
  {
    group: 'Produksi', color: 'orange',
    items: [
      { key: 'antrianProduksi', label: 'Alur SPK', icon: 'printer', path: '/alur-spk' },
      { key: 'statusPengerjaan', label: 'Status Pengerjaan', icon: 'activity', path: '/status-pengerjaan' },
      { key: 'laporanProduksi', label: 'Laporan Produksi', icon: 'chart', path: '/laporan-produksi' },
      { key: 'kalkulasiHpp', label: 'Kalkulasi HPP', icon: 'lock', path: '/kalkulasi-hpp' },
    ],
  },
  {
    group: 'Marketing', color: 'pink',
    items: [
      { key: 'marketingDashboard', label: 'Dashboard Marketing', icon: 'trending', path: '/dashboard-marketing' },
      { key: 'promosi', label: 'Promosi & Diskon', icon: 'percent', path: '/promosi' },
      { key: 'kampanye', label: 'Kampanye Pelanggan', icon: 'megaphone', path: '/kampanye' },
      { key: 'leads', label: 'Sumber Leads', icon: 'userplus', path: '/leads' },
    ],
  },
  {
    group: 'Laporan Keuangan', color: 'purple',
    items: [
      { key: 'laporanKeuangan', label: 'Laporan Keuangan', icon: 'wallet', path: '/laporan-keuangan' },
      { key: 'neraca', label: 'Laporan Neraca', icon: 'scale', path: '/neraca' },
      { key: 'dashboard', label: 'Dashboard', icon: 'home', path: '/dashboard' },
    ],
  },
];

export const BOTTOM = {
  group: 'Pengaturan',
  items: [
    { key: 'pengaturanSistem', label: 'Pengaturan Sistem', icon: 'settings', path: '/pengaturan-sistem' },
    { key: 'pelangganSupplier', label: 'Pelanggan & Supplier', icon: 'users', path: '/pelanggan-supplier' },
    { key: 'produk', label: 'Produk', icon: 'layers', path: '/produk' },
  ],
};

export function getAllNavGroups() {
  return [...NAV, BOTTOM];
}
