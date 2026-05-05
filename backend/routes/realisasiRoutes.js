const express = require('express');
const router = express.Router();
const realisasiController = require('../controllers/realisasiController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /api/realisasi - Input data pengeluaran (User/Staff & Admin)
router.post('/', authMiddleware, realisasiController.create);

// GET /api/realisasi - Ambil data histori pengeluaran (User/Staff & Admin)
router.get('/', authMiddleware, realisasiController.getAll);

module.exports = router;
