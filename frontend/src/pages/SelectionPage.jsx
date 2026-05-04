import { LayoutGrid, ShieldCheck, Box, ArrowRight } from 'lucide-react';
import './SelectionPage.css';

export default function SelectionPage({ navigateTo }) {
  return (
    <div className="page-wrapper selection-page">
      <div className="bg-gradient-mesh"></div>
      
      <div className="selection-header animate-fade-in">
        <div className="icon-wrapper">
          <LayoutGrid size={24} color="#fff" />
        </div>
        <h5>ADBUDGET MANAGER • FINANCIAL INTELLIGENCE</h5>
      </div>

      <div className="cards-container">
        {/* Admin Card */}
        <div className="card selection-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-icon blue-icon">
            <ShieldCheck size={28} />
          </div>
          <div className="card-content">
            <span className="card-subtitle">MANAJEMEN PERUSAHAAN</span>
            <h2>Portal Admin</h2>
            <p>Konfigurasi izin jaringan, kelola anggaran global, dan awasi kinerja tim di semua kampanye.</p>
          </div>
          <button className="btn-primary w-full" onClick={() => navigateTo('admin_login')}>
            Lanjutkan ke Otentikasi
            <ArrowRight size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="card selection-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="card-icon light-icon">
            <Box size={28} />
          </div>
          <div className="card-content">
            <span className="card-subtitle">OPERASI KAMPANYE</span>
            <h2>Ruang Kerja Pengguna</h2>
            <p>Akses dasbor pribadi Anda, lacak pengeluaran kampanye secara real-time, dan hasilkan laporan kinerja.</p>
          </div>
          <button className="btn-light w-full" onClick={() => navigateTo('user_login')}>
            Masuk sebagai Operator
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <footer className="selection-footer">
        <div className="footer-square"></div>
        <p>© 2026 KELOMPOK 12 • GERBANG KEUANGAN TERAMANKAN</p>
      </footer>
    </div>
  );
}
