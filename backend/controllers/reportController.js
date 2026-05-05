const reportService = require('../services/reportService');

const reportController = {
  /**
   * GET /api/reports
   * Ambil data laporan lengkap dengan optional filter
   * Query params: periode_awal, periode_akhir
   */
  async getReport(req, res) {
    try {
      const { periode_awal, periode_akhir } = req.query;

      const filters = {};
      if (periode_awal) filters.periode_awal = periode_awal;
      if (periode_akhir) filters.periode_akhir = periode_akhir;

      const reportData = await reportService.getReportData(filters);

      return res.status(200).json({
        success: true,
        message: 'Data laporan berhasil diambil',
        data: reportData
      });
    } catch (error) {
      console.error('Report error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data laporan',
        error: error.message
      });
    }
  },

  /**
   * GET /api/reports/export/csv
   */
  async exportCsv(req, res) {
    try {
      const { periode_awal, periode_akhir } = req.query;
      const filters = {};
      if (periode_awal) filters.periode_awal = periode_awal;
      if (periode_akhir) filters.periode_akhir = periode_akhir;

      const reportData = await reportService.getReportData(filters);
      const detailRows = reportData.detail_rows || [];

      let csvContent = "Tanggal,Biaya (IDR),Impresi,Klik,CTR (%),Konversi,Revenue (IDR)\n";
      detailRows.forEach(row => {
        const dateStr = new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
        csvContent += `${dateStr},${row.biaya || 0},${row.impression || 0},${row.click || 0},${row.ctr || 0},${row.conversion || 0},${row.revenue || 0}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="Laporan_Budget_Iklan_${new Date().toISOString().split('T')[0]}.csv"`);
      return res.status(200).send(csvContent);
    } catch (error) {
      console.error('Export CSV error:', error);
      return res.status(500).json({ success: false, message: 'Gagal export CSV' });
    }
  }
};

module.exports = reportController;
