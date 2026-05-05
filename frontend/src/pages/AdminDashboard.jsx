import { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, LayoutDashboard, Megaphone, FileText, Filter, LogOut } from 'lucide-react';
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard({ navigateTo }) {
  const [summary, setSummary] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = api.getUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch dashboard summary dan campaigns secara paralel
      const [summaryResult, campaignsResult] = await Promise.all([
        api.getDashboardSummary(),
        api.getCampaigns()
      ]);

      setSummary(summaryResult.data);
      setCampaigns(campaignsResult.data);
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
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Executive<br/>Architect</h2>
          <span>PREMIUM INSIGHTS</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section-title" style={{fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', margin: '1rem 0 0.5rem 1rem', letterSpacing: '1px'}}>MAIN MENU</div>
          <a href="#" className="nav-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigateTo('campaign_management'); }}>
            <Megaphone size={18} />
            Campaigns
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigateTo('admin_reports'); }}>
            <FileText size={18} />
            Reports
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-dark w-full mb-4" onClick={() => navigateTo('campaign_create')}>CREATE CAMPAIGN</button>
          <div className="profile-widget" onClick={handleLogout}>
            <div className="avatar">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Admin')}&background=0D8ABC&color=fff`} alt={user?.nama} />
            </div>
            <div className="profile-info">
              <h4>{user?.nama || 'Admin'}</h4>
              <span>{user?.role || 'Admin'} • Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">Dasbor Anggaran</h1>
          <div className="topbar-actions">
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Cari kampanye..." />
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn" onClick={handleLogout} title="Logout"><LogOut size={20} /></button>
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
            <button className="btn-light" onClick={fetchData}>Refresh</button>
            <button className="btn-dark"><Filter size={16} /> Filter</button>
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
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Belum ada data kampanye
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
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
