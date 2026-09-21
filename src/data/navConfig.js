// Struktur navigasi — portir langsung dari NAV/BOTTOM di versi HTML
// Fase 1: cuma item yang sudah dimigrasi yang punya `path`; sisanya masih placeholder.
// `modul` = kunci yang dicocokkan ke HAK_AKSES_MODULES (seedData.js) untuk gerbang akses.
// Default-nya sama dengan nama grup, kecuali disebutkan beda (mis. Kalkulasi HPP).

export const NAV = [
  {
    group: 'Penjualan', color: 'green', modul: 'Penjualan',
    items: [
      { key: 'pos', label: 'Kasir (POS)', icon: 'cart', path: '/pos' },
    ],
  },
  {
    group: 'Pembelian', color: 'blue', modul: 'Pembelian',
    items: [
      { key: 'pembelian', label: 'Pembelian', icon: 'box', path: '/pembelian' },
      { key: 'stok', label: 'Stok', icon: 'checksquare', path: '/stok' },
    ],
  },
  {
    group: 'Produksi', color: 'orange', modul: 'Produksi',
    items: [
      { key: 'statusPengerjaan', label: 'Dashboard', icon: 'home', path: '/status-pengerjaan' },
      { key: 'antrianProduksi', label: 'Alur SPK', icon: 'printer', path: '/alur-spk' },
      { key: 'laporanProduksi', label: 'Laporan Produksi', icon: 'chart', path: '/laporan-produksi' },
      { key: 'kalkulasiHpp', label: 'Kalkulasi HPP', icon: 'lock', path: '/kalkulasi-hpp', modul: 'Kalkulasi HPP' },
    ],
  },
  {
    group: 'Marketing', color: 'pink', modul: 'Marketing',
    items: [
      { key: 'marketingDashboard', label: 'Dashboard Marketing', icon: 'trending', path: '/dashboard-marketing' },
      { key: 'promosi', label: 'Promosi & Diskon', icon: 'percent', path: '/promosi' },
      { key: 'kampanye', label: 'Kampanye Pelanggan', icon: 'megaphone', path: '/kampanye' },
      { key: 'leads', label: 'Sumber Leads', icon: 'userplus', path: '/leads' },
    ],
  },
  {
    group: 'Laporan Keuangan', color: 'purple', modul: 'Laporan Keuangan',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'home', path: '/dashboard' },
      { key: 'laporanKeuangan', label: 'Laporan Keuangan', icon: 'wallet', path: '/laporan-keuangan' },
      { key: 'neraca', label: 'Laporan Neraca', icon: 'scale', path: '/neraca' },
    ],
  },
];

export const BOTTOM = {
  group: 'Pengaturan', modul: 'Pengaturan',
  items: [
    { key: 'pengaturanSistem', label: 'Pengaturan Sistem', icon: 'settings', path: '/pengaturan-sistem' },
    { key: 'pelangganSupplier', label: 'Pelanggan & Supplier', icon: 'users', path: '/pelanggan-supplier' },
    { key: 'produk', label: 'Produk', icon: 'layers', path: '/produk' },
  ],
};

export function getAllNavGroups() {
  return [...NAV, BOTTOM];
}

/** Modul (Hak Akses) yang berlaku buat 1 item nav — pakai punya item kalau ada, else ikut grupnya. */
export function modulForItem(group, item) {
  return item.modul || group.modul;
}

/** Cari grup+item yang cocok dengan path — dipakai buat gerbang akses per-route. */
export function findNavItemByPath(pathname) {
  for (const g of getAllNavGroups()) {
    const item = g.items.find(it => it.path === pathname);
    if (item) return { group: g, item };
  }
  return null;
}

/** Halaman pertama yang boleh diakses role ini — dipakai sebagai tujuan redirect default/fallback. */
export function firstAccessiblePath(role, hakAkses) {
  const izin = hakAkses[role] || {};
  for (const g of getAllNavGroups()) {
    for (const it of g.items) {
      if (izin[modulForItem(g, it)]) return it.path;
    }
  }
  return '/profil-saya'; // jaga-jaga kalau role ini benar-benar tidak punya akses modul manapun
}
