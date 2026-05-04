import { useState } from 'react';
import { Building, Mail, Lock, ArrowRight, ChevronLeft, Eye, EyeOff, Presentation } from 'lucide-react';
import api from '../services/api';
import './UserLogin.css';

export default function UserLogin({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const result = await api.login(email, password);
      
      // Cek apakah user adalah Staff
      if (result.data.user.role !== 'Staff') {
        setError('Akses ditolak. Silakan gunakan portal Admin.');
        setLoading(false);
        return;
      }

      // Simpan token dan user data
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // Redirect ke user dashboard
      navigateTo('user_dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="page-wrapper user-login-page">
      <div className="split-card animate-fade-in">
        
        {/* Left Side - Form */}
        <div className="split-form">
          <div className="form-header">
            <div className="brand-logo">
              <div className="brand-icon">
                <Building size={18} color="#fff" />
              </div>
            </div>
            <h2>Login Pengguna</h2>
            <div className="badge-inline">
              <ShieldIcon />
              <span>Akses Portal Pengeluaran</span>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">EMAIL PENGGUNA</label>
            <div className="form-input-container">
              <Mail className="form-input-icon" size={18} />
              <input 
                type="email" 
                placeholder="staff@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">KATA SANDI</label>
            <div className="form-input-container">
              <Lock className="form-input-icon" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {showPassword ? (
                <EyeOff className="form-input-icon action-icon" size={18} onClick={() => setShowPassword(false)} style={{ cursor: 'pointer' }} />
              ) : (
                <Eye className="form-input-icon action-icon" size={18} onClick={() => setShowPassword(true)} style={{ cursor: 'pointer' }} />
              )}
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Ingat saya
            </label>
            <a href="#" className="forgot-link">Lupa kata sandi?</a>
          </div>

          <button 
            className="btn-primary w-full" 
            style={{ marginBottom: '2rem' }} 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk ke Portal'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <button className="btn-back" onClick={() => navigateTo('selection')}>
            <ChevronLeft size={16} />
            Kembali ke pemilihan
          </button>
        </div>

        {/* Right Side - Gradient Widget */}
        <div className="split-gradient">
          <div className="floating-card">
            <div className="floating-icon">
              <Presentation size={24} color="#fff" />
            </div>
            <h3>Kuasai Anggaran<br/>Iklan Anda</h3>
            <p>Akses dasbor keuangan kelas atas yang dirancang untuk kurator profesional. Kelola pengeluaran dengan kontrol editorial yang presisi.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.76 0 4.97 1 6.84 2.14a1 1 0 0 1 .16 1.66V13Z"/><path d="m9 12 2 2 4-4"/></svg>
  );
}
