import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>CoalSight</h2>
          <p>Admin Portal</p>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/admin/attendance" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">👥</span>
            <span>Attendance</span>
          </NavLink>
          
          <NavLink to="/admin/hazards" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">⚠️</span>
            <span>Hazards</span>
          </NavLink>
          
          <NavLink to="/admin/equipment" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">🔧</span>
            <span>Equipment</span>
          </NavLink>
          
          <NavLink to="/admin/production" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">📈</span>
            <span>Production</span>
          </NavLink>
          
          <NavLink to="/admin/notifications" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">🔔</span>
            <span>Notifications</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navigation Bar */}
        <header className="top-nav">
          <div className="top-nav-left">
            <h3>Coal Mine Monitoring System</h3>
          </div>
          
          <div className="top-nav-right">
            <div className="user-info">
              <span className="user-name">{user.name || 'Admin'}</span>
              <span className="user-role">{user.role || 'admin'}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
