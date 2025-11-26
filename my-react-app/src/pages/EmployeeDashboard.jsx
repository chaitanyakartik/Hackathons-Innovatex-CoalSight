import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../utils/api';
import '../styles/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();
      // Filter notifications for employee and unread
      const employeeNotifications = data.notifications.filter(
        n => (n.targetRole === 'employee' || n.targetRole === 'all') && !n.isRead
      );
      setUnreadNotifications(employeeNotifications.slice(0, 5)); // Show top 5
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'alert': '⚠️',
      'maintenance': '🔧',
      'info': 'ℹ️',
      'safety': '🛡️',
      'success': '✓'
    };
    return icons[type] || 'ℹ️';
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="employee-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>{getGreeting()}, {user.name?.split(' ')[0] || 'Employee'}! 👋</h1>
          <p className="welcome-subtitle">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {getCurrentTime()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-card attendance"
            onClick={() => navigate('/employee/attendance')}
          >
            <div className="action-icon">✓</div>
            <div className="action-content">
              <h3>Mark Attendance</h3>
              <p>Check in for your shift</p>
            </div>
          </button>

          <button 
            className="action-card hazard"
            onClick={() => navigate('/employee/report-hazard')}
          >
            <div className="action-icon">⚠️</div>
            <div className="action-content">
              <h3>Report Hazard</h3>
              <p>Report safety concerns</p>
            </div>
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        <div className="section-header">
          <h2>Recent Notifications</h2>
          {unreadNotifications.length > 0 && (
            <span className="notification-count">{unreadNotifications.length} unread</span>
          )}
        </div>

        {unreadNotifications.length > 0 ? (
          <div className="notifications-list">
            {unreadNotifications.map((notification) => (
              <div key={notification.id} className={`notification-item ${notification.type}`}>
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h4>{notification.title}</h4>
                    <span className="notification-time">{getTimeAgo(notification.timestamp)}</span>
                  </div>
                  <p>{notification.message}</p>
                  {notification.priority === 'high' && (
                    <span className="priority-badge high">High Priority</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notifications">
            <p>✓ No new notifications</p>
          </div>
        )}
      </div>

      {/* Safety Reminder */}
      <div className="safety-reminder">
        <div className="reminder-icon">🛡️</div>
        <div className="reminder-content">
          <h3>Safety First</h3>
          <p>Always wear your PPE and follow safety protocols. Report any hazards immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
