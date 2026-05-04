import { useState } from 'react';
import { Shield, Mail, Lock, ArrowRight, ChevronLeft, BarChart3, Zap, CheckCircle2, Search } from 'lucide-react';
import api from '../services/api';
import './AdminLogin.css';

export default function AdminLogin({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      
      // Cek apakah user adalah Admin
      if (result.data.user.role !== 'Admin') {
        setError('Akses ditolak. Hanya Admin yang bisa login di sini.');
        setLoading(false);
        return;
      }

      // Simpan token dan user data
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // Redirect ke admin dashboard
      navigateTo('admin_dashboard');
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
    <div className="page-wrapper admin-login-page">
      <div className="bg-gradient-mesh"></div>

      <div className="login-header animate-fade-in">
        <div className="icon-wrapper">
          <Shield size={24} color="#fff" />
        </div>
        <h2>Login Admin</h2>
        <p>Akses Editorial</p>
      </div>

      <div className="login-content-wrapper">
        <div className="card login-form-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
            <label className="form-label">EMAIL ADMIN</label>
            <div className="form-input-container">
              <Mail className="form-input-icon" size={18} />
              <input 
                type="email" 
                placeholder="admin@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <label className="form-label">KATA SANDI</label>
              <a href="#" style={{ fontSize: '0.75rem', fontWeight: '600' }}>Lupa?</a>
            </div>
            <div className="form-input-container">
              <Lock className="form-input-icon" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <button 
            className="btn-dark w-full" 
            style={{ marginBottom: '1.5rem', marginTop: '1rem' }} 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk ke Dasbor'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <button className="btn-back" onClick={() => navigateTo('selection')}>
            <ChevronLeft size={16} />
            Kembali ke pemilihan
          </button>
        </div>

        <div className="widget-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="widget-inner">
            <div className="widget-header">
              <div className="widget-icon">
                <BarChart3 size={16} color="#fff" />
              </div>
              <div className="widget-lines">
                <div className="line long"></div>
                <div className="line short"></div>
              </div>
            </div>
            <div className="bar-chart">
              <div className="bar light" style={{ height: '40%' }}></div>
              <div className="bar light" style={{ height: '60%' }}></div>
              <div className="bar dark" style={{ height: '100%' }}></div>
              <div className="bar light" style={{ height: '80%' }}></div>
              <div className="bar light" style={{ height: '50%' }}></div>
            </div>
          </div>
          <div className="notification-toast">
            <Zap size={16} color="#f59e0b" />
            <span>Umpan Kampanye Langsung</span>
            <div className="dot"></div>
          </div>
        </div>
      </div>

      <div className="badges-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="badge">
          <CheckCircle2 size={16} color="var(--primary-blue)" />
          <span>SESI AMAN</span>
        </div>
        <div className="badge">
          <Search size={16} color="var(--primary-blue)" />
          <span>AUDIT AKTIF</span>
        </div>
      </div>

      <footer className="selection-footer">
        <p>© 2026 KELOMPOK 12 • GERBANG KEUANGAN TERAMANKAN</p>
      </footer>
    </div>
  );
}
