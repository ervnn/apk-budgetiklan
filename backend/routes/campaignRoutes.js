const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// GET /api/campaigns - Ambil semua campaign (Admin & Staff)
router.get('/', authMiddleware, campaignController.getAll);

// GET /api/campaigns/:id - Ambil campaign by ID (Admin & Staff)
router.get('/:id', authMiddleware, campaignController.getById);

// POST /api/campaigns - Buat campaign baru (Admin only)
router.post('/', authMiddleware, roleMiddleware('Admin'), campaignController.create);

// PUT /api/campaigns/:id - Update campaign (Admin only)
router.put('/:id', authMiddleware, roleMiddleware('Admin'), campaignController.update);

// DELETE /api/campaigns/:id - Hapus campaign (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), campaignController.remove);

module.exports = router;
