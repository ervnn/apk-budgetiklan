import { useState } from 'react';
import { LayoutDashboard, Megaphone, FileText, TrendingUp, DollarSign, LogOut, Plus } from 'lucide-react';
import api from '../services/api';

/**
 * Sidebar component reusable untuk Admin dan Staff.
 * Menu ditampilkan sesuai role user dari localStorage.
 * Logout selalu meminta konfirmasi terlebih dahulu.
 */
export default function Sidebar({ navigateTo, activePage }) {
  const user = api.getUser();
  const role = user?.role;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    api.logout();
    navigateTo('selection');
  };

  // Menu items berdasarkan role
  const adminMenuItems = [
    { id: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaign_management', label: 'Campaigns', icon: Megaphone },
    { id: 'campaign_create', label: 'Buat Kampanye', icon: Plus },
    { id: 'admin_reports', label: 'Reports', icon: FileText },
  ];

  const staffMenuItems = [
    { id: 'user_dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'expense_input', label: 'Catat Biaya', icon: DollarSign },
    { id: 'performance_input', label: 'Performa', icon: TrendingUp },
  ];

  const menuItems = role === 'Admin' ? adminMenuItems : staffMenuItems;

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Executive<br/>Architect</h2>
          <span>PREMIUM INSIGHTS</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title" style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            margin: '1rem 0 0.5rem 1rem',
            letterSpacing: '1px'
          }}>
            {role === 'Admin' ? 'ADMIN MENU' : 'STAFF MENU'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <a
                key={item.id}
                href="#"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.id);
                }}
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {role === 'Admin' && (
            <button
              className="btn-dark w-full mb-4"
              onClick={() => navigateTo('campaign_create')}
            >
              + CREATE CAMPAIGN
            </button>
          )}
          <div className="profile-widget" onClick={handleLogout}>
            <div className="avatar">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'User')}&background=0D8ABC&color=fff`}
                alt={user?.nama}
              />
            </div>
            <div className="profile-info">
              <h4>{user?.nama || 'User'}</h4>
              <span>{user?.role || 'Staff'} • <LogOut size={12} style={{verticalAlign: 'middle'}} /> Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="confirm-modal animate-scale-in" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '380px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#fee2e2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <LogOut size={28} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-blue)', marginBottom: '0.5rem' }}>
              Konfirmasi Logout
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Apakah Anda yakin ingin keluar dari akun <strong>{user?.nama}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '10px 24px', borderRadius: '8px', fontWeight: 600,
                  fontSize: '0.85rem', background: 'var(--light-gray)',
                  color: 'var(--text-dark)', border: 'none', cursor: 'pointer'
                }}
              >
                BATAL
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '10px 24px', borderRadius: '8px', fontWeight: 600,
                  fontSize: '0.85rem', background: '#dc2626',
                  color: 'white', border: 'none', cursor: 'pointer'
                }}
              >
                YA, LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
