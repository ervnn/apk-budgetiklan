/**
 * API Service - Budget Iklan
 * 
 * Endpoint mapping:
 * =========================================
 * POST   /api/auth/login           → Login (email, password)
 * GET    /api/dashboard/summary    → Dashboard summary (Auth Required)
 * GET    /api/campaigns            → List campaigns (Auth Required)
 * GET    /api/campaigns/:id        → Get campaign by ID (Auth Required)
 * POST   /api/campaigns            → Create campaign (Auth Required, Admin only)
 * PUT    /api/campaigns/:id        → Update campaign (Auth Required, Admin only)
 * DELETE /api/campaigns/:id        → Delete campaign (Auth Required, Admin only)
 * GET    /api/reports              → Report data (Auth Required, Admin only)
 * GET    /api/reports/export/csv   → Export CSV (Auth Required, Admin only)
 * POST   /api/realisasi            → Create realisasi/biaya (Auth Required)
 * GET    /api/realisasi            → Get realisasi history (Auth Required)
 * POST   /api/performa             → Create performa (Auth Required)
 * GET    /api/performa             → Get performa history (Auth Required)
 * GET    /api/health               → Health check (No Auth)
 */

// Base URL API - Otomatis pake URL Railway pas deploy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = {
  // ==================== AUTH ====================
  /**
   * POST /api/auth/login
   * Body: { email, password }
   * Response: { success, token, user }
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login gagal');
    }
    return data;
  },

  // ==================== DASHBOARD ====================
  /**
   * GET /api/dashboard/summary
   * Headers: Authorization: Bearer <token>
   * Response: { success, data: { total_campaign, campaign_aktif, total_budget, total_realisasi, sisa_budget, total_revenue } }
   */
  async getDashboardSummary() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data dashboard');
    }
    return data;
  },

  // ==================== CAMPAIGNS ====================
  /**
   * GET /api/campaigns
   * Headers: Authorization: Bearer <token>
   * Response: { success, data: [...campaigns] }
   */
  async getCampaigns() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data campaign');
    }
    return data;
  },

  /**
   * GET /api/campaigns/:id
   * Headers: Authorization: Bearer <token>
   */
  async getCampaignById(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data campaign');
    }
    return data;
  },

  /**
   * POST /api/campaigns
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   * Body: { id_user, nama_campaign, platform, total_budget, tanggal_mulai, tanggal_selesai, status }
   */
  async createCampaign(campaignData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(campaignData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal membuat campaign');
    }
    return data;
  },

  /**
   * PUT /api/campaigns/:id
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   * Body: { nama_campaign, platform, total_budget, tanggal_mulai, tanggal_selesai, status }
   */
  async updateCampaign(id, campaignData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(campaignData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengupdate campaign');
    }
    return data;
  },

  /**
   * DELETE /api/campaigns/:id
   * Headers: Authorization: Bearer <token>
   */
  async deleteCampaign(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menghapus campaign');
    }
    return data;
  },

  // ==================== REPORTS ====================
  /**
   * GET /api/reports
   * Headers: Authorization: Bearer <token>
   * Query params: ?periode_awal=YYYY-MM-DD&periode_akhir=YYYY-MM-DD
   * Response: { success, data: { summary, detail_rows, platform_data, tren_harian } }
   */
  async getReportData(filters = {}) {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (filters.periode_awal) params.append('periode_awal', filters.periode_awal);
    if (filters.periode_akhir) params.append('periode_akhir', filters.periode_akhir);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/reports${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil data laporan');
    }
    return data;
  },

  // ==================== REALISASI (BIAYA) ====================
  /**
   * POST /api/realisasi
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   * Body: { id_campaign, tanggal, biaya }
   */
  async createRealisasi(realisasiData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/realisasi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(realisasiData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menyimpan realisasi');
    }
    return data;
  },

  /**
   * GET /api/realisasi
   * Headers: Authorization: Bearer <token>
   * Response: { success, data: [...realisasi with campaign details] }
   */
  async getRealisasiHistori() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/realisasi`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil histori realisasi');
    }
    return data;
  },

  // ==================== PERFORMA ====================
  /**
   * POST /api/performa
   * Headers: Authorization: Bearer <token>, Content-Type: application/json
   * Body: { id_campaign, tanggal, impression, click, conversion, revenue }
   */
  async createPerforma(performaData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/performa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(performaData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menyimpan performa');
    }
    return data;
  },

  /**
   * GET /api/performa
   * Headers: Authorization: Bearer <token>
   * Response: { success, data: [...performa with campaign details] }
   */
  async getPerformaHistori() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/performa`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal mengambil histori performa');
    }
    return data;
  },

  // ==================== UTILS ====================
  /**
   * Logout - hapus token dan user data dari localStorage
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Cek apakah user sudah login
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  /**
   * Ambil data user dari localStorage
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api;
