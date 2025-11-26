import React, { useEffect, useState } from 'react';
import { employeesAPI, attendanceAPI, hazardsAPI, equipmentAPI } from '../utils/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    checkedIn: 0,
    activeHazards: 0,
    avgEquipmentHealth: 0
  });
  const [hazards, setHazards] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const [employeesData, attendanceData, hazardsData, equipmentData] = await Promise.all([
          employeesAPI.getAll(),
          attendanceAPI.getAll({ date: today }),
          hazardsAPI.getAll(),
          equipmentAPI.getAll()
        ]);

        // Calculate statistics
        const totalEmployees = employeesData.employees.length;
        
        // Count checked-in employees (Present or Late status for today)
        const todayAttendance = attendanceData.attendance.filter(a => a.date === today);
        const checkedIn = todayAttendance.filter(
          a => a.status === 'Present' || a.status === 'Late'
        ).length;
        
        // Count active hazards (Pending or In-progress)
        const activeHazards = hazardsData.hazards.filter(
          h => h.status === 'Pending' || h.status === 'In-progress' || h.status === 'In Progress'
        ).length;
        
        // Calculate average equipment health
        const totalHealth = equipmentData.equipment.reduce(
          (sum, eq) => sum + eq.healthScore, 0
        );
        const avgEquipmentHealth = Math.round(totalHealth / equipmentData.equipment.length);

        setStats({
          totalEmployees,
          checkedIn,
          activeHazards,
          avgEquipmentHealth
        });
        
        // Store hazards and equipment for display
        setHazards(hazardsData.hazards || []);
        setEquipment(equipmentData.equipment || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="admin-dashboard"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>👥</div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-value">{stats.totalEmployees}</p>
            <span className="stat-label">Workforce</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>✓</div>
          <div className="stat-content">
            <h3>Checked In</h3>
            <p className="stat-value">{stats.checkedIn}</p>
            <span className="stat-label">Currently on-site</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ef4444' }}>⚠️</div>
          <div className="stat-content">
            <h3>Active Hazards</h3>
            <p className="stat-value">{stats.activeHazards}</p>
            <span className="stat-label">Require attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>🔧</div>
          <div className="stat-content">
            <h3>Avg Equipment Health</h3>
            <p className="stat-value">{stats.avgEquipmentHealth}%</p>
            <span className="stat-label">System performance</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Recent Hazards</h2>
          <div className="hazards-list">
            {hazards
              .filter(h => h.status !== 'Resolved')
              .slice(0, 3)
              .map(hazard => (
                <div key={hazard.id} className="hazard-item">
                  <div className="hazard-header">
                    <span className={`hazard-severity ${hazard.severity.toLowerCase()}`}>
                      {hazard.severity}
                    </span>
                    <span className="hazard-type">{hazard.type}</span>
                  </div>
                  <p className="hazard-location">{hazard.location}</p>
                  <p className="hazard-description">{hazard.description}</p>
                  <span className={`hazard-status status-${hazard.status.toLowerCase()}`}>
                    {hazard.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="section-card">
          <h2>Equipment Status</h2>
          <div className="equipment-list">
            {equipment
              .sort((a, b) => a.healthScore - b.healthScore)
              .slice(0, 5)
              .map(eq => (
                <div key={eq.id} className="equipment-item">
                  <div className="equipment-info">
                    <span className="equipment-name">{eq.name}</span>
                    <span className="equipment-location">{eq.location}</span>
                  </div>
                  <div className="equipment-health">
                    <div className="health-bar">
                      <div 
                        className="health-fill" 
                        style={{ 
                          width: `${eq.healthScore}%`,
                          background: eq.healthScore > 80 ? '#10b981' : 
                                     eq.healthScore > 60 ? '#f59e0b' : '#ef4444'
                        }}
                      ></div>
                    </div>
                    <span className="health-score">{eq.healthScore}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
