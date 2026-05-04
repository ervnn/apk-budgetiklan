const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password harus diisi'
        });
      }

      // Proses login via service
      const user = await authService.login(email, password);

      // Generate JWT token
      const token = jwt.sign(
        {
          id_user: user.id_user,
          email: user.email,
          role: user.role,
          nama: user.nama
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Login gagal'
      });
    }
  }
};

module.exports = authController;
