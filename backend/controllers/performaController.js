const performaService = require('../services/performaService');

const performaController = {
  // POST /api/performa
  async create(req, res) {
    try {
      const { id_campaign, tanggal, impression, click, conversion, revenue } = req.body;
      const id_user = req.user.id_user; // dari token JWT

      if (!id_campaign || !tanggal) {
        return res.status(400).json({ 
          success: false, 
          message: 'id_campaign dan tanggal wajib diisi' 
        });
      }

      const data = await performaService.createPerforma({
        id_campaign,
        id_user,
        tanggal,
        impression: impression || 0,
        click: click || 0,
        conversion: conversion || 0,
        revenue: revenue || 0
      });

      return res.status(201).json({ 
        success: true, 
        message: 'Data performa kampanye berhasil disimpan', 
        data 
      });
    } catch (error) {
      console.error('Performa create error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal menyimpan data performa', 
        error: error.message 
      });
    }
  },

  // GET /api/performa
  async getAll(req, res) {
    try {
      const data = await performaService.getAllPerforma();
      return res.status(200).json({ 
        success: true, 
        message: 'Data histori performa berhasil diambil', 
        data 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data histori performa', 
        error: error.message 
      });
    }
  }
};

module.exports = performaController;
