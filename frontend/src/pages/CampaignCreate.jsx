import { useState } from 'react';
import { Search, Bell, HelpCircle, LayoutDashboard, Megaphone, FileText, Lightbulb, CheckCircle2, ArrowRight, X } from 'lucide-react';
import api from '../services/api';
import './CampaignCreate.css';

export default function CampaignCreate({ navigateTo }) {
  const user = api.getUser();
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nama_campaign: '',
    platform: '',
    total_budget: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });

  // Auto-hide notification
  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!form.nama_campaign || !form.platform || !form.total_budget || !form.tanggal_mulai || !form.tanggal_selesai) {
      showNotif('error', 'Semua field harus diisi!');
      return;
    }

    if (new Date(form.tanggal_selesai) <= new Date(form.tanggal_mulai)) {
      showNotif('error', 'Tanggal berakhir harus setelah tanggal mulai!');
      return;
    }

    try {
      setSubmitting(true);
      await api.createCampaign({
        id_user: user?.id_user || 1,
        nama_campaign: form.nama_campaign,
        platform: form.platform,
        total_budget: parseInt(form.total_budget),
        tanggal_mulai: form.tanggal_mulai,
        tanggal_selesai: form.tanggal_selesai,
        status: 'Active'
      });

      showNotif('success', 'Campaign berhasil dibuat! 🎉');

      // Reset form
      setForm({
        nama_campaign: '',
        platform: '',
        total_budget: '',
        tanggal_mulai: '',
        tanggal_selesai: ''
      });

      // Navigate back after short delay
      setTimeout(() => navigateTo('campaign_management'), 1500);
    } catch (err) {
      showNotif('error', 'Gagal membuat campaign: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigateTo('campaign_management');
  };

  // Estimate reach (visual only)
  const estimatedReach = form.total_budget ? Math.round((parseInt(form.total_budget) / 1000) * 0.24) : 0;
  const formatReach = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const handleLogout = () => {
    api.logout();
    navigateTo('selection');
  };

  return (
    <div className="dashboard-layout">
      {/* ============ NOTIFICATION ============ */}
      {notification && (
        <div className={`toast-notification ${notification.type} animate-toast-in`} key={Date.now()}>
          <div className="toast-body">
            <div className={`toast-icon-circle ${notification.type}`}>
              {notification.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 6l8 8M14 6l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="toast-text">{notification.message}</span>
            <button className="toast-close" onClick={() => setNotification(null)}>
              <X size={16} />
            </button>
          </div>
          <div className="toast-progress-track">
            <div className={`toast-progress-bar ${notification.type}`}></div>
          </div>
        </div>
      )}

      {/* ============ SIDEBAR ============ */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Executive<br />Architect</h2>
          <span>PREMIUM INSIGHTS</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigateTo('admin_dashboard'); }}>
            <LayoutDashboard size={18} />
            DASHBOARD
          </a>
          <a href="#" className="nav-item active">
            <Megaphone size={18} />
            CAMPAIGNS
          </a>
          <a href="#" className="nav-item">
            <FileText size={18} />
            REPORTS
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="profile-widget" onClick={handleLogout}>
            <div className="avatar">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Admin')}&background=0D8ABC&color=fff`} alt={user?.nama} />
            </div>
            <div className="profile-info">
              <h4>{user?.nama || 'Executive Architect'}</h4>
              <span>ADMIN PREMIUM</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <h1 className="page-title" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--dark-blue)' }}>
            Tambah Kampanye Baru
          </h1>
          <div className="topbar-actions">
            <div className="search-bar" style={{ width: '200px' }}>
              <Search size={16} />
              <input type="text" placeholder="Cari data..." />
            </div>
            <button className="icon-btn"><Bell size={20} /></button>
            <button className="icon-btn"><HelpCircle size={20} /></button>
          </div>
        </header>

        <div className="cc-layout animate-fade-in">
          {/* ============ LEFT: FORM ============ */}
          <div className="cc-form-section">
            <div className="cc-form-card">
              <h2 className="cc-form-title">Detail Kampanye</h2>
              <p className="cc-form-subtitle">Rancang narasi pemasaran Anda dengan presisi institusional.</p>

              <form onSubmit={handleSubmit}>
                <div className="cc-form-group">
                  <label className="cc-label">NAMA KAMPANYE</label>
                  <input
                    type="text"
                    className="cc-input"
                    placeholder="Masukkan nama kampanye"
                    value={form.nama_campaign}
                    onChange={(e) => setForm({ ...form, nama_campaign: e.target.value })}
                  />
                </div>

                <div className="cc-form-row">
                  <div className="cc-form-group">
                    <label className="cc-label">PLATFORM IKLAN</label>
                    <select
                      className="cc-select"
                      value={form.platform}
                      onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    >
                      <option value="">Pilih Platform</option>
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Meta Ads">Meta Ads</option>
                      <option value="YouTube">YouTube</option>
                      <option value="LinkedIn Ads">LinkedIn Ads</option>
                      <option value="Twitter">Twitter</option>
                    </select>
                  </div>
                  <div className="cc-form-group">
                    <label className="cc-label">TOTAL ANGGARAN</label>
                    <div className="cc-input-prefix">
                      <span>IDR</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.total_budget}
                        onChange={(e) => setForm({ ...form, total_budget: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="cc-form-row">
                  <div className="cc-form-group">
                    <label className="cc-label">TANGGAL MULAI</label>
                    <input
                      type="date"
                      className="cc-input"
                      value={form.tanggal_mulai}
                      onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })}
                    />
                  </div>
                  <div className="cc-form-group">
                    <label className="cc-label">TANGGAL BERAKHIR</label>
                    <input
                      type="date"
                      className="cc-input"
                      value={form.tanggal_selesai}
                      onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })}
                    />
                  </div>
                </div>

                <div className="cc-form-actions">
                  <button type="submit" className="btn-simpan" disabled={submitting}>
                    {submitting ? 'Menyimpan...' : 'SIMPAN KAMPANYE'}
                  </button>
                  <button type="button" className="btn-batal" onClick={handleCancel}>
                    BATAL
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ============ RIGHT: TIPS & INFO ============ */}
          <div className="cc-sidebar">
            {/* Tips Card */}
            <div className="cc-tips-card">
              <div className="cc-tips-icon">
                <Lightbulb size={24} />
              </div>
              <h3>Tips Editorial</h3>
              <ul className="cc-tips-list">
                <li>
                  <CheckCircle2 size={14} />
                  Gunakan penamaan yang konsisten dan deskriptif.
                </li>
                <li>
                  <CheckCircle2 size={14} />
                  Alokasikan setidaknya 20% "Tahap Q. Mandatory" untuk anggaran unik fase pelaporan yang lebih rapi, eksperimental "Discovery".
                </li>
                <li>
                  <CheckCircle2 size={14} />
                  Pastikan tanggal berakhir tidak melewati penutupan kuartal finansial.
                </li>
              </ul>
            </div>

            {/* Promo Card */}
            <div className="cc-promo-card">
              <span className="cc-promo-badge">FITUR BARU</span>
              <h3>Optimalkan<br />Jangkauan Iklan</h3>
              <p>Gunakan mesin AI kami untuk memprediksi performa kampanye sebelum diluncurkan.</p>
              <a href="#" className="cc-promo-link">
                PELAJARI LEBIH LANJUT
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Estimasi Card */}
            <div className="cc-estimate-card">
              <span className="cc-estimate-label">ESTIMASI JANGKAUAN</span>
              <div className="cc-estimate-value">
                {form.total_budget ? formatReach(estimatedReach) : '0'}
                {form.total_budget && <span className="cc-estimate-trend">+14.2%</span>}
              </div>
              <p className="cc-estimate-desc">Berdasarkan alokasi anggaran saat ini.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
