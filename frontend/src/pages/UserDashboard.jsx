import { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, Grid, CreditCard, TrendingUp, AlertTriangle, Wallet, LogOut } from 'lucide-react';
import api from '../services/api';
import './UserDashboard.css';

export default function UserDashboard({ navigateTo }) {
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
      const [summaryResult, campaignsResult] = await Promise.all([
        api.getDashboardSummary(),
        api.getCampaigns()
      ]);

      setSummary(summaryResult.data);
      setCampaigns(campaignsResult.data);
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

  const formatRupiah = (num) => {
    if (!num && num !== 0) return 'Rp 0';
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Ambil campaign aktif pertama
  const activeCampaign = campaigns.find(c => c.status === 'Active');

  if (loading) {
    return (
      <div className="dashboard-layout user-dashboard">
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
    <div className="dashboard-layout user-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Executive<br/>Architect</h2>
        </div>
        
        <div className="sidebar-profile">
          <div className="avatar">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Staff')}&background=1E2954&color=fff`} alt="User" />
          </div>
          <div>
            <h4>{user?.nama || 'Staff'}</h4>
            <span>{user?.role || 'Staff'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <Grid size={18} />
            Beranda
          </a>
          <a href="#" className="nav-item">
            <CreditCard size={18} />
            Catat Biaya
          </a>
          <a href="#" className="nav-item">
            <TrendingUp size={18} />
            Performa
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar" style={{ background: '#f1f5f9', border: 'none' }}>
            <Search size={16} />
            <input type="text" placeholder="Cari kampanye atau data..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn"><Bell size={20} color="#64748b" /></button>
            <button className="icon-btn" onClick={handleLogout} title="Logout"><LogOut size={20} color="#64748b" /></button>
            <div className="user-pill" onClick={handleLogout}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Staff')}&background=F59E0B&color=fff`} alt="User" />
              <span>{user?.nama || 'Staff'}</span>
            </div>
          </div>
        </header>

        <div className="hero-section animate-fade-in">
          <h1>Halo, {user?.nama || 'Pengguna'}.</h1>
          <p>Kelola anggaran iklan Anda dengan efisien hari ini.</p>
        </div>

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

        <div className="stats-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card">
            <span className="stat-label">KAMPANYE TERPILIH</span>
            <div className="flex justify-between items-center mt-2">
              <span className="campaign-name">{activeCampaign?.nama_campaign || 'Belum ada campaign aktif'}</span>
              {activeCampaign && <span className="badge-aktif">AKTIF</span>}
            </div>
          </div>
          <div className="stat-card border-accent">
            <span className="stat-label">SISA ANGGARAN</span>
            <div className="stat-value">{formatRupiah(summary?.sisa_budget)} <span className="trend positive">
              {summary?.total_budget > 0 ? `${Math.round((summary?.sisa_budget / summary?.total_budget) * 100)}%` : '0%'}
            </span></div>
            <span className="stat-desc">Sisa dari total budget</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">TOTAL REALISASI</span>
            <div className="stat-value">{formatRupiah(summary?.total_realisasi)}</div>
            <span className="stat-desc">{summary?.total_campaign} KAMPANYE TOTAL</span>
          </div>
        </div>

        <div className="performance-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="perf-header">
            <span className="tag">TOTAL REVENUE</span>
            <div className="platforms">
              {[...new Set(campaigns.map(c => c.platform))].map(platform => (
                <span key={platform} className="platform-tag">{platform}</span>
              ))}
            </div>
          </div>
          <h2>Ringkasan Performa Aktif</h2>
          
          <div className="perf-content">
            <div className="perf-chart">
               <div className="bar-wrapper"><div className="bar" style={{height:'40%'}}></div></div>
               <div className="bar-wrapper"><div className="bar" style={{height:'60%'}}></div></div>
               <div className="bar-wrapper"><div className="bar active" style={{height:'100%'}}></div></div>
               <div className="bar-wrapper"><div className="bar" style={{height:'50%'}}></div></div>
               <div className="bar-wrapper"><div className="bar" style={{height:'70%'}}></div></div>
               <div className="bar-wrapper"><div className="bar" style={{height:'45%'}}></div></div>
            </div>
            
            <div className="perf-stats">
              <div className="stat-box">
                <span className="label">Total Revenue</span>
                <div className="value-lg">{formatRupiah(summary?.total_revenue)}</div>
                <div className="progress-container"><div className="progress" style={{width:'72%'}}></div></div>
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <span className="label">KAMPANYE AKTIF</span>
                  <div className="value-md">{summary?.campaign_aktif}</div>
                </div>
                <div>
                  <span className="label">TOTAL BUDGET</span>
                  <div className="value-md">{formatRupiah(summary?.total_budget)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="activities-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3>Kampanye Terbaru</h3>
          
          <div className="activity-list">
            {campaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                Belum ada data kampanye
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div className="activity-item" key={campaign.id_campaign}>
                  <div className={`activity-icon ${campaign.status === 'Active' ? 'success' : 'danger'}`}>
                    {campaign.status === 'Active' ? <Wallet size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div className="activity-details">
                    <h4>{campaign.nama_campaign}</h4>
                    <p>Platform: {campaign.platform} • Budget: {formatRupiah(campaign.total_budget)}</p>
                  </div>
                  <div className="activity-time" style={{
                    background: campaign.status === 'Active' ? '#d1fae5' : '#e2e8f0',
                    color: campaign.status === 'Active' ? '#059669' : '#64748b',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '700'
                  }}>
                    {campaign.status === 'Active' ? 'AKTIF' : campaign.status === 'Completed' ? 'SELESAI' : 'DIJEDA'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
