import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import AppShell from './components/layout/AppShell';
import PelangganSupplierPage from './pages/pelangganSupplier/PelangganSupplierPage';
import ProdukBahanBakuPage from './pages/produkBahanBaku/ProdukBahanBakuPage';
import PromosiPage from './pages/promosi/PromosiPage';
import KampanyePage from './pages/kampanye/KampanyePage';
import LeadsPage from './pages/leads/LeadsPage';
import PengaturanSistemPage from './pages/pengaturanSistem/PengaturanSistemPage';

export default function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/pelanggan-supplier" replace />} />
              <Route path="/pelanggan-supplier" element={<PelangganSupplierPage />} />
              <Route path="/produk-bahan-baku" element={<ProdukBahanBakuPage />} />
              <Route path="/promosi" element={<PromosiPage />} />
              <Route path="/kampanye" element={<KampanyePage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/pengaturan-sistem" element={<PengaturanSistemPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </DataProvider>
  );
}
