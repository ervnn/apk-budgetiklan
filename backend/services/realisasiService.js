const supabase = require('../config/supabase');

const realisasiService = {
  /**
   * Insert data biaya ke tabel realisasi
   * Sesuai DFD Proses 2.0 Input Realisasi
   */
  async createRealisasi(data) {
    const { data: result, error } = await supabase
      .from('realisasi')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  /**
   * Ambil semua data histori realisasi beserta relasinya
   */
  async getAllRealisasi() {
    const { data, error } = await supabase
      .from('realisasi')
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

module.exports = realisasiService;
