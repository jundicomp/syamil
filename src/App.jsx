import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/login/LoginPage';
import ProfilSayaPage from './pages/profil/ProfilSayaPage';
import PelangganSupplierPage from './pages/pelangganSupplier/PelangganSupplierPage';
import ProdukPage from './pages/produk/ProdukPage';
import PromosiPage from './pages/promosi/PromosiPage';
import KampanyePage from './pages/kampanye/KampanyePage';
import LeadsPage from './pages/leads/LeadsPage';
import PengaturanSistemPage from './pages/pengaturanSistem/PengaturanSistemPage';
import ChangelogPage from './pages/changelog/ChangelogPage';
import LaporanPenjualanPage from './pages/laporanPenjualan/LaporanPenjualanPage';
import LaporanProduksiPage from './pages/laporanProduksi/LaporanProduksiPage';
import StokPage from './pages/stok/StokPage';
import POSPage from './pages/pos/POSPage';
import PembelianPage from './pages/pembelian/PembelianPage';
import AntrianProduksiPage from './pages/antrianProduksi/AntrianProduksiPage';
import StatusPengerjaanPage from './pages/statusPengerjaan/StatusPengerjaanPage';
import KalkulasiHppPage from './pages/kalkulasiHpp/KalkulasiHppPage';
import MarketingDashboardPage from './pages/marketingDashboard/MarketingDashboardPage';
import BukuKasPage from './pages/bukuKas/BukuKasPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LabaRugiPage from './pages/labaRugi/LabaRugiPage';
import NeracaPage from './pages/neraca/NeracaPage';

export default function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/pelanggan-supplier" element={<PelangganSupplierPage />} />
                  <Route path="/profil-saya" element={<ProfilSayaPage />} />
                  <Route path="/produk" element={<ProdukPage />} />
                  <Route path="/promosi" element={<PromosiPage />} />
                  <Route path="/kampanye" element={<KampanyePage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/pengaturan-sistem" element={<PengaturanSistemPage />} />
                  <Route path="/changelog" element={<ChangelogPage />} />
                  <Route path="/laporan-penjualan" element={<LaporanPenjualanPage />} />
                  <Route path="/laporan-produksi" element={<LaporanProduksiPage />} />
                  <Route path="/stok" element={<StokPage />} />
                  <Route path="/pos" element={<POSPage />} />
                  <Route path="/pembelian" element={<PembelianPage />} />
                  <Route path="/alur-spk" element={<AntrianProduksiPage />} />
                  <Route path="/status-pengerjaan" element={<StatusPengerjaanPage />} />
                  <Route path="/kalkulasi-hpp" element={<KalkulasiHppPage />} />
                  <Route path="/dashboard-marketing" element={<MarketingDashboardPage />} />
                  <Route path="/buku-kas" element={<BukuKasPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/laba-rugi" element={<LabaRugiPage />} />
                  <Route path="/neraca" element={<NeracaPage />} />
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </DataProvider>
  );
}
