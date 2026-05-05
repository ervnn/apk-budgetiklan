const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper untuk melakukan API calls ke backend
 */
const api = {
  /**
   * POST /api/auth/login   
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

  /**
   * GET /api/dashboard/summary
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

  /**
   * GET /api/campaigns
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

  /**
   * GET /api/reports
   * Ambil data laporan dengan optional filter periode
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

  /**
   * Logout - hapus token dan user data
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
  }
};

export default api;
