import { useState, useEffect } from 'react';
import { TrendingUp, Lightbulb, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Sidebar from './Sidebar';
import './PerformanceInput.css';

export default function PerformanceInput({ navigateTo }) {
  const user = api.getUser();
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [histori, setHistori] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [form, setForm] = useState({
    id_campaign: '',
    tanggal: new Date().toISOString().split('T')[0],
    impression: '',
    click: '',
    conversion: '',
    revenue: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campData, historiData, summaryData] = await Promise.all([
        api.getCampaigns(),
        api.getPerformaHistori(),
        api.getDashboardSummary()
      ]);
      setCampaigns(campData.data || []);
      setHistori(historiData.data || []);
      setSummary(summaryData.data || null);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!form.id_campaign || !form.tanggal) {
      showNotif('error', 'Pilih kampanye dan tanggal data!');
      return;
    }
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    try {
      setSubmitting(true);
      await api.createPerforma({
        id_campaign: parseInt(form.id_campaign),
        tanggal: form.tanggal,
        impression: parseInt(form.impression) || 0,
        click: parseInt(form.click) || 0,
        conversion: parseInt(form.conversion) || 0,
        revenue: parseInt(form.revenue) || 0
      });

      showNotif('success', 'Data performa berhasil disimpan! 🚀');
      
      // Reset form
      setForm({
        id_campaign: '',
        tanggal: new Date().toISOString().split('T')[0],
        impression: '',
        click: '',
        conversion: '',
        revenue: ''
      });
      
      fetchData(); // Refresh history
    } catch (err) {
      showNotif('error', 'Gagal menyimpan data: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigateTo('selection');
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="dashboard-layout">
      {/* ============ NOTIFICATION ============ */}
      {notification && (
        <div className={`toast-notification ${notification.type} animate-toast-in`}>
          <div className="toast-body">
            <div className={`toast-icon-circle ${notification.type}`}>
              {notification.type === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
            </div>
            <span className="toast-text">{notification.message}</span>
          </div>
        </div>
      )}

      {/* ============ CONFIRM MODAL ============ */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal animate-scale-in">
            <div className="confirm-icon">
              <AlertCircle size={48} color="var(--primary-blue)" />
            </div>
            <h3>Konfirmasi Simpan Data</h3>
            <p>Apakah Anda yakin data yang dimasukkan sudah benar? Data ini akan mempengaruhi laporan performa.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>BATAL</button>
              <button className="btn-confirm" onClick={handleSubmit}>YA, SIMPAN</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SIDEBAR ============ */}
      <Sidebar navigateTo={navigateTo} activePage="performance_input" />

      {/* ============ MAIN CONTENT ============ */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">Input Performa</h1>
          <div className="topbar-actions">
            <div className="user-mini-profile">
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'User')}&background=0D8ABC&color=fff`} alt="User" />
               <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{user?.nama || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="content-body animate-fade-in">
          <h1 className="page-heading">Input Performa Kampanye</h1>
          <p className="page-subheading">Submit high-precision data for your active ad accounts.</p>

          <div className="input-grid">
            {/* Form Section */}
            <div className="form-container-card">
              <form onSubmit={handlePreSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>PILIH KAMPANYE</label>
                    <select 
                      value={form.id_campaign} 
                      onChange={(e) => setForm({...form, id_campaign: e.target.value})}
                      required
                    >
                      <option value="">Pilih Kampanye</option>
                      {campaigns.map(c => (
                        <option key={c.id_campaign} value={c.id_campaign}>{c.nama_campaign}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>TANGGAL DATA</label>
                    <input 
                      type="date" 
                      value={form.tanggal} 
                      onChange={(e) => setForm({...form, tanggal: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>IMPRESSIONS</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={form.impression}
                      onChange={(e) => setForm({...form, impression: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>CLICKS</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={form.click}
                      onChange={(e) => setForm({...form, click: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CONVERSIONS</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={form.conversion}
                      onChange={(e) => setForm({...form, conversion: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>REVENUE (RP)</label>
                    <div className="currency-input">
                      <span>Rp</span>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={form.revenue}
                        onChange={(e) => setForm({...form, revenue: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-submit-main" disabled={submitting}>
                  {submitting ? 'MEMPROSES...' : 'SIMPAN PERFORMA'}
                </button>
              </form>

              <div className="integrity-box">
                <div className="integrity-icon">
                   <TrendingUp size={32} color="var(--primary-blue)" />
                </div>
                <h4>Data Integrity</h4>
                <p>Pastikan data yang Anda masukkan sesuai dengan laporan dashboard penyedia iklan.</p>
              </div>
            </div>

            {/* Side Info Cards */}
            <div className="info-cards-stack">
              <div className="stat-card premium-shadow">
                <span className="stat-label">TOTAL REVENUE</span>
                <div className="stat-value">{formatCurrency(summary?.total_revenue || 0)} <span className="stat-trend">ROAS: {summary?.total_realisasi > 0 ? ((summary?.total_revenue || 0) / summary.total_realisasi).toFixed(1) : '0'}x</span></div>
                <span className="stat-compare">dari {summary?.total_campaign || 0} kampanye</span>
                <div className="stat-chart-mini">
                  <div className="bar" style={{height: '40%'}}></div>
                  <div className="bar" style={{height: '60%'}}></div>
                  <div className="bar" style={{height: '50%'}}></div>
                  <div className="bar" style={{height: '80%'}}></div>
                  <div className="bar active" style={{height: '100%'}}></div>
                </div>
              </div>

              <div className="tip-card-dark">
                <div className="tip-header">
                  <Lightbulb size={20} />
                  <span>PRECISION TIP</span>
                </div>
                <p>Gunakan model atribusi "Last Click" untuk validasi revenue cepat, namun pertimbangkan data multi-touch untuk perencanaan strategis kampanye skala besar.</p>
              </div>

              <div className="architectural-card">
                 <span>ARCHITECTURAL INSIGHTS</span>
              </div>
            </div>
          </div>

          {/* Histori Table */}
          <div className="log-section card-premium">
            <div className="log-header">
              <h2>Log Performa Terakhir</h2>
              <button className="btn-link">LIHAT SEMUA <ArrowRight size={14} /></button>
            </div>
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>KAMPANYE</th>
                    <th>TANGGAL</th>
                    <th>IMPRESSIONS</th>
                    <th>CLICKS</th>
                    <th>CONVERSIONS</th>
                    <th>REVENUE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {histori.length > 0 ? histori.slice(0, 5).map(item => (
                    <tr key={item.id_performa}>
                      <td className="font-bold">{item.campaign?.nama_campaign || 'Kampanye'}</td>
                      <td>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{formatNumber(item.impression)}</td>
                      <td>{formatNumber(item.click)}</td>
                      <td>{formatNumber(item.conversion)}</td>
                      <td className="text-blue font-bold">Rp {formatNumber(item.revenue)}</td>
                      <td><span className="badge-verified">VERIFIED</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>Belum ada data performa.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
