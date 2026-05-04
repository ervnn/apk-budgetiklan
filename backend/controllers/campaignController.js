const campaignService = require('../services/campaignService');

const campaignController = {
  /**
   * GET /api/campaigns
   * Ambil semua campaign
   */
  async getAll(req, res) {
    try {
      const campaigns = await campaignService.getAllCampaigns();

      return res.status(200).json({
        success: true,
        message: 'Data campaign berhasil diambil',
        data: campaigns
      });
    } catch (error) {
      console.error('Campaign getAll error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data campaign',
        error: error.message
      });
    }
  },

  /**
   * GET /api/campaigns/:id
   * Ambil campaign berdasarkan ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const campaign = await campaignService.getCampaignById(id);

      return res.status(200).json({
        success: true,
        message: 'Data campaign berhasil diambil',
        data: campaign
      });
    } catch (error) {
      console.error('Campaign getById error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data campaign',
        error: error.message
      });
    }
  },

  /**
   * POST /api/campaigns
   * Buat campaign baru
   */
  async create(req, res) {
    try {
      const campaignData = req.body;
      const campaign = await campaignService.createCampaign(campaignData);

      return res.status(201).json({
        success: true,
        message: 'Campaign berhasil dibuat',
        data: campaign
      });
    } catch (error) {
      console.error('Campaign create error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal membuat campaign',
        error: error.message
      });
    }
  },

  /**
   * PUT /api/campaigns/:id
   * Update campaign
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const campaignData = req.body;
      const campaign = await campaignService.updateCampaign(id, campaignData);

      return res.status(200).json({
        success: true,
        message: 'Campaign berhasil diupdate',
        data: campaign
      });
    } catch (error) {
      console.error('Campaign update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengupdate campaign',
        error: error.message
      });
    }
  },

  /**
   * DELETE /api/campaigns/:id
   * Hapus campaign
   */
  async remove(req, res) {
    try {
      const { id } = req.params;
      await campaignService.deleteCampaign(id);

      return res.status(200).json({
        success: true,
        message: 'Campaign berhasil dihapus'
      });
    } catch (error) {
      console.error('Campaign delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus campaign',
        error: error.message
      });
    }
  }
};

module.exports = campaignController;
