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

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy untuk deployment (misal Railway/Render) agar client IP terdeteksi dengan benar oleh rate limiter
app.set('trust proxy', 1);

// ==================== SECURITY MIDDLEWARE ====================
// Helmet untuk security HTTP headers
app.use(helmet());

// Disable X-Powered-By agar hacker tidak tahu kita pakai Express
app.disable('x-powered-by');

// Rate Limiting untuk mencegah Brute Force dan DDoS
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 percobaan per 15 menit per IP
  standardHeaders: true, // Mengembalikan info limit di header `RateLimit-*`
  legacyHeaders: false, // Menonaktifkan header `X-RateLimit-*` (deprecated)
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login, silakan coba lagi dalam 15 menit'
  }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 60, // Maksimal 60 request per menit
  standardHeaders: true, // Mengembalikan info limit di header `RateLimit-*`
  legacyHeaders: false, // Menonaktifkan header `X-RateLimit-*` (deprecated)
  message: {
    success: false,
    message: 'Terlalu banyak request, silakan tunggu sebentar'
  }
});

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: true, // Izinkan semua origin selama development/deploy (bisa diperketat nanti)
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
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/dashboard', apiLimiter, dashboardRoutes);
app.use('/api/campaigns', apiLimiter, campaignRoutes);
app.use('/api/reports', apiLimiter, reportRoutes);
app.use('/api/realisasi', apiLimiter, realisasiRoutes);
app.use('/api/performa', apiLimiter, performaRoutes);

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
if (require.main === module) {
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
}

module.exports = app;
