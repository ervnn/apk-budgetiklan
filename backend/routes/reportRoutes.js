const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// GET /api/reports/export/csv - Download laporan format CSV
router.get('/export/csv', authMiddleware, roleMiddleware('Admin'), reportController.exportCsv);

// GET /api/reports - Ambil data laporan (Admin only)
router.get('/', authMiddleware, roleMiddleware('Admin'), reportController.getReport);

module.exports = router;
