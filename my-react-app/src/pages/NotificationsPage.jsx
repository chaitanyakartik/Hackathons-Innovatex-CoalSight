import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../utils/api';
import '../styles/NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'info',
    title: '',
    message: '',
    priority: 'medium',
    targetRole: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newNotification = await notificationsAPI.create({
        ...formData,
        isRead: false
      });

      setNotifications([newNotification, ...notifications]);
      
      // Reset form
      setFormData({
        type: 'info',
        title: '',
        message: '',
        priority: 'medium',
        targetRole: 'all'
      });
      
      setShowForm(false);
      alert('Notification created successfully!');
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Failed to create notification');
    }
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

  const getNotificationClass = (type) => {
    return `notification-card ${type}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-badge ${priority}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>System alerts and announcements</p>
        </div>
        <button 
          className="create-notification-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Notification'}
        </button>
      </div>

      {showForm && (
        <div className="notification-form-container">
          <h2>Create New Notification</h2>
          <form onSubmit={handleSubmit} className="notification-form">
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select 
                  name="type" 
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="info">Info</option>
                  <option value="alert">Alert</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="safety">Safety</option>
                  <option value="success">Success</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select 
                  name="priority" 
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target</label>
                <select 
                  name="targetRole" 
                  value={formData.targetRole}
                  onChange={handleInputChange}
                  required
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admin Only</option>
                  <option value="employee">Employees Only</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter notification title"
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter notification message"
                rows="4"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Notification
            </button>
          </form>
        </div>
      )}

      <div className="notifications-stats">
        <div className="stat-box">
          <span className="stat-label">Total</span>
          <span className="stat-value">{notifications.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Unread</span>
          <span className="stat-value">{notifications.filter(n => !n.isRead).length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">High Priority</span>
          <span className="stat-value">{notifications.filter(n => n.priority === 'high').length}</span>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            className={getNotificationClass(notification.type)}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="notification-content">
              <div className="notification-header">
                <h3>{notification.title}</h3>
                <div className="notification-meta">
                  <span className={getPriorityClass(notification.priority)}>
                    {notification.priority}
                  </span>
                  <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
                </div>
              </div>
              
              <p className="notification-message">{notification.message}</p>
              
              <div className="notification-footer">
                <span className="target-role">
                  Target: <strong>{notification.targetRole === 'all' ? 'All Users' : notification.targetRole}</strong>
                </span>
                {!notification.isRead && <span className="unread-badge">New</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
