const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/dashboard/summary - Ambil ringkasan dashboard
router.get('/summary', authMiddleware, dashboardController.getSummary);

module.exports = router;
