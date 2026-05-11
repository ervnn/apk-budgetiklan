import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Sidebar from './Sidebar';
import './CampaignManagement.css';

export default function CampaignManagement({ navigateTo }) {
  const [campaigns, setCampaigns] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Missing state variables restored
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [editForm, setEditForm] = useState({
    nama_campaign: '',
    platform: '',
    total_budget: 0,
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 5;

  const user = api.getUser();

  // Proteksi: jika bukan Admin, redirect ke selection
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      navigateTo('selection');
    }
  }, [user, navigateTo]);

  // Auto-hide notification after 3s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  const showNotif = (type, message) => {
    setNotification({ type, message });
  };

  // ==================== EDIT ====================
  const handleEditClick = (campaign) => {
    setEditingCampaign(campaign);
    setEditForm({
      nama_campaign: campaign.nama_campaign || '',
      platform: campaign.platform || '',
      total_budget: campaign.total_budget || 0,
      tanggal_mulai: campaign.tanggal_mulai || '',
      tanggal_selesai: campaign.tanggal_selesai || '',
      status: campaign.status || 'Active'
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.updateCampaign(editingCampaign.id_campaign, {
        nama_campaign: editForm.nama_campaign,
        platform: editForm.platform,
        total_budget: parseInt(editForm.total_budget),
        tanggal_mulai: editForm.tanggal_mulai,
        tanggal_selesai: editForm.tanggal_selesai,
        status: editForm.status
      });
      setShowEditModal(false);
      setEditingCampaign(null);
      showNotif('success', 'Campaign berhasil diupdate! ✨');
      await fetchData();
    } catch (err) {
      showNotif('error', 'Gagal mengupdate campaign: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== DELETE ====================
  const handleDeleteClick = (campaign) => {
    setDeletingCampaign(campaign);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      await api.deleteCampaign(deletingCampaign.id_campaign);
      setShowDeleteModal(false);
      setDeletingCampaign(null);
      showNotif('success', 'Campaign berhasil dihapus! 🗑️');
      await fetchData();
    } catch (err) {
      showNotif('error', 'Gagal menghapus campaign: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== HELPERS ====================
  const handleLogout = () => {
    api.logout();
    navigateTo('selection');
  };

  const formatRupiah = (num) => {
    if (!num && num !== 0) return 'IDR 0';
    if (num >= 1000000) {
      return 'IDR ' + (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    return 'IDR ' + num.toLocaleString('id-ID');
  };

  const formatRupiahFull = (num) => {
    if (!num && num !== 0) return 'IDR 0';
    return 'IDR ' + num.toLocaleString('id-ID');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}`;
  };

  const getStatusLabel = (status) => {
    const statusMap = { 'Active': 'AKTIF', 'Paused': 'DIJEDA', 'Completed': 'SELESAI' };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = { 'Active': 'status-aktif', 'Paused': 'status-dijeda', 'Completed': 'status-selesai' };
    return classMap[status] || '';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'Instagram': '📸',
      'TikTok': '🎵',
      'Google Ads': '🔍',
      'Facebook': '👥',
      'Meta Ads': '◎',
      'YouTube': '▶️',
      'LinkedIn Ads': '💼',
      'Twitter': '🐦'
    };
    return icons[platform] || '📢';
  };

  const getCampaignIcon = (platform) => {
    const icons = {
      'Instagram': '📸',
      'TikTok': '🎵',
      'Google Ads': '🛒',
      'Facebook': '👥',
      'Meta Ads': '🎯',
      'YouTube': '🎬',
      'LinkedIn Ads': '💼',
      'Twitter': '🐦'
    };
    return icons[platform] || '📊';
  };

  // ==================== FILTERING & PAGINATION ====================
  const filteredCampaigns = campaigns.filter(c =>
    c.nama_campaign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.id_campaign).includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIdx, startIdx + itemsPerPage);

  const activePlatforms = [...new Set(campaigns.filter(c => c.status === 'Active').map(c => c.platform))];
  const platformColors = {
    'Instagram': '#E1306C',
    'TikTok': '#000000',
    'Google Ads': '#4285F4',
    'Facebook': '#1877F2',
    'Meta Ads': '#0668E1',
    'YouTube': '#FF0000',
    'LinkedIn Ads': '#0A66C2',
    'Twitter': '#1DA1F2'
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat data kampanye...</p>
          </div>
        </div>
      </div>
    );
  }

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
      <Sidebar navigateTo={navigateTo} activePage="campaign_management" />

      {/* ============ MAIN CONTENT ============ */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="search-bar cm-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari kampanye..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="topbar-actions">
            <div className="user-mini-profile">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'Admin')}&background=1E2954&color=fff&size=32`} alt="User" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>{user?.nama || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="cm-page-header animate-fade-in">
          <div>
            <h1 className="cm-title">Manajemen Kampanye</h1>
            <p className="cm-subtitle">Pantau dan optimalkan performa pemasaran digital Anda.</p>
          </div>
          <button className="btn-create-campaign" onClick={() => navigateTo('campaign_create')}>
            <Plus size={18} />
            BUAT KAMPANYE BARU
          </button>
        </div>

        {/* Stats Cards */}
        <div className="cm-stats-grid animate-fade-in">
          <div className="cm-stat-card">
            <span className="cm-stat-label">TOTAL ANGGARAN</span>
            <div className="cm-stat-value">{formatRupiah(summary?.total_budget)}</div>
            <div className="cm-stat-badge positive">Sisa: {formatRupiah(summary?.sisa_budget)}</div>
          </div>
          <div className="cm-stat-card">
            <span className="cm-stat-label">TOTAL KAMPANYE</span>
            <div className="cm-stat-value-large">{summary?.total_campaign || 0}</div>
            <p className="cm-stat-desc">Aktif di {activePlatforms.length} platform berbeda</p>
          </div>
          <div className="cm-stat-card">
            <span className="cm-stat-label">KAMPANYE AKTIF</span>
            <div className="cm-stat-value-large">{summary?.campaign_aktif || 0}</div>
            <div className="cm-platform-dots">
              {activePlatforms.slice(0, 3).map((p, i) => (
                <span key={i} className="platform-dot" style={{ background: platformColors[p] || '#6366f1' }} title={p}></span>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="cm-table-container animate-fade-in">
          <table className="cm-table">
            <thead>
              <tr>
                <th>NAMA KAMPANYE</th>
                <th>ID</th>
                <th>PLATFORM</th>
                <th>DURASI</th>
                <th>TOTAL ANGGARAN</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    {searchTerm ? 'Tidak ada kampanye yang cocok' : 'Belum ada data kampanye'}
                  </td>
                </tr>
              ) : (
                paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.id_campaign}>
                    <td className="cm-name-cell">
                      <div className="cm-campaign-icon">{getCampaignIcon(campaign.platform)}</div>
                      <div>
                        <strong>{campaign.nama_campaign}</strong>
                        <span className={`cm-status-badge ${getStatusClass(campaign.status)}`}>
                          {getStatusLabel(campaign.status)}
                        </span>
                      </div>
                    </td>
                    <td className="cm-id-cell">
                      <span className="cm-id-text">#CAM-<br />{String(campaign.id_campaign).padStart(5, '0')}</span>
                    </td>
                    <td className="cm-platform-cell">
                      <span className="cm-platform-icon">{getPlatformIcon(campaign.platform)}</span>
                      {campaign.platform}
                    </td>
                    <td className="cm-duration-cell">
                      {formatDate(campaign.tanggal_mulai)} - {formatDate(campaign.tanggal_selesai)}
                    </td>
                    <td className="cm-budget-cell">
                      <strong>{formatRupiahFull(campaign.total_budget)}</strong>
                    </td>
                    <td className="cm-action-cell">
                      <button
                        className="cm-action-btn edit"
                        onClick={() => handleEditClick(campaign)}
                        title="Edit Campaign"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="cm-action-btn delete"
                        onClick={() => handleDeleteClick(campaign)}
                        title="Hapus Campaign"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="cm-pagination">
            <span className="cm-pagination-info">
              Menampilkan {paginatedCampaigns.length} dari {filteredCampaigns.length} kampanye
            </span>
            <div className="cm-pagination-controls">
              <button
                className="cm-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`cm-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="cm-page-btn"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ============ EDIT MODAL ============ */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Kampanye</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label className="modal-label">NAMA KAMPANYE</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={editForm.nama_campaign}
                    onChange={(e) => setEditForm({ ...editForm, nama_campaign: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label className="modal-label">PLATFORM IKLAN</label>
                    <select
                      className="modal-select"
                      value={editForm.platform}
                      onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                      required
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
                  <div className="modal-form-group">
                    <label className="modal-label">TOTAL ANGGARAN</label>
                    <div className="modal-input-prefix">
                      <span>IDR</span>
                      <input
                        type="number"
                        value={editForm.total_budget}
                        onChange={(e) => setEditForm({ ...editForm, total_budget: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label className="modal-label">TANGGAL MULAI</label>
                    <input
                      type="date"
                      className="modal-input"
                      value={editForm.tanggal_mulai}
                      onChange={(e) => setEditForm({ ...editForm, tanggal_mulai: e.target.value })}
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label className="modal-label">TANGGAL BERAKHIR</label>
                    <input
                      type="date"
                      className="modal-input"
                      value={editForm.tanggal_selesai}
                      onChange={(e) => setEditForm({ ...editForm, tanggal_selesai: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-form-group">
                  <label className="modal-label">STATUS</label>
                  <select
                    className="modal-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active">Aktif</option>
                    <option value="Paused">Dijeda</option>
                    <option value="Completed">Selesai</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRMATION MODAL ============ */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-sm animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete-header">
              <div className="delete-icon-wrap">
                <Trash2 size={28} />
              </div>
              <h2>Hapus Kampanye?</h2>
              <p>Anda yakin ingin menghapus kampanye <strong>"{deletingCampaign?.nama_campaign}"</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="modal-footer center">
              <button className="btn-delete-confirm" onClick={handleDeleteConfirm} disabled={submitting}>
                {submitting ? 'Menghapus...' : 'YA, HAPUS'}
              </button>
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
