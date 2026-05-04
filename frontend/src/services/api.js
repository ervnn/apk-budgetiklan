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
