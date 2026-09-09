// Struktur navigasi — portir langsung dari NAV/BOTTOM di versi HTML
// Fase 1: cuma item yang sudah dimigrasi yang punya `path`; sisanya masih placeholder.

export const NAV = [
  {
    group: 'Penjualan', color: 'green',
    items: [
      { key: 'pos', label: 'Kasir (POS)', icon: 'cart', path: '/pos' },
      { key: 'laporanPenjualan', label: 'Laporan Penjualan', icon: 'chart', path: '/laporan-penjualan' },
    ],
  },
  {
    group: 'Pembelian', color: 'blue',
    items: [
      { key: 'pembelian', label: 'Pembelian', icon: 'box', path: '/pembelian' },
      { key: 'stokOpname', label: 'Stok Opname', icon: 'checksquare', path: '/stok-opname' },
    ],
  },
  {
    group: 'Produksi', color: 'orange',
    items: [
      { key: 'antrianProduksi', label: 'Alur SPK', icon: 'printer', path: null },
      { key: 'statusPengerjaan', label: 'Status Pengerjaan', icon: 'activity', path: null },
      { key: 'laporanProduksi', label: 'Laporan Produksi', icon: 'chart', path: '/laporan-produksi' },
      { key: 'kalkulasiHpp', label: 'Kalkulasi HPP', icon: 'lock', path: null },
    ],
  },
  {
    group: 'Marketing', color: 'pink',
    items: [
      { key: 'marketingDashboard', label: 'Dashboard Marketing', icon: 'trending', path: null },
      { key: 'promosi', label: 'Promosi & Diskon', icon: 'percent', path: '/promosi' },
      { key: 'kampanye', label: 'Kampanye Pelanggan', icon: 'megaphone', path: '/kampanye' },
      { key: 'leads', label: 'Sumber Leads', icon: 'userplus', path: '/leads' },
    ],
  },
  {
    group: 'Laporan Keuangan', color: 'purple',
    items: [
      { key: 'bukuKas', label: 'Buku Kas', icon: 'wallet', path: null },
      { key: 'labaRugi', label: 'Laporan Laba Rugi', icon: 'trending', path: null },
      { key: 'neraca', label: 'Laporan Neraca', icon: 'scale', path: null },
      { key: 'dashboard', label: 'Dashboard', icon: 'home', path: null },
    ],
  },
];

export const BOTTOM = {
  group: 'Pengaturan',
  items: [
    { key: 'pengaturanSistem', label: 'Pengaturan Sistem', icon: 'settings', path: '/pengaturan-sistem' },
    { key: 'pelangganSupplier', label: 'Pelanggan & Supplier', icon: 'users', path: '/pelanggan-supplier' },
    { key: 'produkBahanBaku', label: 'Produk & Bahan Baku', icon: 'layers', path: '/produk-bahan-baku' },
  ],
};

export function getAllNavGroups() {
  return [...NAV, BOTTOM];
}
