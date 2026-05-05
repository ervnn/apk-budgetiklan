const express = require('express');
const router = express.Router();
const performaController = require('../controllers/performaController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /api/performa - Input data performa kampanye (User/Staff & Admin)
router.post('/', authMiddleware, performaController.create);

// GET /api/performa - Ambil data histori performa kampanye (User/Staff & Admin)
router.get('/', authMiddleware, performaController.getAll);

module.exports = router;
