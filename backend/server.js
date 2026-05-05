const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const reportRoutes = require('./routes/reportRoutes');
const realisasiRoutes = require('./routes/realisasiRoutes');
const performaRoutes = require('./routes/performaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==================== ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/realisasi', realisasiRoutes);
app.use('/api/performa', performaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Budget Iklan API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} tidak ditemukan`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n🚀 Budget Iklan API Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/api/health`);
  console.log(`   Auth:       POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   Dashboard:  GET  http://localhost:${PORT}/api/dashboard/summary`);
  console.log(`   Campaigns:  GET  http://localhost:${PORT}/api/campaigns`);
  console.log(`   Reports:    GET  http://localhost:${PORT}/api/reports`);
  console.log(`   Realisasi:  POST http://localhost:${PORT}/api/realisasi`);
  console.log(`   Performa:   POST http://localhost:${PORT}/api/performa\n`);
});

module.exports = app;
