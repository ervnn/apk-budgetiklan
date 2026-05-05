import { useState, useEffect, useRef } from 'react';
import { Search, Bell, HelpCircle, LayoutDashboard, Megaphone, FileText, Filter, LogOut, Download } from 'lucide-react';
import api from '../services/api';
import './AdminReports.css';
import './AdminReportsPrint.css';

export default function AdminReports({ navigateTo }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = api.getUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.getReportData();
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
  const detailRows = reportData?.detail_rows || [];
  const platformData = reportData?.platform_data || [];
  const trenHarian = reportData?.tren_harian || [];

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
      const response = await fetch(`http://localhost:5000/api/reports/export/csv`, {
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
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Executive<br/>Architect</h2>
          <span>PREMIUM INSIGHTS</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN MENU</div>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigateTo('admin_dashboard'); }}>
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigateTo('campaign_management'); }}>
            <Megaphone size={18} />
            Campaigns
          </a>
          <a href="#" className="nav-item active">
            <FileText size={18} />
            Reports
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-dark w-full mb-4" onClick={() => navigateTo('campaign_create')}>+ CREATE CAMPAIGN</button>
          <div className="profile-widget" onClick={handleLogout}>
            <div className="avatar">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Admin')}&background=0D8ABC&color=fff`} alt={user?.nama} />
            </div>
            <div className="profile-info">
              <h4>{user?.nama || 'Admin'}</h4>
              <span>{user?.role || 'Admin'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content report-content">
        <header className="topbar">
          <div className="page-title-group">
            <h1 className="page-title">Laporan Anggaran Iklan</h1>
            <span className="status-badge success"><CheckCircleIcon /> SESUAI TARGET</span>
          </div>
          <div className="topbar-actions">
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Cari laporan..." />
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><HelpCircle size={20} /></button>
          </div>
        </header>

        {error && (
          <div className="error-alert">
            {error}
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
              <span className="stat-value">{summary.roas}</span>
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
        <div className="table-section animate-fade-in mt-6">
          <div className="table-header">
            <h3>Tabel Detail Laporan</h3>
            <div className="table-actions">
              <button className="icon-btn-outline" title="Filter"><Filter size={16} /></button>
              <button className="icon-btn-outline" title="Export ke CSV" onClick={handleExportCSV}><FileText size={16} /></button>
              <button className="icon-btn-outline" title="Download PDF" onClick={handleDownloadPDF}><Download size={16} /></button>
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
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
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
