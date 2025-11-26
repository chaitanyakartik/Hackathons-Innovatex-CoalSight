import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/EmployeeLayout.css';

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="employee-layout">
      {/* Top Navigation Bar */}
      <header className="employee-header">
        <div className="header-left">
          <h2>CoalSight</h2>
          <span className="employee-badge">Employee Portal</span>
        </div>
        
        <nav className="employee-nav">
          <NavLink to="/employee/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🏠 Dashboard
          </NavLink>
          <NavLink to="/employee/attendance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            ✓ Attendance
          </NavLink>
          <NavLink to="/employee/report-hazard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            ⚠️ Report Hazard
          </NavLink>
        </nav>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user.name || 'Employee'}</span>
            <span className="user-role">{user.role || 'employee'}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="employee-main">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
