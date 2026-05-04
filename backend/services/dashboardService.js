const supabase = require('../config/supabase');

const dashboardService = {
  /**
   * Ambil ringkasan data dashboard
   * Sesuai DFD Level 1: Proses 4.0 Dashboard
   * Mengambil data dari tabel campaign, realisasi, dan performa_campaign
   */
  async getSummary() {
    // 1. Total Campaign
    const { data: campaigns, error: campaignError } = await supabase
      .from('campaign')
      .select('id_campaign, total_budget, status');

    if (campaignError) throw campaignError;

    const totalCampaign = campaigns ? campaigns.length : 0;
    const totalBudget = campaigns
      ? campaigns.reduce((sum, c) => sum + (c.total_budget || 0), 0)
      : 0;
    const campaignAktif = campaigns
      ? campaigns.filter(c => c.status === 'Active').length
      : 0;

    // 2. Total Realisasi (sum biaya dari tabel realisasi)
    const { data: realisasi, error: realisasiError } = await supabase
      .from('realisasi')
      .select('biaya');

    if (realisasiError) throw realisasiError;

    const totalRealisasi = realisasi
      ? realisasi.reduce((sum, r) => sum + (r.biaya || 0), 0)
      : 0;

    // 3. Total Revenue (sum revenue dari tabel performa_campaign)
    const { data: performa, error: performaError } = await supabase
      .from('performa_campaign')
      .select('revenue');

    if (performaError) throw performaError;

    const totalRevenue = performa
      ? performa.reduce((sum, p) => sum + (p.revenue || 0), 0)
      : 0;

    return {
      total_campaign: totalCampaign,
      total_budget: totalBudget,
      total_realisasi: totalRealisasi,
      total_revenue: totalRevenue,
      campaign_aktif: campaignAktif,
      sisa_budget: totalBudget - totalRealisasi
    };
  }
};

module.exports = dashboardService;
