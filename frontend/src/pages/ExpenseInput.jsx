import { useState, useEffect } from 'react';
import { TrendingUp, Lightbulb, CheckCircle2, X, Wallet, HelpCircle } from 'lucide-react';
import api from '../services/api';
import Sidebar from './Sidebar';
import './ExpenseInput.css';

export default function ExpenseInput({ navigateTo }) {
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
    biaya: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campData, historiData, summaryData] = await Promise.all([
        api.getCampaigns(),
        api.getRealisasiHistori(),
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
    if (!form.id_campaign || !form.biaya) {
      showNotif('error', 'Pilih kampanye dan masukkan biaya!');
      return;
    }
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    try {
      setSubmitting(true);
      await api.createRealisasi({
        id_campaign: parseInt(form.id_campaign),
        tanggal: form.tanggal,
        biaya: parseInt(form.biaya)
      });

      showNotif('success', 'Biaya pengeluaran berhasil dicatat! 💸');
      
      // Reset form
      setForm({
        id_campaign: '',
        tanggal: new Date().toISOString().split('T')[0],
        biaya: ''
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
              <Wallet size={48} color="var(--primary-blue)" />
            </div>
            <h3>Konfirmasi Pengeluaran</h3>
            <p>Apakah Anda yakin ingin mencatat pengeluaran sebesar <strong>{formatCurrency(form.biaya)}</strong> untuk kampanye ini?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>BATAL</button>
              <button className="btn-confirm" onClick={handleSubmit}>YA, CATAT</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SIDEBAR ============ */}
      <Sidebar navigateTo={navigateTo} activePage="expense_input" />

      {/* ============ MAIN CONTENT ============ */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">Input Pengeluaran</h1>
          <div className="topbar-actions">
            <div className="user-mini-profile">
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'User')}&background=0D8ABC&color=fff`} alt="User" />
               <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{user?.nama || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="content-body animate-fade-in">
          <h1 className="page-heading">Input Pengeluaran</h1>
          <p className="page-subheading">Silakan masukkan detail biaya harian untuk kampanye Anda.</p>

          <div className="expense-grid">
            {/* Left: Input Card */}
            <div className="expense-input-card card-premium">
              <form onSubmit={handlePreSubmit}>
                <div className="form-group-full">
                  <label>PILIH KAMPANYE</label>
                  <select 
                    className="premium-select"
                    value={form.id_campaign} 
                    onChange={(e) => setForm({...form, id_campaign: e.target.value})}
                    required
                  >
                    <option value="">Pilih salah satu kampanye</option>
                    {campaigns.map(c => (
                      <option key={c.id_campaign} value={c.id_campaign}>{c.nama_campaign}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-full">
                  <label>TANGGAL PENGELUARAN</label>
                  <input 
                    type="date" 
                    className="premium-input-date"
                    value={form.tanggal} 
                    onChange={(e) => setForm({...form, tanggal: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group-full">
                  <label>BIAYA HARIAN (RP)</label>
                  <div className="large-currency-input">
                    <input 
                      type="number" 
                      placeholder="Contoh: 50.000"
                      value={form.biaya}
                      onChange={(e) => setForm({...form, biaya: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-save-expense" disabled={submitting}>
                  {submitting ? 'MEMPROSES...' : 'SIMPAN PENGELUARAN'}
                </button>
              </form>

              <div className="recent-activity-preview">
                <label>AKTIVITAS TERAKHIR</label>
                <div className="activity-list">
                  {histori.slice(0, 2).map(item => (
                    <div className="activity-item" key={item.id_realisasi}>
                      <div className="activity-icon blue">
                         <TrendingUp size={18} />
                      </div>
                      <div className="activity-details">
                        <h4>{item.campaign?.nama_campaign || 'Kampanye'}</h4>
                        <span>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(item.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="activity-amount">
                        <div className="amount-val">{formatCurrency(item.biaya)}</div>
                        <span className="status-badge-success">BERHASIL</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Info Panels */}
            <div className="expense-info-panels">
              <div className="balance-card">
                <span className="card-label">SISA SALDO SAAT INI</span>
                <h2 className="card-value">{formatCurrency(summary?.sisa_budget || 0)}</h2>
                <div className="budget-progress-container">
                   <div className="progress-labels">
                      <span>Anggaran Terpakai</span>
                      <span>{summary?.total_budget > 0 ? Math.round((summary?.total_realisasi / summary?.total_budget) * 100) : 0}%</span>
                   </div>
                   <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{width: `${summary?.total_budget > 0 ? Math.round((summary?.total_realisasi / summary?.total_budget) * 100) : 0}%`}}></div>
                   </div>
                </div>
                <span className="target-date">{summary?.campaign_aktif || 0} kampanye aktif • Total budget: {formatCurrency(summary?.total_budget || 0)}</span>
              </div>

              <div className="tips-card-light">
                <div className="tip-head">
                  <div className="tip-bulb-icon">
                    <Lightbulb size={20} />
                  </div>
                  <h3>Tips Hemat</h3>
                </div>
                <div className="tip-content">
                  <h4>Optimasi Jadwal Tayang</h4>
                  <p>Fokuskan anggaran pada jam 19:00 - 22:00 untuk meningkatkan konversi hingga 15% tanpa menambah biaya.</p>
                </div>
                <div className="tip-note">
                   <HelpCircle size={14} />
                   <span>Berdasarkan data minggu lalu, performa Digital Marketing Q4 meningkat saat biaya harian stabil di Rp 50k.</span>
                </div>
              </div>

              <div className="efficiency-card">
                <span className="eff-label">EFISIENSI BULAN INI</span>
                <div className="eff-value">
                  +12% <span className="eff-badge">Growth</span>
                </div>
                <p>Peningkatan efisiensi pengeluaran dibandingkan bulan Desember.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
