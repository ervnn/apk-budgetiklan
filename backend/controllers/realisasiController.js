const realisasiService = require('../services/realisasiService');

const realisasiController = {
  // POST /api/realisasi
  async create(req, res) {
    try {
      const { id_campaign, tanggal, biaya } = req.body;
      const id_user = req.user.id_user; // dari token JWT

      if (!id_campaign || biaya === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: 'id_campaign dan biaya wajib diisi' 
        });
      }

      const data = await realisasiService.createRealisasi({
        id_campaign,
        id_user,
        tanggal: tanggal || new Date().toISOString(),
        biaya
      });

      return res.status(201).json({ 
        success: true, 
        message: 'Data realisasi biaya berhasil disimpan', 
        data 
      });
    } catch (error) {
      console.error('Realisasi create error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal menyimpan data realisasi', 
        error: error.message 
      });
    }
  },

  // GET /api/realisasi
  async getAll(req, res) {
    try {
      const data = await realisasiService.getAllRealisasi();
      return res.status(200).json({ 
        success: true, 
        message: 'Data histori realisasi berhasil diambil', 
        data 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data histori realisasi', 
        error: error.message 
      });
    }
  }
};

module.exports = realisasiController;
