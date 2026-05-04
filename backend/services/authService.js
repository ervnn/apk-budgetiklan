const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

const authService = {

  async login(email, password) {
    // Cari user berdasarkan email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Email atau password salah');
    }

    // Cek password
    let isPasswordValid = false;

    // Cek apakah password di database adalah bcrypt hash (dimulai dengan $2)
    if (user.password && user.password.startsWith('$2')) {
      // Password sudah di-hash, bandingkan dengan bcrypt
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Password plain text (data seed awal), bandingkan langsung
      isPasswordValid = (password === user.password);
    }

    if (!isPasswordValid) {
      throw new Error('Email atau password salah');
    }

    // Return user data tanpa password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

module.exports = authService;
