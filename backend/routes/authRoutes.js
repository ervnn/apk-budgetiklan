const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login user (Admin / Staff)
router.post('/login', authController.login);

module.exports = router;
