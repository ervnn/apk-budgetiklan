const supabase = require('../config/supabase');

const reportService = {
  async getReportData(filters = {}) {
    // 1. Ambil semua kampanye untuk mapping
    const { data: campaigns, error: campaignError } = await supabase
      .from('campaign')
      .select('*');
    if (campaignError) throw campaignError;

    // 2. Ambil data realisasi (biaya)
    let realisasiQuery = supabase.from('realisasi').select('*');
    if (filters.periode_awal) realisasiQuery = realisasiQuery.gte('tanggal', filters.periode_awal);
    if (filters.periode_akhir) realisasiQuery = realisasiQuery.lte('tanggal', filters.periode_akhir);
    
    const { data: realisasi, error: realisasiError } = await realisasiQuery;
    if (realisasiError) throw realisasiError;

    // 3. Ambil data performa
    let performaQuery = supabase.from('performa_campaign').select('*');
    if (filters.periode_awal) performaQuery = performaQuery.gte('tanggal', filters.periode_awal);
    if (filters.periode_akhir) performaQuery = performaQuery.lte('tanggal', filters.periode_akhir);

    const { data: performa, error: performaError } = await performaQuery;
    if (performaError) throw performaError;

    // Mapping campaigns untuk lookup cepat
    const campaignMap = {};
    campaigns.forEach(c => {
      const id = String(c.id_campaign);
      campaignMap[id] = c;
    });

    // Helper format tanggal
    const formatDate = (dateStr) => {
      if (!dateStr) return 'unknown';
      return new Date(dateStr).toISOString().split('T')[0];
    };

    // Gabungin data berdasarkan Tanggal + ID Kampanye
    // Ini kuncinya biar kampanye beda nggak kegabung meskipun tanggalnya sama
    const reportEntries = {};

    // Proses data performa (Click, Impression, Revenue)
    if (performa) {
      performa.forEach(p => {
        const dStr = formatDate(p.tanggal);
        const rawId = p.id_campaign || p.id_kampanye || p.id_campaign_fk || p.id_kampanye_fk;
        const cId = rawId ? String(rawId) : `perf_only_${p.id_performa}`;
        const key = `${dStr}_${cId}`;

        if (!reportEntries[key]) {
          reportEntries[key] = {
            tanggal: dStr,
            id_campaign: rawId,
            biaya: 0,
            impression: 0,
            click: 0,
            conversion: 0,
            revenue: 0
          };
        }
        reportEntries[key].impression += (p.impression || 0);
        reportEntries[key].click += (p.click || 0);
        reportEntries[key].conversion += (p.conversion || 0);
        reportEntries[key].revenue += (p.revenue || 0);
      });
    }

    // Proses data biaya (Realisasi)
    if (realisasi) {
      realisasi.forEach(r => {
        const dStr = formatDate(r.tanggal);
        const rawId = r.id_campaign || r.id_kampanye || r.id_campaign_fk || r.id_kampanye_fk;
        const cId = rawId ? String(rawId) : `real_only_${r.id_realisasi}`;
        const key = `${dStr}_${cId}`;

        if (!reportEntries[key]) {
          reportEntries[key] = {
            tanggal: dStr,
            id_campaign: rawId,
            biaya: 0,
            impression: 0,
            click: 0,
            conversion: 0,
            revenue: 0
          };
        }
        reportEntries[key].biaya += (r.biaya || 0);
      });
    }

    // Ubah ke array dan lengkapi metadata
    const detailRows = Object.values(reportEntries).map(row => {
      // Pastikan lookup ID kampanye konsisten (String)
      const campaignIdStr = row.id_campaign ? String(row.id_campaign) : 'null';
      const campaign = campaignMap[campaignIdStr] || {};
      
      return {
        ...row,
        nama_campaign: campaign.nama_campaign || (row.id_campaign ? `Campaign #${row.id_campaign}` : 'Unknown Campaign'),
        platform: campaign.platform || 'Unknown',
        ctr: row.impression > 0 ? parseFloat(((row.click / row.impression) * 100).toFixed(1)) : 0,
        roas: row.biaya > 0 ? parseFloat((row.revenue / row.biaya).toFixed(1)) : 0
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Summary global
    const totalRealisasi = realisasi.reduce((sum, r) => sum + (r.biaya || 0), 0);
    const totalRevenue = performa.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.total_budget || 0), 0);

    // Tren Harian (untuk chart)
    const trendMap = {};
    detailRows.forEach(row => {
      if (!trendMap[row.tanggal]) {
        trendMap[row.tanggal] = { tanggal: row.tanggal, revenue: 0, biaya: 0 };
      }
      trendMap[row.tanggal].revenue += (row.revenue || 0);
      trendMap[row.tanggal].biaya += (row.biaya || 0);
    });
    const trenHarian = Object.values(trendMap).sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    // List platform unik untuk filter dan chart (Ambil dari data yang ada)
    const allPlatforms = [...new Set(detailRows.map(r => r.platform))].filter(p => p && p !== 'Unknown');

    // Data Aggregasi per Platform (untuk Chart)
    const platformMap = {};
    detailRows.forEach(row => {
      const p = row.platform || 'Unknown';
      if (!platformMap[p]) {
        platformMap[p] = { platform: p, revenue: 0, biaya: 0 };
      }
      platformMap[p].revenue += (row.revenue || 0);
      platformMap[p].biaya += (row.biaya || 0);
    });
    const platformData = Object.values(platformMap);

    return {
      summary: {
        total_budget: totalBudget,
        total_realisasi: totalRealisasi,
        total_revenue: totalRevenue,
        total_impression: performa.reduce((sum, p) => sum + (p.impression || 0), 0),
        total_click: performa.reduce((sum, p) => sum + (p.click || 0), 0),
        total_conversion: performa.reduce((sum, p) => sum + (p.conversion || 0), 0),
        sisa_budget: totalBudget - totalRealisasi,
        roas: totalRealisasi > 0 ? parseFloat((totalRevenue / totalRealisasi).toFixed(1)) : 0,
        roi: totalRealisasi > 0 ? Math.round(((totalRevenue - totalRealisasi) / totalRealisasi) * 100) : 0,
        budget_used_percent: totalBudget > 0 ? Math.round((totalRealisasi / totalBudget) * 100) : 0
      },
      detail_rows: detailRows,
      tren_harian: trenHarian,
      all_platforms: allPlatforms.length > 0 ? allPlatforms : ['General'],
      platform_data: platformData
    };
  }
};

module.exports = reportService;
