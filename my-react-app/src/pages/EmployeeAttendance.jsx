import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../utils/api';
import '../styles/EmployeeAttendance.css';

const EmployeeAttendance = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const data = await attendanceAPI.getAll({ employeeId: user.id, date: today });
      if (data.attendance && data.attendance.length > 0) {
        setTodayAttendance(data.attendance[0]);
        setIsCheckedIn(true);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS format
      
      const newAttendanceRecord = {
        employeeId: user.id,
        date: today,
        checkIn: timestamp,
        checkOut: null,
        status: 'Present',
        location: 'Mine Entrance - Gate A',
        notes: ''
      };

      const result = await attendanceAPI.create(newAttendanceRecord);
      setTodayAttendance(result);
      setIsCheckedIn(true);
      setSuccessMessage(`✓ Attendance marked successfully at ${now.toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    }
  };

  return (
    <div className="employee-attendance">
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Mark your attendance for today's shift</p>
      </div>

      <div className="attendance-container">
        {/* Current Status */}
        <div className="status-card">
          <div className="status-icon">
            {todayAttendance || isCheckedIn ? '✓' : '○'}
          </div>
          <div className="status-content">
            <h2>Today's Status</h2>
            <p className="status-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            {(todayAttendance || isCheckedIn) ? (
              <div className="checked-in">
                <span className="status-badge present">✓ Checked In</span>
                <p className="check-in-time">
                  Check-in Time: {todayAttendance?.checkIn || new Date().toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <div className="not-checked-in">
                <span className="status-badge absent">Not Checked In</span>
              </div>
            )}
          </div>
        </div>

        {/* Mark Attendance Button */}
        {!todayAttendance && !isCheckedIn && (
          <div className="attendance-action">
            <button 
              className="mark-attendance-btn"
              onClick={handleMarkAttendance}
            >
              <span className="btn-icon">✓</span>
              Mark Attendance
            </button>
            <p className="attendance-note">
              Click the button above to mark your attendance for today
            </p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">👤</div>
            <div className="info-content">
              <h3>Employee</h3>
              <p>{user.name}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🏢</div>
            <div className="info-content">
              <h3>Department</h3>
              <p>Mining Operations</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">⏰</div>
            <div className="info-content">
              <h3>Current Time</h3>
              <p>{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Attendance Guidelines */}
        <div className="guidelines">
          <h3>📋 Attendance Guidelines</h3>
          <ul>
            <li>Mark attendance at the start of your shift</li>
            <li>Attendance can only be marked once per day</li>
            <li>Late arrivals (after scheduled shift time) will be marked accordingly</li>
            <li>Contact your supervisor if you need to modify attendance records</li>
            <li>Ensure you're on-site before marking attendance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
