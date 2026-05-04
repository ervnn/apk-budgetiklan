const supabase = require('../config/supabase');

const campaignService = {

  async getAllCampaigns() {
    const { data, error } = await supabase
      .from('campaign')
      .select(`
        *,
        users ( id_user, nama, email, role )
      `)
      .order('id_campaign', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Ambil campaign berdasarkan ID
   */
  async getCampaignById(id) {
    const { data, error } = await supabase
      .from('campaign')
      .select(`
        *,
        users ( id_user, nama, email, role ),
        realisasi ( id_realisasi, biaya, tanggal ),
        performa_campaign ( id_performa, tanggal, impression, click, conversion, revenue )
      `)
      .eq('id_campaign', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCampaign(campaignData) {
    const { data, error } = await supabase
      .from('campaign')
      .insert([campaignData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCampaign(id, campaignData) {
    const { data, error } = await supabase
      .from('campaign')
      .update(campaignData)
      .eq('id_campaign', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCampaign(id) {
    const { data, error } = await supabase
      .from('campaign')
      .delete()
      .eq('id_campaign', id);

    if (error) throw error;
    return data;
  }
};

module.exports = campaignService;
