import { useState } from 'react';
import './index.css';
import SelectionPage from './pages/SelectionPage';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

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
    </>
  );
}

export default App;
