import { useState } from 'react';
import './index.css';
import SelectionPage from './pages/SelectionPage';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CampaignManagement from './pages/CampaignManagement';
import CampaignCreate from './pages/CampaignCreate';
import AdminReports from './pages/AdminReports';

function App() {
  const [currentPage, setCurrentPage] = useState('selection');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'selection' && <SelectionPage navigateTo={navigateTo} />}
      {currentPage === 'admin_login' && <AdminLogin navigateTo={navigateTo} />}
      {currentPage === 'user_login' && <UserLogin navigateTo={navigateTo} />}
      {currentPage === 'admin_dashboard' && <AdminDashboard navigateTo={navigateTo} />}
      {currentPage === 'user_dashboard' && <UserDashboard navigateTo={navigateTo} />}
      {currentPage === 'campaign_management' && <CampaignManagement navigateTo={navigateTo} />}
      {currentPage === 'campaign_create' && <CampaignCreate navigateTo={navigateTo} />}
      {currentPage === 'admin_reports' && <AdminReports navigateTo={navigateTo} />}
    </>
  );
}

export default App;
