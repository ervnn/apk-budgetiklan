const supabase = require('../config/supabase');

const reportService = {
  /**
   * Ambil data laporan lengkap untuk halaman Reports
   * Menggabungkan data dari campaign, realisasi, dan performa_campaign
   * @param {Object} filters - Optional filters (periode_awal, periode_akhir, platform)
   */
  async getReportData(filters = {}) {
    // 1. Ambil semua campaign dengan relasi
    const { data: campaigns, error: campaignError } = await supabase
      .from('campaign')
      .select('id_campaign, nama_campaign, platform, total_budget, status, tanggal_mulai, tanggal_selesai');

    if (campaignError) throw campaignError;

    // 2. Ambil semua data realisasi
    let realisasiQuery = supabase
      .from('realisasi')
      .select('id_realisasi, id_campaign, biaya, tanggal')
      .order('tanggal', { ascending: true });

    if (filters.periode_awal) {
      realisasiQuery = realisasiQuery.gte('tanggal', filters.periode_awal);
    }
    if (filters.periode_akhir) {
      realisasiQuery = realisasiQuery.lte('tanggal', filters.periode_akhir);
    }

    const { data: realisasi, error: realisasiError } = await realisasiQuery;
    if (realisasiError) throw realisasiError;

    // 3. Ambil semua data performa
    let performaQuery = supabase
      .from('performa_campaign')
      .select('id_performa, id_campaign, tanggal, impression, click, conversion, revenue')
      .order('tanggal', { ascending: true });

    if (filters.periode_awal) {
      performaQuery = performaQuery.gte('tanggal', filters.periode_awal);
    }
    if (filters.periode_akhir) {
      performaQuery = performaQuery.lte('tanggal', filters.periode_akhir);
    }

    const { data: performa, error: performaError } = await performaQuery;
    if (performaError) throw performaError;

    // === HITUNG SUMMARY ===
    const totalBudget = campaigns
      ? campaigns.reduce((sum, c) => sum + (c.total_budget || 0), 0)
      : 0;

    const totalRealisasi = realisasi
      ? realisasi.reduce((sum, r) => sum + (r.biaya || 0), 0)
      : 0;

    const totalRevenue = performa
      ? performa.reduce((sum, p) => sum + (p.revenue || 0), 0)
      : 0;

    const totalImpression = performa
      ? performa.reduce((sum, p) => sum + (p.impression || 0), 0)
      : 0;

    const totalClick = performa
      ? performa.reduce((sum, p) => sum + (p.click || 0), 0)
      : 0;

    const totalConversion = performa
      ? performa.reduce((sum, p) => sum + (p.conversion || 0), 0)
      : 0;

    // ROI = ((Revenue - Biaya) / Biaya) * 100
    const roi = totalRealisasi > 0
      ? Math.round(((totalRevenue - totalRealisasi) / totalRealisasi) * 100)
      : 0;

    // ROAS = Revenue / Biaya
    const roas = totalRealisasi > 0
      ? parseFloat((totalRevenue / totalRealisasi).toFixed(1))
      : 0;

    // Persentase budget terpakai
    const budgetUsedPercent = totalBudget > 0
      ? Math.round((totalRealisasi / totalBudget) * 100)
      : 0;

    // === DETAIL PER TANGGAL (Tabel Detail Laporan) ===
    // Gabungkan data performa dengan biaya per tanggal
    const campaignMap = {};
    if (campaigns) {
      campaigns.forEach(c => {
        campaignMap[c.id_campaign] = c;
      });
    }

    // Group realisasi by tanggal (date only)
    const biayaByDate = {};
    if (realisasi) {
      realisasi.forEach(r => {
        const date = r.tanggal ? r.tanggal.split('T')[0] : 'unknown';
        if (!biayaByDate[date]) biayaByDate[date] = 0;
        biayaByDate[date] += (r.biaya || 0);
      });
    }

    // Build detail rows from performa data, grouped by tanggal
    const detailByDate = {};
    if (performa) {
      performa.forEach(p => {
        const date = p.tanggal;
        if (!detailByDate[date]) {
          detailByDate[date] = {
            tanggal: date,
            biaya: 0,
            impression: 0,
            click: 0,
            conversion: 0,
            revenue: 0
          };
        }
        detailByDate[date].impression += (p.impression || 0);
        detailByDate[date].click += (p.click || 0);
        detailByDate[date].conversion += (p.conversion || 0);
        detailByDate[date].revenue += (p.revenue || 0);
      });
    }

    // Merge biaya into detail rows
    Object.keys(biayaByDate).forEach(date => {
      if (!detailByDate[date]) {
        detailByDate[date] = {
          tanggal: date,
          biaya: 0,
          impression: 0,
          click: 0,
          conversion: 0,
          revenue: 0
        };
      }
      detailByDate[date].biaya += biayaByDate[date];
    });

    // Convert to array and calculate CTR
    const detailRows = Object.values(detailByDate)
      .map(row => ({
        ...row,
        ctr: row.impression > 0
          ? parseFloat(((row.click / row.impression) * 100).toFixed(1))
          : 0
      }))
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // === PERFORMA PER PLATFORM ===
    const platformPerforma = {};
    if (performa) {
      performa.forEach(p => {
        const campaign = campaignMap[p.id_campaign];
        const platform = campaign ? campaign.platform : 'Unknown';
        if (!platformPerforma[platform]) {
          platformPerforma[platform] = {
            platform,
            impression: 0,
            click: 0,
            conversion: 0,
            revenue: 0,
            biaya: 0
          };
        }
        platformPerforma[platform].impression += (p.impression || 0);
        platformPerforma[platform].click += (p.click || 0);
        platformPerforma[platform].conversion += (p.conversion || 0);
        platformPerforma[platform].revenue += (p.revenue || 0);
      });
    }

    // Tambahkan biaya per platform dari realisasi
    if (realisasi) {
      realisasi.forEach(r => {
        const campaign = campaignMap[r.id_campaign];
        const platform = campaign ? campaign.platform : 'Unknown';
        if (!platformPerforma[platform]) {
          platformPerforma[platform] = {
            platform,
            impression: 0,
            click: 0,
            conversion: 0,
            revenue: 0,
            biaya: 0
          };
        }
        platformPerforma[platform].biaya += (r.biaya || 0);
      });
    }

    // Hitung ROAS per platform
    const platformData = Object.values(platformPerforma).map(p => ({
      ...p,
      roas: p.biaya > 0 ? parseFloat((p.revenue / p.biaya).toFixed(1)) : 0,
      ctr: p.impression > 0 ? parseFloat(((p.click / p.impression) * 100).toFixed(1)) : 0
    }));

    // === TREN HARIAN (untuk chart Revenue vs Biaya) ===
    const allDates = new Set([
      ...Object.keys(biayaByDate),
      ...(performa ? performa.map(p => p.tanggal) : [])
    ]);

    const trenHarian = Array.from(allDates)
      .sort()
      .map(date => ({
        tanggal: date,
        revenue: detailByDate[date]?.revenue || 0,
        biaya: detailByDate[date]?.biaya || biayaByDate[date] || 0
      }));

    return {
      summary: {
        total_budget: totalBudget,
        total_realisasi: totalRealisasi,
        total_revenue: totalRevenue,
        total_impression: totalImpression,
        total_click: totalClick,
        total_conversion: totalConversion,
        roi,
        roas,
        budget_used_percent: budgetUsedPercent,
        sisa_budget: totalBudget - totalRealisasi
      },
      detail_rows: detailRows,
      platform_data: platformData,
      tren_harian: trenHarian
    };
  }
};

module.exports = reportService;
