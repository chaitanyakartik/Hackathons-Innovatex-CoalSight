import React, { useState, useEffect } from 'react';
import { equipmentAPI } from '../utils/api';
import '../styles/ProductionPage.css';

const ProductionPage = () => {
  const [equipment, setEquipment] = useState([]);
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

  // Mock production data
  const [productionData] = useState({
    daily: [
      { date: '2025-11-20', coal: 1250, target: 1200, shift: 'Day' },
      { date: '2025-11-20', coal: 980, target: 1000, shift: 'Night' },
      { date: '2025-11-21', coal: 1180, target: 1200, shift: 'Day' },
      { date: '2025-11-21', coal: 1050, target: 1000, shift: 'Night' },
      { date: '2025-11-22', coal: 1320, target: 1200, shift: 'Day' },
      { date: '2025-11-22', coal: 1100, target: 1000, shift: 'Night' },
      { date: '2025-11-23', coal: 1150, target: 1200, shift: 'Day' },
      { date: '2025-11-23', coal: 950, target: 1000, shift: 'Night' },
      { date: '2025-11-24', coal: 1280, target: 1200, shift: 'Day' },
      { date: '2025-11-24', coal: 1020, target: 1000, shift: 'Night' },
      { date: '2025-11-25', coal: 1190, target: 1200, shift: 'Day' },
      { date: '2025-11-25', coal: 1080, target: 1000, shift: 'Night' },
      { date: '2025-11-26', coal: 1240, target: 1200, shift: 'Day' },
    ],
    monthly: {
      target: 35000,
      achieved: 32200,
      percentage: 92
    }
  });

  // Calculate machine utilization
  const getMachineUtilization = () => {
    return equipment.map(eq => {
      // Mock utilization based on health score and status
      let utilization = eq.healthScore;
      if (eq.status === 'Maintenance') utilization = 0;
      if (eq.status === 'Warning') utilization *= 0.7;
      
      return {
        name: eq.name,
        type: eq.type,
        utilization: Math.round(utilization),
        status: eq.status,
        operatingHours: eq.operatingHours
      };
    });
  };

  const machineUtilization = getMachineUtilization();

  // Calculate today's production
  const todayProduction = productionData.daily
    .filter(d => d.date === '2025-11-26')
    .reduce((sum, shift) => sum + shift.coal, 0);

  const todayTarget = productionData.daily
    .filter(d => d.date === '2025-11-26')
    .reduce((sum, shift) => sum + shift.target, 0);

  // Calculate week's production
  const weekProduction = productionData.daily
    .reduce((sum, shift) => sum + shift.coal, 0);

  const weekTarget = productionData.daily
    .reduce((sum, shift) => sum + shift.target, 0);

  const getUtilizationColor = (utilization) => {
    if (utilization >= 80) return '#10b981';
    if (utilization >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getProductionStatus = (actual, target) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 100) return 'excellent';
    if (percentage >= 90) return 'good';
    if (percentage >= 80) return 'fair';
    return 'poor';
  };

  return (
    <div className="production-page">
      <div className="page-header">
        <h1>Production Analytics</h1>
        <p>Monitor coal production and machine utilization</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading production data...</div>
      ) : (
        <>
          {/* Production Stats */}
          <div className="production-stats">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Today's Production</h3>
            <span className={`status-indicator ${getProductionStatus(todayProduction, todayTarget)}`}>
              {Math.round((todayProduction / todayTarget) * 100)}%
            </span>
          </div>
          <div className="stat-values">
            <div className="stat-value-item">
              <span className="value-label">Achieved</span>
              <span className="value-number">{todayProduction.toLocaleString()} tons</span>
            </div>
            <div className="stat-value-item">
              <span className="value-label">Target</span>
              <span className="value-number">{todayTarget.toLocaleString()} tons</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min((todayProduction / todayTarget) * 100, 100)}%`,
                background: todayProduction >= todayTarget ? '#10b981' : '#f59e0b'
              }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>This Week</h3>
            <span className={`status-indicator ${getProductionStatus(weekProduction, weekTarget)}`}>
              {Math.round((weekProduction / weekTarget) * 100)}%
            </span>
          </div>
          <div className="stat-values">
            <div className="stat-value-item">
              <span className="value-label">Achieved</span>
              <span className="value-number">{weekProduction.toLocaleString()} tons</span>
            </div>
            <div className="stat-value-item">
              <span className="value-label">Target</span>
              <span className="value-number">{weekTarget.toLocaleString()} tons</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min((weekProduction / weekTarget) * 100, 100)}%`,
                background: weekProduction >= weekTarget ? '#10b981' : '#f59e0b'
              }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Monthly Progress</h3>
            <span className={`status-indicator ${getProductionStatus(productionData.monthly.achieved, productionData.monthly.target)}`}>
              {productionData.monthly.percentage}%
            </span>
          </div>
          <div className="stat-values">
            <div className="stat-value-item">
              <span className="value-label">Achieved</span>
              <span className="value-number">{productionData.monthly.achieved.toLocaleString()} tons</span>
            </div>
            <div className="stat-value-item">
              <span className="value-label">Target</span>
              <span className="value-number">{productionData.monthly.target.toLocaleString()} tons</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${productionData.monthly.percentage}%`,
                background: '#3b82f6'
              }}
            />
          </div>
        </div>
      </div>

      {/* Daily Production Chart */}
      <div className="chart-section">
        <h2>Daily Production (Last 7 Days)</h2>
        <div className="production-chart">
          {productionData.daily.slice(-14).map((day, index) => {
            const percentage = (day.coal / day.target) * 100;
            const height = Math.min(percentage, 100);
            
            return (
              <div key={index} className="chart-bar">
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${height}%`,
                      background: day.coal >= day.target ? '#10b981' : '#f59e0b'
                    }}
                  >
                    <span className="bar-value">{day.coal}</span>
                  </div>
                </div>
                <div className="bar-label">
                  <div className="bar-date">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="bar-shift">{day.shift}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#10b981' }}></span>
            <span>Met/Exceeded Target</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#f59e0b' }}></span>
            <span>Below Target</span>
          </div>
        </div>
      </div>

      {/* Machine Utilization */}
      <div className="utilization-section">
        <h2>Machine Utilization</h2>
        <div className="utilization-grid">
          {machineUtilization.map((machine, index) => (
            <div key={index} className="utilization-card">
              <div className="machine-header">
                <h3>{machine.name}</h3>
                <span className="machine-type">{machine.type}</span>
              </div>
              <div className="utilization-meter">
                <svg viewBox="0 0 200 120" className="meter-svg">
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={getUtilizationColor(machine.utilization)}
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={`${machine.utilization * 2.51} 251`}
                  />
                </svg>
                <div className="meter-value">
                  <span className="percentage">{machine.utilization}%</span>
                  <span className="label">Utilization</span>
                </div>
              </div>
              <div className="machine-stats">
                <div className="stat-item">
                  <span className="stat-label">Status:</span>
                  <span className={`stat-value status-${machine.status.toLowerCase()}`}>
                    {machine.status}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Operating Hours:</span>
                  <span className="stat-value">{machine.operatingHours.toLocaleString()}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default ProductionPage;
