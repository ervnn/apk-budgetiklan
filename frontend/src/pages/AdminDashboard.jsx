import { useState, useEffect } from 'react';
import { Filter, ArrowRight, X, Download, RefreshCw } from 'lucide-react';
import api from '../services/api';
import Sidebar from './Sidebar';
import './AdminDashboard.css';

export default function AdminDashboard({ navigateTo }) {
  const [summary, setSummary] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [performanceLog, setPerformanceLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState('All');
  const user = api.getUser();

  // Proteksi: jika bukan Admin, redirect ke selection
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigateTo('selection');
    }
  }, [user, navigateTo]);

  useEffect(() => {
    // Fetch data pertama kali
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch data secara paralel tapi tangani kegagalan masing-masing
      const results = await Promise.allSettled([
        api.getDashboardSummary(),
        api.getCampaigns(),
        api.getReportData()
      ]);

      // 1. Dashboard Summary
      if (results[0].status === 'fulfilled') {
        setSummary(results[0].value.data);
      } else {
        console.error('Summary fetch failed:', results[0].reason);
      }

      // 2. Campaigns List
      if (results[1].status === 'fulfilled') {
        setCampaigns(results[1].value.data);
      } else {
        console.error('Campaigns fetch failed:', results[1].reason);
      }

      // 3. Performance Log (dari reports)
      if (results[2].status === 'fulfilled') {
        const reportData = results[2].value.data;
        if (reportData && reportData.detail_rows) {
          setPerformanceLog(reportData.detail_rows.slice(0, 5));
        }
      } else {
        console.error('Reports fetch failed:', results[2].reason);
      }

      // Jika summary dan campaigns gagal total, baru set error utama
      if (results[0].status === 'rejected' && results[1].status === 'rejected') {
        setError('Gagal memuat data utama dashboard. Silakan refresh halaman.');
      }

    } catch (err) {
      setError(err.message);
      // Jika token expired, redirect ke login
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

  // Format angka ke format Rupiah
  const formatRupiah = (num) => {
    if (!num && num !== 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Hitung persentase realisasi terhadap budget
  const getRealisasiPercentage = () => {
    if (!summary || !summary.total_budget) return 0;
    return Math.round((summary.total_realisasi / summary.total_budget) * 100);
  };

  // Map status ke label Indonesia
  const getStatusLabel = (status) => {
    const statusMap = {
      'Active': 'AKTIF',
      'Paused': 'DIJEDA',
      'Completed': 'SELESAI'
    };
    return statusMap[status] || status;
  };

  // Filter campaigns berdasarkan platform
  const filteredCampaigns = campaigns.filter(c => 
    filterPlatform === 'All' || c.platform === filterPlatform
  );

  const platforms = ['All', ...new Set(campaigns.map(c => c.platform))];

  // Map platform ke warna
  const getPlatformColor = (platform) => {
    const colorMap = {
      'Instagram': '#E1306C',
      'TikTok': '#000000',
      'Google Ads': '#4285F4',
      'Facebook': '#1877F2',
      'LinkedIn Ads': '#0A66C2',
      'Twitter': '#1DA1F2',
      'YouTube': '#FF0000'
    };
    return colorMap[platform] || '#6366f1';
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar navigateTo={navigateTo} activePage="admin_dashboard" />

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">Dasbor Anggaran</h1>
          <div className="topbar-actions">
            <div className="user-mini-profile">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Admin')}&background=0D8ABC&color=fff`} alt="User" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{user?.nama || 'Admin'}</span>
            </div>
          </div>
        </header>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {/* Stats Cards - Data Real dari API */}
        <div className="stats-grid animate-fade-in">
          <div className="stat-card">
            <span className="stat-label">TOTAL ANGGARAN</span>
            <div className="stat-value">{formatRupiah(summary?.total_budget)}</div>
            <div className="stat-badge positive">
              {summary?.total_campaign} kampanye • {summary?.campaign_aktif} aktif
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">TOTAL REALISASI</span>
            <div className="stat-value dark">{formatRupiah(summary?.total_realisasi)}</div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${getRealisasiPercentage()}%` }}></div>
            </div>
            <span className="stat-desc">{getRealisasiPercentage()}% dari total anggaran</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">TOTAL REVENUE</span>
            <div className="stat-value">{formatRupiah(summary?.total_revenue)}</div>
            <div className="stat-badge outline"><ShieldCheckIcon /> Sisa: {formatRupiah(summary?.sisa_budget)}</div>
          </div>
        </div>

        {/* Campaigns List - Data Real dari API */}
        <div className="section-header mt-8 animate-fade-in">
          <div>
            <h2>Semua Kampanye</h2>
            <p>Lacak performa dan alokasi dana per platform</p>
          </div>
          <div className="flex gap-4">
            <div className="table-actions">
              <div style={{ position: 'relative' }}>
                <button 
                  className={`icon-btn-outline ${showFilter ? 'active' : ''}`} 
                  onClick={() => setShowFilter(!showFilter)}
                  title="Filter Platform"
                >
                  <Filter size={18} />
                </button>
                {showFilter && (
                  <div className="filter-dropdown animate-scale-in">
                    <div className="filter-header">Platform</div>
                    {platforms.map(p => (
                      <div 
                        key={p} 
                        className={`filter-item ${filterPlatform === p ? 'active' : ''}`}
                        onClick={() => { setFilterPlatform(p); setShowFilter(false); }}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="icon-btn-outline" onClick={fetchData} title="Refresh Data">
                 <RefreshCw size={18} />
              </button>
              <button className="icon-btn-outline" onClick={() => window.print()} title="Export View">
                 <Download size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="table-container animate-fade-in">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>NAMA KAMPANYE</th>
                <th>PLATFORM</th>
                <th>STATUS</th>
                <th>ALOKASI ANGGARAN</th>
                <th>PERIODE</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    {filterPlatform !== 'All' ? `Tidak ada kampanye untuk platform ${filterPlatform}` : 'Belum ada data kampanye'}
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id_campaign}>
                    <td>
                      <strong>{campaign.nama_campaign}</strong>
                      <span>ID: #CP-{campaign.id_campaign}</span>
                    </td>
                    <td><PlatformBadge name={campaign.platform} color={getPlatformColor(campaign.platform)} /></td>
                    <td><StatusBadge status={getStatusLabel(campaign.status)} /></td>
                    <td>{formatRupiah(campaign.total_budget)}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {campaign.tanggal_mulai} ~ {campaign.tanggal_selesai}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Log Performa Terakhir Section */}
        <div className="section-header mt-8 animate-fade-in">
          <div>
            <h2>Log Performa Terakhir</h2>
            <p>Data harian terbaru dari semua kampanye aktif</p>
          </div>
          <button 
            className="btn-text" 
            onClick={() => navigateTo('admin_reports')}
            style={{ color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            LIHAT SEMUA <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-container animate-fade-in">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>TANGGAL</th>
                <th>IMPRESSIONS</th>
                <th>CLICKS</th>
                <th>CONVERSIONS</th>
                <th>REVENUE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {performanceLog.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Belum ada log performa terbaru
                  </td>
                </tr>
              ) : (
                performanceLog
                  .filter(log => filterPlatform === 'All' || log.platform === filterPlatform)
                  .map((log, idx) => (
                    <tr key={idx}>                
                    <td>{new Date(log.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{(log.impression / 1000).toFixed(1)}K</td>
                    <td>{(log.click / 1000).toFixed(1)}K</td>
                    <td>{log.conversion}</td>
                    <td><strong>{formatRupiah(log.revenue)}</strong></td>
                    <td><div className="status-pill verified">VERIFIED</div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Chart Section */}
        <div className="chart-card animate-fade-in mt-8">
          <div className="chart-header">
            <div>
              <h3>Analisis Mingguan</h3>
              <p>Tren pengeluaran 7 hari terakhir</p>
            </div>
            <select className="chart-select">
              <option>April 2026</option>
            </select>
          </div>
          <div className="chart-area">
             <div className="mock-chart">
               <div className="chart-col" style={{height: '30%'}}></div>
               <div className="chart-col" style={{height: '50%'}}></div>
               <div className="chart-col" style={{height: '40%'}}></div>
               <div className="chart-col" style={{height: '70%'}}></div>
               <div className="chart-col" style={{height: '25%'}}></div>
               <div className="chart-col" style={{height: '80%'}}></div>
               <div className="chart-col" style={{height: '60%'}}></div>
             </div>
             <div className="chart-labels">
               <span>SEN</span><span>SEL</span><span>RAB</span><span>KAM</span><span>JUM</span><span>SAB</span><span>MIN</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ShieldCheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.76 0 4.97 1 6.84 2.14a1 1 0 0 1 .16 1.66V13Z"/><path d="m9 12 2 2 4-4"/></svg>;
}

function PlatformBadge({ name, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: color, opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></div>
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{name}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const isAktif = status === 'AKTIF';
  return (
    <div style={{
      background: isAktif ? '#059669' : '#e2e8f0',
      color: isAktif ? 'white' : '#64748b',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.7rem',
      fontWeight: '700',
      display: 'inline-block'
    }}>
      {status}
    </div>
  );
}
