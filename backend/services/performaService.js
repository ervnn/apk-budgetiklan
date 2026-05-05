const supabase = require('../config/supabase');

const performaService = {
  /**
   * Insert data performa ke tabel performa_campaign
   */
  async createPerforma(data) {
    const { data: result, error } = await supabase
      .from('performa_campaign')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  /**
   * Ambil semua data histori performa beserta relasinya
   */
  async getAllPerforma() {
    const { data, error } = await supabase
      .from('performa_campaign')
      .select(`
        *,
        campaign ( nama_campaign, platform ),
        users ( nama, role )
      `)
      .order('tanggal', { ascending: false });

    if (error) throw error;
    return data;
  }
};

module.exports = performaService;
