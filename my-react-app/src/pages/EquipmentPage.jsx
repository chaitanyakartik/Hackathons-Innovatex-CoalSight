import React, { useState, useEffect } from 'react';
import { equipmentAPI } from '../utils/api';
import '../styles/EquipmentPage.css';

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const data = await equipmentAPI.getAll();
      setEquipment(data.equipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = filterStatus === 'all'
    ? equipment
    : equipment.filter(e => e.status.toLowerCase() === filterStatus.toLowerCase());

  const getHealthColor = (healthScore) => {
    if (healthScore >= 80) return '#10b981';
    if (healthScore >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Operational': '#10b981',
      'Warning': '#f59e0b',
      'Maintenance': '#ef4444',
      'Offline': '#64748b'
    };
    return colors[status] || '#64748b';
  };

  return (
    <div className="equipment-page">
      <div className="page-header">
        <h1>Equipment Dashboard</h1>
        <p>Monitor all mining equipment health and maintenance schedules</p>
      </div>

      <div className="equipment-controls">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Equipment</option>
            <option value="operational">Operational</option>
            <option value="warning">Warning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div className="equipment-stats">
          <span className="stat-item">Total: {equipment.length}</span>
          <span className="stat-item success">Operational: {equipment.filter(e => e.status === 'Operational').length}</span>
          <span className="stat-item warning">Needs Attention: {equipment.filter(e => e.status === 'Warning' || e.status === 'Maintenance').length}</span>
        </div>
      </div>

      <div className="equipment-grid">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="equipment-card">
            <div className="card-header">
              <div className="equipment-title">
                <h3>{item.name}</h3>
                <span className="equipment-type">{item.type}</span>
              </div>
              <span 
                className="status-indicator" 
                style={{ background: getStatusColor(item.status) }}
                title={item.status}
              >
                {item.status}
              </span>
            </div>

            <div className="card-body">
              <div className="info-row">
                <span className="info-label">📍 Location:</span>
                <span className="info-value">{item.location}</span>
              </div>

              <div className="info-row">
                <span className="info-label">👤 Operator:</span>
                <span className="info-value">{item.operator || 'Unassigned'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">⏱️ Operating Hours:</span>
                <span className="info-value">{item.operatingHours.toLocaleString()}h</span>
              </div>

              {item.fuelLevel !== null && (
                <div className="metric-row">
                  <div className="metric-header">
                    <span className="metric-label">⛽ Fuel Level</span>
                    <span className="metric-value">{item.fuelLevel}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${item.fuelLevel}%`,
                        background: item.fuelLevel > 30 ? '#10b981' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="metric-row">
                <div className="metric-header">
                  <span className="metric-label">🌡️ Temperature</span>
                  <span className="metric-value">{item.temperature}°{item.temperatureUnit}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min((item.temperature / 100) * 100, 100)}%`,
                      background: item.temperature < 75 ? '#10b981' : item.temperature < 85 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-header">
                  <span className="metric-label">💚 Health Score</span>
                  <span className="metric-value">{item.healthScore}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${item.healthScore}%`,
                      background: getHealthColor(item.healthScore)
                    }}
                  />
                </div>
              </div>

              <div className="maintenance-info">
                <div className="maintenance-row">
                  <span>Last Maintenance:</span>
                  <span className="date-value">{new Date(item.lastMaintenance).toLocaleDateString()}</span>
                </div>
                <div className="maintenance-row">
                  <span>Next Maintenance:</span>
                  <span className="date-value">{new Date(item.nextMaintenance).toLocaleDateString()}</span>
                </div>
                <div className="maintenance-due">
                  <span className={item.maintenanceDueInDays <= 3 ? 'due-urgent' : item.maintenanceDueInDays <= 7 ? 'due-warning' : 'due-normal'}>
                    {item.maintenanceDueInDays <= 0 ? 'OVERDUE!' : `Due in ${item.maintenanceDueInDays} days`}
                  </span>
                </div>
              </div>

              {item.notes && (
                <div className="equipment-notes">
                  <strong>Notes:</strong> {item.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentPage;
