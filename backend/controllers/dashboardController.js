const dashboardService = require('../services/dashboardService');

const dashboardController = {
  /**
   * GET /api/dashboard/summary
   * Ambil ringkasan data untuk dashboard
   */
  async getSummary(req, res) {
    try {
      const summary = await dashboardService.getSummary();

      return res.status(200).json({
        success: true,
        message: 'Data dashboard berhasil diambil',
        data: summary
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data dashboard',
        error: error.message
      });
    }
  }
};

module.exports = dashboardController;
