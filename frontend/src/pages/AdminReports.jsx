import { useState, useEffect, useRef } from 'react';
import { FileText, Filter, Download, RefreshCw } from 'lucide-react';
import api from '../services/api';
import Sidebar from './Sidebar';
import './AdminReports.css';
import './AdminReportsPrint.css';

export default function AdminReports({ navigateTo }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    periode_awal: '',
    periode_akhir: '',
    platform: 'All'
  });
  const user = api.getUser();

  // Proteksi: jika bukan Admin, redirect ke selection
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigateTo('selection');
    }
  }, [user, navigateTo]);

  useEffect(() => {
    fetchData();
  }, []); // Only fetch on mount

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiFilters = {};
      if (filters.periode_awal) apiFilters.periode_awal = filters.periode_awal;
      if (filters.periode_akhir) apiFilters.periode_akhir = filters.periode_akhir;
      
      const result = await api.getReportData(apiFilters);
      setReportData(result.data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Token')) {
        api.logout();
        navigateTo('selection');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigateTo('selection');
  };

  const formatCurrency = (num) => {
    if (!num && num !== 0) return 'IDR 0';
    if (num >= 1000000000) {
      return `IDR ${(num / 1000000000).toFixed(1)}Mlyr`;
    }
    if (num >= 1000000) {
      return `IDR ${(num / 1000000).toFixed(1)}Jt`;
    }
    return 'IDR ' + num.toLocaleString('id-ID');
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toLocaleString('id-ID');
  };

  const exportToCSV = () => {
    if (!detailRows || detailRows.length === 0) return;
    
    const headers = ['Nama Kampanye', 'Platform', 'Tanggal', 'Impressions', 'Clicks', 'Conversions', 'Revenue', 'ROAS'];
    const csvContent = [
      headers.join(','),
      ...detailRows.map(row => [
        `"${row.nama_campaign}"`,
        row.platform,
        row.tanggal,
        row.impression,
        row.click,
        row.conversion,
        row.revenue,
        row.roas
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Iklan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat data laporan...</p>
          </div>
        </div>
      </div>
    );
  }

  const summary = reportData?.summary || {};
  const platformData = reportData?.platform_data || [];
  const trenHarian = reportData?.tren_harian || [];

  // Filter detail rows berdasarkan platform jika bukan 'All'
  const detailRows = (reportData?.detail_rows || []).filter(row => 
    filters.platform === 'All' || row.platform === filters.platform
  );

  const availablePlatforms = ['All', ...(reportData?.all_platforms || [])];

  // Hitung max value untuk skala line chart (Tren Revenue vs Biaya)
  const maxChartValue = trenHarian.length > 0 
    ? Math.max(...trenHarian.flatMap(d => [d.revenue, d.biaya])) 
    : 100;

  // Fungsi untuk menggambar garis SVG dari data
  const getSvgPath = (dataKey) => {
    if (trenHarian.length === 0) return '';
    if (trenHarian.length === 1) {
      const y = 140 - (trenHarian[0][dataKey] / maxChartValue) * 120;
      return `M0,${y} L500,${y}`;
    }
    
    return trenHarian.map((d, i) => {
      const x = (i / (trenHarian.length - 1)) * 500;
      const y = 140 - (d[dataKey] / maxChartValue) * 120; // 140 is bottom bound, 120 is chart scale
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  // Hitung max revenue untuk skala bar chart (Platform)
  const maxPlatformRevenue = platformData.length > 0
    ? Math.max(...platformData.map(p => p.revenue))
    : 100;

  // --- FUNGSI EXPORT & DOWNLOAD ---
  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      // Gunakan URL dinamis dari environment
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/reports/export/csv`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error(`Gagal mengunduh file CSV dari backend`);
      
      // Ambil file binary (Blob)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Buat elemen link tersembunyi untuk trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan_Budget_Iklan.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Bersihkan
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // PDF dicetak murni dari frontend agar desain UI terbawa rapi
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar navigateTo={navigateTo} activePage="admin_reports" />

      {/* Main Content */}
      <main className="main-content report-content">
        <header className="topbar">
          <div className="page-title-group">
            <h1 className="page-title">Laporan Anggaran Iklan</h1>
            <span className="status-badge success"><CheckCircleIcon /> SESUAI TARGET</span>
          </div>
          <div className="topbar-actions">
            <div className="user-mini-profile">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Admin')}&background=0D8ABC&color=fff`} alt="User" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{user?.nama || 'Admin'}</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
            <div className="modal-content animate-scale-in" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
               <div className="modal-header">
                  <h2>Filter Laporan</h2>
                  <button className="modal-close" onClick={() => setShowFilterModal(false)}>
                    <svg width="20" height="20" viewBox="0 0 20 20"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
               </div>
               <div className="modal-body">
                  <div className="modal-form-group">
                     <label className="modal-label">PERIODE</label>
                     <div className="date-inputs-row">
                        <input 
                           type="date" 
                           className="modal-input"
                           value={filters.periode_awal} 
                           onChange={(e) => setFilters({...filters, periode_awal: e.target.value})} 
                        />
                        <span className="mx-2">s/d</span>
                        <input 
                           type="date" 
                           className="modal-input"
                           value={filters.periode_akhir} 
                           onChange={(e) => setFilters({...filters, periode_akhir: e.target.value})} 
                        />
                     </div>
               </div>
            </div>
               <div className="modal-footer">
                  <button className="btn-save w-full" onClick={() => { fetchData(); setShowFilterModal(false); }}>
                     TERAPKAN FILTER
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid report-stats animate-fade-in">
          <div className="stat-card">
            <span className="stat-label">TOTAL BUDGET VS REALISASI</span>
            <div className="stat-value-group">
              <span className="stat-value">{formatCurrency(summary.total_realisasi)}</span>
              <span className="stat-value-sub">/{formatCurrency(summary.total_budget).replace('IDR ', '')}</span>
            </div>
            <div className="stat-badge-minimal">
              <FileText size={14}/> {summary.budget_used_percent}% Terpakai
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">TOTAL REVENUE</span>
            <div className="stat-value">{formatCurrency(summary.total_revenue)}</div>
            <div className="stat-trend positive">
              <TrendUpIcon /> +18.2% vs bulan lalu
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">ROI</span>
            <div className="stat-value-group">
              <span className="stat-value">{summary.roi}</span>
              <span className="stat-value-sub">%</span>
            </div>
            <div className="stat-badge-minimal">
              <FileText size={14}/> Sangat Efisien
            </div>
          </div>

          <div className="stat-card dark-card">
            <span className="stat-label">ROAS</span>
            <div className="stat-value-group">
              <span className="stat-value">{summary.roas ?? '-'}</span>
              <span className="stat-value-sub">x</span>
            </div>
            <div className="stat-badge-minimal light">
              <TargetIcon /> Target: 3.0x
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row animate-fade-in mt-6">
          <div className="chart-card line-chart-card">
            <div className="chart-header">
              <div>
                <h3>Tren Revenue vs Biaya</h3>
                <p>Pergerakan harian performa iklan</p>
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-color revenue"></span> REVENUE</span>
                <span className="legend-item"><span className="legend-color biaya"></span> BIAYA</span>
              </div>
            </div>
            <div className="chart-area line-chart-area">
              <svg viewBox="0 0 500 150" className="chart-svg" preserveAspectRatio="none">
                {trenHarian.length > 0 ? (
                  <>
                    <path d={getSvgPath('revenue')} fill="none" stroke="#232c65" strokeWidth="3" />
                    <path d={getSvgPath('biaya')} fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5" />
                  </>
                ) : (
                  <text x="250" y="75" textAnchor="middle" fill="#94a3b8" fontSize="12">Belum ada data tren</text>
                )}
              </svg>
              <div className="chart-labels x-axis" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {trenHarian.length > 0 ? (
                  trenHarian.map((d, i) => {
                    const dateObj = new Date(d.tanggal);
                    const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase();
                    return <span key={i} style={{ flex: 1, textAlign: 'center' }}>{dayName}</span>;
                  })
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>

          <div className="chart-card bar-chart-card">
            <div className="chart-header">
              <h3>Performa antar Platform</h3>
            </div>
            <div className="chart-area bar-chart-area">
              <div className="bars-container">
                {/* if data platform kosong*/}
                {platformData.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 'auto' }}>Belum ada data platform</p>
                ) : (
                  platformData.map((plat, idx) => {
                    const heightPercent = maxPlatformRevenue > 0 ? (plat.revenue / maxPlatformRevenue) * 100 : 0;
                    return (
                      <div className="bar-group" key={idx}>
                        <div className="bar-bg">
                          <div className="bar-fill" style={{ height: `${heightPercent}%` }}></div>
                        </div>
                        <span className="bar-label">{plat.platform.toUpperCase()}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-section mt-8 animate-fade-in">
          <div className="table-header">
            <h3>Detail Performa Kampanye</h3>
            <div className="table-actions">
              <button className={`icon-btn-outline ${showFilterModal ? 'active' : ''}`} onClick={() => setShowFilterModal(true)} title="Filter Data">
                 <Filter size={18} />
              </button>
              <button className="icon-btn-outline" onClick={exportToCSV} title="Export CSV">
                 <FileText size={18} />
              </button>
              <button className="icon-btn-outline" onClick={() => window.print()} title="Download PDF (Print)">
                 <Download size={18} />
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>TANGGAL</th>
                  <th>BIAYA (IDR)</th>
                  <th>IMPRESI</th>
                  <th>KLIK</th>
                  <th>CTR</th>
                  <th>KONVERSI</th>
                  <th>REVENUE (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {detailRows.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      Belum ada data laporan
                    </td>
                  </tr>
                ) : (
                  detailRows.map((row, index) => {
                    // Format tanggal (e.g., "01 Des 2023")
                    const dateObj = new Date(row.tanggal);
                    const dateStr = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                    
                    return (
                      <tr key={index}>
                        <td className="font-medium">{dateStr}</td>
                        <td>{formatNumber(row.biaya)}</td>
                        <td>{formatNumber(row.impression)}</td>
                        <td>{formatNumber(row.click)}</td>
                        <td>{row.ctr}%</td>
                        <td>{formatNumber(row.conversion)}</td>
                        <td className="font-bold text-dark">{formatNumber(row.revenue)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckCircleIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}

function TrendUpIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
}

function TargetIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
}
